import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pool, pingDatabase } from './db.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, 'uploads');
await fs.mkdir(uploadsDir, { recursive: true });
const app = express();
const port = Number(process.env.API_PORT || 4000);
const jwtSecret = process.env.JWT_SECRET || '';
const allowedTypes = new Set(['departments', 'courses', 'announcements', 'internships']);
const safeSlug = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 180);

app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(uploadsDir, { maxAge: '1h', dotfiles: 'deny', index: false }));
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 12, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many login attempts. Wait a few minutes and try again.' } }));

function requireAdmin(req, res, next) {
  if (jwtSecret.length < 32) return res.status(503).json({ error: 'Server is not configured. Set a unique JWT_SECRET of at least 32 characters in .env.' });
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Admin login required.' });
  try { req.admin = jwt.verify(token, jwtSecret, { algorithms: ['HS256'], issuer: 'ysse-portal' }); next(); }
  catch { return res.status(401).json({ error: 'Your session expired. Please sign in again.' }); }
}

function parseJson(value, fallback = {}) {
  if (value == null) return fallback;
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return fallback; }
}
function publicUrl(value) { return typeof value === 'string' && value.startsWith('/uploads/') ? `http://localhost:${port}${value}` : value; }
function publicRow(row) {
  const content = parseJson(row.content_json);
  for (const key of ['image','image_url','heroImage','featureImage','aboutImage']) if (content[key]) content[key] = publicUrl(content[key]);
  return { ...content, id: row.slug, slug: row.slug, title: content.title || row.title, published: Boolean(row.is_published), sortOrder: row.sort_order };
}
function publicSettings(value) {
  const result = parseJson(value);
  if (result && typeof result === 'object') for (const key of ['image','image_url','heroImage','featureImage','aboutImage']) if (result[key]) result[key] = publicUrl(result[key]);
  return result;
}
async function getItems(type, publishedOnly = false) {
  const [rows] = await pool.execute(
    `SELECT slug,title,content_json,is_published,sort_order FROM content_items WHERE content_type=? ${publishedOnly ? 'AND is_published=1' : ''} ORDER BY sort_order ASC, updated_at DESC`, [type]
  );
  return rows.map(publicRow);
}
async function cleanupImageIfUnused(url) {
  if (!url || typeof url !== 'string') return;
  let pathname; try { pathname = new URL(url, `http://localhost:${port}`).pathname; } catch { return; }
  if (!pathname.startsWith('/uploads/')) return;
  const filename = path.basename(pathname);
  if (!filename || filename !== pathname.slice('/uploads/'.length)) return;
  const [rows] = await pool.execute('SELECT content_json FROM content_items');
  for (const row of rows) {
    if (JSON.stringify(parseJson(row.content_json)).includes(url) || JSON.stringify(parseJson(row.content_json)).includes(pathname)) return;
  }
  const [settings] = await pool.execute('SELECT setting_json FROM site_settings');
  for (const row of settings) if (JSON.stringify(parseJson(row.setting_json)).includes(url) || JSON.stringify(parseJson(row.setting_json)).includes(pathname)) return;
  await fs.unlink(path.join(uploadsDir, filename)).catch(() => {});
}

app.get('/api/health', async (_req, res) => {
  try { await pingDatabase(); res.json({ ok: true, database: 'connected' }); }
  catch { res.status(503).json({ ok: false, database: 'unavailable', message: 'Check XAMPP MySQL and .env database settings.' }); }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    if (jwtSecret.length < 32 || jwtSecret.includes('replace-this')) return res.status(503).json({ error: 'Admin API is not configured. Set a unique JWT_SECRET of at least 32 characters in .env.' });
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (!email || !password || email.length > 190 || password.length > 300) return res.status(400).json({ error: 'Enter a valid email and password.' });
    const [rows] = await pool.execute('SELECT id,email,password_hash FROM admin_users WHERE email=? LIMIT 1', [email]);
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) return res.status(401).json({ error: 'Email or password is incorrect.' });
    await pool.execute('UPDATE admin_users SET last_login_at=CURRENT_TIMESTAMP WHERE id=?', [rows[0].id]);
    const token = jwt.sign({ sub: String(rows[0].id), email: rows[0].email, role: 'admin' }, jwtSecret, { expiresIn: '8h', issuer: 'ysse-portal' });
    res.json({ token, user: { email: rows[0].email }, expiresIn: 28800 });
  } catch (e) { next(e); }
});

app.get('/api/public/site', async (_req, res, next) => {
  try {
    const collections = {};
    for (const type of allowedTypes) collections[type] = await getItems(type, true);
    const [rows] = await pool.execute('SELECT setting_key,setting_json FROM site_settings');
    const settings = Object.fromEntries(rows.map(r => [r.setting_key, publicSettings(r.setting_json)]));
    res.set('Cache-Control', 'no-store');
    res.json({ collections, settings });
  } catch (e) { next(e); }
});

app.post('/api/public/contact', rateLimit({ windowMs: 60 * 60 * 1000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many messages were sent. Please wait and try later.' } }), async (req, res, next) => {
  try {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const topic = String(req.body?.topic || '').trim();
    const message = String(req.body?.message || '').trim();
    if (name.length < 2 || name.length > 180 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 190 || topic.length < 2 || topic.length > 180 || message.length < 10 || message.length > 5000) return res.status(400).json({ error: 'Check each field and try again. Messages must be 10–5000 characters.' });
    const [result] = await pool.execute('INSERT INTO contact_messages (name,email,topic,message) VALUES (?,?,?,?)', [name,email,topic,message]);
    res.status(201).json({ ok: true, id: result.insertId });
  } catch (e) { next(e); }
});

app.get('/api/admin/dashboard', requireAdmin, async (_req, res, next) => {
  try {
    const [counts] = await pool.execute('SELECT content_type,COUNT(*) AS total,SUM(is_published=1) AS published FROM content_items GROUP BY content_type');
    const [messages] = await pool.execute("SELECT COUNT(*) AS total, SUM(status='New') AS newCount FROM contact_messages");
    res.json({ counts, messages: messages[0] || { total: 0, newCount: 0 } });
  } catch (e) { next(e); }
});

app.get('/api/admin/content/:type', requireAdmin, async (req, res, next) => {
  try {
    const type = req.params.type;
    if (!allowedTypes.has(type)) return res.status(404).json({ error: 'Unknown content type.' });
    res.json({ items: await getItems(type, false) });
  } catch (e) { next(e); }
});

app.post('/api/admin/content/:type', requireAdmin, async (req, res, next) => {
  try {
    const type = req.params.type;
    if (!allowedTypes.has(type)) return res.status(404).json({ error: 'Unknown content type.' });
    const content = req.body?.content;
    if (!content || typeof content !== 'object' || Array.isArray(content)) return res.status(400).json({ error: 'Content fields are required.' });
    const title = String(content.title || content.name || '').trim();
    const slug = safeSlug(req.body?.slug || content.id || title);
    if (!title || !slug) return res.status(400).json({ error: 'A title/name is required to create a content item.' });
    if (title.length > 255) return res.status(400).json({ error: 'Title is too long.' });
    const normalized = { ...content };
    delete normalized.published; delete normalized.sortOrder; delete normalized.slug;
    const published = req.body.published === false ? 0 : 1;
    const order = Number.isFinite(Number(req.body.sortOrder)) ? Math.trunc(Number(req.body.sortOrder)) : 0;
    await pool.execute('INSERT INTO content_items (content_type,slug,title,content_json,is_published,sort_order) VALUES (?,?,?,?,?,?)', [type,slug,title,JSON.stringify(normalized),published,order]);
    res.status(201).json({ item: { ...normalized, id: slug, slug, title, published: Boolean(published), sortOrder: order } });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'This slug already exists. Choose a different ID/slug.' });
    next(e);
  }
});

app.put('/api/admin/content/:type/:slug', requireAdmin, async (req, res, next) => {
  try {
    const type = req.params.type;
    if (!allowedTypes.has(type)) return res.status(404).json({ error: 'Unknown content type.' });
    const [oldRows] = await pool.execute('SELECT content_json FROM content_items WHERE content_type=? AND slug=? LIMIT 1', [type,req.params.slug]);
    if (!oldRows.length) return res.status(404).json({ error: 'Content item not found.' });
    const oldContent = parseJson(oldRows[0].content_json);
    const content = req.body?.content;
    if (!content || typeof content !== 'object' || Array.isArray(content)) return res.status(400).json({ error: 'Content fields are required.' });
    const title = String(content.title || content.name || '').trim();
    const slug = safeSlug(req.body?.slug || content.id || title);
    if (!title || !slug) return res.status(400).json({ error: 'A title/name is required.' });
    if (title.length > 255) return res.status(400).json({ error: 'Title is too long.' });
    const normalized = { ...content };
    delete normalized.published; delete normalized.sortOrder; delete normalized.slug;
    const published = req.body.published === false ? 0 : 1;
    const order = Number.isFinite(Number(req.body.sortOrder)) ? Math.trunc(Number(req.body.sortOrder)) : 0;
    await pool.execute('UPDATE content_items SET slug=?,title=?,content_json=?,is_published=?,sort_order=? WHERE content_type=? AND slug=?', [slug,title,JSON.stringify(normalized),published,order,type,req.params.slug]);
    for (const key of ['image','image_url','heroImage','aboutImage']) if (oldContent[key] && oldContent[key] !== normalized[key]) await cleanupImageIfUnused(oldContent[key]);
    res.json({ item: { ...normalized, id: slug, slug, title, published: Boolean(published), sortOrder: order } });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'This slug already exists. Choose a different ID/slug.' });
    next(e);
  }
});

app.delete('/api/admin/content/:type/:slug', requireAdmin, async (req, res, next) => {
  try {
    const type = req.params.type;
    if (!allowedTypes.has(type)) return res.status(404).json({ error: 'Unknown content type.' });
    const [rows] = await pool.execute('SELECT content_json FROM content_items WHERE content_type=? AND slug=?', [type,req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: 'Content item not found.' });
    const content = parseJson(rows[0].content_json);
    await pool.execute('DELETE FROM content_items WHERE content_type=? AND slug=?', [type,req.params.slug]);
    for (const key of ['image','image_url']) if (content[key]) await cleanupImageIfUnused(content[key]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

app.get('/api/admin/settings', requireAdmin, async (_req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT setting_key,setting_json FROM site_settings');
    res.json({ settings: Object.fromEntries(rows.map(r => [r.setting_key, publicSettings(r.setting_json)])) });
  } catch (e) { next(e); }
});
app.put('/api/admin/settings/:section', requireAdmin, async (req, res, next) => {
  try {
    const section = req.params.section;
    if (!['home','about','pages'].includes(section)) return res.status(404).json({ error: 'Unknown settings section.' });
    if (!req.body?.settings || typeof req.body.settings !== 'object' || Array.isArray(req.body.settings)) return res.status(400).json({ error: 'Settings are required.' });
    const [old] = await pool.execute('SELECT setting_json FROM site_settings WHERE setting_key=?', [section]);
    const oldValue = old.length ? parseJson(old[0].setting_json) : {};
    await pool.execute('INSERT INTO site_settings (setting_key,setting_json) VALUES (?,?) ON DUPLICATE KEY UPDATE setting_json=VALUES(setting_json)', [section,JSON.stringify(req.body.settings)]);
    for (const key of ['image','heroImage','featureImage','aboutImage']) if (oldValue[key] && oldValue[key] !== req.body.settings[key]) await cleanupImageIfUnused(oldValue[key]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

const storage = multer.diskStorage({ destination: (_req,_file,cb) => cb(null,uploadsDir), filename: (_req,file,cb) => {
  const ext = file.safeExtension || '.jpg';
  const name = `${Date.now()}-${randomBytes(12).toString('hex')}`;
  cb(null, `${name}${ext}`);
}});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024, files: 1 }, fileFilter: (_req,file,cb) => {
  const valid = new Map([['image/jpeg','.jpg'],['image/png','.png'],['image/webp','.webp'],['image/gif','.gif']]);
  const expected = valid.get(file.mimetype);
  if (!expected || !['.jpg','.jpeg','.png','.webp','.gif'].includes(path.extname(file.originalname).toLowerCase())) return cb(new Error('Only JPG, PNG, WEBP and GIF image files are allowed.'));
  file.safeExtension = expected;
  cb(null, true);
}});
app.post('/api/admin/upload', requireAdmin, upload.single('image'), (req,res) => {
  if (!req.file) return res.status(400).json({ error: 'Choose an image file.' });
  res.status(201).json({ url: `http://localhost:${port}/uploads/${req.file.filename}`, originalName: req.file.originalname, size: req.file.size });
});
app.delete('/api/admin/images', requireAdmin, async (req,res,next) => {
  try {
    const raw = String(req.body?.url || '');
    let parsed;
    try { parsed = new URL(raw, `http://localhost:${port}`); } catch { return res.status(400).json({ error: 'Invalid image URL.' }); }
    const localOrigins = new Set([`http://localhost:${port}`, `http://127.0.0.1:${port}`]);
    if (!parsed.pathname.startsWith('/uploads/') || !localOrigins.has(parsed.origin)) {
      return res.status(400).json({ error: 'Only images uploaded to this portal can be deleted from storage.' });
    }
    await cleanupImageIfUnused(parsed.pathname);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

app.get('/api/admin/messages', requireAdmin, async (_req,res,next) => {
  try { const [items] = await pool.execute('SELECT id,name,email,topic,message,status,created_at AS createdAt FROM contact_messages ORDER BY created_at DESC'); res.json({ items }); }
  catch (e) { next(e); }
});
app.patch('/api/admin/messages/:id', requireAdmin, async (req,res,next) => {
  try {
    const status = String(req.body?.status || '');
    if (!['New','Reviewed','Archived'].includes(status)) return res.status(400).json({ error: 'Invalid message status.' });
    const [result] = await pool.execute('UPDATE contact_messages SET status=? WHERE id=?', [status,Number(req.params.id)]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Message not found.' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'Image must be no larger than 5 MB.' : 'Image upload failed.' });
  if (err.message?.startsWith('Only JPG')) return res.status(400).json({ error: err.message });
  console.error(err);
  res.status(500).json({ error: 'The server could not complete that request. Check the API terminal for details.' });
});

try {
  await pingDatabase();
  if (jwtSecret.length < 32) console.warn('Warning: JWT_SECRET is missing or too short. Admin login is disabled until .env is configured.');
  app.listen(port, () => console.log(`YSSE API running at http://localhost:${port}; uploads at /uploads`));
} catch (error) {
  console.error('Could not connect to MySQL. Start MySQL in XAMPP, import database/schema.sql, copy .env.example to .env, then run npm run server.');
  console.error(error.message);
  process.exit(1);
}

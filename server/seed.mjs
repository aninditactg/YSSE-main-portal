import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from './db.mjs';
import { contentSeed, settingsSeed } from './seed-data.mjs';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}. Copy .env.example to .env and configure it first.`);
  return value;
}

try {
  const email = requireEnv('ADMIN_EMAIL').trim().toLowerCase();
  const password = requireEnv('ADMIN_PASSWORD');
  const secret = requireEnv('JWT_SECRET');
  if (password.length < 12) throw new Error('ADMIN_PASSWORD must be at least 12 characters.');
  if (password === 'Change-This-Local-Password-Now-123!') throw new Error('Change ADMIN_PASSWORD in .env from the example placeholder before seeding.');
  if (secret.length < 32 || secret.includes('replace-this')) throw new Error('Set JWT_SECRET to a unique random value of at least 32 characters.');

  const passwordHash = await bcrypt.hash(password, 12);
  await pool.execute(
    `INSERT INTO admin_users (email,password_hash) VALUES (?,?)
     ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash)`, [email, passwordHash]
  );

  for (const [type, records] of Object.entries(contentSeed)) {
    for (const [index, record] of records.entries()) {
      const { id, title, ...defaults } = record;
      const [existingRows] = await pool.execute('SELECT content_json FROM content_items WHERE content_type=? AND slug=? LIMIT 1', [type, id]);
      if (!existingRows.length) {
        await pool.execute(
          `INSERT INTO content_items (content_type,slug,title,content_json,is_published,sort_order)
           VALUES (?,?,?,?,1,?)`,
          [type, id, title || record.name, JSON.stringify(defaults), index]
        );
        continue;
      }
      const raw = existingRows[0].content_json;
      let existing = {};
      try { existing = raw && typeof raw === 'object' ? raw : JSON.parse(String(raw || '{}')); } catch { existing = {}; }
      // Add newly introduced fields to existing seed records without overwriting admin edits.
      const merged = { ...defaults, ...existing };
      if (Object.keys(defaults).some((field) => !(field in existing))) {
        await pool.execute('UPDATE content_items SET content_json=? WHERE content_type=? AND slug=?', [JSON.stringify(merged), type, id]);
      }
      // Keep the original DB title and publication state, since admins may have changed them.
    }
  }

  for (const [key, defaults] of Object.entries(settingsSeed)) {
    const [existingRows] = await pool.execute('SELECT setting_json FROM site_settings WHERE setting_key=? LIMIT 1', [key]);
    if (!existingRows.length) {
      await pool.execute('INSERT INTO site_settings (setting_key,setting_json) VALUES (?,?)', [key, JSON.stringify(defaults)]);
      continue;
    }
    const raw = existingRows[0].setting_json;
    let existing = {};
    try { existing = raw && typeof raw === 'object' ? raw : JSON.parse(String(raw || '{}')); } catch { existing = {}; }
    // Add newly introduced settings without overwriting edits already made by the site administrator.
    const merged = { ...defaults, ...existing };
    if (Object.keys(defaults).some((field) => !(field in existing))) {
      await pool.execute('UPDATE site_settings SET setting_json=? WHERE setting_key=?', [JSON.stringify(merged), key]);
    }
  }
  console.log(`Seed complete. Admin user: ${email}`);
  console.log('Default sample content is only a starting point; edit and verify it in /admin.');
} catch (error) {
  console.error('Seed failed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}

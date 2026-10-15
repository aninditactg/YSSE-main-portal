import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { resolve, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (file) => readFile(resolve(root, file), 'utf8')

const app = await read('src/App.tsx')
const layout = await read('src/components/Layout.tsx')
const pages = await read('src/pages/Pages.tsx')
const home = await read('src/pages/Home.tsx')
const data = await read('src/data/mockData.ts')
const types = await read('src/types/index.ts')
const html = await read('index.html')
const css = await read('src/styles.css')
const pkg = JSON.parse(await read('package.json'))

const routePaths = [
  '/', '/about', '/departments', '/departments/:id', '/courses', '/courses/:id',
  '/announcements', '/announcements/:id', '/internships', '/internships/:id',
  '/apply', '/apply/:id', '/candidate-dashboard', '/recruitment-dashboard', '/contact', '*',
]

test('all required page routes are registered', () => {
  for (const route of routePaths) assert.ok(app.includes(`path="${route}"`), `missing route ${route}`)
})

test('primary navigation includes Contact and the official YSSE logo asset', () => {
  assert.match(layout, /\['Contact', '\/contact'\]/)
  assert.equal((layout.match(/https:\/\/i\.ibb\.co\/N2GZ2Cvk\/logo-png-01\.png/g) || []).length, 2, 'same logo image is reused in header and footer')
  assert.match(layout, /alt="YSSE — Stage of Innovation"/)
  assert.match(html, /YSSE — Stage of Innovation/)
})

test('all nine official internship departments are represented', () => {
  for (const department of ['Admin & HR', 'Business Development', 'Communication', 'Content Writing', 'Graphic Design', 'Marketing & PR', 'Operations Management', 'Video Editing', 'IT']) {
    assert.ok(data.includes(`name: '${department}'`), `missing ${department}`)
  }
})


test('every sample internship department maps to a selectable department', () => {
  const departmentNames = [...data.matchAll(/name: '([^']+)'/g)].map(match => match[1])
  const internshipBlock = data.slice(data.indexOf('export let internships'))
  const internshipDepartments = [...internshipBlock.matchAll(/department: '([^']+)'/g)].map(match => match[1])
  assert.ok(internshipDepartments.length > 0)
  for (const department of internshipDepartments) assert.ok(departmentNames.includes(department), `unselectable internship department: ${department}`)
})

test('internship form validates email, phone, education and motivation', () => {
  assert.match(pages, /function isValidEmail\(value: string\)/)
  assert.match(pages, /function isValidPhone\(value: string\)/)
  assert.match(pages, /form\.education/)
  assert.match(pages, /form\.motivation\.trim\(\)\.length<40/)
  assert.match(pages, /no larger than 5 MB/)
  for (const field of ['phone:form.phone.trim()', 'education:form.education', 'skills:form.skills.trim()']) assert.ok(pages.includes(field), `application fails to persist ${field}`)
})

test('local demo persistence handles storage failures and legacy saved fields', () => {
  assert.match(pages, /function normaliseApplication\(value: unknown\)/)
  assert.match(pages, /function readApps\(\): Application\[\]/)
  assert.match(pages, /function saveApps\(apps: Application\[\]\): boolean/)
  assert.match(pages, /catch \{\s*return false\s*\}/)
  assert.ok(types.includes("phone: string; university: string; education: string"))
})

test('candidate timeline supports both final outcomes', () => {
  assert.match(pages, /active\?\.status==='Not selected'/)
  assert.match(pages, /This is a simulated outcome only\./)
})

test('contact links are editable from MySQL-backed page settings', async () => {
  assert.match(pages, /mailto:\$\{copy\.contactEmail/ )
  assert.match(pages, /tel:\$\{String\(copy\.contactPhone/ )
  assert.match(pages, /copy\.facebookUrl/)
  assert.match(pages, /copy\.officialUrl/)
  assert.match(pages, /copy\.internshipUrl/)
  assert.ok((await read('server/seed-data.mjs')).includes('https://www.facebook.com/share/1d7szMfqRa/?mibextid=wwXIfr'))
})

test('demo-only boundaries are disclosed in application and recruitment pages', () => {
  assert.match(pages, /Nothing is submitted to YSSE/)
  assert.match(pages, /No authentication, server, real applicant database/)
  assert.match(pages, /No application, resume or email has been sent to YSSE/)
})

test('responsive breakpoints and accessible mobile navigation exist', () => {
  assert.match(css, /@media\(max-width:780px\)/)
  assert.match(css, /@media\(max-width:480px\)/)
  assert.match(layout, /aria-label=\{open \? 'Close menu' : 'Open menu'\}/)
  assert.match(layout, /aria-expanded=\{open\}/)
  assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length, 'CSS blocks must balance')
})

test('all relative source imports resolve to a project file', async () => {
  const sourceFiles = ['src/App.tsx', 'src/main.tsx', 'src/components/Layout.tsx', 'src/components/UI.tsx', 'src/pages/Home.tsx', 'src/pages/Pages.tsx']
  const importPattern = /from\s+['"](\.[^'"]+)['"]/g
  for (const file of sourceFiles) {
    const source = await read(file)
    for (const match of source.matchAll(importPattern)) {
      const base = resolve(root, dirname(file), match[1])
      const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.css`, resolve(base, 'index.ts'), resolve(base, 'index.tsx')]
      let found = false
      for (const candidate of candidates) {
        try { await access(candidate); found = true; break } catch {}
      }
      assert.ok(found, `${file} has unresolved import ${match[1]}`)
    }
  }
})


test('XAMPP/MySQL schema and Node API routes are present', async () => {
  const schema = await read('database/schema.sql')
  const server = await read('server/index.mjs')
  const seed = await read('server/seed.mjs')
  assert.match(schema, /CREATE DATABASE IF NOT EXISTS ysse_portal/i)
  for (const table of ['admin_users','content_items','site_settings','contact_messages']) assert.ok(schema.includes(`CREATE TABLE IF NOT EXISTS ${table}`), `missing table ${table}`)
  for (const route of ['/api/auth/login','/api/public/site','/api/admin/content/:type','/api/admin/upload','/api/admin/settings/:section','/api/admin/messages']) assert.ok(server.includes(route), `missing API route ${route}`)
  assert.match(server, /requireAdmin/)
  assert.match(server, /bcrypt\.compare/)
  assert.match(seed, /ADMIN_PASSWORD/)
})

test('admin UI supports CRUD modules, settings editing, and image upload/removal', async () => {
  const admin = await read('src/admin/AdminApp.tsx')
  const app = await read('src/App.tsx')
  assert.match(app, /path="\/admin\/\*"/)
  for (const moduleName of ['departments','courses','announcements','internships']) assert.ok(admin.includes(`${moduleName}: { label:`), `missing admin module ${moduleName}`)
  assert.match(admin, /Upload picture/)
  assert.match(admin, /Remove picture/)
  assert.match(admin, /Save page changes/)
  assert.match(admin, /Sign in to admin/)
  assert.match(admin, /localStorage\.setItem\(TOKEN_KEY/)
})

test('public content loads from the CMS while bundled content remains the fallback', async () => {
  const app = await read('src/App.tsx')
  const cms = await read('src/data/cms.ts')
  assert.match(app, /refreshCMS\(\)/)
  assert.match(cms, /\/api\/public\/site/)
  assert.match(cms, /replaceContent\(payload\.collections/)
})

test('a QA script is available through npm', () => {
  assert.equal(pkg.scripts['test:qa'], 'node --test tests/*.test.mjs')
})


test('homepage and About text settings are connected to public rendering', async () => {
  const admin = await read('src/admin/AdminApp.tsx')
  const seed = await read('server/seed-data.mjs')
  assert.match(home, /home\.impact1Title/)
  assert.match(home, /home\.featureTitleLine1/)
  assert.match(home, /home\.socialDescription/)
  assert.match(pages, /content\.value1Title/)
  assert.match(pages, /copy\.contactBlockTitle/)
  for (const key of ['impact1Title','footerTagline','value1Title','contactBlockTitle','contactEmail']) assert.ok(seed.includes(key), `missing seed setting ${key}`)
  assert.match(admin, /Remove picture/)
})

test('uploaded image deletion only accepts local upload paths and seed adds new defaults without replacing edits', async () => {
  const server = await read('server/index.mjs')
  const seed = await read('server/seed.mjs')
  assert.match(server, /Only images uploaded to this portal can be deleted/)
  assert.match(server, /localOrigins\.has\(parsed\.origin\)/)
  assert.match(seed, /Add newly introduced settings without overwriting edits/)
})


test('department details, course modules, and announcement full text are CMS-managed', async () => {
  const admin = await read('src/admin/AdminApp.tsx')
  const seed = await read('server/seed-data.mjs')
  assert.match(admin, /teamHeadTitle/)
  assert.match(admin, /Course lessons \/ modules/)
  assert.match(pages, /a\.content\|\|/ )
  assert.match(pages, /c\.lessons===undefined/)
  assert.match(pages, /d\.teamCoordinatorTitle/)
  assert.match(seed, /Object\.assign\(department/)
})

test('every routed Pages component is actually exported', () => {
  const requiredExports = ['About','Departments','DepartmentDetail','Courses','CourseDetail','Announcements','AnnouncementDetail','Internships','InternshipDetail','Apply','CandidateDashboard','RecruitmentDashboard','Contact','NotFound']
  for (const name of requiredExports) assert.match(pages, new RegExp(`export function ${name}\\b`), `Pages.tsx must export ${name} because App.tsx imports it`)
})

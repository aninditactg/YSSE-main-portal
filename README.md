# YSSE Main Portal — XAMPP + MySQL Admin CMS

This project includes the YSSE public website plus a separate Node.js API and MySQL content database. The existing YSSE logo image URL is reused unchanged in the public header/footer and admin login/sidebar.

## What the admin can edit

- **Homepage:** hero copy and photo, intro, impact section and three impact cards, department section heading, featured internship band and photo, learning/news sections, social CTA, and footer tagline.
- **About page:** page heading/intro, main and secondary copy, the four value cards, and page picture.
- **Departments:** add, edit, publish/unpublish, reorder, add/remove photos, permanently delete departments, and edit detail copy and the illustrative team-hierarchy roles.
- **Courses & learning:** add, edit, publish/unpublish, reorder, edit the lesson/module list and detail copy, add/remove course images, and delete courses.
- **Announcements:** manage title, category, date, summary, full text, featured flag, image, and publish status.
- **Internships:** manage role, department, format, duration, commitment, skills/requirements, images, and publish status.
- **Contact page and messages:** edit headings, introductions, contact email/phone and official links; contact submissions are stored in MySQL, where admins can mark messages New, Reviewed, or Archived.
- Image files uploaded through admin are stored under `server/uploads/`, limited to 5 MB, and can be replaced/removed. Replaced files are deleted only when no content record still uses them.

Department/course/announcement/internship records and page settings are read from the database by the public website. The bundled data remains the fallback if the API is unavailable. Some seeded content is illustrative: replace it with organisation-approved copy and current vacancies before publishing.

## Requirements

- Node.js 20 LTS recommended (18.18+ should work)
- npm (included with Node.js)
- XAMPP for its MySQL/MariaDB service and phpMyAdmin

## One-time installation on Windows

### 1. Start MySQL in XAMPP

1. Open **XAMPP Control Panel**.
2. Click **Start** next to **MySQL**. Apache is optional for the Node website itself; phpMyAdmin may rely on Apache in your XAMPP installation.
3. Open `http://localhost/phpmyadmin` in your browser.

### 2. Create the database and tables

1. In phpMyAdmin, click **Import**.
2. Choose the project's `database/schema.sql` file.
3. Click **Import** / **Go** at the bottom.
4. Confirm that the `ysse_portal` database appears, with `admin_users`, `content_items`, `site_settings`, and `contact_messages` tables.

The SQL file creates the database and tables; it does not include any real applicant personal information.

### 3. Configure the administrator and database

1. In VS Code Explorer, copy `.env.example` and rename the copy to **`.env`** (the filename is exactly `.env`, without `.txt`).
2. Edit `.env` and verify the MySQL username/password. Typical clean XAMPP defaults are `DB_USER=root`, `DB_PASSWORD=` (blank), host `127.0.0.1`, port `3306`. Change these if your local MySQL credentials differ.
3. Change `ADMIN_EMAIL` to your preferred admin email.
4. Replace `ADMIN_PASSWORD` with a private password at least 12 characters long.
5. Replace `JWT_SECRET` with a unique random secret of at least 32 characters. Do not publish or commit `.env`.

Example shape (use your own private values):

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=ysse_portal
DB_USER=root
DB_PASSWORD=
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=your-private-password-longer-than-12-characters
JWT_SECRET=your-own-random-secret-of-at-least-32-characters
API_PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

### 4. Install dependencies and seed the initial content

Open the **project root folder that contains `package.json`** in VS Code. In its terminal run:

```powershell
npm.cmd install
npm.cmd run db:seed
```

The seed command creates/updates the admin account from `.env`, adds starter departments/courses/announcements/internships when missing, and creates homepage/About settings if missing. It does not overwrite existing content JSON when you run it again.

If PowerShell blocks `npm`, use `npm.cmd` as shown, or switch the VS Code terminal to **Command Prompt** and use `npm`.

### 5. Run the website and API in two terminals

**Terminal 1 — API server**

```powershell
npm.cmd run server
```

Wait for `YSSE API running at http://localhost:4000`.

**Terminal 2 — React website**

```powershell
npm.cmd run dev
```

Open the URL Vite prints, usually `http://localhost:5173`.

## Admin login

Open **`http://localhost:5173/admin`** and sign in using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from your `.env` file. The dashboard is intentionally separate from the public navigation. Login sessions use a server-verified JWT token, expire after 8 hours, and the API checks authentication for every admin CRUD/upload request.

## Helpful commands

```powershell
npm.cmd run test:qa
npm.cmd run build
```

Health check for the API/database: open `http://localhost:4000/api/health`. It should return `{"ok":true,"database":"connected"}` when XAMPP MySQL and the `.env` connection are correct.

## Database & media layout

- `database/schema.sql` — MySQL schema
- `server/index.mjs` — Express REST API, admin auth, CRUD, uploads and contact inbox
- `server/db.mjs` — MySQL connection pool
- `server/seed.mjs` / `server/seed-data.mjs` — initial admin and editable starter content
- `server/uploads/` — uploaded media (created automatically)
- `src/admin/AdminApp.tsx` — separate admin interface and content forms
- `src/data/cms.ts` — fetches database-backed published content into the public website

## Operational boundaries

This is a local project starter, not yet an internet-hardened production deployment. Before putting it on a public server: use HTTPS, set a least-privilege MySQL user rather than `root`, rotate the JWT secret and admin password, back up the database and uploads, configure the actual frontend origin, add server-side logs/monitoring, review data privacy/retention for contact messages, and test the upload pipeline. The existing internship application/candidate/recruitment pages remain demo flows; their application records are still browser-local rather than stored as production recruitment records in MySQL.

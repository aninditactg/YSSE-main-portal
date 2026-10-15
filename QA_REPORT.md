# YSSE Main Portal — QA report (CMS upgrade)

## Automated checks run in the authoring environment

- 19/19 Node built-in static QA smoke tests passed (`npm run test:qa`, which does not require dependency installation).
- `node --check server/index.mjs` passed.
- `node --check server/seed.mjs` passed.
- Static checks cover public route declarations, logo URL reuse, all nine department names, department-role matching, application validation, the XAMPP MySQL schema, authentication/content/settings/upload/message API route presence, admin editing controls, and CMS content fetch integration.

## Added in this revision

- Separate MySQL schema in `database/schema.sql` for admin users, CMS content, page settings, and contact messages.
- Express API with JWT-protected admin routes, bcrypt password verification, login throttling, content CRUD, settings CRUD, image upload/removal and a contact-message inbox.
- Separate `/admin` login/dashboard.
- Editable homepage section copy and impact cards; About page copy, values, and picture; editable department detail/team hierarchy fields; editable course module lists and detail copy; full announcement body rendering; CRUD and publish/unpublish for departments, courses, announcements, and internship listings; per-record image upload, replace, and removal.
- Public site loads published CMS data from the API. Contact form saves messages to MySQL.
- Existing YSSE logo image URL is kept unchanged and is not an editable media field.

## Not verified here

- A production TypeScript/Vite build was not executed successfully because dependency installation is unavailable/unreliable in the authoring environment.
- No XAMPP service is available in this environment, so SQL import, MySQL connectivity, real authentication, file uploads, and database round trips must be verified on the user's local machine.
- The QA suite is source-level smoke testing; it is not full browser E2E testing. After local setup, run `npm.cmd run test:qa` and `npm.cmd run build`, then check `/api/health`, login, each CRUD module, image replacement/removal, and a public Contact submission.

## Known limits

- Internship application/candidate/recruitment pages remain demo flows and their application records still use browser local storage.
- Seed announcement/course/internship items are illustrative and should be reviewed/verified before public use.
- The existing logo image is loaded from its current external URL; it is preserved, not redrawn. For production reliability, bundle the same original image locally once you have the original approved file.

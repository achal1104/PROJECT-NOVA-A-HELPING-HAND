# Project NOVA — A Helping Hand
Run: `npm install` then `npm run dev`. Build: `npm run build`.

Pages: / (home), /register, /login, /dashboard, /profile, /courses, /notes, /science, /workshops, /careers, /community, /about, /contact, /terms, /privacy, /admin.

- All copy lives in `src/data.js`. Photos: put files in `public/images/` and set the paths in `IMG` (top of data.js).
- Marathi/English toggle: `src/i18n.jsx` — add more `'English text': 'मराठी'` pairs (Hindi slot is ready).
- Admin: open `/admin` (demo passcode `nova-admin`, in `src/pages/Admin.jsx`). Roles are demo-only.
- PWA: `public/manifest.webmanifest`, `public/sw.js`, icons in `public/`.
- Data is stored in localStorage (demo only) — connect Supabase/Firebase for real auth, storage, hashed passwords, roles and email/SMS.
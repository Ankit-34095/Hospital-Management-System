# Hospital Frontend

This is a minimal React frontend for the Hospital Management System backend.

Start (after installing dependencies):

```bash
npm install
npm start
```

It expects the backend API at `http://localhost:8081/api` (see `src/services/api.js`).

Pages:
- /login
- /register
- /dashboard
- /patients
- /doctors
- /appointments
- /billing

Auth: JWT stored in localStorage under `token`. Role is stored as `role`.

Payment simulation: `POST /api/payment/simulate/{billingId}` — the frontend calls `/payment/simulate/{id}` when clicking Pay Now.

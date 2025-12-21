# Life-Saving Connector

MERN scaffold for volunteers, blood donations, and organ donor management.

## Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Helmet, rate limiting.
- Frontend: React + Vite, React Router, Zustand, Axios.

## Quick start
1. Backend
   ```bash
   cd backend
   cp env.example .env
   npm install
   npm run dev
   ```
2. Frontend
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Default API base: `http://localhost:5000/api`. Frontend base: `http://localhost:5173`.

## Notes
- JWT payload includes `userId` and `roles`.
- Role constants live in `backend/src/config/constants.js`.
- Placeholder appointment/email logic is stubbed; swap with real provider and data model as you extend.


## Ex No: 1 — Setting up MERN environment
**Date**: 24-02-2026

This document lists the **software**, **library installation**, and **configuration** steps required to set up a MERN (MongoDB, Express, React, Node.js) environment.

---

### 1) Software prerequisites

- **Node.js (LTS)** (includes npm)
  - Verify:
    - `node -v`
    - `npm -v`
- **MongoDB**
  - Options:
    - **MongoDB Community Server** (local installation), or
    - **MongoDB Atlas** (cloud database)
- **Git**
  - Verify: `git --version`
- **Code editor**
  - VS Code recommended

Optional (helpful):
- **MongoDB Compass** (GUI for MongoDB)
- **Postman** (API testing)

---

### 2) Create a project structure

Typical MERN repo layout:

- `server/` — Node + Express backend
- `client/` — React frontend

---

### 3) Backend setup (Node + Express)

#### 3.1 Initialize the backend

Inside `server/`:

- `npm init -y`

#### 3.2 Install backend libraries

Common libraries:
- `express` — HTTP server & routing
- `cors` — enable cross-origin requests
- `dotenv` — environment variables
- `mongoose` — MongoDB ODM

Install:

- `npm i express cors dotenv mongoose`

Dev-only (recommended):
- `npm i -D nodemon`

#### 3.3 Add server scripts

In `server/package.json`:
- `"start": "node server.js"`
- `"dev": "nodemon server.js"`

#### 3.4 Configure environment variables

Create `server/.env`:

- `PORT=5001`
- `MONGODB_URI=mongodb://127.0.0.1:27017/smartcampus` (local)  
  or Atlas connection string (cloud)
- `FRONTEND_URL=http://localhost:3000`

**Notes**:
- Never commit `.env` to git.
- Use `process.env.MONGODB_URI` in code.

#### 3.5 Connect MongoDB (Mongoose)

Typical config:
- Import `mongoose`
- `mongoose.connect(process.env.MONGODB_URI)`
- Add error and success logs

---

### 4) Frontend setup (React)

#### 4.1 Create React app

Inside `client/`:

- `npx create-react-app .`

#### 4.2 Install frontend libraries (typical)

Depending on your needs:
- `react-router-dom` (routing) *(optional; this project uses hash routing without extra deps)*
- `axios` (HTTP client) *(optional; you can use `fetch`)*

Install example:
- `npm i axios react-router-dom`

---

### 5) Configure backend ↔ frontend communication

#### Option A: CRA proxy (development)

In `client/package.json` add:
- `"proxy": "http://localhost:5001"`

Then frontend can call:
- `fetch("/api/complaints")`

#### Option B: CORS allowlist (backend)

In Express:
- Enable `cors({ origin: FRONTEND_URL, credentials: true })`

---

### 6) Run the MERN app (development)

Start backend:
- `cd server`
- `npm run dev`

Start frontend:
- `cd client`
- `npm start`

Expected:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001/api/...`

---

### 7) Production build & deployment notes

- Build React:
  - `cd client && npm run build`
- Serve React build from Express (optional approach):
  - `app.use(express.static(path.join(__dirname, "client/build")))`
  - Fallback route to `index.html`
- Ensure environment variables are set on hosting platform:
  - `MONGODB_URI`, `PORT`, etc.

---

### 8) Common troubleshooting

- **CORS errors**:
  - Ensure backend `cors` origin matches frontend URL
- **Mongo connection refused** (local):
  - Ensure MongoDB service is running
  - Use correct hostname `127.0.0.1`
- **Proxy not working**:
  - Restart CRA dev server after editing `client/package.json`



# Team-15

Smart Campus Portal is a full-stack MERN-style campus management project built for team submission. It includes a React frontend, an Express + MongoDB backend, team member management, complaint tracking, announcements, events, authentication, and supporting tutorial exercises.

## Project Structure

```text
Team-15/
├── frontend/               # React frontend
├── backend/                # Express backend + MongoDB models/routes
├── nodejs-builtin-apis/    # Extra Node.js built-ins exercise app
├── npm-project/            # Custom npm module exercise
├── docs/                   # Exercise documentation
├── package.json            # Root scripts for running the project
└── README.md               # Submission guide
```

## Features

- Student and admin login/signup
- Team member add, edit, delete, list, and detail view
- Profile photo upload for team members
- Complaint submission and tracking
- Dashboard statistics
- Announcements and events
- MongoDB-backed storage

## Tech Stack

- Frontend: React 18
- Backend: Node.js, Express
- Database: MongoDB
- File Uploads: Multer

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/sasivadan-yellapragada/Team-15.git
cd Team-15
```

### 2. Install dependencies

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
npm --prefix nodejs-builtin-apis install
```

### 3. Configure environment variables

Create `backend/.env` with:

```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGO_URI=mongodb://127.0.0.1:27017/smart-campus-portal
```

### 4. Start MongoDB

Make sure MongoDB is running locally on port `27017`.

## How To Run The App

### Run frontend and backend together

```bash
npm run dev
```

This starts:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001`
- Exercise 8 demo app: `http://localhost:4000` if that port is free

### Run services separately

```bash
npm run dev:server
npm run dev:client
```

Or use the renamed scripts:

```bash
npm run dev:backend
npm run dev:frontend
```

## API Endpoints

### Health

- `GET /api/health` - Check backend status

### Team Members

- `GET /api/members` - Retrieve all team members
- `GET /api/members/:id` - Retrieve one team member by MongoDB ID
- `POST /api/members` - Add a new member
- `PUT /api/members/:id` - Update a member
- `DELETE /api/members/:id` - Delete a member

### Authentication

- `POST /api/auth/student/signup`
- `POST /api/auth/student/login`
- `POST /api/auth/admin/signup`
- `POST /api/auth/admin/login`

### Complaints

- `GET /api/complaints`
- `POST /api/complaints`
- `PATCH /api/complaints/:id`
- `POST /api/complaints/:id/updates`

### Staff

- `GET /api/staff`
- `POST /api/staff`
- `PATCH /api/staff/:id`
- `DELETE /api/staff/:id`

### Dashboard / Content

- `GET /api/dashboard-stats`
- `GET /api/announcements`
- `GET /api/events`

## Browser Testing

You can directly open these in the browser after starting the backend:

- `http://localhost:5001/api/health`
- `http://localhost:5001/api/members`
- `http://localhost:5001/api/members/<member-id>`

## Notes

- `.gitignore` excludes `node_modules`, `.env`, logs, and local MongoDB data.
- Uploaded team member images are stored in `backend/uploads/team-members/`.
- The repository is intended for public GitHub submission under the team name `Team-15`.

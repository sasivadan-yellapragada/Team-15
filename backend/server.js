const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();

const app = express();
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const TEAM_MEMBER_UPLOADS_DIR = path.join(UPLOADS_DIR, 'team-members');

if (!fs.existsSync(TEAM_MEMBER_UPLOADS_DIR)) {
  fs.mkdirSync(TEAM_MEMBER_UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, TEAM_MEMBER_UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (String(file.mimetype || '').startsWith('image/')) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const complaintSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    status: { type: String, default: 'Pending', trim: true },
    category: { type: String, default: 'General', trim: true },
    priority: { type: String, default: 'Medium', trim: true },
    description: { type: String, default: '', trim: true },
    department: { type: String, default: 'Maintenance', trim: true },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    assignedTo: { type: String, default: '', trim: true },
    assignedToId: { type: String, default: '', trim: true },
    assignedAt: { type: String, default: '' },
    createdById: { type: String, default: '', trim: true },
    createdByEmail: { type: String, default: '', trim: true, lowercase: true },
    createdByName: { type: String, default: '', trim: true },
    feedback: { type: String, default: '', trim: true },
    rating: { type: Number, default: null },
    updates: [
      {
        authorRole: { type: String, default: 'system', trim: true },
        authorName: { type: String, default: 'System', trim: true },
        message: { type: String, default: '', trim: true },
        createdAt: { type: String, default: () => new Date().toISOString() }
      }
    ]
  },
  { versionKey: false, timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

// ============================================
// STAFF SCHEMA & MODEL (for admin assignments)
// ============================================

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    department: { type: String, default: 'Maintenance', trim: true },
    role: { type: String, default: 'Technician', trim: true },
    status: { type: String, enum: ['free', 'busy'], default: 'free' },
    currentComplaintId: { type: Number, default: null }
  },
  { versionKey: false, timestamps: true }
);

const Staff = mongoose.model('Staff', staffSchema);

// ============================================
// AUTH (Student/Admin) — simple password hashing
// ============================================

function hashPassword(password, salt) {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(String(password), s, 120000, 32, 'sha256').toString('hex');
  return { salt: s, hash };
}

function safeUser(u) {
  if (!u) return null;
  return { id: String(u._id), name: u.name, email: u.email };
}

const studentUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true }
  },
  { versionKey: false, timestamps: true }
);

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true }
  },
  { versionKey: false, timestamps: true }
);

const StudentUser = mongoose.model('StudentUser', studentUserSchema);
const AdminUser = mongoose.model('AdminUser', adminUserSchema);

// ============================================
// STUDENT SCHEMA & MODEL
// ============================================

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 15, max: 35 },
    department: { type: String, required: true, enum: ['CSE', 'ECE', 'MECH', 'IT', 'CIVIL'] },
    courses: [
      {
        courseName: { type: String, required: true },
        grade: { type: String, enum: ['A', 'B', 'C', 'D', 'F'], required: true },
        credits: { type: Number, required: true, min: 1, max: 5 }
      }
    ],
    attendance: { type: Number, required: true, min: 0, max: 100 }
  },
  { versionKey: false, timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);

// ============================================
// TEAM MEMBER SCHEMA & MODEL
// ============================================

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    year: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    aboutProject: { type: String, default: '', trim: true },
    profilePhotoUrl: { type: String, default: '', trim: true },
    hobbies: [{ type: String, trim: true }],
    certificate: { type: String, required: true, trim: true },
    internship: { type: String, required: true, trim: true },
    aboutAim: { type: String, required: true, trim: true }
  },
  { versionKey: false, timestamps: true }
);

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

function parseMemberPayload(req) {
  const hobbies = Array.isArray(req.body.hobbies)
    ? req.body.hobbies
    : String(req.body.hobbies || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

  const payload = {
    name: String(req.body.name || '').trim(),
    rollNumber: String(req.body.rollNumber || '').trim(),
    year: String(req.body.year || '').trim(),
    degree: String(req.body.degree || '').trim(),
    aboutProject: String(req.body.aboutProject || '').trim(),
    hobbies,
    certificate: String(req.body.certificate || '').trim(),
    internship: String(req.body.internship || '').trim(),
    aboutAim: String(req.body.aboutAim || '').trim()
  };

  if (req.file) {
    payload.profilePhotoUrl = `/uploads/team-members/${req.file.filename}`;
  }

  return payload;
}

function memberApiErrorMessage(error, fallback) {
  if (error?.code === 11000) {
    return 'A member with that roll number already exists';
  }
  return error?.message || fallback;
}

// ============================================
// ANNOUNCEMENT SCHEMA & MODEL
// ============================================

const announcementSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    important: { type: Boolean, default: false }
  },
  { versionKey: false, timestamps: true }
);

const Announcement = mongoose.model('Announcement', announcementSchema);

// ============================================
// EVENT SCHEMA & MODEL
// ============================================

const eventSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    icon: { type: String, default: '📅' }
  },
  { versionKey: false, timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

const complaintSeedData = [
  { title: 'Broken Chair in Library', status: 'Pending', category: 'Infrastructure', date: '2026-03-10', priority: 'High' },
  { title: 'Water Leakage in Room 101', status: 'In Progress', category: 'Maintenance', date: '2026-03-09', priority: 'Critical' },
  { title: 'Noise Issue in Hostel', status: 'Resolved', category: 'Hostel', date: '2026-03-08', priority: 'Medium' }
];

const announcements = [
  { id: 1, title: 'Campus Fest 2026', content: 'Join us for the annual campus fest on March 20th!', date: '2026-03-11', important: true },
  { id: 2, title: 'Exam Schedule Released', content: 'Check the portal for your exam schedule.', date: '2026-03-10', important: true },
  { id: 3, title: 'Library Timing Extended', content: 'Library will now close at 11 PM.', date: '2026-03-09', important: false }
];

const events = [
  { id: 1, name: 'Tech Talk', date: '2026-03-15', time: '4:00 PM', location: 'Auditorium', icon: '🎤' },
  { id: 2, name: 'Sports Day', date: '2026-03-20', time: '9:00 AM', location: 'Sports Ground', icon: '⚽' },
  { id: 3, name: 'Workshop: Web Dev', date: '2026-03-18', time: '3:00 PM', location: 'Lab 3', icon: '💻' }
];

// ---------------------------------------------------------------------------
// Exercise 8 — Express + Node built-ins (fs, path) + HTTP GET / POST
// JSON file: server/data/tutorial-ex8-items.json
// Proxied from CRA as: /tutorial/ex8/items
// ---------------------------------------------------------------------------
const EX8_ITEMS_FILE = path.join(__dirname, 'data', 'tutorial-ex8-items.json');

function ex8EnsureFile() {
  const dir = path.dirname(EX8_ITEMS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(EX8_ITEMS_FILE)) {
    fs.writeFileSync(
      EX8_ITEMS_FILE,
      JSON.stringify([{ id: 1, name: 'Seed item', createdAt: new Date().toISOString() }], null, 2),
      'utf8'
    );
  }
}

function ex8ReadItems() {
  ex8EnsureFile();
  return JSON.parse(fs.readFileSync(EX8_ITEMS_FILE, 'utf8'));
}

function ex8WriteItems(items) {
  ex8EnsureFile();
  fs.writeFileSync(EX8_ITEMS_FILE, JSON.stringify(items, null, 2), 'utf8');
}

app.get('/tutorial/ex8/items', (req, res) => {
  try {
    const data = ex8ReadItems();
    res.json({ status: 'success', data, exercise: 8, note: 'Express route; persistence via fs + path' });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

app.post('/tutorial/ex8/items', (req, res) => {
  try {
    const name = (req.body && String(req.body.name).trim()) || 'Untitled item';
    const items = ex8ReadItems();
    const nextId = items.length ? Math.max(...items.map((i) => Number(i.id) || 0)) + 1 : 1;
    const item = { id: nextId, name, createdAt: new Date().toISOString() };
    items.push(item);
    ex8WriteItems(items);
    res.status(201).json({ status: 'success', data: item });
  } catch (e) {
    res.status(400).json({ status: 'error', message: e.message });
  }
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Smart Campus Portal API is running!' });
});

// Auth APIs (Student/Admin)
app.post('/api/auth/:role/signup', async (req, res) => {
  try {
    const role = String(req.params.role || '').toLowerCase();
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!name || !email || !password) return res.status(400).json({ status: 'error', message: 'Missing fields' });
    if (password.length < 4) return res.status(400).json({ status: 'error', message: 'Password too short' });

    const { salt, hash } = hashPassword(password);
    const Model = role === 'admin' ? AdminUser : role === 'student' ? StudentUser : null;
    if (!Model) return res.status(400).json({ status: 'error', message: 'Invalid role' });

    const created = await Model.create({ name, email, passwordHash: hash, passwordSalt: salt });
    res.status(201).json({ status: 'success', data: safeUser(created) });
  } catch (e) {
    const msg = String(e?.message || 'Signup failed');
    const dup = msg.includes('E11000') ? 'Email already exists' : msg;
    res.status(400).json({ status: 'error', message: dup });
  }
});

app.post('/api/auth/:role/login', async (req, res) => {
  try {
    const role = String(req.params.role || '').toLowerCase();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const Model = role === 'admin' ? AdminUser : role === 'student' ? StudentUser : null;
    if (!Model) return res.status(400).json({ status: 'error', message: 'Invalid role' });

    const user = await Model.findOne({ email }).lean();
    if (!user) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

    const { hash } = hashPassword(password, user.passwordSalt);
    if (hash !== user.passwordHash) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

    res.json({ status: 'success', data: { role, user: safeUser(user) } });
  } catch (e) {
    res.status(400).json({ status: 'error', message: 'Login failed' });
  }
});

// Demo-only password reset (no email OTP). Useful for presentations.
app.post('/api/auth/:role/reset-password', async (req, res) => {
  try {
    const role = String(req.params.role || '').toLowerCase();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const Model = role === 'admin' ? AdminUser : role === 'student' ? StudentUser : null;
    if (!Model) return res.status(400).json({ status: 'error', message: 'Invalid role' });
    if (!email || !password) return res.status(400).json({ status: 'error', message: 'Missing fields' });
    if (password.length < 4) return res.status(400).json({ status: 'error', message: 'Password too short' });

    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ status: 'error', message: 'Account not found' });

    const { salt, hash } = hashPassword(password);
    user.passwordSalt = salt;
    user.passwordHash = hash;
    await user.save();

    res.json({ status: 'success', message: 'Password updated' });
  } catch (e) {
    res.status(400).json({ status: 'error', message: 'Reset failed' });
  }
});

app.get('/api/complaints', async (req, res) => {
  try {
    const ownerEmail = (req.query?.ownerEmail ? String(req.query.ownerEmail) : '').trim().toLowerCase();
    const ownerId = (req.query?.ownerId ? String(req.query.ownerId) : '').trim();
    const filter = ownerId ? { createdById: ownerId } : ownerEmail ? { createdByEmail: ownerEmail } : {};
    const complaints = await Complaint.find(filter).sort({ id: 1 }).lean();
    res.json({ status: 'success', data: complaints });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch complaints' });
  }
});

app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ id: 1 }).lean();
    res.json({ status: 'success', data: announcements });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch announcements' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ id: 1 }).lean();
    res.json({ status: 'success', data: events });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch events' });
  }
});

app.post('/api/complaints', async (req, res) => {
  try {
    const latest = await Complaint.findOne().sort({ id: -1 }).select('id').lean();
    const newComplaint = await Complaint.create({
      id: latest?.id ? latest.id + 1 : 1,
      ...req.body,
      createdById: req.body?.createdById ? String(req.body.createdById) : '',
      createdByEmail: req.body?.createdByEmail ? String(req.body.createdByEmail).trim().toLowerCase() : '',
      createdByName: req.body?.createdByName ? String(req.body.createdByName) : '',
      date: req.body?.date || new Date().toISOString().split('T')[0]
    });
    res.status(201).json({ status: 'success', data: newComplaint });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message || 'Failed to create complaint' });
  }
});

app.patch('/api/complaints/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await Complaint.findOneAndUpdate(
      { id },
      req.body,
      { returnDocument: 'after', runValidators: true }
    ).lean();
    if (!updated) return res.status(404).json({ status: 'error', message: 'Complaint not found' });
    res.json({ status: 'success', data: updated });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Failed to update complaint' });
  }
});

app.post('/api/complaints/:id/updates', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const authorRole = String(req.body?.authorRole || 'system').trim();
    const authorName = String(req.body?.authorName || 'System').trim();
    const message = String(req.body?.message || '').trim();
    if (!message) return res.status(400).json({ status: 'error', message: 'Message is required' });

    const update = { authorRole, authorName, message, createdAt: new Date().toISOString() };
    const updated = await Complaint.findOneAndUpdate(
      { id },
      { $push: { updates: update } },
      { returnDocument: 'after', runValidators: true }
    ).lean();
    if (!updated) return res.status(404).json({ status: 'error', message: 'Complaint not found' });
    res.json({ status: 'success', data: updated });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Failed to add update' });
  }
});

// Staff APIs (Admin workforce + assignment)
app.get('/api/staff', async (req, res) => {
  try {
    const staff = await Staff.find().sort({ name: 1 }).lean();
    res.json({ status: 'success', data: staff });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch staff' });
  }
});

app.patch('/api/staff/:id', async (req, res) => {
  try {
    const updated = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!updated) return res.status(404).json({ status: 'error', message: 'Staff not found' });
    res.json({ status: 'success', data: updated });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Failed to update staff' });
  }
});

app.post('/api/staff', async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    const department = String(req.body?.department || 'Maintenance').trim();
    const role = String(req.body?.role || 'Technician').trim();
    const status = String(req.body?.status || 'free').toLowerCase() === 'busy' ? 'busy' : 'free';
    if (!name) return res.status(400).json({ status: 'error', message: 'Name is required' });
    const created = await Staff.create({ name, department, role, status, currentComplaintId: null });
    res.status(201).json({ status: 'success', data: created });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Failed to create staff' });
  }
});

app.delete('/api/staff/:id', async (req, res) => {
  try {
    const deleted = await Staff.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Staff not found' });
    res.json({ status: 'success', data: deleted });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Failed to delete staff' });
  }
});

app.get('/api/dashboard-stats', async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
    const announcementsCount = await Announcement.countDocuments();
    const eventsCount = await Event.countDocuments();
    const studentsCount = await Student.countDocuments();

    res.json({
      status: 'success',
      data: {
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        announcements: announcementsCount,
        upcomingEvents: eventsCount,
        totalStudents: studentsCount
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch dashboard stats' });
  }
});

// ============================================
// STUDENT ROUTES (Exercise 4, 5, 6)
// ============================================

// GET all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ _id: -1 });
    res.json({ status: 'success', data: students });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch students' });
  }
});

// POST add new student
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student({
      name: req.body.name,
      age: parseInt(req.body.age),
      department: req.body.department,
      courses: req.body.courses,
      attendance: parseInt(req.body.attendance)
    });
    
    const savedStudent = await newStudent.save();
    res.status(201).json({ status: 'success', data: savedStudent });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message || 'Failed to create student' });
  }
});

// PUT update student
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        age: parseInt(req.body.age),
        department: req.body.department,
        courses: req.body.courses,
        attendance: parseInt(req.body.attendance)
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedStudent) {
      return res.status(404).json({ status: 'error', message: 'Student not found' });
    }
    
    res.json({ status: 'success', data: updatedStudent });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message || 'Failed to update student' });
  }
});

// DELETE student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    
    if (!deletedStudent) {
      return res.status(404).json({ status: 'error', message: 'Student not found' });
    }
    
    res.json({ status: 'success', message: 'Student deleted successfully', data: deletedStudent });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Failed to delete student' });
  }
});

// ============================================
// MEMBERS API (Team Members routes - alias for students)
// ============================================

// GET all members
app.get('/api/members', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ createdAt: 1 }).lean();
    res.json(members);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message || 'Failed to fetch members' });
  }
});

// GET single member
app.get('/api/members/:id', async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id).lean();
    if (!member) {
      return res.status(404).json({ status: 'error', message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message || 'Failed to fetch member' });
  }
});

// POST add new member
app.post('/api/members', upload.single('profilePhoto'), async (req, res) => {
  try {
    const newMember = await TeamMember.create(parseMemberPayload(req));

    res.status(201).json({ status: 'success', data: newMember });
  } catch (error) {
    res.status(400).json({ status: 'error', message: memberApiErrorMessage(error, 'Failed to create member') });
  }
});

// PUT update member
app.put('/api/members/:id', upload.single('profilePhoto'), async (req, res) => {
  try {
    const existingMember = await TeamMember.findById(req.params.id);
    if (!existingMember) {
      return res.status(404).json({ status: 'error', message: 'Member not found' });
    }

    const payload = parseMemberPayload(req);
    const hadOldPhoto = req.file && existingMember.profilePhotoUrl;
    const oldPhotoPath = hadOldPhoto ? path.join(__dirname, existingMember.profilePhotoUrl.replace(/^\//, '')) : '';

    const updatedMember = await TeamMember.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
      lean: true
    });

    if (hadOldPhoto && fs.existsSync(oldPhotoPath)) {
      fs.unlinkSync(oldPhotoPath);
    }

    res.json({ status: 'success', data: updatedMember });
  } catch (error) {
    res.status(400).json({ status: 'error', message: memberApiErrorMessage(error, 'Failed to update member') });
  }
});

// DELETE member
app.delete('/api/members/:id', async (req, res) => {
  try {
    const deletedMember = await TeamMember.findByIdAndDelete(req.params.id).lean();

    if (!deletedMember) {
      return res.status(404).json({ status: 'error', message: 'Member not found' });
    }

    res.json({ status: 'success', message: 'Member deleted successfully', data: deletedMember });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Failed to delete member' });
  }
});

// PUT update attendance (Exercise 5)
app.put('/api/update-attendance', async (req, res) => {
  try {
    const result = await Student.updateMany(
      {
        $expr: {
          $and: [
            { $gte: [{ $size: { $filter: { input: "$courses", as: "course", cond: { $in: ["$$course.grade", ["A", "B"]] } } } }, 2] },
            { $lt: ["$attendance", 95] }
          ]
        }
      },
      { $inc: { attendance: 5 } }
    );
    
    res.json({ 
      status: 'success', 
      message: `Updated ${result.modifiedCount} students`,
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update attendance' });
  }
});

// GET failed students (Exercise 5)
app.get('/api/read-failed-students', async (req, res) => {
  try {
    const failedStudents = await Student.find({
      $expr: {
        $and: [
          { $gt: [{ $size: { $filter: { input: "$courses", as: "course", cond: { $eq: ["$$course.grade", "F"] } } } }, 0] },
          { $lt: ["$attendance", 75] }
        ]
      }
    });
    
    res.json({ 
      status: 'success', 
      data: failedStudents,
      count: failedStudents.length 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch failed students' });
  }
});

// DELETE low performers (Exercise 5)
app.delete('/api/delete-low-performers', async (req, res) => {
  try {
    const result = await Student.deleteMany({
      $expr: {
        $and: [
          { $gt: [{ $size: { $filter: { input: "$courses", as: "course", cond: { $eq: ["$$course.grade", "F"] } } } }, 1] },
          { $lt: ["$attendance", 50] }
        ]
      }
    });
    
    res.json({ 
      status: 'success', 
      message: `Deleted ${result.deletedCount} students`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete students' });
  }
});

async function seedComplaintsIfNeeded() {
  const count = await Complaint.countDocuments();
  if (count > 0) return;
  const docs = complaintSeedData.map((entry, index) => ({
    id: index + 1,
    ...entry
  }));
  // Use insertMany with validateBeforeSave: false to skip hooks
  await Complaint.collection.insertMany(docs);
  console.log('✅ Complaints seeded');
}

async function seedStudentsIfNeeded() {
  const count = await Student.countDocuments();
  if (count > 0) return;
  
  const studentData = [
    {
      name: 'Arjun Singh',
      age: 20,
      department: 'CSE',
      courses: [
        { courseName: 'Data Structures', grade: 'A', credits: 4 },
        { courseName: 'Web Development', grade: 'A', credits: 3 },
        { courseName: 'Database Systems', grade: 'A', credits: 4 },
        { courseName: 'Algorithms', grade: 'B', credits: 3 }
      ],
      attendance: 95
    },
    {
      name: 'Priya Sharma',
      age: 21,
      department: 'ECE',
      courses: [
        { courseName: 'Circuits', grade: 'A', credits: 4 },
        { courseName: 'Signals', grade: 'B', credits: 3 },
        { courseName: 'Electromagnetics', grade: 'A', credits: 4 },
        { courseName: 'Control Systems', grade: 'B', credits: 3 }
      ],
      attendance: 90
    },
    {
      name: 'Rohan Patel',
      age: 22,
      department: 'MECH',
      courses: [
        { courseName: 'Thermodynamics', grade: 'B', credits: 4 },
        { courseName: 'Mechanics', grade: 'B', credits: 3 },
        { courseName: 'CAD', grade: 'A', credits: 4 },
        { courseName: 'Design', grade: 'C', credits: 3 }
      ],
      attendance: 85
    },
    {
      name: 'Neha Gupta',
      age: 20,
      department: 'IT',
      courses: [
        { courseName: 'Programming', grade: 'B', credits: 4 },
        { courseName: 'Networks', grade: 'B', credits: 3 },
        { courseName: 'Physics', grade: 'F', credits: 4 },
        { courseName: 'Math', grade: 'C', credits: 3 }
      ],
      attendance: 72
    },
    {
      name: 'Vikram Kumar',
      age: 22,
      department: 'CIVIL',
      courses: [
        { courseName: 'Structural Analysis', grade: 'F', credits: 4 },
        { courseName: 'Civil Engineering', grade: 'F', credits: 3 },
        { courseName: 'Hydraulics', grade: 'D', credits: 3 }
      ],
      attendance: 45
    }
  ];
  
  await Student.insertMany(studentData);
  console.log('✅ Students seeded');
}

async function seedTeamMembers() {
  const count = await TeamMember.countDocuments();
  if (count > 0) return;

  const roster = [
    {
      name: 'Varada Govind',
      rollNumber: 'RA2312704010028',
      year: '3rd Year',
      degree: 'MTech (Integrated)',
      hobbies: ['Photography', 'Chess', 'Traveling'],
      certificate: 'AWS Cloud Practitioner',
      internship: 'Web Development Intern at Infosys',
      aboutAim: 'To become a cloud solutions architect and build scalable systems'
    },
    {
      name: 'Sasivadan Yellapragada',
      rollNumber: 'RA2312704010030',
      year: '3rd Year',
      degree: 'MTech (Integrated)',
      hobbies: ['Coding', 'Gym', 'Blogging'],
      certificate: 'Google Data Analytics Certificate',
      internship: 'Data Analyst Intern at TCS',
      aboutAim: 'To become a data scientist and solve real-world problems using AI'
    },
    {
      name: 'Vamshi Polkampally',
      rollNumber: 'RA2312704010047',
      year: '3rd Year',
      degree: 'MTech (Integrated)',
      profilePhotoUrl: '/uploads/team-members/vamshi-polkampally.jpeg',
      hobbies: ['Gaming', 'Cricket', 'Video Editing'],
      certificate: 'Meta Frontend Developer Certificate',
      internship: 'Frontend Developer Intern at Wipro',
      aboutAim: 'To become a full-stack developer and build impactful applications'
    },
    {
      name: 'Nandini M R',
      rollNumber: 'RA2312704010066',
      year: '3rd Year',
      degree: 'MTech (Integrated)',
      hobbies: ['Drawing', 'Dancing', 'Reading'],
      certificate: 'UI/UX Design Certificate by Coursera',
      internship: 'UI/UX Intern at Zoho',
      aboutAim: 'To become a product designer and create user-friendly experiences'
    }
  ];

  await TeamMember.insertMany(roster);
  console.log('✅ Team members seeded');
}

async function seedAnnouncementsIfNeeded() {
  const count = await Announcement.countDocuments();
  if (count > 0) return;
  
  const docs = announcements.map((entry, index) => ({
    id: index + 1,
    ...entry
  }));
  await Announcement.collection.insertMany(docs);
  console.log('✅ Announcements seeded');
}

async function seedEventsIfNeeded() {
  const count = await Event.countDocuments();
  if (count > 0) return;
  
  const docs = events.map((entry, index) => ({
    id: index + 1,
    ...entry
  }));
  await Event.collection.insertMany(docs);
  console.log('✅ Events seeded');
}

async function seedStaffIfNeeded() {
  const count = await Staff.countDocuments();
  if (count > 0) return;

  const staff = [
    { name: 'Asha Nair', department: 'Maintenance', role: 'Technician', status: 'free' },
    { name: 'Rahul Verma', department: 'Electrical', role: 'Electrician', status: 'free' },
    { name: 'Meera Iyer', department: 'Plumbing', role: 'Plumber', status: 'busy', currentComplaintId: 2 },
    { name: 'Karthik Rao', department: 'IT Support', role: 'Technician', status: 'free' },
    { name: 'Divya Menon', department: 'Hostel', role: 'Warden', status: 'free' }
  ];

  await Staff.insertMany(staff);
  console.log('✅ Staff seeded');
}

async function seedAdminIfNeeded() {
  const count = await AdminUser.countDocuments();
  if (count > 0) return;

  const email = 'admin@smartcampus.com';
  const password = 'admin123';
  const { salt, hash } = hashPassword(password);
  await AdminUser.create({ name: 'Campus Admin', email, passwordHash: hash, passwordSalt: salt });
  console.log('✅ Admin user seeded');
}

async function start() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing in backend/.env');
  }

  await mongoose.connect(mongoUri);
  await seedComplaintsIfNeeded();
  await seedStudentsIfNeeded();
  await seedTeamMembers();
  await seedAnnouncementsIfNeeded();
  await seedEventsIfNeeded();
  await seedStaffIfNeeded();
  await seedAdminIfNeeded();

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`\nSmart Campus Portal Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

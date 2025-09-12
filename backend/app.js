// app.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({
  path: process.env.RENDER || process.env.NODE_ENV === 'production'
    ? '/etc/secrets/.env' // Render secret file path
    : path.resolve(__dirname, '.env') // Local .env fallback
});

// ------------------- ROUTES -------------------
const authRoutes = require('./routes/authRoutes');
const gradeRoutes = require('./routes/gradesRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const profileRoutes = require('./routes/profileRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const clubRoutes = require('./routes/clubs');
const bookRoutes = require('./routes/books');
const eventRoutes = require('./routes/events');
const accountRoutes = require('./routes/accounts');
const statsRoutes = require('./routes/stats');
const schoolUserRoutes = require('./routes/schoolUserRoutes');
const homeworkRoutes = require('./routes/homeworkRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const roleRoutes = require('./routes/roles');
const quizRoutes = require('./routes/quizRoutes');
const classRoutes = require('./routes/class');
const marksRoutes = require('./routes/marksRoutes');
const userRoutes = require('./routes/userRoutes');
const feesRoutes = require('./routes/fees');

// ------------------- MIDDLEWARE -------------------
const requestLogger = require('./middleware/requestLogger');

const app = express();

// ------------------- BODY PARSERS -------------------
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ------------------- CORS -------------------
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://school-93dy.onrender.com", // frontend on Render
  "http://localhost:3000" // local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin); // ✅ echo the request origin
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Explicit preflight handling
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(200);
  }
  return res.sendStatus(403);
});

// ------------------- LOGGING -------------------
app.use(requestLogger);

// ------------------- STATIC DIRECTORIES -------------------
const uploadsDir = path.join(__dirname, 'uploads');
const profilePhotosDir = path.join(uploadsDir, 'profile-photos');
const reportCardsDir = path.join(__dirname, '../frontend_public/uploads/report-cards');

[uploadsDir, profilePhotosDir, reportCardsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use('/uploads', express.static(uploadsDir));
app.use('/uploads/profile-photos', express.static(profilePhotosDir));
app.use('/report-cards', express.static(reportCardsDir));
app.use('/css', express.static(path.join(__dirname, '../frontend_public/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend_public/js')));
app.use(express.static(path.join(__dirname, '../frontend_public/pages')));

// ------------------- FRONTEND ROUTES -------------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend_public/pages/login.html'));
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend_public/pages/index.html'));
});
app.get('/student', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend_public/pages/student.html'));
});
app.get('/teacher', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend_public/pages/teacher.html'));
});

// fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend_public/pages/login.html'));
});

// ------------------- API ROUTES -------------------
app.use('/api/auth', authRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', [schoolUserRoutes, userRoutes]);
app.use('/api/homeworks', homeworkRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/fees', feesRoutes);

// ------------------- MONGODB CONNECTION -------------------
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

module.exports = app;

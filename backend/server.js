const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const app = express();

// ------------------- MIDDLEWARE -------------------
// Connect to MongoDB
connectDB();

// Allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://school-93dy.onrender.com", // frontend on Render
  "http://localhost:3000" // local dev
];

// Configure CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      // ✅ Echo back the origin instead of "*"
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log("👉 Response headers:", res.getHeaders()["access-control-allow-origin"]);
  });
  next();
});


// Explicitly handle preflight requests
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

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));

// Serve favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/favicon.ico'), {
    headers: { 'Content-Type': 'image/x-icon' }
  });
});

// ------------------- ROUTES -------------------
const authRoutes = require('./routes/authRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
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
const contactRoutes = require('./routes/contact');
const healthRoutes = require('./routes/health');

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', schoolUserRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/health', healthRoutes);

// Serve frontend pages
app.get(['/', '/login'], (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});
app.get('*.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 5000;

mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log("✅ Allowed Origins:", allowedOrigins);
  });
});

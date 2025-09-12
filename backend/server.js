const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const app = express();

// ------------------- MONGODB -------------------
connectDB();

// ------------------- ALLOWED ORIGINS -------------------
const allowedOrigins = [
  (process.env.FRONTEND_URL || "https://school-93dy.onrender.com").replace(/\/$/, ""),
  "http://localhost:3000"
];

// ------------------- CORS MIDDLEWARE -------------------
app.use((req, res, next) => {
  let origin = req.headers.origin;
  if (origin) origin = origin.replace(/\/$/, "");

  if (origin && allowedOrigins.includes(origin)) {
    // Echo the allowed origin
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,Accept"
    );
    res.setHeader("Access-Control-Expose-Headers", "Content-Length,Content-Range");
  } else if (origin) {
    // Origin not allowed
    return res.status(403).json({ message: "Not allowed by CORS" });
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") return res.sendStatus(204);

  next();
});

// ------------------- DEBUG MIDDLEWARE -------------------
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> Access-Control-Allow-Origin:`,
      res.getHeader("access-control-allow-origin")
    );
  });
  next();
});

// ------------------- BODY PARSERS -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------- STATIC FILES -------------------
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));

// ------------------- FAVICON -------------------
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/favicon.ico'), {
    headers: { 'Content-Type': 'image/x-icon' }
  });
});

// ------------------- API ROUTES -------------------
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

// ------------------- FRONTEND ROUTES -------------------
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
    console.log(
      `🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
    console.log("✅ Allowed Origins:", allowedOrigins);
  });
});

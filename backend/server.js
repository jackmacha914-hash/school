const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const corsMiddleware = require('./middleware/cors');

const app = express();

// -------------------------
// Connect to MongoDB
// -------------------------
connectDB();

// -------------------------
// CORS – must be mounted first
// -------------------------
app.use(corsMiddleware);

// -------------------------
// Body parsers
// -------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------
// Debug logging (CORS check)
// -------------------------
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ACAO:`,
      res.getHeader('access-control-allow-origin')
    );
  });
  next();
});

// -------------------------
// Static assets (frontend)
// -------------------------
const publicFrontendPath = path.join(__dirname, 'public_frontend');
const pagesPath = path.join(publicFrontendPath, 'pages');

app.use(express.static(publicFrontendPath));
app.use('/css', express.static(path.join(publicFrontendPath, 'css')));
app.use('/js', express.static(path.join(publicFrontendPath, 'js')));
app.use('/images', express.static(path.join(publicFrontendPath, 'images')));

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(publicFrontendPath, 'favicon.ico'), {
    headers: { 'Content-Type': 'image/x-icon' }
  });
});

// -------------------------
// API routes
// -------------------------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/grades', require('./routes/gradesRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/clubs', require('./routes/clubs'));
app.use('/api/books', require('./routes/books'));
app.use('/api/events', require('./routes/events'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/users', require('./routes/schoolUserRoutes'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/health', require('./routes/health'));

// -------------------------
// Frontend routes
// -------------------------
app.get(['/', '/login'], (req, res) => {
  res.sendFile(path.join(pagesPath, 'login.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(pagesPath, 'index.html'));
});

app.get('*.html', (req, res) => {
  res.sendFile(path.join(pagesPath, 'login.html'));
});

// -------------------------
// Start server
// -------------------------
const PORT = process.env.PORT || 5000;
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

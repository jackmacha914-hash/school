const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const corsMiddleware = require('./middleware/cors'); // <- your custom CORS middleware
const app = express();

// ------------------- MONGODB -------------------
connectDB();

// ------------------- BODY PARSERS -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------- CORS -------------------
app.use(corsMiddleware);

// ------------------- DEBUG MIDDLEWARE -------------------
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> Access-Control-Allow-Origin:`,
      res.getHeader('Access-Control-Allow-Origin')
    );
  });
  next();
});

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
  });
});

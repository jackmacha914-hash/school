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

// Enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

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
    res.sendFile(path.join(__dirname, '../frontend/favicon.ico'), { headers: { 'Content-Type': 'image/x-icon' } });
});

// ------------------- ROUTES -------------------
// Example: adjust paths to your route files
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
    });
});

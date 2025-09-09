
// app.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Routes
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

// Middleware
const requestLogger = require('./middleware/requestLogger');
const corsMiddleware = require('./middleware/cors');

const app = express();

// Logging
app.use(requestLogger);

// Enable CORS
app.use(cors());
app.use(corsMiddleware);

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static directories
const uploadsDir = path.join(__dirname, 'uploads');
const profilePhotosDir = path.join(uploadsDir, 'profile-photos');
const reportCardsDir = path.join(__dirname, '..', 'frontend', 'public', 'uploads', 'report-cards');

[uploadsDir, profilePhotosDir, reportCardsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Serve static files
app.use('/uploads', express.static(uploadsDir));
app.use('/uploads/profile-photos', express.static(profilePhotosDir));
app.use('/report-cards', express.static(reportCardsDir));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use(express.static(path.join(__dirname, '../frontend/pages')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// API routes
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
app.use('/api/fees', require('./routes/fees'));

module.exports = app;

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/president', require('./routes/presidentRoutes'));
app.use('/api/secretary', require('./routes/secretaryRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/public', require('./routes/publicVoteRoutes')); // Public voting routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/rsvp', require('./routes/rsvpRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/communication', require('./routes/communicationRoutes'));
app.use('/api', require('./routes/voteRoutes'));

app.get('/', (req, res) => res.send('HUSUMS API Running'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

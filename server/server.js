const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/vocabulary', require('./routes/vocabRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ParkLanguage API is running 🚀' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ParkLanguage Server running on port ${PORT}`);
});

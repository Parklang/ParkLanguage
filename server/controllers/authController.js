const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400);
      throw new Error('Vui lòng điền đầy đủ thông tin');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('Email đã được sử dụng');
    }

    const user = await User.create({ username, email, password });

    // Create initial progress for all lessons
    const lessons = await Lesson.find().sort({ order: 1 });
    if (lessons.length > 0) {
      const progressDocs = lessons.map((lesson, index) => ({
        userId: user._id,
        lessonId: lesson._id,
        status: index === 0 ? 'available' : 'locked'
      }));
      await Progress.insertMany(progressDocs);
    }

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      level: user.level,
      totalXP: user.totalXP,
      dailyXP: user.dailyXP,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      lastActiveDate: user.lastActiveDate,
      wordsLearned: user.wordsLearned,
      lessonsCompleted: user.lessonsCompleted,
      quizzesCompleted: user.quizzesCompleted,
      achievements: user.achievements,
      settings: user.settings,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Vui lòng điền email và mật khẩu');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      level: user.level,
      totalXP: user.totalXP,
      dailyXP: user.dailyXP,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      lastActiveDate: user.lastActiveDate,
      wordsLearned: user.wordsLearned,
      lessonsCompleted: user.lessonsCompleted,
      quizzesCompleted: user.quizzesCompleted,
      achievements: user.achievements,
      settings: user.settings,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      level: user.level,
      totalXP: user.totalXP,
      dailyXP: user.dailyXP,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      lastActiveDate: user.lastActiveDate,
      wordsLearned: user.wordsLearned,
      lessonsCompleted: user.lessonsCompleted,
      quizzesCompleted: user.quizzesCompleted,
      achievements: user.achievements,
      settings: user.settings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };

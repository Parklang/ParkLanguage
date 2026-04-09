const Progress = require('../models/Progress');
const User = require('../models/User');
const Lesson = require('../models/Lesson');

// @route GET /api/progress
const getProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ userId: req.user._id })
      .populate('lessonId', 'title titleVi order')
      .sort({ 'lessonId.order': 1 });
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/progress/lesson/:lessonId
const updateLessonProgress = async (req, res, next) => {
  try {
    const { status, score } = req.body;
    const { lessonId } = req.params;

    let progress = await Progress.findOne({ userId: req.user._id, lessonId });
    if (!progress) {
      res.status(404);
      throw new Error('Progress not found');
    }

    progress.status = status || progress.status;
    if (score !== undefined) {
      progress.score = score;
      progress.bestScore = Math.max(progress.bestScore, score);
      progress.attemptsCount += 1;
    }

    if (status === 'completed') {
      progress.completedAt = new Date();
      const lesson = await Lesson.findById(lessonId);
      const xpEarned = score >= 80 ? lesson.xpReward : Math.round(lesson.xpReward * 0.6);
      progress.xpEarned = xpEarned;

      // Update user
      const user = await User.findById(req.user._id);
      user.totalXP += xpEarned;
      user.dailyXP += xpEarned;
      user.lessonsCompleted += 1;

      // Level up check
      let totalNeeded = 0;
      for (let i = 1; i <= user.level; i++) {
        totalNeeded += i * 100;
      }
      if (user.totalXP >= totalNeeded) {
        user.level += 1;
      }

      await user.save();

      // Unlock next lessons
      const nextLessons = await Lesson.find({ order: { $gt: lesson.order } }).sort({ order: 1 }).limit(2);
      for (const next of nextLessons) {
        await Progress.findOneAndUpdate(
          { userId: req.user._id, lessonId: next._id, status: 'locked' },
          { status: 'available' }
        );
      }
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/progress/stats
const getStats = async (req, res, next) => {
  try {
    const user = req.user;
    const completed = await Progress.countDocuments({ userId: user._id, status: 'completed' });
    const total = await Progress.countDocuments({ userId: user._id });

    res.json({
      totalXP: user.totalXP,
      level: user.level,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      lessonsCompleted: completed,
      totalLessons: total,
      wordsLearned: user.wordsLearned,
      quizzesCompleted: user.quizzesCompleted
    });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/progress/streak
const updateStreak = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const today = new Date().toDateString();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;

    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = lastActive === yesterday.toDateString();

      user.currentStreak = isConsecutive ? user.currentStreak + 1 : 1;
      user.longestStreak = Math.max(user.currentStreak, user.longestStreak);
      user.lastActiveDate = new Date();
      user.dailyXP = 0;

      // Streak achievements
      if (user.currentStreak >= 1 && !user.achievements.includes('first_flame')) {
        user.achievements.push('first_flame');
      }
      if (user.currentStreak >= 7 && !user.achievements.includes('week_warrior')) {
        user.achievements.push('week_warrior');
      }
      if (user.currentStreak >= 30 && !user.achievements.includes('month_master')) {
        user.achievements.push('month_master');
      }

      await user.save();
    }

    res.json({
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      dailyXP: user.dailyXP,
      lastActiveDate: user.lastActiveDate
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/leaderboard
const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('username level totalXP currentStreak avatar')
      .sort({ totalXP: -1 })
      .limit(20);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProgress, updateLessonProgress, getStats, updateStreak, getLeaderboard };

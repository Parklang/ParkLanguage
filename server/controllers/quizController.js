const Quiz = require('../models/Quiz');
const User = require('../models/User');

// @route GET /api/quizzes/lesson/:lessonId
const getQuizByLesson = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ lessonId: req.params.lessonId });
    if (!quiz) {
      res.status(404);
      throw new Error('Quiz không tìm thấy');
    }
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

// @route POST /api/quizzes/:id/submit
const submitQuiz = async (req, res, next) => {
  try {
    const { score, totalPoints } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      res.status(404);
      throw new Error('Quiz không tìm thấy');
    }

    const percentage = Math.round((score / totalPoints) * 100);
    const xpEarned = percentage === 100 ? 50 : percentage >= 80 ? 30 : 15;

    // Update user XP
    const user = await User.findById(req.user._id);
    user.totalXP += xpEarned;
    user.dailyXP += xpEarned;
    user.quizzesCompleted += 1;

    // Check level up
    let xpNeeded = user.level * 100;
    let totalNeeded = 0;
    for (let i = 1; i <= user.level; i++) {
      totalNeeded += i * 100;
    }
    if (user.totalXP >= totalNeeded) {
      user.level += 1;
    }

    // Perfect score achievement
    if (percentage === 100 && !user.achievements.includes('perfect_score')) {
      user.achievements.push('perfect_score');
    }

    await user.save();

    res.json({ percentage, xpEarned, newTotalXP: user.totalXP, newLevel: user.level });
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuizByLesson, submitQuiz };

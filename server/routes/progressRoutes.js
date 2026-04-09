const express = require('express');
const router = express.Router();
const { getProgress, updateLessonProgress, getStats, updateStreak, getLeaderboard } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getProgress);
router.put('/lesson/:lessonId', protect, updateLessonProgress);
router.get('/stats', protect, getStats);
router.put('/streak', protect, updateStreak);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getQuizByLesson, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.get('/lesson/:lessonId', protect, getQuizByLesson);
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;

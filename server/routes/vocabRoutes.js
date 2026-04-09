const express = require('express');
const router = express.Router();
const { getVocabulary, getCategories } = require('../controllers/vocabController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getVocabulary);
router.get('/categories', protect, getCategories);

module.exports = router;

const Vocabulary = require('../models/Vocabulary');

// @route GET /api/vocabulary
const getVocabulary = async (req, res, next) => {
  try {
    const { category, difficulty, lessonId, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (lessonId) filter.lessonId = lessonId;
    if (search) {
      filter.$or = [
        { word: { $regex: search, $options: 'i' } },
        { meaningVi: { $regex: search, $options: 'i' } }
      ];
    }

    const vocabulary = await Vocabulary.find(filter).sort({ word: 1 });
    res.json(vocabulary);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/vocabulary/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Vocabulary.distinct('category');
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = { getVocabulary, getCategories };

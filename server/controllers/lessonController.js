const Lesson = require('../models/Lesson');

// @route GET /api/lessons
const getLessons = async (req, res, next) => {
  try {
    const { level } = req.query;
    const filter = level ? { level } : {};
    const lessons = await Lesson.find(filter).sort({ order: 1 });
    res.json(lessons);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/lessons/:id
const getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      res.status(404);
      throw new Error('Bài học không tìm thấy');
    }
    res.json(lesson);
  } catch (error) {
    next(error);
  }
};

module.exports = { getLessons, getLessonById };

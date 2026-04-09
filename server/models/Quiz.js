const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  title: { type: String, required: true },
  type: { type: String, default: 'multiple-choice' },
  timeLimit: { type: Number, default: 120 },
  xpReward: { type: Number, default: 30 },
  questions: [{
    questionText: { type: String, required: true },
    questionTextVi: String,
    type: { type: String, enum: ['mcq', 'fill', 'translate', 'listen'], default: 'mcq' },
    options: [String],
    correctAnswer: { type: String, required: true },
    explanationVi: String,
    points: { type: Number, default: 10 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);

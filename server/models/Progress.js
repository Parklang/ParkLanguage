const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  status: {
    type: String,
    enum: ['locked', 'available', 'in-progress', 'completed'],
    default: 'locked'
  },
  score: { type: Number, default: 0 },
  bestScore: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
  attemptsCount: { type: Number, default: 0 },
  completedAt: { type: Date, default: null },
  timeSpent: { type: Number, default: 0 }
}, { timestamps: true });

// Compound index to ensure one progress per user per lesson
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);

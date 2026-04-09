const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleVi: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, required: true, enum: ['A1', 'A2', 'B1', 'B2'] },
  category: { type: String, required: true, enum: ['grammar', 'vocabulary', 'conversation'] },
  order: { type: Number, required: true },
  xpReward: { type: Number, default: 50 },
  estimatedMinutes: { type: Number, default: 10 },
  prerequisiteIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  content: [{
    type: { type: String, enum: ['explanation', 'example', 'practice', 'tip'] },
    titleVi: String,
    textEn: String,
    textVi: String,
    imageUrl: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);

const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema({
  word: { type: String, required: true },
  pronunciation: String,
  meaningVi: { type: String, required: true },
  partOfSpeech: { type: String, enum: ['noun', 'verb', 'adjective', 'adverb', 'interjection', 'phrase', 'number', 'preposition'] },
  exampleEn: String,
  exampleVi: String,
  audioUrl: String,
  imageUrl: String,
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }
}, { timestamps: true });

module.exports = mongoose.model('Vocabulary', vocabularySchema);

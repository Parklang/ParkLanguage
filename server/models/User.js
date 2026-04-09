const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: 2,
    maxlength: 30
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  avatar: { type: String, default: null },
  level: { type: Number, default: 1 },
  totalXP: { type: Number, default: 0 },
  dailyXP: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: null },
  wordsLearned: { type: Number, default: 0 },
  lessonsCompleted: { type: Number, default: 0 },
  quizzesCompleted: { type: Number, default: 0 },
  totalTimeMinutes: { type: Number, default: 0 },
  achievements: [{ type: String }],
  settings: {
    theme: { type: String, default: 'dark', enum: ['dark', 'light'] },
    soundEnabled: { type: Boolean, default: true },
    dailyGoal: { type: Number, default: 50 }
  }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

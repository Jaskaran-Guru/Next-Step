const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '+91 98765 43210' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  targetExam: { type: String, default: 'JEE Mains & Advanced', enum: ['JEE Mains & Advanced', 'NEET UG', 'Class 10 Foundation', 'GATE CS', 'UPSC'] },
  currentClass: { type: String, default: 'Class 12th' },
  // Life Stage = entire app experience pivot point
  lifeStage: {
    type: String,
    default: 'entrance_prep_17_18',
    enum: ['playway_1_4', 'primary_5_10', 'middle_11_14', 'stream_selection_15_16', 'entrance_prep_17_18', 'degree_college_19_23', 'career_launch']
  },
  childAge: { type: String, default: '' }, // For parents tracking child's age
  enrolledBatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
  coins: { type: Number, default: 250 },
  streakDays: { type: Number, default: 14 },
  studyMinutesTotal: { type: Number, default: 1840 },
  testsAttempted: { type: Number, default: 4 },
  dppsCompleted: { type: Number, default: 18 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

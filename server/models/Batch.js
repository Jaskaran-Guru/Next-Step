const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  experience: { type: String, default: '10+ Years' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  bio: { type: String, default: 'Ex-Kota Senior Faculty, mentored 50,000+ top rankers' }
});

const BatchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  tagline: { type: String, default: 'India\'s Most Trusted Batch' },
  badge: { type: String, default: 'BESTSELLER' },
  examCategory: { 
    type: String, 
    required: true, 
    enum: ['JEE Mains & Advanced', 'NEET UG', 'Class 10 Foundation', 'GATE CS', 'UPSC'] 
  },
  classLevel: { type: String, default: 'Class 12th / Dropper' },
  language: { type: String, default: 'Hinglish (Hindi + English)' },
  price: { type: Number, default: 4500 },
  originalPrice: { type: Number, default: 9999 },
  discountPercentage: { type: Number, default: 55 },
  bannerImage: { type: String, required: true },
  accentColor: { type: String, default: '#2563eb' },
  startDate: { type: String, default: '15th May 2026' },
  validity: { type: String, default: 'Until Exam Day 2027' },
  faculty: [FacultySchema],
  features: [{ type: String }],
  enrolledCount: { type: Number, default: 42800 },
  rating: { type: Number, default: 4.9 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Batch', BatchSchema);

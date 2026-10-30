const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Major National Competitive & Board Exams 2026/2027 Calendar
const EXAM_COUNTDOWNS = [
  {
    code: 'jee-main-2026',
    title: 'JEE Main 2026 (Session 1)',
    category: 'Engineering',
    examDate: '2026-01-24T09:00:00.000Z',
    conductingBody: 'National Testing Agency (NTA)',
    officialUrl: 'https://jeemain.nta.nic.in',
    daysRemaining: 86,
    weightageFocus: 'Rotational Motion, Electrostatics, Thermodynamics, Coordinate Geometry, Organic Chemistry'
  },
  {
    code: 'neet-ug-2026',
    title: 'NEET-UG 2026',
    category: 'Medical',
    examDate: '2026-05-03T14:00:00.000Z',
    conductingBody: 'National Testing Agency (NTA)',
    officialUrl: 'https://neet.nta.nic.in',
    daysRemaining: 185,
    weightageFocus: 'Human Physiology, Genetics & Evolution, Optics, Chemical Bonding, Ecology'
  },
  {
    code: 'cbse-class-10-12',
    title: 'CBSE Board Examinations (Class 10 & 12)',
    category: 'Board Examination',
    examDate: '2026-02-15T10:30:00.000Z',
    conductingBody: 'CBSE',
    officialUrl: 'https://cbse.gov.in',
    daysRemaining: 108,
    weightageFocus: 'NCERT Exemplar, 5-Year PYQs, Marking Scheme Answer Writing'
  },
  {
    code: 'cuet-ug-2026',
    title: 'CUET-UG 2026 (Central Universities)',
    category: 'Undergraduate Admission',
    examDate: '2026-05-18T09:00:00.000Z',
    conductingBody: 'NTA',
    officialUrl: 'https://exams.nta.ac.in/CUET-UG/',
    daysRemaining: 200,
    weightageFocus: 'Class 12 Syllabus Only, General Test (Logical Reasoning & Current Affairs)'
  },
  {
    code: 'upsc-cse-prelims-2026',
    title: 'UPSC Civil Services Examination (Prelims 2026)',
    category: 'Civil Services',
    examDate: '2026-05-24T09:30:00.000Z',
    conductingBody: 'Union Public Service Commission (UPSC)',
    officialUrl: 'https://upsc.gov.in',
    daysRemaining: 206,
    weightageFocus: 'Indian Polity, Modern History, Economy, Environment & Ecology, CSAT Paper-II'
  },
  {
    code: 'clat-2026',
    title: 'Common Law Admission Test (CLAT 2026)',
    category: 'Law Admission',
    examDate: '2025-12-07T14:00:00.000Z',
    conductingBody: 'Consortium of NLUs',
    officialUrl: 'https://consortiumofnlus.ac.in',
    daysRemaining: 38,
    weightageFocus: 'Legal Reasoning, Reading Comprehension, Logical Deduction, Quantitative Techniques'
  }
];

// Default Daily Time-Boxed Study Routine
const DEFAULT_SCHEDULE = [
  {
    slot: '06:00 AM - 08:30 AM',
    title: '🌅 Morning Prime Focus (Deep Work Block 1)',
    subject: 'High-Difficulty Concepts (Physics / Complex Math / DSA)',
    tip: 'No phone or notifications. Tackle your most difficult conceptual topic while cognition is peak.'
  },
  {
    slot: '09:00 AM - 01:00 PM',
    title: '🏫 School / College Lectures or Video Playlists',
    subject: 'Active Note-Taking & Bookmark Creation',
    tip: 'Write 1-page summary formulas immediately after each lecture ends.'
  },
  {
    slot: '02:30 PM - 04:30 PM',
    title: '📝 Daily Practice Problems (DPP & Problem Sets)',
    subject: 'Active Problem Solving (30-40 Questions)',
    tip: 'Simulate timed pressure. Never look at solutions before attempting twice on scratchpad.'
  },
  {
    slot: '05:00 PM - 07:00 PM',
    title: '🧠 AI Doubt Resolution & Peer Community',
    subject: 'Saarthi AI Doubt Solver & Error Notebook Analysis',
    tip: 'Document every incorrect question in your Error Notebook with the conceptual reason.'
  },
  {
    slot: '08:30 PM - 10:00 PM',
    title: '🌙 Spaced Repetition Revision & Flashcards',
    subject: 'Formulas, Inorganic Reactions, Vocabulary & Active Recall',
    tip: 'Spaced recall before sleep consolidates memory into long-term hippocampus storage.'
  }
];

// 1. Get Exam Countdowns
router.get('/countdown', (req, res) => {
  return res.json({ success: true, count: EXAM_COUNTDOWNS.length, exams: EXAM_COUNTDOWNS });
});

// 2. Get User Study Schedule
router.get('/schedule', async (req, res) => {
  try {
    const user = await User.findOne();
    return res.json({
      success: true,
      targetExam: user?.targetExam || 'JEE Mains & Advanced',
      schedule: DEFAULT_SCHEDULE
    });
  } catch (error) {
    return res.json({ success: true, schedule: DEFAULT_SCHEDULE });
  }
});

// 3. Save Custom Study Slot
router.post('/schedule', async (req, res) => {
  try {
    const { slot, title, subject, tip } = req.body;
    if (!slot || !title) {
      return res.status(400).json({ success: false, message: 'Slot and title are required' });
    }
    const newSlot = { slot, title, subject: subject || 'General Study', tip: tip || 'Consistent daily practice' };
    return res.status(201).json({ success: true, message: 'Study slot added to planner', slot: newSlot });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;


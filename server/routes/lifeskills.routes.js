const express = require('express');
const router = express.Router();

const LIFE_SKILLS_MODULES = [
  {
    id: 'communication-public-speaking',
    title: 'Public Speaking & Executive Communication',
    icon: 'mic',
    tagline: 'Master the art of articulate speaking, storytelling & impromptu presentations.',
    category: 'Communication',
    lessons: [
      { title: 'Overcoming Stage Fright & The 3-Second Breath Rule', duration: '12 mins', type: 'Framework' },
      { title: 'The PREP Structure (Point, Reason, Example, Point)', duration: '18 mins', type: 'Practice Drill' },
      { title: 'Vocal Modulation, Pauses & Eliminating Filler Words', duration: '15 mins', type: 'Exercise' }
    ],
    exercise: 'Record a 60-second self-introduction using the PREP framework and review for pause cadence.'
  },
  {
    id: 'financial-literacy',
    title: 'Financial Literacy, Compounding & Wealth Basics',
    icon: 'trending-up',
    tagline: 'Understand cash flow, budgeting, inflation, compounding & index investing.',
    category: 'Finance',
    lessons: [
      { title: 'The 50/30/20 Budgeting Rule for Students & Freshers', duration: '14 mins', type: 'Blueprint' },
      { title: 'Power of Compounding: Starting at 20 vs Starting at 30', duration: '20 mins', type: 'Interactive Calculator' },
      { title: 'Debunking High-Risk Trading vs Long-Term Index Investing', duration: '16 mins', type: 'Case Study' }
    ],
    exercise: 'Calculate how a ₹2,000 monthly SIP compounding at 12% grows over 15 years versus keeping cash in savings.'
  },
  {
    id: 'critical-thinking-mental-models',
    title: 'Critical Thinking, Logic & Mental Models',
    icon: 'cpu',
    tagline: 'Make superior decisions using first-principles reasoning and inversion.',
    category: 'Cognitive',
    lessons: [
      { title: 'First Principles Thinking: Breaking Problems to Core Truths', duration: '15 mins', type: 'Mental Model' },
      { title: 'Inversion (Thinking Backwards to Avoid Failure)', duration: '12 mins', type: 'Framework' },
      { title: 'Recognizing Cognitive Biases (Sunk Cost, Confirmation Bias)', duration: '18 mins', type: 'Case Studies' }
    ],
    exercise: 'Take a complex life decision (e.g., Stream or Degree choice) and apply the Inversion framework.'
  },
  {
    id: 'emotional-intelligence-stress',
    title: 'Emotional Intelligence & Exam Anxiety Management',
    icon: 'heart',
    tagline: 'Build psychological resilience, self-regulation & peak exam-day composure.',
    category: 'Mindset',
    lessons: [
      { title: 'Physiological Sigh: Science-Backed Instant Cortisol Reset', duration: '10 mins', type: 'Biofeedback' },
      { title: 'Detaching Self-Worth from Marks & Percentiles', duration: '16 mins', type: 'Reframing' },
      { title: 'Building a Non-Negotiable Sleep & Circadian Rhythm Routine', duration: '14 mins', type: 'Habit Blueprint' }
    ],
    exercise: 'Practice the physiological double-inhale followed by extended exhale 3 times before test sessions.'
  },
  {
    id: 'time-management-deep-work',
    title: 'Time Management, Pomodoro & Deep Work Mastery',
    icon: 'clock',
    tagline: 'Eliminate digital dopamine addiction and sustain 4+ hours of uninterrupted focus.',
    category: 'Productivity',
    lessons: [
      { title: 'The 90-Minute Ultradian Rhythm Focus Block', duration: '15 mins', type: 'Framework' },
      { title: 'Dopamine Detox: Restructuring Phone Notification Architecture', duration: '12 mins', type: 'Action Guide' },
      { title: 'Time-Boxing Daily Timetables vs Flexible To-Do Lists', duration: '18 mins', type: 'System' }
    ],
    exercise: 'Block out one single 90-minute phone-free study window every morning.'
  }
];

// 1. Get all life skills modules
router.get('/', (req, res) => {
  return res.json({ success: true, count: LIFE_SKILLS_MODULES.length, data: LIFE_SKILLS_MODULES });
});

// 2. Submit Life Skills Diagnostic Self-Assessment
router.post('/diagnostic', (req, res) => {
  const { answers } = req.body; // e.g. { publicSpeaking: 4, finance: 2, anxiety: 3, timeMgmt: 5, logic: 4 }
  
  const scores = answers || { publicSpeaking: 3, finance: 2, anxiety: 3, timeMgmt: 4, logic: 4 };
  const avg = Object.values(scores).reduce((a, b) => a + Number(b), 0) / Object.values(scores).length;
  const overallPercent = Math.round((avg / 5) * 100);

  const recommendations = [];
  if ((scores.finance || 0) < 3) recommendations.push('Start with Financial Literacy: Learn compounding & budgeting basics');
  if ((scores.publicSpeaking || 0) < 3) recommendations.push('Practice the PREP framework for 60-second speaking confidence');
  if ((scores.anxiety || 0) < 3) recommendations.push('Adopt the Physiological Sigh breathing protocol for exam calm');
  if (recommendations.length === 0) recommendations.push('Maintain high focus with 90-minute deep work blocks');

  return res.json({
    success: true,
    score: overallPercent,
    level: overallPercent >= 80 ? 'Mastery' : overallPercent >= 60 ? 'Competent' : 'Developing',
    recommendations
  });
});

module.exports = router;

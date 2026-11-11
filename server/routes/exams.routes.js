const express = require('express');
const router = express.Router();

const EXAMS = [
  {
    id: 'jee_main',
    name: 'JEE Main',
    fullName: 'Joint Entrance Examination – Main',
    category: 'engineering',
    conductedBy: 'NTA (National Testing Agency)',
    icon: '⚙️',
    color: '#6857F5',
    level: 'National',
    targetDegree: 'B.Tech / B.E.',
    eligibility: {
      qualification: '10+2 or equivalent with Physics, Chemistry, Mathematics',
      minMarks: '75% aggregate (65% for SC/ST/PwD)',
      ageLimit: 'No age limit',
      attempts: 'Maximum 3 consecutive years'
    },
    pattern: {
      mode: 'Computer-Based Test (CBT)',
      duration: '3 hours',
      papers: ['Paper 1 (B.Tech/B.E.)', 'Paper 2A (B.Arch)', 'Paper 2B (B.Planning)'],
      subjects: [
        { name: 'Physics', questions: 30, marks: 100 },
        { name: 'Chemistry', questions: 30, marks: 100 },
        { name: 'Mathematics', questions: 30, marks: 100 }
      ],
      totalMarks: 300,
      marking: '+4 for correct, -1 for incorrect (MCQ); +4 no negative (numerical)'
    },
    syllabus: {
      Physics: ['Mechanics', 'Thermodynamics', 'Electrostatics', 'Current Electricity', 'Optics', 'Modern Physics', 'Waves'],
      Chemistry: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
      Mathematics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry', 'Vectors', 'Statistics']
    },
    importantDates: [
      { event: 'Session 1 Application', date: 'November 2024' },
      { event: 'Session 1 Exam', date: 'January 2025' },
      { event: 'Session 2 Application', date: 'February 2025' },
      { event: 'Session 2 Exam', date: 'April 2025' }
    ],
    officialLink: 'https://jeemain.nta.ac.in',
    prepTips: ['Focus on NCERT first', 'Solve previous year papers', 'Practice numerical problems daily', 'Time management is key'],
    topColleges: ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur', 'NITs', 'IIITs']
  },
  {
    id: 'jee_advanced',
    name: 'JEE Advanced',
    fullName: 'Joint Entrance Examination – Advanced',
    category: 'engineering',
    conductedBy: 'IITs (rotational)',
    icon: '🔬',
    color: '#19C6D8',
    level: 'National',
    targetDegree: 'B.Tech at IITs',
    eligibility: {
      qualification: 'Qualified JEE Main (top 2.5 lakh candidates)',
      minMarks: '75% in 10+2 (65% for reserved categories)',
      ageLimit: 'Born on or after Oct 1, 2000 (general)',
      attempts: 'Maximum 2 consecutive years'
    },
    pattern: {
      mode: 'Computer-Based Test (CBT)',
      duration: '3 hours per paper (2 papers)',
      papers: ['Paper 1', 'Paper 2'],
      subjects: [
        { name: 'Physics', questions: 'Variable', marks: 'Variable' },
        { name: 'Chemistry', questions: 'Variable', marks: 'Variable' },
        { name: 'Mathematics', questions: 'Variable', marks: 'Variable' }
      ],
      totalMarks: 360,
      marking: 'Complex marking scheme – varies by question type'
    },
    syllabus: {
      Physics: ['Mechanics (Advanced)', 'Electrodynamics', 'Optics', 'Modern Physics', 'Thermal Physics'],
      Chemistry: ['Physical Chemistry', 'Organic Synthesis', 'Inorganic Chemistry (IUPAC)', 'Electrochemistry'],
      Mathematics: ['Complex Numbers', 'Matrices', 'Differential Equations', 'Probability', 'Integration']
    },
    importantDates: [
      { event: 'Registration Opens', date: 'April 2025' },
      { event: 'Exam Date', date: 'May 2025' },
      { event: 'Result Declaration', date: 'June 2025' }
    ],
    officialLink: 'https://jeeadv.ac.in',
    prepTips: ['Master concepts, not just formulas', 'Practice HC Verma & Irodov for Physics', 'JD Lee for Inorganic Chemistry', 'Hall & Knight for Maths'],
    topColleges: ['IIT Bombay (CS)', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Roorkee', 'IIT Kharagpur']
  },
  {
    id: 'neet_ug',
    name: 'NEET-UG',
    fullName: 'National Eligibility cum Entrance Test – Undergraduate',
    category: 'medical',
    conductedBy: 'NTA (National Testing Agency)',
    icon: '🏥',
    color: '#22C58B',
    level: 'National',
    targetDegree: 'MBBS / BDS / AYUSH',
    eligibility: {
      qualification: '10+2 with Physics, Chemistry, Biology (minimum 50% aggregate)',
      minMarks: '50% aggregate for General (40% for SC/ST/OBC)',
      ageLimit: '17 years minimum; upper limit removed post SC ruling',
      attempts: 'No limit on attempts'
    },
    pattern: {
      mode: 'Pen and Paper (OMR)',
      duration: '3 hours 20 minutes',
      papers: ['Single paper'],
      subjects: [
        { name: 'Physics', questions: 45, marks: 180 },
        { name: 'Chemistry', questions: 45, marks: 180 },
        { name: 'Botany', questions: 45, marks: 180 },
        { name: 'Zoology', questions: 45, marks: 180 }
      ],
      totalMarks: 720,
      marking: '+4 for correct, -1 for incorrect'
    },
    syllabus: {
      Physics: ['Mechanics', 'Thermodynamics', 'Optics', 'Electronic Devices', 'Dual Nature of Radiation'],
      Chemistry: ['Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Biomolecules', 'Polymers'],
      Biology: ['Cell Biology', 'Genetics', 'Evolution', 'Human Physiology', 'Plant Physiology', 'Ecology']
    },
    importantDates: [
      { event: 'Application Form', date: 'February 2025' },
      { event: 'Exam Date', date: 'May 2025' },
      { event: 'Result', date: 'June 2025' },
      { event: 'Counselling', date: 'July-August 2025' }
    ],
    officialLink: 'https://neet.nta.nic.in',
    prepTips: ['NCERT Biology is the Bible', 'Practice previous year questions', 'Focus on diagrams', 'Revise regularly with flashcards'],
    topColleges: ['AIIMS Delhi', 'JIPMER', 'AFMC Pune', 'KMC Manipal', 'CMC Vellore']
  },
  {
    id: 'cuet',
    name: 'CUET-UG',
    fullName: 'Common University Entrance Test – Undergraduate',
    category: 'undergraduate',
    conductedBy: 'NTA (National Testing Agency)',
    icon: '🎓',
    color: '#F5B942',
    level: 'National',
    targetDegree: 'Any UG Degree at Central Universities',
    eligibility: {
      qualification: '10+2 or equivalent from any recognized board',
      minMarks: 'As per university norms',
      ageLimit: 'No age limit',
      attempts: 'No limit'
    },
    pattern: {
      mode: 'Computer-Based Test (CBT)',
      duration: '3 hours 15 minutes (variable by section)',
      papers: ['Section IA/IB (Languages)', 'Section II (Domain Subjects)', 'Section III (General Test)'],
      subjects: [
        { name: 'Language Test', questions: 50, marks: 200 },
        { name: 'Domain Subjects', questions: 40, marks: 160 },
        { name: 'General Test', questions: 60, marks: 240 }
      ],
      totalMarks: 'Variable (depends on university)',
      marking: '+5 for correct, -1 for incorrect'
    },
    syllabus: {
      'Domain Subjects': ['As per Class 12 NCERT for chosen subjects'],
      'General Test': ['Numerical Ability', 'Reasoning', 'General Knowledge', 'Current Affairs', 'Quantitative Reasoning']
    },
    importantDates: [
      { event: 'Application', date: 'March 2025' },
      { event: 'Exam', date: 'May 2025' },
      { event: 'Result', date: 'July 2025' }
    ],
    officialLink: 'https://cuet.samarth.ac.in',
    prepTips: ['Cover NCERT of chosen domain subjects', 'Practice mock tests on NTA website', 'Focus on General Test for university-agnostic prep'],
    topColleges: ['Delhi University', 'JNU', 'BHU', 'Jamia Millia', 'Hyderabad Central University']
  },
  {
    id: 'clat',
    name: 'CLAT',
    fullName: 'Common Law Admission Test',
    category: 'law',
    conductedBy: 'Consortium of NLUs',
    icon: '⚖️',
    color: '#A78BFA',
    level: 'National',
    targetDegree: 'BA LLB / BBA LLB / LLM',
    eligibility: {
      qualification: '10+2 with minimum 45% (40% for SC/ST)',
      minMarks: '45% in 10+2',
      ageLimit: 'No age limit for UG; 20 years max was removed',
      attempts: 'No limit'
    },
    pattern: {
      mode: 'Offline (Pen and Paper)',
      duration: '2 hours',
      papers: ['Single paper – UG'],
      subjects: [
        { name: 'English Language', questions: '22-26', marks: '22-26' },
        { name: 'Current Affairs & GK', questions: '28-32', marks: '28-32' },
        { name: 'Legal Reasoning', questions: '28-32', marks: '28-32' },
        { name: 'Logical Reasoning', questions: '22-26', marks: '22-26' },
        { name: 'Quantitative Techniques', questions: '10-14', marks: '10-14' }
      ],
      totalMarks: 120,
      marking: '+1 for correct, -0.25 for incorrect'
    },
    syllabus: {
      'English': ['Reading Comprehension', 'Vocabulary', 'Grammar'],
      'Legal Reasoning': ['Legal Principles', 'Case Analysis', 'Legal Maxims'],
      'Logical Reasoning': ['Critical Reasoning', 'Arrangements', 'Syllogisms'],
      'GK': ['Current Affairs', 'Legal & Constitutional Events', 'Science & Technology']
    },
    importantDates: [
      { event: 'Application Opens', date: 'January 2025' },
      { event: 'Exam Date', date: 'December 2025' },
      { event: 'Counselling', date: 'January 2026' }
    ],
    officialLink: 'https://consortiumofnlus.ac.in',
    prepTips: ['Read newspapers daily', 'Practice legal reasoning passages', 'Build reading speed', 'Focus on SC/HC judgments for legal GK'],
    topColleges: ['NLSIU Bangalore', 'NALSAR Hyderabad', 'NUJS Kolkata', 'NLU Delhi', 'NLIU Bhopal']
  },
  {
    id: 'nda',
    name: 'NDA',
    fullName: 'National Defence Academy Examination',
    category: 'defence',
    conductedBy: 'UPSC (Union Public Service Commission)',
    icon: '🎖️',
    color: '#F06474',
    level: 'National',
    targetDegree: 'B.Tech / BSc at NDA',
    eligibility: {
      qualification: '10+2 with PCM (Army/Air Force/Navy)',
      minMarks: 'As per merit',
      ageLimit: '16.5 to 19.5 years',
      attempts: 'Varies; typically unmarried males only (policy evolving)'
    },
    pattern: {
      mode: 'Offline (OMR)',
      duration: '5 hours (2 papers of 2.5 hrs each)',
      papers: ['Paper I – Mathematics', 'Paper II – General Ability Test'],
      subjects: [
        { name: 'Mathematics', questions: 120, marks: 300 },
        { name: 'General Ability Test', questions: 150, marks: 600 }
      ],
      totalMarks: 900,
      marking: '+2.5 / -0.83 (Maths), +4 / -1.33 (GAT)'
    },
    syllabus: {
      Mathematics: ['Algebra', 'Matrices', 'Trigonometry', 'Calculus', 'Statistics', 'Vectors'],
      'General Ability': ['English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Current Affairs']
    },
    importantDates: [
      { event: 'NDA I Notification', date: 'January 2025' },
      { event: 'NDA I Exam', date: 'April 2025' },
      { event: 'NDA II Notification', date: 'June 2025' },
      { event: 'NDA II Exam', date: 'September 2025' }
    ],
    officialLink: 'https://upsc.gov.in',
    prepTips: ['Strong PCM basics essential', 'Current affairs and GK critical', 'Physical fitness for SSB stage', 'Practise previous papers of both sessions'],
    topColleges: ['NDA Khadakwasla (leads to IMA, INA, AFA)']
  },
  {
    id: 'upsc_cse',
    name: 'UPSC CSE',
    fullName: 'Union Public Service Commission – Civil Services Examination',
    category: 'government',
    conductedBy: 'UPSC (Union Public Service Commission)',
    icon: '🏛️',
    color: '#6857F5',
    level: 'National',
    targetDegree: 'IAS / IPS / IFS & other All India Services',
    eligibility: {
      qualification: 'Any Bachelor\'s degree from recognized university',
      minMarks: 'No minimum marks',
      ageLimit: '21–32 years (relaxation for reserved categories)',
      attempts: 'General: 6, OBC: 9, SC/ST: unlimited till age limit'
    },
    pattern: {
      mode: 'Offline (Written) + Personality Test',
      duration: 'Prelims (2 papers), Mains (9 papers), Interview',
      papers: ['Prelims – GS Paper I', 'Prelims – CSAT', 'Mains – GS I to IV + Essay + Optional'],
      subjects: [
        { name: 'Prelims GS', questions: 100, marks: 200 },
        { name: 'Prelims CSAT', questions: 80, marks: 200 },
        { name: 'Mains (total)', questions: 'Descriptive', marks: 1750 }
      ],
      totalMarks: 2025,
      marking: 'Prelims: -0.33 per wrong; Mains: no negative'
    },
    syllabus: {
      'GS Paper 1': ['Indian History', 'Geography', 'Indian Polity', 'Economic Development'],
      'GS Paper 2': ['Governance', 'Constitution', 'International Relations', 'Social Justice'],
      'GS Paper 3': ['Economy', 'Technology', 'Environment', 'Disaster Management', 'Security'],
      'GS Paper 4': ['Ethics', 'Integrity', 'Aptitude', 'Case Studies']
    },
    importantDates: [
      { event: 'Notification', date: 'February 2025' },
      { event: 'Prelims', date: 'May 2025' },
      { event: 'Mains', date: 'September 2025' },
      { event: 'Interview', date: 'January-April 2026' }
    ],
    officialLink: 'https://upsc.gov.in',
    prepTips: ['NCERT foundation is essential', 'The Hindu newspaper daily', 'Develop answer writing skills', 'Consistent revision is the key'],
    topColleges: ['LBSNAA (IAS training)', 'SVP National Police Academy (IPS)', 'IGNFA (IFS)']
  },
  {
    id: 'ca_foundation',
    name: 'CA Foundation',
    fullName: 'Chartered Accountancy – Foundation Course',
    category: 'finance',
    conductedBy: 'ICAI (Institute of Chartered Accountants of India)',
    icon: '📊',
    color: '#19C6D8',
    level: 'National',
    targetDegree: 'CA (Chartered Accountant)',
    eligibility: {
      qualification: '10+2 passed (can register after Class 10)',
      minMarks: 'No minimum marks specified',
      ageLimit: 'No age limit',
      attempts: 'No limit'
    },
    pattern: {
      mode: 'Offline (Pen and Paper)',
      duration: '6 hours per paper (4 papers over 2 days)',
      papers: ['Paper 1 – Accountancy', 'Paper 2 – Business Laws', 'Paper 3 – Maths & Statistics', 'Paper 4 – Economics'],
      subjects: [
        { name: 'Principles of Accountancy', questions: 'Descriptive', marks: 100 },
        { name: 'Business Laws', questions: 'Descriptive', marks: 100 },
        { name: 'Quantitative Aptitude', questions: 'MCQ + Descriptive', marks: 100 },
        { name: 'Business Economics', questions: 'MCQ + Descriptive', marks: 100 }
      ],
      totalMarks: 400,
      marking: 'Aggregate 50%, no paper below 40%'
    },
    syllabus: {
      Accountancy: ['Journal Entries', 'Ledger', 'Trial Balance', 'Final Accounts', 'Partnership', 'Company Accounts'],
      'Business Laws': ['Indian Contract Act', 'Sale of Goods Act', 'Negotiable Instruments Act'],
      'Quantitative Aptitude': ['Ratio', 'Percentages', 'Time & Work', 'Permutation & Combination', 'Statistics']
    },
    importantDates: [
      { event: 'May Session Exam', date: 'May 2025' },
      { event: 'November Session Exam', date: 'November 2025' },
      { event: 'Registration (ongoing)', date: 'Year-round' }
    ],
    officialLink: 'https://icai.org',
    prepTips: ['Study ICAI Study Material only', 'Practice questions daily', 'Attempt mock tests on ICAI portal', 'Join a coaching for Paper 1 & 3'],
    topColleges: ['Big 4 firms (Deloitte, PwC, EY, KPMG)', 'Leads to all CA-level organisations']
  }
];

// GET /api/exams — all exams (summary)
router.get('/', (req, res) => {
  const { category } = req.query;
  let exams = EXAMS;
  if (category) exams = exams.filter(e => e.category === category);

  const summary = exams.map(({ id, name, fullName, category, conductedBy, icon, color, level, targetDegree }) => ({
    id, name, fullName, category, conductedBy, icon, color, level, targetDegree
  }));

  const categories = [...new Set(EXAMS.map(e => e.category))];
  res.json({ success: true, exams: summary, categories, total: summary.length });
});

// GET /api/exams/categories
router.get('/categories', (req, res) => {
  const categories = [...new Set(EXAMS.map(e => e.category))].map(cat => ({
    id: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: EXAMS.filter(e => e.category === cat).length
  }));
  res.json({ success: true, categories });
});

// GET /api/exams/:id — full exam detail
router.get('/:id', (req, res) => {
  const exam = EXAMS.find(e => e.id === req.params.id);
  if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
  res.json({ success: true, exam });
});

// POST /api/exams/:id/roadmap — AI-generated prep roadmap
router.post('/:id/roadmap', async (req, res) => {
  const exam = EXAMS.find(e => e.id === req.params.id);
  if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

  const { monthsAvailable = 6 } = req.body;

  // Try Gemini
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (GEMINI_API_KEY) {
      const prompt = `Create a ${monthsAvailable}-month study roadmap for ${exam.fullName}. 
      Subjects: ${Object.keys(exam.syllabus).join(', ')}.
      Format as JSON: { phases: [{ month: number, title: string, focus: string[], tasks: string[], tip: string }] }
      Make it motivating, practical and specific to Indian students.`;

      const gemRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
      );
      const data = await gemRes.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const roadmap = JSON.parse(jsonMatch[0]);
        return res.json({ success: true, examId: exam.id, examName: exam.name, monthsAvailable, roadmap, source: 'gemini' });
      }
    }
  } catch (_) {}

  // Rule-based expert response system for study roadmap
  const phases = Array.from({ length: Math.min(monthsAvailable, 6) }, (_, i) => ({
    month: i + 1,
    title: i === 0 ? 'Foundation & Concept Building' : i === monthsAvailable - 1 ? 'Revision & Mock Tests' : `Deep Practice – Phase ${i + 1}`,
    focus: Object.keys(exam.syllabus).slice(0, 3),
    tasks: ['Complete NCERT/reference books', 'Solve 20 practice questions daily', 'Take weekly mock test'],
    tip: ['Start with basics', 'Mix subjects daily', 'Track weak areas', 'Revise regularly', 'Full mock tests', 'Stay calm and confident'][i] || 'Keep going!'
  }));

  res.json({ success: true, examId: exam.id, examName: exam.name, monthsAvailable, roadmap: { phases }, source: 'rule_based_engine' });
});

// In-memory tracked exams for the user session
let userTrackedExams = [
  {
    examId: 'jee_main',
    examName: 'JEE Main',
    targetYear: '2025',
    targetScore: '240/300',
    status: 'In Preparation',
    trackedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// GET /api/exams/user/tracked — list tracked exams
router.get('/user/tracked', (req, res) => {
  res.json({ success: true, trackedExams: userTrackedExams, total: userTrackedExams.length });
});

// POST /api/exams/:id/track — toggle tracking an exam
router.post('/:id/track', (req, res) => {
  const exam = EXAMS.find(e => e.id === req.params.id);
  if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

  const existingIndex = userTrackedExams.findIndex(t => t.examId === exam.id);
  if (existingIndex !== -1) {
    // Untrack
    userTrackedExams.splice(existingIndex, 1);
    return res.json({ success: true, isTracked: false, message: `Untracked ${exam.name}`, trackedExams: userTrackedExams });
  }

  const { targetYear = '2025', targetScore = 'Top 1% Percentile' } = req.body || {};
  const newTracked = {
    examId: exam.id,
    examName: exam.name,
    targetYear,
    targetScore,
    status: 'In Preparation',
    trackedAt: new Date().toISOString()
  };
  userTrackedExams.push(newTracked);
  res.json({ success: true, isTracked: true, message: `Added ${exam.name} to My Target Exams`, tracked: newTracked, trackedExams: userTrackedExams });
});

// POST /api/exams — create new exam (Admin)
router.post('/', (req, res) => {
  const { name, fullName, category, conductedBy, icon, color, level, targetDegree, eligibility, pattern, syllabus, importantDates, officialLink, prepTips, topColleges } = req.body;
  if (!name || !fullName || !category) {
    return res.status(400).json({ success: false, message: 'name, fullName and category are required' });
  }
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const newExam = {
    id,
    name,
    fullName,
    category,
    conductedBy: conductedBy || 'National Authority',
    icon: icon || '📝',
    color: color || '#6857F5',
    level: level || 'National',
    targetDegree: targetDegree || 'Undergraduate Degree',
    eligibility: eligibility || { qualification: '10+2 or equivalent' },
    pattern: pattern || { mode: 'Computer-Based Test (CBT)', duration: '3 hours' },
    syllabus: syllabus || { 'Core Subjects': ['Fundamentals', 'Advanced Concepts'] },
    importantDates: importantDates || [{ event: 'Application', date: 'TBA' }],
    officialLink: officialLink || 'https://nta.ac.in',
    prepTips: prepTips || ['Master core syllabus', 'Solve PYQs daily'],
    topColleges: topColleges || ['Top National Institutions']
  };
  EXAMS.push(newExam);
  res.status(201).json({ success: true, exam: newExam });
});

module.exports = router;


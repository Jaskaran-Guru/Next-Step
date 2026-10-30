const express = require('express');
const router = express.Router();
const Career = require('../models/Career');
const Degree = require('../models/Degree');

// Seed catalog data for careers
const DEFAULT_CAREERS = [
  {
    slug: 'software-engineer',
    title: 'Full-Stack & Cloud Software Engineer',
    category: 'Technology & AI',
    tagline: 'Architecting scalable applications, cloud systems & intelligent algorithms.',
    overview: 'Software Engineers design, develop, and maintain software systems ranging from web and mobile apps to distributed cloud platforms and AI infrastructure.',
    requiredDegrees: ['B.Tech Computer Science / IT', 'BCA + MCA', 'B.Sc Computer Science'],
    entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'State CETs', 'NIMCET (for MCA)'],
    recommendedStreams: ['Science (PCM)'],
    coreSkills: ['Data Structures & Algorithms', 'JavaScript / TypeScript / Node.js', 'System Design', 'Databases (SQL & NoSQL)', 'Docker & Cloud (AWS/GCP)'],
    growthOutlook: 'Exponential Demand (+24% Growth through 2030)',
    approxSalaryRange: {
      fresher: '₹6,00,000 - ₹18,00,000 per annum',
      experienced: '₹22,00,000 - ₹65,00,000+ per annum'
    },
    dayInTheLife: [
      'Morning daily standup and sprint prioritization',
      'Architecting system components and database schemas',
      'Writing test-driven code and reviewing peer pull requests',
      'Optimizing query latencies and analyzing deployment telemetry'
    ],
    alternativePathways: [
      'Self-taught coder through open source & coding bootcamps',
      'Diploma in Computer Engineering -> Lateral Entry B.Tech',
      'B.Sc Mathematics / Statistics -> Data Engineering transition'
    ],
    topHiringDomains: ['Product Tech Firms', 'FinTech & Banking', 'E-Commerce', 'AI Startups', 'Global Capability Centers (GCCs)']
  },
  {
    slug: 'ai-ml-engineer',
    title: 'Artificial Intelligence & Machine Learning Specialist',
    category: 'Technology & AI',
    tagline: 'Building neural networks, LLM agents & autonomous intelligence.',
    overview: 'AI/ML Engineers develop predictive models, natural language processing pipelines, computer vision systems, and autonomous generative AI agents.',
    requiredDegrees: ['B.Tech AI / Data Science', 'B.Tech CSE', 'M.Tech / M.S. in Machine Learning'],
    entranceExams: ['JEE Main', 'GATE (CS/DA)', 'BITSAT'],
    recommendedStreams: ['Science (PCM)'],
    coreSkills: ['Python & PyTorch', 'Linear Algebra & Statistics', 'Transformer Architecture (LLMs)', 'RAG Pipelines & Vector DBs', 'MLOps (MLflow, Kubernetes)'],
    growthOutlook: 'Hyper-Growth (+38% CAGR)',
    approxSalaryRange: {
      fresher: '₹8,00,000 - ₹24,00,000 per annum',
      experienced: '₹30,00,000 - ₹90,00,000+ per annum'
    },
    dayInTheLife: [
      'Fine-tuning foundational models on proprietary domain datasets',
      'Benchmarking hallucination and latency in retrieval systems',
      'Optimizing inference pipelines using TensorRT and quantization'
    ],
    alternativePathways: ['B.Sc Statistics / Data Science -> M.Sc Applied AI', 'Software Engineer -> Internal AI specialization switch'],
    topHiringDomains: ['GenAI Research Labs', 'Healthcare Diagnostics', 'Autonomous Robotics', 'Algorithmic Trading']
  },
  {
    slug: 'medical-doctor',
    title: 'Medical Doctor & Clinical Specialist (MBBS / MD)',
    category: 'Medical & Healthcare',
    tagline: 'Diagnosing, treating, and saving human lives through medical science.',
    overview: 'Doctors provide primary, secondary, and specialized clinical care, performing surgeries, diagnosing complex pathologies, and leading healthcare delivery.',
    requiredDegrees: ['MBBS (5.5 Years)', 'MD / MS (3 Years Residency)', 'DM / MCh (Super-speciality)'],
    entranceExams: ['NEET-UG', 'NEET-PG / NExT'],
    recommendedStreams: ['Science (PCB / PCMB)'],
    coreSkills: ['Clinical Diagnostics', 'Human Anatomy & Physiology', 'Pharmacology', 'Patient Communication & Empathy', 'Surgical Dexterity'],
    growthOutlook: 'Critical Essential Demand (Zero Unemployment Risk)',
    approxSalaryRange: {
      fresher: '₹8,00,000 - ₹14,00,000 per annum (Junior Resident)',
      experienced: '₹20,00,000 - ₹60,00,000+ per annum (Specialist Consultant)'
    },
    dayInTheLife: [
      'Ward rounds and patient assessment in ICU/OPD',
      'Performing clinical evaluations and ordering diagnostic imaging',
      'Surgical procedures and clinical case reviews'
    ],
    alternativePathways: ['BDS (Dental)', 'BAMS (Ayurveda)', 'B.Sc Nursing -> Clinical Nurse Specialist', 'Biomedical Research'],
    topHiringDomains: ['Government Hospitals (AIIMS)', 'Private Multi-Specialty Hospitals', 'Clinical Research Organizations', 'Private Practice']
  },
  {
    slug: 'chartered-accountant',
    title: 'Chartered Accountant (CA) & Financial Strategist',
    category: 'Commerce & Finance',
    tagline: 'Mastering corporate auditing, taxation, financial planning & CFO leadership.',
    overview: 'Chartered Accountants are the financial backbone of corporate governance, handling audits, mergers & acquisitions, international taxation, and strategic finance.',
    requiredDegrees: ['ICAI CA Program (Foundation -> Intermediate -> Articleship -> Final)', 'B.Com (Hons) as dual degree'],
    entranceExams: ['CA Foundation', 'CUET (for top B.Com colleges)'],
    recommendedStreams: ['Commerce (with or without Math)', 'Science students can also appear'],
    coreSkills: ['Financial Accounting & Auditing', 'Corporate Law & Direct/Indirect Tax', 'Financial Modeling', 'Risk Assessment', 'Strategic CFO Advisory'],
    growthOutlook: 'High Sustained Demand across all industries',
    approxSalaryRange: {
      fresher: '₹8,50,000 - ₹18,00,000 per annum',
      experienced: '₹25,00,000 - ₹75,00,000+ per annum'
    },
    dayInTheLife: [
      'Statutory audit reviews and compliance checklists',
      'Tax optimization modeling for corporate restructuring',
      'Advising board members on capital allocation and risks'
    ],
    alternativePathways: ['CFA (Chartered Financial Analyst)', 'US CPA / CMA', 'MBA Finance from IIMs'],
    topHiringDomains: ['Big 4 Audit Firms (Deloitte, PwC, EY, KPMG)', 'Investment Banks', 'Multinational Corporations', 'Advisory Consultancies']
  },
  {
    slug: 'civil-services-officer',
    title: 'Civil Services Officer (IAS / IPS / IFS / IRS)',
    category: 'Civil Services',
    tagline: 'Policy formulation, district administration, national security & diplomatic relations.',
    overview: 'Civil Servants spearhead governance, public policy, law and order, and national development programs at district, state, and central government levels.',
    requiredDegrees: ['Any Bachelor’s Degree (Graduation in any discipline: B.Tech, BA, B.Sc, B.Com, MBBS)'],
    entranceExams: ['UPSC Civil Services Examination (Prelims -> Mains -> Interview)'],
    recommendedStreams: ['Any Stream (Humanities, Science, Commerce)'],
    coreSkills: ['Public Administration & Policy Analysis', 'Leadership & Crisis Management', 'Constitutional Law', 'General Studies & Ethics', 'Diplomatic Communication'],
    growthOutlook: 'Prestigious Public Leadership',
    approxSalaryRange: {
      fresher: '₹75,000 - ₹1,20,000 per month (SDM / Assistant Secretary + Govt Perquisites)',
      experienced: '₹1,50,000 - ₹2,50,000 per month (District Magistrate / Secretary to GoI)'
    },
    dayInTheLife: [
      'District administrative field inspections and reviews',
      'Disaster management and public grievance hearings',
      'Formulating state department policies and reviewing expenditure'
    ],
    alternativePathways: ['State Public Service Commissions (State PCS)', 'SSC CGL', 'RBI Grade B Officer'],
    topHiringDomains: ['Government of India', 'State Governments', 'Ministry of External Affairs', 'Central Secretariats']
  },
  {
    slug: 'product-designer',
    title: 'UI/UX & Product Experience Designer',
    category: 'Design & Creative',
    tagline: 'Transforming complex human problems into intuitive, aesthetic digital products.',
    overview: 'Product Designers craft user experiences, visual design systems, interaction flows, and design psychology for web, mobile, and consumer hardware applications.',
    requiredDegrees: ['B.Des (Bachelor of Design)', 'B.Tech / BCA with Design Specialization', 'Any Degree + High-Impact Design Portfolio'],
    entranceExams: ['UCEED', 'NID DAT', 'CEED (for Masters)'],
    recommendedStreams: ['Any Stream (Science, Arts, Commerce)'],
    coreSkills: ['Figma & Design Systems', 'User Research & Wireframing', 'Interaction Design', 'Micro-animations', 'Design-to-Code Collaboration'],
    growthOutlook: 'Rapid Surge (+20% YoY in digital SaaS)',
    approxSalaryRange: {
      fresher: '₹6,00,000 - ₹15,00,000 per annum',
      experienced: '₹20,00,000 - ₹50,00,000+ per annum'
    },
    dayInTheLife: [
      'Conducting user usability tests and analyzing click telemetry',
      'Iterating wireframes and interactive Figma prototypes',
      'Aligning with product managers and frontend developers on tokens'
    ],
    alternativePathways: ['Graphic Designer -> Product Designer transition', 'Frontend Developer -> UX Specialist', 'Self-taught portfolio route'],
    topHiringDomains: ['Consumer Tech Apps (Swiggy, Zomato, CRED)', 'Enterprise SaaS Companies', 'Design Studios', 'FinTech']
  }
];

// Seed catalog data for degrees
const DEFAULT_DEGREES = [
  {
    code: 'btech-cse',
    name: 'B.Tech in Computer Science & Engineering',
    level: 'Undergraduate',
    durationYears: 4,
    category: 'Engineering & Technology',
    eligibility: '10+2 with Physics, Mathematics & Chemistry/Comp Sci (min 60-75%)',
    entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'MHT-CET'],
    averageFees: '₹4,00,000 - ₹14,00,000 (Total 4 Years)',
    practicalFocusScore: 85,
    pros: [
      'Gold standard for on-campus technical recruitment globally',
      'Wide eligibility for tech roles, higher studies (M.S./M.Tech), and MBA',
      'Campus hiring ecosystem is mature in Tier 1 and 2 colleges'
    ],
    cons: [
      'High entrance examination competition (JEE Main cutoffs are severe)',
      'College syllabus can sometimes lag behind fast-moving industry tech stacks'
    ],
    careerOutcomes: ['Software Engineer', 'Data Scientist', 'DevOps / Cloud Architect', 'Product Manager']
  },
  {
    code: 'bca',
    name: 'Bachelor of Computer Applications (BCA)',
    level: 'Undergraduate',
    durationYears: 3,
    category: 'Computer Applications',
    eligibility: '10+2 in any stream (Math/Comp Sci preferred in top universities)',
    entranceExams: ['CUET-UG', 'IPU CET', 'Christ University Entrance'],
    averageFees: '₹1,50,000 - ₹6,00,000 (Total 3 Years)',
    practicalFocusScore: 78,
    pros: [
      'Open to students from non-PCM streams (Commerce/Arts with Math)',
      'Shorter 3-year duration allows quicker entry or pairing with MCA',
      'Strong hands-on programming focus in web and database technologies'
    ],
    cons: [
      'Certain core engineering exams (e.g. GATE CS directly) prefer 4-year degree or MCA',
      'Initial campus median packages are typically lower than Tier 1 B.Tech'
    ],
    careerOutcomes: ['Full-Stack Web Developer', 'System Administrator', 'Software QA Engineer', 'BCA + MCA -> SDE']
  },
  {
    code: 'bcom-hons',
    name: 'Bachelor of Commerce (B.Com Honours)',
    level: 'Undergraduate',
    durationYears: 3,
    category: 'Commerce & Finance',
    eligibility: '10+2 with Commerce / Mathematics / English',
    entranceExams: ['CUET-UG (Delhi University, BHU, Jamia)', 'NPAT', 'SET'],
    averageFees: '₹50,000 - ₹3,50,000 (Total 3 Years)',
    practicalFocusScore: 65,
    pros: [
      'Ideal springboard for CA, CS, CFA, and MBA Finance',
      'Provides deep conceptual mastery of taxation, financial markets, and business laws',
      'Flexible schedule allows pursuing professional certifications simultaneously'
    ],
    cons: [
      'Standalone B.Com without professional qualification (CA/CFA/MBA) has limited salary ceiling',
      'High competition for admission into top colleges like SRCC, LSR, St. Xaviers'
    ],
    careerOutcomes: ['Financial Analyst', 'Accountant', 'Tax Consultant', 'Investment Banking Analyst (with CFA/MBA)']
  },
  {
    code: 'bba',
    name: 'Bachelor of Business Administration (BBA)',
    level: 'Undergraduate',
    durationYears: 3,
    category: 'Business & Management',
    eligibility: '10+2 in any stream with minimum 50%',
    entranceExams: ['IPMAT (IIM Indore/Rohtak 5-Year Integrated)', 'CUET-UG', 'SET', 'NPAT'],
    averageFees: '₹2,00,000 - ₹8,00,000 (Total 3 Years)',
    practicalFocusScore: 75,
    pros: [
      'Comprehensive foundation in marketing, human resources, finance, and leadership',
      'IPMAT pathway guarantees direct entry into premier IIM MBA without CAT',
      'Strong case-study, presentation, and communication development'
    ],
    cons: [
      'Generalist degree: requires specialization or top MBA for executive roles',
      'College brand name heavily influences campus placement quality'
    ],
    careerOutcomes: ['Business Development Executive', 'Marketing Associate', 'HR Generalist', 'Management Trainee']
  },
  {
    code: 'mbbs',
    name: 'Bachelor of Medicine & Bachelor of Surgery (MBBS)',
    level: 'Undergraduate',
    durationYears: 5.5,
    category: 'Medicine',
    eligibility: '10+2 with Physics, Chemistry & Biology (minimum 50%)',
    entranceExams: ['NEET-UG'],
    averageFees: '₹10,000 - ₹50,000/yr (Govt College) | ₹12,00,000 - ₹25,00,000/yr (Private)',
    practicalFocusScore: 98,
    pros: [
      'Most respected healthcare qualification with guaranteed social utility',
      'Zero unemployment risk throughout professional lifetime',
      'Rotational 1-year clinical internship provides extensive hands-on medical experience'
    ],
    cons: [
      'Extreme admission competition in NEET-UG (over 2.4 million candidates)',
      'Long study duration: 5.5 years MBBS + 3 years MD/MS residency to establish specialist practice'
    ],
    careerOutcomes: ['Medical Officer', 'Resident Doctor', 'Clinical Specialist (after MD/MS)', 'Healthcare Administrator']
  }
];

// 1. Get all careers
router.get('/', async (req, res) => {
  try {
    let careers = await Career.find().lean();
    if (!careers || careers.length === 0) {
      careers = DEFAULT_CAREERS;
    }
    return res.json({ success: true, count: careers.length, data: careers });
  } catch (error) {
    return res.json({ success: true, count: DEFAULT_CAREERS.length, data: DEFAULT_CAREERS });
  }
});

// 2. Get single career by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    let career = await Career.findOne({ slug }).lean();
    if (!career) {
      career = DEFAULT_CAREERS.find(c => c.slug === slug);
    }
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career profile not found' });
    }
    return res.json({ success: true, data: career });
  } catch (error) {
    const career = DEFAULT_CAREERS.find(c => c.slug === req.params.slug);
    if (career) return res.json({ success: true, data: career });
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Get all degrees
router.get('/meta/degrees', async (req, res) => {
  try {
    let degrees = await Degree.find().lean();
    if (!degrees || degrees.length === 0) {
      degrees = DEFAULT_DEGREES;
    }
    return res.json({ success: true, count: degrees.length, data: degrees });
  } catch (error) {
    return res.json({ success: true, count: DEFAULT_DEGREES.length, data: DEFAULT_DEGREES });
  }
});

// 4. Compare Degrees Side-by-Side
router.post('/meta/compare-degrees', async (req, res) => {
  try {
    const { codes } = req.body;
    if (!codes || !Array.isArray(codes) || codes.length < 2) {
      return res.status(400).json({ success: false, message: 'Select at least 2 degree codes to compare' });
    }

    const compared = DEFAULT_DEGREES.filter(d => codes.includes(d.code));
    return res.json({
      success: true,
      comparison: compared
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;


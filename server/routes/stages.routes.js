const express = require('express');
const router = express.Router();
const LifeStage = require('../models/LifeStage');
const ChildRoadmap = require('../models/ChildRoadmap');
const User = require('../models/User');

// Get all life stages with full developmental & career data
router.get('/', async (req, res) => {
  try {
    let stages = await LifeStage.find().sort({ createdAt: 1 });
    if (!stages || stages.length === 0) {
      stages = await seedDefaultStages();
    }
    res.json({ success: true, count: stages.length, stages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user saved child roadmaps (MUST be before /:stageKey to avoid param conflict)
router.get('/saved-roadmaps', async (req, res) => {
  try {
    const user = await User.findOne();
    const filter = user ? { userId: user._id } : {};
    const roadmaps = await ChildRoadmap.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: roadmaps.length, roadmaps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single stage by key
router.get('/:stageKey', async (req, res) => {
  try {
    const stage = await LifeStage.findOne({ stageKey: req.params.stageKey });
    if (!stage) return res.status(404).json({ success: false, message: 'Stage not found' });
    res.json({ success: true, stage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// AI Life-Stage & Career Advisor Query Endpoint
router.post('/advise', async (req, res) => {
  try {
    const { childName, childAge, currentStage, parentQuery } = req.body;
    if (!parentQuery || parentQuery.trim() === '') {
      return res.status(400).json({ success: false, message: 'Parent query or concern is required' });
    }

    const user = await User.findOne();
    let analysisData = null;

    // Check Gemini API
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 10) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY.trim()}`;
        const prompt = `You are the Lead Child Development & Career Architect at NextStep OS (Saarthi).
Parent's Child: "${childName || 'Child'}"
Age/Class: "${childAge || 'Not specified'}"
Life Stage: "${currentStage || 'General'}"
Parent's Query/Concern: "${parentQuery}"

Provide a compassionate, scientific, and realistic developmental & career guidance plan.
Utmost priority: Solid foundation, personality development, communication, high-value degrees, and ensuring the child is 100% gainfully employed with future-proof AI-proof skills.

Respond ONLY in valid JSON format with this exact structure:
{
  "summary": "Warm, reassuring 2-3 sentence executive guidance for the parents",
  "immediateNextSteps": [
    "Step 1 with specific action",
    "Step 2 with specific action",
    "Step 3 with specific action"
  ],
  "personalityAndHabits": [
    "Habit 1 for emotional/cognitive growth",
    "Habit 2 for communication & confidence",
    "Habit 3 for focus and curiosity"
  ],
  "academicRoadmap": [
    "Milestone 1 for this age group",
    "Milestone 2 for competitive/school readiness",
    "Milestone 3 for long-term stream/degree alignment"
  ],
  "unemploymentImmunityPlan": "Clear strategic plan on how to build skills, choose the right degree, and develop real-world problem-solving abilities so the student never faces unemployment in the evolving AI era."
}`;

        const apiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
          })
        });

        const geminiJson = await apiRes.json();
        const rawText = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const match = rawText.match(/\{[\s\S]*\}/);
          if (match) {
            analysisData = JSON.parse(match[0]);
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini advisor failed, using deterministic advisor:', geminiErr.message);
      }
    }

    // High-precision fallback expert engine if Gemini offline
    if (!analysisData) {
      analysisData = generateExpertAdvice(childName, childAge, currentStage, parentQuery);
    }

    // Save roadmap into MongoDB Atlas
    const savedRoadmap = await ChildRoadmap.create({
      userId: user?._id,
      childName: childName || 'My Child',
      childAge: childAge || 'Early Childhood',
      currentStage: currentStage || 'playway_1_4',
      parentConcernOrQuery: parentQuery.trim(),
      aiAnalysis: analysisData
    });

    res.status(201).json({
      success: true,
      message: 'Life-Stage Roadmap generated and persisted to MongoDB Atlas 🌱',
      roadmap: savedRoadmap
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Helper: Seed full 7 Life Stages into MongoDB
async function seedDefaultStages() {
  const defaultStages = [
    {
      stageKey: 'playway_1_4',
      ageGroup: 'Age 1 - 4 Years',
      title: 'Toddler & Playway Foundation',
      tagline: 'Sensory discovery, motor skills, speech development & playway readiness',
      badge: 'EARLY CHILDHOOD',
      icon: 'baby',
      color: '#06B6D4',
      overview: 'Between age 1 and 4, 90% of brain development occurs. Formal rote learning does more harm than good at this age. Focus exclusively on play-based sensory exploration, speech stimulation, fine motor coordination, and emotional bonding.',
      parentConcerns: [
        'Screen time addiction & delayed speech',
        'Playway / preschool selection criteria',
        'Separation anxiety & temper tantrums',
        'Nutritional habits and sleep consistency'
      ],
      subjectsAndActivities: [
        {
          title: 'Phonics, Rhymes & Speech Stimulation',
          description: 'Daily conversational reading, phonics sound imitation, and interactive storytelling.',
          icon: 'volume-2',
          skillsDeveloped: ['Vocabulary Expansion', 'Pronunciation', 'Listening Comprehension']
        },
        {
          title: 'Fine & Gross Motor Play',
          description: 'Clay modeling, stacking blocks, finger painting, paper tearing, and outdoor balance games.',
          icon: 'hand',
          skillsDeveloped: ['Hand-Eye Coordination', 'Pencil Grip Readiness', 'Spatial Awareness']
        },
        {
          title: 'Sensory & Montessori Exploration',
          description: 'Water play, color sorting, sand trays, and rhythm instruments.',
          icon: 'sparkles',
          skillsDeveloped: ['Sensory Processing', 'Curiosity', 'Focus Duration']
        }
      ],
      personalityDevelopment: [
        {
          trait: 'Emotional Security & Attachment',
          guideline: 'Acknowledge big feelings without shouting or harsh timeouts. Comfort first, teach later.',
          actionableHabit: '15 minutes of uninterrupted daily floor play with zero mobile phones around.'
        },
        {
          trait: 'Independence in Small Tasks',
          guideline: 'Encourage child to pick up toys, feed themselves with a spoon, and choose between two shirts.',
          actionableHabit: 'Never do for a child what they can reasonably do for themselves with patience.'
        }
      ],
      futureCareerPathways: []
    },
    {
      stageKey: 'primary_5_10',
      ageGroup: 'Age 5 - 10 Years (Class 1 to 5)',
      title: 'Primary School & Foundational Literacy',
      tagline: 'Mathematical curiosity, reading fluency, creativity & habit formation',
      badge: 'PRIMARY FOUNDATION',
      icon: 'palette',
      color: '#2563EB',
      overview: 'Transition into primary school where reading habit, mental math comfort, creative expression, and sports participation set the lifelong trajectory for academic self-confidence.',
      parentConcerns: [
        'Fear of mathematics and numbers',
        'Resistance to sitting down for homework',
        'Social confidence and making friends',
        'Developing a genuine love for reading books'
      ],
      subjectsAndActivities: [
        {
          title: 'Mental Math & Number Intuition',
          description: 'Visual arithmetic using counters, board games, abacus principles, and practical money math.',
          icon: 'calculator',
          skillsDeveloped: ['Arithmetic Fluency', 'Logical Reasoning', 'Pattern Recognition']
        },
        {
          title: 'Independent Reading & Creative Writing',
          description: 'Chapter books (Roald Dahl, Panchatantra), creative sentence building, and picture summaries.',
          icon: 'book-open',
          skillsDeveloped: ['Language Comprehension', 'Imagination', 'Written Expression']
        },
        {
          title: 'Hands-on Science & Nature Discovery',
          description: 'Plant growth experiments, magnet kits, kitchen chemistry, and astronomy gazing.',
          icon: 'flask-conical',
          skillsDeveloped: ['Scientific Temper', 'Observation', 'Questioning Mindset']
        }
      ],
      personalityDevelopment: [
        {
          trait: 'Growth Mindset vs Fear of Failure',
          guideline: 'Praise effort, persistence, and problem-solving strategies rather than inborn intelligence ("You worked hard on this puzzle" instead of "You are a genius").',
          actionableHabit: 'Debrief mistakes as fun learning experiments during dinner.'
        },
        {
          trait: 'Physical Agility & Sportsmanship',
          guideline: 'Enroll in at least one outdoor sport (swimming, martial arts, football, gymnastics) for discipline.',
          actionableHabit: '60 minutes of daily vigorous physical play.'
        }
      ],
      futureCareerPathways: []
    },
    {
      stageKey: 'middle_11_14',
      ageGroup: 'Age 11 - 14 Years (Class 6 to 8)',
      title: 'Middle School & Curiosity Ignition',
      tagline: 'Computational thinking, Olympiad exposure, public speaking & peer resilience',
      badge: 'MIDDLE DISCOVERY',
      icon: 'compass',
      color: '#8B5CF6',
      overview: 'Pre-adolescence brings rapid cognitive expansion. This is the prime window to expose students to logic, coding basics, robotics, Olympiads (IMO/NSO), debate, and deep hobby mastery before high-stakes board pressure begins.',
      parentConcerns: [
        'Peer pressure and social media exposure',
        'Distraction from academics into mobile gaming',
        'Identifying child\'s genuine innate aptitude',
        'Preparing for competitive foundation early without burnout'
      ],
      subjectsAndActivities: [
        {
          title: 'Junior Olympiad Foundation (Math & Science)',
          description: 'Conceptual mechanics, basic algebra, number theory, and biology systems beyond NCERT.',
          icon: 'zap',
          skillsDeveloped: ['High-Order Thinking (HOTS)', 'Competitive Stamina', 'Analytical Speed']
        },
        {
          title: 'Computational Thinking & Python / Scratch',
          description: 'Algorithm design, small game creation, and logic flow fundamentals.',
          icon: 'code',
          skillsDeveloped: ['Algorithmic Logic', 'Debugging Persistence', 'Tech Literacy']
        },
        {
          title: 'Elocution, Debate & Art of Communication',
          description: 'Model UN participation, school debating, and book review presentations.',
          icon: 'mic',
          skillsDeveloped: ['Public Speaking', 'Persuasion', 'Vocabulary & Poise']
        }
      ],
      personalityDevelopment: [
        {
          trait: 'Self-Regulation & Time Management',
          guideline: 'Help child create their own weekly study calendar with dedicated hobby slots.',
          actionableHabit: 'The Pomodoro Technique (25 min study + 5 min break) for focused sessions.'
        },
        {
          trait: 'Peer Resilience & Self-Identity',
          guideline: 'Maintain open, non-judgmental communication so the child discusses peer challenges at home.',
          actionableHabit: 'Weekly 1-on-1 parent-child walk or coffee talk with no academic scolding.'
        }
      ],
      futureCareerPathways: []
    },
    {
      stageKey: 'stream_selection_15_16',
      ageGroup: 'Age 15 - 16 Years (Class 9 & 10)',
      title: 'Class 9-10 Boards & Stream Decision Matrix',
      tagline: 'Science (PCM/PCB) vs Commerce vs Humanities: Choosing without regret',
      badge: 'CRITICAL TURNING POINT',
      icon: 'git-branch',
      color: '#F59E0B',
      overview: 'The most decisive crossroad for parents and students in India. Board exam excellence combined with scientifically grounded stream selection (PCM, PCB, Commerce, Arts, Vocational) determines future university admissions and entrance feasibility.',
      parentConcerns: [
        'Should my child take Science just because relatives say so?',
        'PCM vs PCB: What if my child is weak in Mathematics or Physics?',
        'Is Commerce or Humanities viable for high-paying corporate careers?',
        'Board examination percentage vs entrance exam foundation balance'
      ],
      subjectsAndActivities: [
        {
          title: 'Class 10 Board Core Mastery',
          description: 'Mathematics, Science, Social Sciences, English, and Hindi syllabus completion by November.',
          icon: 'file-check',
          skillsDeveloped: ['Answer Writing Technique', 'Time Bound Practice', 'Past 10 Years PYQs']
        },
        {
          title: 'Aptitude & Psychometric Stream Mapping',
          description: 'Evaluating spatial reasoning, verbal ability, numerical skill, and deep interest indicators.',
          icon: 'user-check',
          skillsDeveloped: ['Self-Awareness', 'Unbiased Decision Making', 'Career Reality Alignment']
        }
      ],
      personalityDevelopment: [
        {
          trait: 'Handling Academic Exam Stress',
          guideline: 'Normalize that 10th marks do not define human worth. Focus on disciplined execution.',
          actionableHabit: '10 minutes of daily mindfulness breathing before beginning study hours.'
        }
      ],
      futureCareerPathways: [
        {
          pathwayName: 'Science (PCM) - Engineering, AI, Defense & Research',
          suitableFor: 'Strong analytical logic, love for problem-solving, comfort with abstract mathematical equations.',
          roiOutlook: 'High Demand (Zero Unemployment Target)',
          degreesRecommended: ['B.Tech Computer Science & AI', 'Data Science & FinTech', 'Aerospace Engineering', 'NDA / Defense'],
          inDemandSkills: ['System Design', 'AI / ML Algorithms', 'Mathematical Modeling']
        },
        {
          pathwayName: 'Science (PCB) - Medicine, Biotechnology & Healthcare',
          suitableFor: 'Deep curiosity in living systems, high memorization capacity, empathy, patience for long training.',
          roiOutlook: 'Recession-Proof & High Societal Impact',
          degreesRecommended: ['MBBS', 'BDS', 'Biotechnology & Bioinformatics', 'Pharm.D', 'Genomics'],
          inDemandSkills: ['Clinical Diagnostics', 'Genomic Data Analysis', 'Pharmacology']
        },
        {
          pathwayName: 'Commerce (with/without Math) - Finance, Consulting & Tech',
          suitableFor: 'Interest in markets, economy, business strategy, trade, investments, and enterprise operations.',
          roiOutlook: 'Exceptional ROI & Top Corporate Executive Growth',
          degreesRecommended: ['Chartered Accountancy (CA)', 'CFA + B.Com/BBA', 'Economics Honours', 'Corporate Law (5-Yr BA LLB)'],
          inDemandSkills: ['Financial Modeling', 'Data Analytics', 'Corporate Valuation', 'Tax Strategy']
        },
        {
          pathwayName: 'Humanities & Design - Product, Policy, Media & Civil Services',
          suitableFor: 'Creative thinkers, articulate writers, deep observers of human behavior, society, and governance.',
          roiOutlook: 'High Demand in Modern Tech & Creative Economy',
          degreesRecommended: ['UI/UX Product Design (B.Des)', 'Corporate Law (NLU CLAT)', 'Psychology + HR', 'UPSC / Civil Services'],
          inDemandSkills: ['Design Systems', 'Policy Drafting', 'Public Relations', 'Behavioral Science']
        }
      ]
    },
    {
      stageKey: 'entrance_prep_17_18',
      ageGroup: 'Age 17 - 18 Years (Class 11 & 12)',
      title: 'Class 11-12 & Competitive Exam Battleground',
      tagline: 'JEE, NEET, CUET, CA Foundation, CLAT, NDA & 12th Board Dual-Track Mastery',
      badge: 'TOP TIER EXAMS',
      icon: 'target',
      color: '#EF4444',
      overview: 'Two years of intense focus where deep conceptual mastery, mock test discipline, speed-accuracy calibration, and emotional stamina are forged. Proper mentoring prevents burnout and maximizes college merit selection.',
      parentConcerns: [
        'Backlogs accumulating in coaching institutes',
        'Severe drop in test marks and loss of motivation',
        'Board exam pass percentage vs JEE/NEET rank conflict',
        'Backup options if top government seat is missed'
      ],
      subjectsAndActivities: [
        {
          title: 'Daily Practice Problems (DPP) & Micro-Topic Revision',
          description: 'Solving 40-60 curated high-yield questions daily with stopwatch.',
          icon: 'check-square',
          skillsDeveloped: ['Speed Calibration', 'Error Elimination', 'Formulas on Fingertips']
        },
        {
          title: 'CBT Full-Length Mock Series & Error Diary',
          description: 'Simulating NTA CBT exam conditions with detailed negative mark analysis.',
          icon: 'award',
          skillsDeveloped: ['Exam Temperament', 'Option Elimination Strategy', 'Time Partitioning']
        }
      ],
      personalityDevelopment: [
        {
          trait: 'Resilience During Score Fluctuations',
          guideline: 'Treat every mock test as diagnostic X-ray, not a moral judgment.',
          actionableHabit: 'Maintain an Error Notebook and revise all missed questions every Sunday morning.'
        }
      ],
      futureCareerPathways: []
    },
    {
      stageKey: 'degree_college_19_23',
      ageGroup: 'Age 19 - 23 Years (College / Undergrad)',
      title: 'Undergraduate Degree & Zero-Unemployment Architecture',
      tagline: 'Turning university degrees into high-income, recession-proof careers',
      badge: 'CAREER FORTRESS',
      icon: 'graduation-cap',
      color: '#10B981',
      overview: 'Millions graduate each year with degrees but remain unemployable because universities teach outdated curriculums. NextStep builds a parallel skill-stack alongside your degree (portfolio, internships, open-source, certifications) to guarantee employability on day zero.',
      parentConcerns: [
        'My child might graduate and remain unemployed or underpaid',
        'Campus placement packages are dropping in traditional branches',
        'How to stand out among thousands of applicants in the AI era',
        'Higher studies (M.Tech/MBA/Abroad) vs Immediate Corporate Job'
      ],
      subjectsAndActivities: [
        {
          title: 'High-ROI Modern Skill Stacks',
          description: 'Full-stack engineering, AI/LLM integration, financial modeling, UI/UX systems, and cloud infrastructure.',
          icon: 'layers',
          skillsDeveloped: ['Production-Grade Coding', 'System Architecture', 'Modern Cloud Deployment']
        },
        {
          title: 'Live Projects, Open-Source & Portfolio Building',
          description: 'Building real software, contributing to GitHub, publishing research, or freelance client deliveries.',
          icon: 'globe',
          skillsDeveloped: ['Public Proof of Work', 'Teamwork', 'GitHub Portfolio Credibility']
        }
      ],
      personalityDevelopment: [
        {
          trait: 'Professional Polish & Executive Presence',
          guideline: 'Fluency in English business communication, proactive networking on LinkedIn, and email etiquette.',
          actionableHabit: 'Weekly reach out to 3 industry leaders for informational interviews on LinkedIn.'
        }
      ],
      futureCareerPathways: [
        {
          pathwayName: 'Tier-1 Tech & AI Engineering',
          suitableFor: 'Software developers, computer scientists, AI engineers, data platform leads.',
          roiOutlook: 'High Demand (Zero Unemployment Target)',
          degreesRecommended: ['B.Tech / B.E in CS / AI / Data Science', 'BCA + MCA'],
          inDemandSkills: ['Full Stack Dev', 'Prompt & LLM Engineering', 'Distributed Systems', 'DevOps & Docker']
        },
        {
          pathwayName: 'Investment Banking, FinTech & Strategic Consulting',
          suitableFor: 'Students with analytical sharpness, business acumen, and high drive.',
          roiOutlook: 'Top 1% Compensation & Global Mobility',
          degreesRecommended: ['B.Com / BBA + CFA / CA', 'Economics (Hons)', 'MBA Finance'],
          inDemandSkills: ['Financial Modeling', 'M&A Valuation', 'Python for Finance', 'Equity Research']
        }
      ]
    },
    {
      stageKey: 'career_launch',
      ageGroup: 'Final Year & Early Career (21+ Years)',
      title: 'Corporate Career Launch & Professional Leadership',
      tagline: 'Acing technical interviews, behavioral rounds, negotiation & rapid promotion',
      badge: 'LIFELONG SUCCESS',
      icon: 'briefcase',
      color: '#6366F1',
      overview: 'Transform from a college student into a high-impact professional. Focuses on interview mastery (DSA, system design, case studies, HR questions), salary negotiation, and executive communication.',
      parentConcerns: [
        'Clearing off-campus and on-campus interview rounds',
        'Salary package negotiation and offer letter evaluation',
        'Corporate office politics and initial 90 days survival',
        'Work-life balance and long-term career progression'
      ],
      subjectsAndActivities: [
        {
          title: 'Mock Interview Simulator (AI & Human)',
          description: 'Technical problem-solving on whiteboard, behavioral STAR methodology, and executive presence testing.',
          icon: 'video',
          skillsDeveloped: ['Spontaneous Articulation', 'Confidence under Pressure', 'Structured Storytelling']
        },
        {
          title: 'Resume Crafting & ATS Optimization',
          description: 'Quantified bullet points, impact-driven metrics, and recruiter-focused portfolio presentations.',
          icon: 'file-text',
          skillsDeveloped: ['Recruiter Shortlisting', 'Personal Branding', 'LinkedIn Search Rank']
        }
      ],
      personalityDevelopment: [
        {
          trait: 'Leadership & High Agency',
          guideline: 'Take radical ownership of outcomes. Solve problems before your manager even notices them.',
          actionableHabit: 'Deliver every assignment 24 hours ahead of deadline with zero excuses.'
        }
      ],
      futureCareerPathways: []
    }
  ];

  await LifeStage.deleteMany({});
  return await LifeStage.insertMany(defaultStages);
}

// Fallback deterministic advisor logic
function generateExpertAdvice(childName, childAge, currentStage, parentQuery) {
  const name = childName || 'Your child';
  return {
    summary: `Based on scientific child development and modern market requirements for ${childAge || 'this stage'}, here is the personalized blueprint for ${name}. Every recommendation is optimized to nurture innate curiosity while building resilient, zero-unemployment life skills.`,
    immediateNextSteps: [
      `Establish a predictable daily rhythm combining focused 30-minute learning intervals with active outdoor play.`,
      `Eliminate high-stimulation passive screen exposure and replace it with interactive books, physical puzzles, or hands-on projects.`,
      `Conduct a diagnostic aptitude assessment to uncover ${name}'s dominant strengths across numerical, verbal, and spatial domains.`
    ],
    personalityAndHabits: [
      `Emotional Regulation: Validate feelings while holding firm, loving boundaries. Encourage reflective debriefing after setbacks.`,
      `Daily Reading Ritual: Read together for 20 minutes before bedtime; discuss motivations of characters to foster empathy.`,
      `Public Speaking & Articulation: Encourage ${name} to explain what they learned today in their own words at the family dinner table.`
    ],
    academicRoadmap: [
      `Stage Focus: Master fundamental literacy and mathematical intuition before introducing complex exam syllabi.`,
      `Stream Alignment: If approaching Class 9-10, evaluate aptitude objectively between Science, Commerce, and Humanities.`,
      `Career Immunity: Ensure ${name} builds practical, portfolio-backed skills (coding, communication, financial literacy) alongside school marks.`
    ],
    unemploymentImmunityPlan: `In the modern AI economy, degrees alone do not guarantee jobs. To ensure ${name} remains 100% gainfully employed, build a "T-shaped profile": broad human skills (critical thinking, negotiation, emotional intelligence) combined with deep technical capability (coding, data analysis, or specialized domain mastery). Encourage real-world project portfolios, internships by age 19, and lifelong learning habits.`
  };
}

module.exports = router;

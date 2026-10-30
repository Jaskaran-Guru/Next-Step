const mongoose = require('mongoose');
const { connectDB } = require('../config/db');

// Import all models
const User = require('../models/User');
const Batch = require('../models/Batch');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Lecture = require('../models/Lecture');
const Note = require('../models/Note');
const LectureProgress = require('../models/LectureProgress');
const Dpp = require('../models/Dpp');
const DppSubmission = require('../models/DppSubmission');
const Test = require('../models/Test');
const TestSubmission = require('../models/TestSubmission');
const Doubt = require('../models/Doubt');
const Material = require('../models/Material');

const seedDatabase = async () => {
  try {
    console.log('🚀 Connecting to MongoDB for seeding...');
    await connectDB();

    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Batch.deleteMany({}),
      Subject.deleteMany({}),
      Chapter.deleteMany({}),
      Lecture.deleteMany({}),
      Note.deleteMany({}),
      LectureProgress.deleteMany({}),
      Dpp.deleteMany({}),
      DppSubmission.deleteMany({}),
      Test.deleteMany({}),
      TestSubmission.deleteMany({}),
      Doubt.deleteMany({}),
      Material.deleteMany({})
    ]);

    console.log('👤 Creating default student profile...');
    const user = await User.create({
      name: 'Jaskaran Singh',
      email: 'jaskaran@pw.in',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      targetExam: 'JEE Mains & Advanced',
      currentClass: 'Class 12th',
      coins: 850,
      streakDays: 21,
      studyMinutesTotal: 3420,
      testsAttempted: 6,
      dppsCompleted: 24
    });

    console.log('📚 Creating PW Flagship Batches...');
    const batches = await Batch.insertMany([
      {
        title: 'Lakshya JEE 2026 (Class 12th)',
        slug: 'lakshya-jee-2026',
        tagline: 'Target IIT-JEE 2026 with Kota\'s Best Faculty & Live Interactive System',
        badge: 'MOST POPULAR',
        examCategory: 'JEE Mains & Advanced',
        classLevel: 'Class 12th',
        language: 'Hinglish (Hindi + English)',
        price: 4800,
        originalPrice: 11999,
        discountPercentage: 60,
        bannerImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
        accentColor: '#2563eb',
        startDate: '12th April 2026',
        validity: 'Till JEE Advanced 2026',
        enrolledCount: 68400,
        rating: 4.95,
        faculty: [
          {
            name: 'Alakh Pandey Sir',
            subject: 'Physics Legend & Founder',
            experience: '12+ Years',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            bio: 'Revolutionized Indian education; known for visual concept clarity and zero rote-learning'
          },
          {
            name: 'Rajwant Sir',
            subject: 'Senior Physics Expert',
            experience: '11+ Years',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            bio: 'Kota classroom champion, master of Rotational Motion and Electrodynamics'
          },
          {
            name: 'Sachin Sir',
            subject: 'Mathematics Maestro',
            experience: '14+ Years',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            bio: 'IIT BHU Alumnus, short-trick wizard for Calculus and Coordinate Geometry'
          },
          {
            name: 'Pankaj Sir',
            subject: 'Chemistry Guru',
            experience: '13+ Years',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            bio: 'Organic Reaction Mechanism specialist, produced 100+ AIR under 500'
          }
        ],
        features: [
          'Live Interactive Lectures with In-Class Doubt Polls',
          'Daily Practice Problems (DPP) with Video & Text Solutions',
          'Curated All-India Test Series (AITS) on NTA Computer-Based Interface',
          '24x7 PW Saarthi AI Doubt Assistant',
          'Free Access to Khazana (Archived Masterclasses & Alternate Faculty)',
          'Complete NCERT Revision & JEE Advanced Hard-Problem Sheets'
        ]
      },
      {
        title: 'Yakeen NEET 2026 (Dropper / Repeater)',
        slug: 'yakeen-neet-2026',
        tagline: 'India\'s #1 Selection Batch for Medical Aspirants aiming 680+ in NEET',
        badge: 'HIGHEST SELECTION',
        examCategory: 'NEET UG',
        classLevel: 'Dropper / Class 13th',
        language: 'Hinglish (Hindi + English)',
        price: 4500,
        originalPrice: 10500,
        discountPercentage: 57,
        bannerImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
        accentColor: '#10b981',
        startDate: '5th May 2026',
        validity: 'Till NEET UG 2026',
        enrolledCount: 89200,
        rating: 4.97,
        faculty: [
          {
            name: 'Sudhanshu Sir',
            subject: 'Physical Chemistry Lead',
            experience: '10+ Years',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
            bio: 'Simplifies thermodynamics and equilibrium into intuitive patterns'
          },
          {
            name: 'Tarun Sir',
            subject: 'Botany & Plant Physiology',
            experience: '12+ Years',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
            bio: 'Author of 3 best-selling NEET biology handbooks'
          }
        ],
        features: [
          'Special Dropper Accelerated Syllabus Completion',
          'Daily 50 NCERT Drill Questions per subject',
          'Weekly OMR Mode & Online CBT Simulated Tests',
          'Mentorship Sessions & Rank Booster Seminars'
        ]
      },
      {
        title: 'Arjuna JEE 2027 (Class 11th 2-Year Program)',
        slug: 'arjuna-jee-2027',
        tagline: 'Build Rock-Solid Fundamentals from Day 1 for JEE 2027 Top 100 Ranks',
        badge: '2-YEAR COMPREHENSIVE',
        examCategory: 'JEE Mains & Advanced',
        classLevel: 'Class 11th',
        language: 'Hinglish',
        price: 7999,
        originalPrice: 16999,
        discountPercentage: 53,
        bannerImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
        accentColor: '#8b5cf6',
        startDate: '20th April 2026',
        validity: 'June 2027',
        enrolledCount: 54100,
        rating: 4.92,
        faculty: [
          {
            name: 'Saleem Sir',
            subject: 'Mechanics & Modern Physics',
            experience: '11+ Years',
            avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
            bio: 'Deep mathematical foundations and rigorous derivations'
          }
        ],
        features: [
          'Step-by-step transition from Class 10 to Class 11 concepts',
          'Over 600+ Hours of High-Yield Lectures',
          'Personalized Chapter Tests & Weak Area Analytics'
        ]
      },
      {
        title: 'Parakram GATE 2026 (CS & IT)',
        slug: 'parakram-gate-2026',
        tagline: 'Crack PSU & IISc/IIT M.Tech with India\'s Top GATE Educators',
        badge: 'ENGINEERING',
        examCategory: 'GATE CS',
        classLevel: 'B.Tech / Working Professionals',
        language: 'English + Hinglish',
        price: 5999,
        originalPrice: 12999,
        discountPercentage: 54,
        bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
        accentColor: '#f59e0b',
        startDate: '1st June 2026',
        validity: 'Till GATE 2026 Exam',
        enrolledCount: 22400,
        rating: 4.88,
        faculty: [
          {
            name: 'Vishwa Sir',
            subject: 'Algorithms & Data Structures',
            experience: '10+ Years',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            bio: 'Ex-Google SDE, AIR 19 in GATE CS'
          }
        ],
        features: [
          'Full Coverage of GATE Syllabus + Mathematics + Aptitude',
          'Virtual Calculator Practice & Mock Portal',
          'Live Doubt Solving with Top Rankers'
        ]
      }
    ]);

    const primaryBatch = batches[0]; // Lakshya JEE 2026

    // Enroll default user into primary batch
    user.enrolledBatches.push(primaryBatch._id);
    await user.save();

    console.log('🔬 Creating Subjects for Lakshya JEE...');
    const subjects = await Subject.insertMany([
      {
        batchId: primaryBatch._id,
        name: 'Physics',
        code: 'PHY',
        icon: 'zap',
        color: '#3b82f6',
        totalLectures: 48,
        totalDpps: 36,
        orderIndex: 1
      },
      {
        batchId: primaryBatch._id,
        name: 'Chemistry',
        code: 'CHE',
        icon: 'flask-conical',
        color: '#10b981',
        totalLectures: 52,
        totalDpps: 40,
        orderIndex: 2
      },
      {
        batchId: primaryBatch._id,
        name: 'Mathematics',
        code: 'MAT',
        icon: 'calculator',
        color: '#f59e0b',
        totalLectures: 50,
        totalDpps: 38,
        orderIndex: 3
      }
    ]);

    const physicsSubject = subjects[0];
    const chemistrySubject = subjects[1];
    const mathSubject = subjects[2];

    console.log('📖 Creating Chapters for Physics...');
    const chapters = await Chapter.insertMany([
      {
        subjectId: physicsSubject._id,
        batchId: primaryBatch._id,
        title: 'Electrostatics & Electric Fields',
        chapterNumber: 1,
        description: 'Coulomb\'s Law, Electric Dipole, Gauss Law, and Potential Energy applications.',
        lectureCount: 5,
        orderIndex: 1
      },
      {
        subjectId: physicsSubject._id,
        batchId: primaryBatch._id,
        title: 'Current Electricity & Circuits',
        chapterNumber: 2,
        description: 'Drift velocity, Kirchhoff\'s Laws, Potentiometer, and Heating effects.',
        lectureCount: 4,
        orderIndex: 2
      },
      {
        subjectId: chemistrySubject._id,
        batchId: primaryBatch._id,
        title: 'Chemical Bonding & Molecular Structure',
        chapterNumber: 1,
        description: 'VSEPR Theory, Hybridisation, MOT, and Hydrogen Bonding.',
        lectureCount: 4,
        orderIndex: 1
      },
      {
        subjectId: mathSubject._id,
        batchId: primaryBatch._id,
        title: 'Definite Integration & Area Under Curves',
        chapterNumber: 1,
        description: 'King\'s Property, Queen\'s Rule, Walli\'s Formula, and Bounded Area calculation.',
        lectureCount: 4,
        orderIndex: 1
      }
    ]);

    const electrostaticsChapter = chapters[0];

    console.log('🎥 Creating Video Lectures...');
    // Reliable high-bandwidth open education video streams that play natively across all browsers
    const videoStreamUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    const videoStreamUrl2 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
    const videoStreamUrl3 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

    const lectures = await Lecture.insertMany([
      {
        chapterId: electrostaticsChapter._id,
        subjectId: physicsSubject._id,
        batchId: primaryBatch._id,
        title: 'Lecture 01 : Coulomb\'s Law & Principle of Superposition',
        lectureNumber: 1,
        facultyName: 'Alakh Pandey Sir',
        durationMinutes: 84,
        videoUrl: videoStreamUrl,
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
        description: 'Fundamental electrostatics, quantization of charge, vector form of Coulomb\'s law and symmetrical charge equilibrium problems.',
        hasDpp: true,
        hasNotes: true,
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        viewsCount: 45200,
        date: 'Recorded Live',
        orderIndex: 1
      },
      {
        chapterId: electrostaticsChapter._id,
        subjectId: physicsSubject._id,
        batchId: primaryBatch._id,
        title: 'Lecture 02 : Electric Field Intensity & Dipole Moment',
        lectureNumber: 2,
        facultyName: 'Alakh Pandey Sir',
        durationMinutes: 92,
        videoUrl: videoStreamUrl2,
        thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&auto=format&fit=crop&q=80',
        description: 'Field due to ring, disc, infinite wire and torque on electric dipole in uniform & non-uniform field.',
        hasDpp: true,
        hasNotes: true,
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        viewsCount: 38900,
        date: 'Recorded Live',
        orderIndex: 2
      },
      {
        chapterId: electrostaticsChapter._id,
        subjectId: physicsSubject._id,
        batchId: primaryBatch._id,
        title: 'Lecture 03 : Gauss\'s Law & Flux Integration Shortcuts',
        lectureNumber: 3,
        facultyName: 'Rajwant Sir',
        durationMinutes: 105,
        videoUrl: videoStreamUrl3,
        thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
        description: 'Solid angle method, hemispherical flux, cube corner charges, and conducting sphere boundary conditions.',
        hasDpp: true,
        hasNotes: true,
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        viewsCount: 41200,
        date: 'Today',
        orderIndex: 3
      }
    ]);

    const activeLecture = lectures[0];

    console.log('📝 Creating Timestamped User Notes...');
    await Note.insertMany([
      {
        userId: user._id,
        lectureId: activeLecture._id,
        timestampSeconds: 145,
        timestampFormatted: '02:25',
        noteText: 'Important: Charge quantization formula Q = ±ne applies in all classical electrostatics problems.'
      },
      {
        userId: user._id,
        lectureId: activeLecture._id,
        timestampSeconds: 520,
        timestampFormatted: '08:40',
        noteText: 'In vector form: F12 = (1 / 4πε₀) * (q1 * q2 / |r12|³) * r12. Watch sign of charges!'
      },
      {
        userId: user._id,
        lectureId: activeLecture._id,
        timestampSeconds: 1180,
        timestampFormatted: '19:40',
        noteText: 'Shortcut for neutral point: x = d / (√(q2/q1) + 1) for like charges.'
      }
    ]);

    console.log('⏱️ Recording User Watch Progress in MongoDB...');
    await LectureProgress.create({
      userId: user._id,
      lectureId: activeLecture._id,
      batchId: primaryBatch._id,
      progressSeconds: 1250,
      totalSeconds: 5040,
      percentage: 25,
      isCompleted: false,
      lastWatchedAt: new Date()
    });

    console.log('🎯 Creating Daily Practice Problems (DPP)...');
    const dpp = await Dpp.create({
      lectureId: activeLecture._id,
      batchId: primaryBatch._id,
      subjectName: 'Physics',
      title: 'DPP-01 : Coulomb\'s Law, Charge Distribution & Equilibrium',
      totalQuestions: 5,
      durationMinutes: 20,
      marksPerQuestion: 4,
      negativeMarks: 1,
      questions: [
        {
          questionId: 1,
          text: 'Two point charges +3 µC and +8 µC repel each other with a force of 40 N. If a charge of -5 µC is added to each of them, then the force between them will become:',
          options: [
            '-10 N (attractive)',
            '+20 N (repulsive)',
            '-20 N (attractive)',
            '+10 N (repulsive)'
          ],
          correctOption: 0,
          explanation: 'Initial charges: q1 = 3, q2 = 8 -> product = 24. New charges: q1\' = 3 - 5 = -2 µC, q2\' = 8 - 5 = +3 µC -> product = -6. Since distance is constant, F\' / F = (-6) / 24 = -1/4. Thus F\' = 40 * (-1/4) = -10 N (attractive).',
          difficulty: 'Easy'
        },
        {
          questionId: 2,
          text: 'Three identical positive charges Q are placed at the vertices of an equilateral triangle of side a. The magnitude of electric force experienced by any one charge is:',
          options: [
            '(1 / 4πε₀) * (Q² / a²)',
            '√3 * (1 / 4πε₀) * (Q² / a²)',
            '2 * (1 / 4πε₀) * (Q² / a²)',
            '(√3 / 2) * (1 / 4πε₀) * (Q² / a²)'
          ],
          correctOption: 1,
          explanation: 'Each pair exerts a force F0 = k*Q²/a². The angle between the two forces is 60°. Resultant F_net = √(F0² + F0² + 2*F0*F0*cos(60°)) = √(3*F0²) = √3 * F0.',
          difficulty: 'Medium'
        },
        {
          questionId: 3,
          text: 'A point charge +q is placed at the center of a cube of side L. The electric flux through one of the six faces of the cube is:',
          options: [
            'q / ε₀',
            'q / (6ε₀)',
            'q / (24ε₀)',
            '6q / ε₀'
          ],
          correctOption: 1,
          explanation: 'By Gauss Law, total flux through the enclosed cube is q / ε₀. By symmetry, the flux divides equally across all 6 faces, so flux through one face is q / (6ε₀).',
          difficulty: 'Easy'
        },
        {
          questionId: 4,
          text: 'Two identical conducting spheres with charges +4Q and -2Q are brought into contact and then separated to their original distance. The ratio of final to initial force magnitude is:',
          options: [
            '1 : 8',
            '1 : 4',
            '1 : 2',
            '2 : 1'
          ],
          correctOption: 0,
          explanation: 'Initial product = |(+4Q)*(-2Q)| = 8Q². When touched, charges redistribute equally: q_each = (+4Q - 2Q) / 2 = +Q. Final product = Q * Q = Q². Ratio = 1 : 8.',
          difficulty: 'Medium'
        },
        {
          questionId: 5,
          text: 'An electric dipole of moment p is placed in a uniform electric field E at an angle θ = 30°. The torque acting on the dipole is:',
          options: [
            'pE',
            '0.5 pE',
            '0.866 pE',
            'Zero'
          ],
          correctOption: 1,
          explanation: 'Torque τ = p × E = p * E * sin(θ). For θ = 30°, sin(30°) = 0.5, so τ = 0.5 * pE.',
          difficulty: 'Easy'
        }
      ]
    });

    console.log('🏆 Creating Full-Length Mock Test for All-India Test Series (CBT)...');
    const mockTest = await Test.create({
      title: 'PW All-India Open Mock Test 01 (JEE Mains Simulator)',
      slug: 'pw-aits-jee-main-mock-01',
      examType: 'JEE Mains & Advanced',
      batchId: primaryBatch._id,
      durationMinutes: 180,
      totalQuestions: 6,
      totalMarks: 24,
      isLive: true,
      totalAttempts: 31200,
      instructions: [
        'Total duration of examination is 180 minutes.',
        'The clock will be set at the server. The countdown timer at the top right displays remaining time.',
        'Each correct question awards +4 Marks; each wrong question deducts -1 Mark.',
        'Green represents Answered, Red is Not Answered, Purple is Marked for Review, Grey is Not Visited.'
      ],
      questions: [
        {
          questionId: 1,
          subject: 'Physics',
          section: 'Section A',
          text: 'A particle of mass m and charge q is projected with velocity v into a region of uniform magnetic field B perpendicular to v. The radius of the circular path is:',
          options: [
            'mv / (qB)',
            'qB / (mv)',
            'mB / (qv)',
            'q / (mBv)'
          ],
          correctOption: 0,
          explanation: 'Centripetal force is provided by magnetic Lorentz force: mv² / r = qvB => r = mv / (qB).',
          marksPositive: 4,
          marksNegative: 1
        },
        {
          questionId: 2,
          subject: 'Physics',
          section: 'Section A',
          text: 'In an L-C-R series AC circuit, at resonance condition, the phase difference between applied voltage and resulting current is:',
          options: [
            'π / 2',
            'π',
            '0 (Zero)',
            'π / 4'
          ],
          correctOption: 2,
          explanation: 'At resonance, inductive reactance XL equals capacitive reactance XC, so impedance Z = R (purely resistive). Therefore, voltage and current are in phase (φ = 0).',
          marksPositive: 4,
          marksNegative: 1
        },
        {
          questionId: 3,
          subject: 'Chemistry',
          section: 'Section A',
          text: 'Which of the following molecules has a permanent non-zero dipole moment despite having polar bonds?',
          options: [
            'CO₂',
            'BF₃',
            'NH₃',
            'CCl₄'
          ],
          correctOption: 2,
          explanation: 'NH₃ has trigonal pyramidal geometry with a lone pair on nitrogen, causing net vector sum of dipole moments to be non-zero (µ = 1.47 D). The others are symmetrical with cancelling bond dipoles (µ = 0).',
          marksPositive: 4,
          marksNegative: 1
        },
        {
          questionId: 4,
          subject: 'Chemistry',
          section: 'Section A',
          text: 'For a first-order chemical reaction, if the rate constant k = 0.0693 min⁻¹, the half-life t_1/2 is:',
          options: [
            '10 minutes',
            '5 minutes',
            '20 minutes',
            '6.93 minutes'
          ],
          correctOption: 0,
          explanation: 'For first order: t_1/2 = ln(2) / k = 0.693 / 0.0693 = 10 minutes.',
          marksPositive: 4,
          marksNegative: 1
        },
        {
          questionId: 5,
          subject: 'Mathematics',
          section: 'Section A',
          text: 'The value of the definite integral ∫ from -π to +π of (x³ + x·cos(x) + sin⁵(x) + 1) dx is equal to:',
          options: [
            '0',
            'π',
            '2π',
            '4π'
          ],
          correctOption: 2,
          explanation: 'The functions x³, x·cos(x), and sin⁵(x) are all odd functions, so their integrals from -π to +π vanish to 0. Only the constant 1 remains: ∫[-π, π] 1 dx = π - (-π) = 2π.',
          marksPositive: 4,
          marksNegative: 1
        },
        {
          questionId: 6,
          subject: 'Mathematics',
          section: 'Section A',
          text: 'If A and B are two independent events such that P(A) = 0.4 and P(B) = 0.5, then P(A ∪ B) is equal to:',
          options: [
            '0.9',
            '0.7',
            '0.2',
            '0.6'
          ],
          correctOption: 1,
          explanation: 'For independent events, P(A ∩ B) = P(A)*P(B) = 0.4 * 0.5 = 0.20. Then P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0.4 + 0.5 - 0.20 = 0.70.',
          marksPositive: 4,
          marksNegative: 1
        }
      ]
    });

    console.log('🤖 Creating Seeded Doubts in Saarthi AI Doubt Assistant...');
    await Doubt.create({
      userId: user._id,
      subject: 'Physics',
      questionText: 'Sir, how do we find the electric field on the equatorial line of an electric dipole using vector addition?',
      solutionText: 'The electric field on the equatorial line of a dipole is directed antiparallel to the dipole moment p vector, with magnitude E = (1 / 4πε₀) * (p / (r² + a²)^(3/2)). For short dipoles where r >> a, this simplifies to E = p / (4πε₀ * r³).',
      stepBreakdown: [
        {
          stepNumber: 1,
          heading: 'Resolution of Fields',
          content: 'The fields due to +q and -q have equal magnitudes E+ = E- = kq / (r² + a²). Their vertical components perpendicular to the dipole axis cancel each other out.'
        },
        {
          stepNumber: 2,
          heading: 'Horizontal Superposition',
          content: 'Their horizontal components parallel to the dipole axis add up: E_net = 2 * E+ * cos(θ).'
        },
        {
          stepNumber: 3,
          heading: 'Direction Vector',
          content: 'Since cos(θ) = a / √(r² + a²), we get E_net = 2 * (kq / (r² + a²)) * (a / √(r² + a²)) = k(2aq) / (r² + a²)^(3/2) = kp / (r² + a²)^(3/2) pointing antiparallel to p.'
        }
      ],
      conceptFormula: 'E_equatorial = p / (4πε₀ * r³) [for short dipole r >> a]',
      status: 'resolved',
      helpfulVotes: 38
    });

    console.log('📁 Creating Khazana Study Materials & Formula Sheets...');
    await Material.insertMany([
      {
        title: 'Complete Electrostatics & Gauss Law Master Formula Sheet',
        subjectName: 'Physics',
        category: 'Formula Sheet',
        batchId: primaryBatch._id,
        chapterName: 'Electrostatics',
        pagesCount: 6,
        fileSizeMb: '2.8 MB',
        downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        downloadsCount: 38400
      },
      {
        title: 'Chemical Bonding 1-Page Mind Map & Hybridisation Chart',
        subjectName: 'Chemistry',
        category: 'Mind Map',
        batchId: primaryBatch._id,
        chapterName: 'Chemical Bonding',
        pagesCount: 2,
        fileSizeMb: '1.4 MB',
        downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        downloadsCount: 52100
      },
      {
        title: 'Calculus Super Tricks & Definite Integration PYQs (2018-2025)',
        subjectName: 'Mathematics',
        category: 'PYQ Booklet',
        batchId: primaryBatch._id,
        chapterName: 'Definite Integration',
        pagesCount: 48,
        fileSizeMb: '8.6 MB',
        downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        downloadsCount: 29700
      },
      {
        title: 'Alakh Sir Hand-Written Class Lecture Notes : Coulomb Law to Dipole',
        subjectName: 'Physics',
        category: 'Class Notes PDF',
        batchId: primaryBatch._id,
        chapterName: 'Electrostatics',
        pagesCount: 24,
        fileSizeMb: '12.4 MB',
        downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        downloadsCount: 88200
      }
    ]);

    console.log('✨ Database Seeding Completed Successfully! All collections populated in MongoDB Atlas.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Seeding Failed:', error);
    process.exit(1);
  }
};

seedDatabase();

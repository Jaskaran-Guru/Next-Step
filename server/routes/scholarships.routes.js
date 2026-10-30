const express = require('express');
const router = express.Router();

const SCHOLARSHIPS_DATA = [
  {
    id: 'inspire-she',
    title: 'INSPIRE Scholarship for Higher Education (SHE)',
    provider: 'Department of Science and Technology (DST), Govt. of India',
    category: 'Higher Education & Research',
    amount: '₹80,000 per annum (₹60,000 cash + ₹20,000 mentorship project grant)',
    eligibility: 'Top 1% in Class 12 Board examinations pursuing B.Sc / BS-MS / Integrated M.Sc in Natural & Basic Sciences',
    targetStages: ['entrance_prep_17_18', 'degree_college_19_23'],
    applicationWindow: 'November – January (Annual)',
    officialUrl: 'https://online-inspire.gov.in',
    highlights: [
      'Covers Physics, Chemistry, Mathematics, Biology, Statistics, and Geology',
      'Renewable every year based on academic performance (>60% or equivalent CGPA)'
    ]
  },
  {
    id: 'pm-scholarship',
    title: 'Prime Minister’s Scholarship Scheme (PMSS)',
    provider: 'Welfare and Rehabilitation Board (WARB), Ministry of Home Affairs',
    category: 'Engineering & Medical',
    amount: '₹3,000/month for girls (₹36,000/yr) | ₹2,500/month for boys (₹30,000/yr)',
    eligibility: 'Wards of Ex-Servicemen and Central Armed Police Forces (CAPF) pursuing professional degree programs (B.Tech, MBBS, BCA, B.Pharm)',
    targetStages: ['entrance_prep_17_18', 'degree_college_19_23'],
    applicationWindow: 'August – November (National Scholarship Portal)',
    officialUrl: 'https://scholarships.gov.in',
    highlights: [
      '5,500 fresh scholarships awarded every academic year',
      'Applicable across all AICTE / UGC approved professional degree courses'
    ]
  },
  {
    id: 'reliance-foundation-ug',
    title: 'Reliance Foundation Undergraduate Scholarship',
    provider: 'Reliance Foundation',
    category: 'Merit-cum-Means (All Degrees)',
    amount: 'Up to ₹2,00,000 across the degree duration',
    eligibility: 'First-year regular undergraduate students across any stream with minimum 60% in Class 12 and annual household income < ₹15 Lakhs',
    targetStages: ['degree_college_19_23'],
    applicationWindow: 'August – October',
    officialUrl: 'https://www.scholarships.reliancefoundation.org',
    highlights: [
      '5,000 merit-cum-means scholars selected annually across India',
      'Provides mentorship, alumni network, and leadership development workshops'
    ]
  },
  {
    id: 'cbse-single-girl',
    title: 'CBSE Single Girl Child Merit Scholarship',
    provider: 'Central Board of Secondary Education (CBSE)',
    category: 'School Education (Class 11 & 12)',
    amount: '₹500 per month (₹6,000 per annum for 2 years)',
    eligibility: 'Single girl child of parents who passed Class 10 from CBSE with 60%+ marks and is studying in Class 11 in a CBSE school',
    targetStages: ['stream_selection_15_16', 'entrance_prep_17_18'],
    applicationWindow: 'September – November',
    officialUrl: 'https://cbse.gov.in',
    highlights: [
      'Recognizes and promotes parental investment in girls education',
      'Renewable for Class 12 on securing 50%+ in Class 11'
    ]
  },
  {
    id: 'ntse-olympiad',
    title: 'National Talent Search & Science Olympiad Grants',
    provider: 'NCERT & Homi Bhabha Centre for Science Education (HBCSE)',
    category: 'Talent & Olympiads',
    amount: '₹1,250/month (Class 11-12) | ₹2,000/month (UG & PG) | PhD fellowship',
    eligibility: 'Class 10 students qualifying National Talent Search Scheme and International Olympiad medalists',
    targetStages: ['middle_11_14', 'stream_selection_15_16'],
    applicationWindow: 'Annual state-level notifications',
    officialUrl: 'https://ncert.nic.in',
    highlights: [
      'Prestigious national academic recognition',
      'Direct interview preference at IISc Bangalore and premier research institutes'
    ]
  },
  {
    id: 'post-matric-nsp',
    title: 'Post-Matric Scholarship Scheme for Minorities & Reserved Categories',
    provider: 'Ministry of Minority Affairs / Ministry of Social Justice',
    category: 'Tuition Waiver & Maintenance',
    amount: '100% Course Fee reimbursement + up to ₹1,200/month maintenance allowance',
    eligibility: 'Students pursuing Class 11 through PhD with family income < ₹2.5 Lakhs per annum',
    targetStages: ['entrance_prep_17_18', 'degree_college_19_23', 'career_launch'],
    applicationWindow: 'July – December (NSP Portal)',
    officialUrl: 'https://scholarships.gov.in',
    highlights: [
      'Direct Benefit Transfer (DBT) into verified student Aadhaar-linked bank accounts',
      'Covers tuition fees, exam fees, and hostel maintenance allowances'
    ]
  }
];

// Get all scholarships with optional category filter
router.get('/', (req, res) => {
  const { category, stage } = req.query;
  let filtered = SCHOLARSHIPS_DATA;

  if (category && category !== 'All') {
    filtered = filtered.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (stage) {
    filtered = filtered.filter(s => s.targetStages.includes(stage));
  }

  return res.json({ success: true, count: filtered.length, data: filtered });
});

module.exports = router;


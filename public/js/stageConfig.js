/**
 * NEXTSTEP APP STAGE CONFIGURATION ENGINE
 * ============================================
 * When a user sets their life stage (age group), the ENTIRE app:
 *   - Changes brand identity, subtitle, hero messaging
 *   - Shows/hides sidebar navigation items
 *   - Adapts AI Saarthi persona
 *   - Applies stage-specific CSS accent color
 *   - Updates profile badge
 */

const APP_STAGE_CONFIGS = {

  playway_1_4: {
    stageKey: 'playway_1_4',
    label: '👶 Toddler & Playway (Age 1–4)',
    brandSubtitle: 'Playway Learning OS',
    accentColor: '#06B6D4',
    accentRgb: '6, 182, 212',
    heroTitle: 'Every Child is Born Curious.',
    heroDesc: 'Sensory play, speech development & motor activities curated by child development experts. Zero screen burnout, pure joyful discovery.',
    heroBadge: '🌱 EARLY CHILDHOOD DEVELOPMENT',
    heroCTA: { label: 'Ask Parent Advisor →', view: 'stages' },
    saarthiPersona: 'Playway Parent Advisor',
    saarthiPlaceholder: 'Ask anything about your toddler — speech delay, screen time, preschool selection, sleep routines, separation anxiety...',
    saarthiSubjects: ['Child Development', 'Parenting Tips', 'Playway Activities', 'Nutrition'],
    navSections: [
      { title: 'PLAYWAY LEARNING', items: ['batches', 'khazana'] },
      { title: 'PARENT AI & FAMILY', items: ['parent', 'doubts', 'stages'] },
      { title: 'INSIGHTS', items: ['analytics'] },
    ],
    navItems: [
      { view: 'batches',   label: 'Playway Activities',   icon: 'palette',     badge: null },
      { view: 'parent',    label: 'Parent Portal & Kids', icon: 'users',       badge: 'PORTAL' },
      { view: 'khazana',   label: 'Parent Resources',     icon: 'archive',     badge: null },
      { view: 'doubts',    label: 'Parent AI Advisor',    icon: 'sparkles',    badge: 'AI' },
      { view: 'stages',    label: 'Growth Roadmap',       icon: 'compass',     badge: '1-4 Yrs' },
      { view: 'analytics', label: 'Child Progress',       icon: 'bar-chart-2', badge: null },
    ],
    profileFields: { showTargetExam: false, showCurrentClass: false, showChildAge: true, label: 'Parent of a Toddler (Age 1–4)' }
  },

  primary_5_10: {
    stageKey: 'primary_5_10',
    label: '🎒 Primary School (Age 5–10 / Class 1-5)',
    brandSubtitle: 'Primary Foundation OS',
    accentColor: '#2563EB',
    accentRgb: '37, 99, 235',
    heroTitle: 'Build the Foundation. Own the Future.',
    heroDesc: 'Mental math, phonics, creative writing, hands-on science & sports. Developing a deep love for learning before exam pressure begins.',
    heroBadge: '📚 PRIMARY SCHOOL FOUNDATION',
    heroCTA: { label: 'Explore Activities →', view: 'batches' },
    saarthiPersona: 'Primary School Guide',
    saarthiPlaceholder: "Ask about primary school subjects, math activities, reading habits, school selection, or your child's learning gaps...",
    saarthiSubjects: ['Mathematics', 'English', 'Science', 'Parenting Tips'],
    navSections: [
      { title: 'ACADEMICS', items: ['batches', 'my-study', 'khazana'] },
      { title: 'FAMILY & AI', items: ['parent', 'doubts', 'stages'] },
      { title: 'INSIGHTS', items: ['analytics'] },
    ],
    navItems: [
      { view: 'batches',   label: 'Learning Courses',     icon: 'layers',      badge: null },
      { view: 'my-study',  label: 'My Study Room',        icon: 'book-open',   badge: null },
      { view: 'parent',    label: 'Parent Portal & Kids', icon: 'users',       badge: 'PORTAL' },
      { view: 'khazana',   label: 'Study Materials',      icon: 'archive',     badge: null },
      { view: 'doubts',    label: 'AI Learning Buddy',    icon: 'sparkles',    badge: 'AI' },
      { view: 'stages',    label: 'Growth Roadmap',       icon: 'compass',     badge: '5-10' },
      { view: 'analytics', label: 'Progress Tracker',     icon: 'bar-chart-2', badge: null },
    ],
    profileFields: { showTargetExam: false, showCurrentClass: true, showChildAge: true, label: 'Primary School Student / Parent' }
  },

  middle_11_14: {
    stageKey: 'middle_11_14',
    label: '🧭 Middle School (Age 11–14 / Class 6-8)',
    brandSubtitle: 'Discovery & Curiosity OS',
    accentColor: '#8B5CF6',
    accentRgb: '139, 92, 246',
    heroTitle: "Discover What You're Made Of.",
    heroDesc: 'Olympiad preparation, Python coding, public speaking & robotics. This is where champions are built — before the pressure of boards.',
    heroBadge: '🧭 MIDDLE SCHOOL IGNITION',
    heroCTA: { label: 'Explore Courses →', view: 'batches' },
    saarthiPersona: 'Middle School Mentor',
    saarthiPlaceholder: 'Ask about Olympiad prep, coding basics, managing peer pressure, finding your strengths, or choosing activities...',
    saarthiSubjects: ['Mathematics', 'Science', 'Coding', 'English'],
    navSections: [
      { title: 'ACADEMICS', items: ['batches', 'my-study', 'dpp', 'khazana'] },
      { title: 'AI & CAREER', items: ['doubts', 'stages'] },
      { title: 'INSIGHTS', items: ['analytics'] },
    ],
    navItems: [
      { view: 'batches',   label: 'Explore Courses',      icon: 'layers',      badge: null },
      { view: 'my-study',  label: 'My Study Room',        icon: 'book-open',   badge: null },
      { view: 'dpp',       label: 'Practice Problems',    icon: 'check-square', badge: null },
      { view: 'khazana',   label: 'Resources & Notes',    icon: 'archive',     badge: null },
      { view: 'doubts',    label: 'AI Saarthi Tutor',     icon: 'sparkles',    badge: 'AI' },
      { view: 'stages',    label: 'Future Roadmap',       icon: 'compass',     badge: '11-14' },
      { view: 'analytics', label: 'Progress Dashboard',   icon: 'bar-chart-2', badge: null },
    ],
    profileFields: { showTargetExam: false, showCurrentClass: true, showChildAge: false, label: 'Middle School Student' }
  },

  stream_selection_15_16: {
    stageKey: 'stream_selection_15_16',
    label: '⚡ Class 9-10 (Age 15–16) — Stream Decision',
    brandSubtitle: 'Board Prep & Stream OS',
    accentColor: '#F59E0B',
    accentRgb: '245, 158, 11',
    heroTitle: 'The Crossroad That Defines Everything.',
    heroDesc: "Board examination mastery + scientifically choosing your stream (PCM, PCB, Commerce, Arts). Don't let peer pressure decide your future.",
    heroBadge: '⚡ CLASS 9-10 BOARD + STREAM DECISION',
    heroCTA: { label: 'Choose Stream Wisely →', view: 'stages' },
    saarthiPersona: 'Board & Stream Advisor',
    saarthiPlaceholder: 'Ask about Class 9-10 board prep, PCM vs PCB vs Commerce decision, stream aptitude, or board study strategy...',
    saarthiSubjects: ['Mathematics', 'Science', 'Social Science', 'English'],
    navSections: [
      { title: 'BOARD PREP', items: ['batches', 'my-study', 'dpp', 'tests', 'khazana'] },
      { title: 'AI & FUTURE', items: ['doubts', 'stages', 'careers'] },
      { title: 'INSIGHTS', items: ['analytics'] },
    ],
    navItems: [
      { view: 'batches',   label: 'Board Prep Batches',   icon: 'layers',      badge: null },
      { view: 'my-study',  label: 'My Study Room',        icon: 'book-open',   badge: null },
      { view: 'dpp',       label: 'Daily DPPs',           icon: 'check-square', badge: null },
      { view: 'tests',     label: 'Mock Test Series',     icon: 'award',       badge: 'MOCK' },
      { view: 'khazana',   label: 'PYQs & Notes',         icon: 'archive',     badge: null },
      { view: 'doubts',    label: 'AI Saarthi Tutor',     icon: 'sparkles',    badge: 'AI' },
      { view: 'stages',    label: 'Stream Navigator',     icon: 'git-branch',  badge: 'KEY' },
      { view: 'careers',   label: 'Careers & Degrees',    icon: 'compass',     badge: 'EXPLORE' },
      { view: 'analytics', label: 'Board Analytics',      icon: 'bar-chart-2', badge: null },
    ],
    profileFields: { showTargetExam: false, showCurrentClass: true, showChildAge: false, label: 'Class 9-10 Board Aspirant' }
  },

  entrance_prep_17_18: {
    stageKey: 'entrance_prep_17_18',
    label: '🎯 Class 11-12 (Age 17–18) — JEE / NEET / CUET',
    brandSubtitle: 'Physics Wallah OS',
    accentColor: '#2563EB',
    accentRgb: '37, 99, 235',
    heroTitle: 'Think. Learn. Build.',
    heroDesc: 'One Search. Every Learning Need. Zero Fluff. Live batches, Kota top faculty, NTA simulated CBT tests, and 24x7 AI Saarthi doubt tutoring.',
    heroBadge: '🧠 AI LEARNING SPACE',
    heroCTA: { label: 'Launch AI Tutor →', view: 'doubts' },
    saarthiPersona: 'PW Saarthi AI Tutor',
    saarthiPlaceholder: "Type your doubt (e.g., \"How to find neutral point in Coulomb's law between +4q and +q separated by d?\")...",
    saarthiSubjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    navSections: [
      { title: 'ACADEMICS', items: ['batches', 'my-study', 'classroom', 'dpp', 'tests'] },
      { title: 'AI & INTELLIGENCE', items: ['doubts', 'khazana'] },
      { title: 'CAREER & OPPORTUNITIES', items: ['stages', 'careers', 'scholarships', 'lifeskills', 'analytics'] },
    ],
    navItems: [
      { view: 'batches',      label: 'Explore Batches',      icon: 'layers',      badge: null },
      { view: 'my-study',     label: 'My Study Room',        icon: 'book-open',   badge: null },
      { view: 'classroom',    label: 'Live Classroom',       icon: 'video',       badge: 'LIVE' },
      { view: 'dpp',          label: 'Daily DPPs',           icon: 'check-square', badge: null },
      { view: 'tests',        label: 'AITS Test Series',     icon: 'award',       badge: 'CBT' },
      { view: 'doubts',       label: 'AI Saarthi Tutor',     icon: 'sparkles',    badge: '24x7' },
      { view: 'stages',       label: 'Lifecycle Navigator',  icon: 'map',         badge: '0-25' },
      { view: 'careers',      label: 'Degree & Career Tree', icon: 'compass',     badge: 'COLLEGE' },
      { view: 'scholarships', label: 'Scholarships Finder',  icon: 'award',       badge: 'AID' },
      { view: 'lifeskills',   label: 'Mindset & EQ Skills',  icon: 'zap',         badge: 'GROWTH' },
      { view: 'analytics',    label: 'Learning Analytics',   icon: 'bar-chart-2', badge: null },
    ],
    profileFields: { showTargetExam: true, showCurrentClass: true, showChildAge: false, label: 'JEE / NEET / CUET Aspirant' }
  },

  degree_college_19_23: {
    stageKey: 'degree_college_19_23',
    label: '🎓 College / Undergrad (Age 19–23)',
    brandSubtitle: 'Skill Stack & Career OS',
    accentColor: '#10B981',
    accentRgb: '16, 185, 129',
    heroTitle: 'Degree is Just the Ticket. Skills Are the Job.',
    heroDesc: 'Build a full-stack portfolio, master in-demand skills, crack placement interviews, and architect your zero-unemployment career — parallel to your degree.',
    heroBadge: '🎓 COLLEGE + ZERO-UNEMPLOYMENT FORTRESS',
    heroCTA: { label: 'Build Your Career Stack →', view: 'batches' },
    saarthiPersona: 'Career & Placement Advisor',
    saarthiPlaceholder: 'Ask about placement prep, resume, high-ROI skills, GATE vs placements, MBA vs job, startup vs corporate...',
    saarthiSubjects: ['Full Stack Dev', 'Data Science', 'Finance', 'Aptitude'],
    navSections: [
      { title: 'SKILL BUILDING', items: ['batches', 'my-study', 'dpp', 'tests'] },
      { title: 'CAREER & EMPLOYABILITY', items: ['careers', 'stages', 'scholarships', 'lifeskills'] },
      { title: 'AI & RESOURCES', items: ['doubts', 'khazana'] },
      { title: 'INSIGHTS', items: ['analytics'] },
    ],
    navItems: [
      { view: 'batches',      label: 'Skill Courses',        icon: 'layers',      badge: null },
      { view: 'my-study',     label: 'My Learning Room',     icon: 'book-open',   badge: null },
      { view: 'dpp',          label: 'Practice Problems',    icon: 'check-square', badge: null },
      { view: 'tests',        label: 'Placement Mocks',      icon: 'award',       badge: 'CBT' },
      { view: 'careers',      label: 'Degree & Career Tree', icon: 'briefcase',   badge: 'PRO' },
      { view: 'scholarships', label: 'Scholarships & Grants', icon: 'award',      badge: 'AID' },
      { view: 'lifeskills',   label: 'Personality & Comm',   icon: 'zap',         badge: 'GROWTH' },
      { view: 'stages',       label: 'Career Roadmap',       icon: 'compass',     badge: '19-23' },
      { view: 'doubts',       label: 'Career AI Advisor',    icon: 'sparkles',    badge: 'AI' },
      { view: 'khazana',      label: 'Resources & Docs',     icon: 'archive',     badge: null },
      { view: 'analytics',    label: 'Skill Analytics',      icon: 'bar-chart-2', badge: null },
    ],
    profileFields: { showTargetExam: true, showCurrentClass: true, showChildAge: false, label: 'College / Undergrad Student' }
  },

  career_launch: {
    stageKey: 'career_launch',
    label: '💼 Career Launch (21+) — Job Seeker / Professional',
    brandSubtitle: 'Corporate Career OS',
    accentColor: '#6366F1',
    accentRgb: '99, 102, 241',
    heroTitle: 'From Graduate to Game-Changer.',
    heroDesc: 'DSA & system design mastery, salary negotiation, executive communication. Land your dream role and accelerate to leadership.',
    heroBadge: '💼 CORPORATE CAREER LAUNCHPAD',
    heroCTA: { label: 'Start Interview Prep →', view: 'tests' },
    saarthiPersona: 'Career Coach & Interview Advisor',
    saarthiPlaceholder: 'Ask about DSA interviews, system design, HR questions, salary negotiation, career switch, or corporate growth...',
    saarthiSubjects: ['DSA & Algorithms', 'System Design', 'Aptitude', 'HR & Behavioral'],
    navSections: [
      { title: 'INTERVIEW PREP', items: ['batches', 'my-study', 'dpp', 'tests'] },
      { title: 'CAREER & EMPLOYABILITY', items: ['careers', 'stages'] },
      { title: 'AI COACH & RESOURCES', items: ['doubts', 'khazana'] },
      { title: 'INSIGHTS', items: ['analytics'] },
    ],
    navItems: [
      { view: 'batches',   label: 'Interview Prep',       icon: 'layers',      badge: null },
      { view: 'my-study',  label: 'My Learning Room',     icon: 'book-open',   badge: null },
      { view: 'dpp',       label: 'DSA Practice',         icon: 'check-square', badge: null },
      { view: 'tests',     label: 'Mock Interviews',      icon: 'award',       badge: 'MOCK' },
      { view: 'careers',   label: 'Career & Resume Suite', icon: 'briefcase',  badge: 'HIRE' },
      { view: 'doubts',    label: 'Career Coach AI',      icon: 'sparkles',    badge: 'AI' },
      { view: 'khazana',   label: 'Cheatsheets & Docs',   icon: 'archive',     badge: null },
      { view: 'stages',    label: 'Career Blueprint',     icon: 'compass',     badge: '21+' },
      { view: 'analytics', label: 'Performance Stats',    icon: 'bar-chart-2', badge: null },
    ],
    profileFields: { showTargetExam: false, showCurrentClass: false, showChildAge: false, label: 'Professional / Job Seeker' }
  }
};

// ================================================================
// STAGE ENGINE — applies the full stage config to the entire app UI
// ================================================================
const StageEngine = {
  activeStageKey: 'entrance_prep_17_18',
  config: null,

  applyStage(stageKey, opts = {}) {
    const cfg = APP_STAGE_CONFIGS[stageKey];
    if (!cfg) return;
    this.activeStageKey = stageKey;
    this.config = cfg;

    this._applyAccentColor(cfg);
    this._applyBrandIdentity(cfg);
    this._applyHeroBanner(cfg);
    this._applySidebar(cfg);
    this._applySaarthiPersona(cfg);
    this._applyDocumentTitle(cfg);

    if (!opts.silent) showToast(`Experience updated: ${cfg.label}`, 'success');
    AppState.notify('stage_changed', { stageKey, config: cfg });
  },

  _applyAccentColor(cfg) {
    const r = document.documentElement;
    r.style.setProperty('--stage-accent', cfg.accentColor);
    r.style.setProperty('--stage-accent-rgb', cfg.accentRgb);
    r.style.setProperty('--brand-primary', cfg.accentColor);
    r.style.setProperty('--primary-color', cfg.accentColor);
    r.style.setProperty('--shadow-glow', `0 0 30px rgba(${cfg.accentRgb}, 0.4), 0 0 60px rgba(${cfg.accentRgb}, 0.2)`);
  },

  _applyBrandIdentity(cfg) {
    const sub = document.getElementById('brand-subtitle');
    if (sub) sub.textContent = cfg.brandSubtitle;

    const pill = document.getElementById('header-stage-pill');
    if (pill) {
      pill.textContent = cfg.label;
      pill.style.cssText = `background: rgba(${cfg.accentRgb}, 0.12); color: ${cfg.accentColor}; border: 1px solid rgba(${cfg.accentRgb}, 0.3); padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; white-space: nowrap;`;
    }
  },

  _applyHeroBanner(cfg) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('hero-badge-text', cfg.heroBadge);
    set('hero-title-text', cfg.heroTitle);
    set('hero-desc-text', cfg.heroDesc);

    const ctaBtn = document.getElementById('hero-cta-btn');
    if (ctaBtn) {
      ctaBtn.textContent = cfg.heroCTA.label;
      ctaBtn.onclick = () => window.switchView(cfg.heroCTA.view);
    }
    const secondBtn = document.getElementById('hero-secondary-btn');
    if (secondBtn) secondBtn.style.display = 'inline-flex';
  },

  _applySidebar(cfg) {
    const area = document.getElementById('dynamic-nav-area');
    if (!area) return;

    let html = '';
    cfg.navSections.forEach(section => {
      html += `<div class="nav-section-title">${section.title}</div>`;
      section.items.forEach(viewId => {
        const item = cfg.navItems.find(n => n.view === viewId);
        if (!item) return;
        const isActive = AppState.activeView === viewId;
        const badge = this._buildBadgeHtml(item.badge, cfg);
        html += `
          <a class="nav-item${isActive ? ' active' : ''}" data-view="${viewId}" id="nav-${viewId}" href="#">
            <i data-lucide="${item.icon}"></i>
            <span>${item.label}</span>
            ${badge}
          </a>`;
      });
    });

    area.innerHTML = html;
    area.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); window.switchView(el.getAttribute('data-view')); });
    });
    if (window.lucide) window.lucide.createIcons();
  },

  _buildBadgeHtml(badge, cfg) {
    if (!badge) return '';
    if (badge === 'LIVE') return `<span class="nav-badge live">LIVE</span>`;
    if (badge === 'AI' || badge === '24x7') return `<span class="nav-badge ai">${badge}</span>`;
    if (badge === 'CBT' || badge === 'MOCK' || badge === 'Mock')
      return `<span class="nav-badge" style="background:rgba(${cfg.accentRgb},0.2);color:${cfg.accentColor};">${badge}</span>`;
    if (badge === 'KEY')
      return `<span class="nav-badge" style="background:rgba(239,68,68,0.15);color:#ef4444;border-color:rgba(239,68,68,0.3);">KEY</span>`;
    return `<span class="nav-badge" style="background:rgba(${cfg.accentRgb},0.15);color:${cfg.accentColor};border:1px solid rgba(${cfg.accentRgb},0.3);">${badge}</span>`;
  },

  _applySaarthiPersona(cfg) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('saarthi-persona-name', cfg.saarthiPersona);
    set('saarthi-persona-desc', `Adaptive AI for ${cfg.label.split('(')[0].trim()} — instant answers, roadmaps & strategies.`);

    const inp = document.getElementById('doubt-question-input');
    if (inp) inp.placeholder = cfg.saarthiPlaceholder;

    const bar = document.getElementById('doubt-subject-chips');
    if (bar && cfg.saarthiSubjects) {
      bar.innerHTML = cfg.saarthiSubjects.map((s, i) =>
        `<span class="subject-chip${i === 0 ? ' active' : ''}" data-subject="${s}">${s}</span>`
      ).join('');
    }
  },

  _applyDocumentTitle(cfg) {
    document.title = `NextStep | ${cfg.brandSubtitle}`;
  },

  getConfig(key) { return APP_STAGE_CONFIGS[key] || APP_STAGE_CONFIGS['entrance_prep_17_18']; },
  getAllStages() { return Object.values(APP_STAGE_CONFIGS); }
};

window.StageEngine = StageEngine;
window.APP_STAGE_CONFIGS = APP_STAGE_CONFIGS;

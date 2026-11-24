/**
 * INTERACTIVE RESUME BUILDER CONTROLLER (MILESTONE 2)
 * NextStep OS — Professional ATS-Optimized Resume Engine
 */

const ResumeBuilderView = {
  currentStep: 1,
  totalSteps: 5,
  resumeData: {
    personal: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
      summary: ''
    },
    education: [],
    skills: [],
    projects: [],
    certifications: []
  },
  saveTimeout: null,

  init() {
    this.loadDraft();
    this.bindEvents();
    this.renderFormStep();
    this.renderLivePreview();
  },

  bindEvents() {
    // Step navigation buttons
    document.querySelectorAll('.resume-step-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const step = parseInt(e.currentTarget.getAttribute('data-step'), 10);
        if (step) this.goToStep(step);
      });
    });

    // Prev / Next buttons
    document.getElementById('resume-prev-step-btn')?.addEventListener('click', () => {
      if (this.currentStep > 1) this.goToStep(this.currentStep - 1);
    });

    document.getElementById('resume-next-step-btn')?.addEventListener('click', () => {
      if (this.currentStep < this.totalSteps) this.goToStep(this.currentStep + 1);
    });

    // Sample data loader
    document.getElementById('resume-load-sample-btn')?.addEventListener('click', () => {
      this.loadSampleData();
    });

    // Clear form
    document.getElementById('resume-clear-btn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your current resume draft?')) {
        this.clearDraft();
      }
    });

    // Export buttons
    document.getElementById('resume-export-pdf-btn')?.addEventListener('click', () => {
      this.exportPDF();
    });

    document.getElementById('resume-export-html-btn')?.addEventListener('click', () => {
      this.exportHTML();
    });

    document.getElementById('resume-copy-text-btn')?.addEventListener('click', () => {
      this.copyPlainText();
    });

    // ATS Reviewer trigger
    document.getElementById('resume-run-ats-btn')?.addEventListener('click', () => {
      this.runATSAudit();
    });
  },

  loadDraft() {
    try {
      const saved = localStorage.getItem('nextstep_resume_draft');
      if (saved) {
        this.resumeData = JSON.parse(saved);
      } else {
        // Pre-fill user profile info if available
        if (window.AppState?.currentUser) {
          const u = window.AppState.currentUser;
          this.resumeData.personal.name = u.name || '';
          this.resumeData.personal.email = u.email || '';
          this.resumeData.personal.phone = u.phone || '';
          this.resumeData.personal.title = u.targetExam ? `${u.targetExam} Aspirant` : 'Aspiring Software Engineer';
        }
      }
    } catch (err) {
      console.warn('Failed to parse resume draft from localStorage:', err);
    }
  },

  saveDraft() {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem('nextstep_resume_draft', JSON.stringify(this.resumeData));
        const statusEl = document.getElementById('resume-autosave-status');
        if (statusEl) {
          statusEl.textContent = '✓ Draft autosaved';
          statusEl.style.color = 'var(--status-success)';
          setTimeout(() => {
            statusEl.textContent = 'Autosave active';
            statusEl.style.color = 'var(--text-muted)';
          }, 2000);
        }
      } catch (err) {
        console.warn('Failed to autosave resume draft:', err);
      }
    }, 400);
  },

  goToStep(step) {
    this.currentStep = step;
    this.renderFormStep();
    this.renderLivePreview();
  },

  renderFormStep() {
    // Update step indicator
    document.querySelectorAll('.resume-step-btn').forEach(btn => {
      const step = parseInt(btn.getAttribute('data-step'), 10);
      btn.classList.toggle('active', step === this.currentStep);
    });

    const stepLabel = document.getElementById('resume-step-title');
    const container = document.getElementById('resume-form-step-container');
    if (!container) return;

    const titles = [
      'Step 1 of 5: Personal Details & Contact Information',
      'Step 2 of 5: Academic History & Education',
      'Step 3 of 5: Skills & Core Competencies',
      'Step 4 of 5: Projects & Work Experience',
      'Step 5 of 5: Certifications, Awards & Achievements'
    ];
    if (stepLabel) stepLabel.textContent = titles[this.currentStep - 1] || 'Resume Details';

    if (this.currentStep === 1) {
      this.renderStep1Personal(container);
    } else if (this.currentStep === 2) {
      this.renderStep2Education(container);
    } else if (this.currentStep === 3) {
      this.renderStep3Skills(container);
    } else if (this.currentStep === 4) {
      this.renderStep4Projects(container);
    } else if (this.currentStep === 5) {
      this.renderStep5Certifications(container);
    }

    // Toggle prev/next button visibility
    const prevBtn = document.getElementById('resume-prev-step-btn');
    const nextBtn = document.getElementById('resume-next-step-btn');
    if (prevBtn) prevBtn.style.display = this.currentStep === 1 ? 'none' : 'inline-flex';
    if (nextBtn) nextBtn.textContent = this.currentStep === this.totalSteps ? 'Review & Audit →' : 'Next Step →';
  },

  // ==========================================
  // STEP 1: PERSONAL DETAILS
  // ==========================================
  renderStep1Personal(container) {
    const p = this.resumeData.personal;
    container.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
        <div>
          <label style="font-size:0.75rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Full Name *</label>
          <input type="text" id="r-name" value="${this.escapeAttr(p.name)}" placeholder="e.g. Jaskaran Singh" style="width:100%;padding:10px 12px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.88rem;">
        </div>
        <div>
          <label style="font-size:0.75rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Target Professional Title *</label>
          <input type="text" id="r-title" value="${this.escapeAttr(p.title)}" placeholder="e.g. Full-Stack Developer | CS Undergrad" style="width:100%;padding:10px 12px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.88rem;">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:14px;">
        <div>
          <label style="font-size:0.75rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Email Address *</label>
          <input type="email" id="r-email" value="${this.escapeAttr(p.email)}" placeholder="e.g. jaskaran@pw.in" style="width:100%;padding:10px 12px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.88rem;">
        </div>
        <div>
          <label style="font-size:0.75rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Phone Number *</label>
          <input type="text" id="r-phone" value="${this.escapeAttr(p.phone)}" placeholder="e.g. +91 98765 43210" style="width:100%;padding:10px 12px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.88rem;">
        </div>
        <div>
          <label style="font-size:0.75rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Location</label>
          <input type="text" id="r-location" value="${this.escapeAttr(p.location)}" placeholder="e.g. New Delhi, India" style="width:100%;padding:10px 12px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.88rem;">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:14px;">
        <div>
          <label style="font-size:0.75rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">LinkedIn URL</label>
          <input type="url" id="r-linkedin" value="${this.escapeAttr(p.linkedin)}" placeholder="linkedin.com/in/username" style="width:100%;padding:10px 12px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.88rem;">
        </div>
        <div>
          <label style="font-size:0.75rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">GitHub Profile</label>
          <input type="url" id="r-github" value="${this.escapeAttr(p.github)}" placeholder="github.com/username" style="width:100%;padding:10px 12px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.88rem;">
        </div>
        <div>
          <label style="font-size:0.75rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Portfolio / Website</label>
          <input type="url" id="r-portfolio" value="${this.escapeAttr(p.portfolio)}" placeholder="yourportfolio.dev" style="width:100%;padding:10px 12px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.88rem;">
        </div>
      </div>

      <div style="margin-bottom:14px;">
        <label style="font-size:0.75rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Professional Summary (2–3 sentences)</label>
        <textarea id="r-summary" rows="3" placeholder="Motivated undergraduate student with deep passion for building scalable full-stack applications. Proven track record of architecting real-time systems and solving 300+ DSA algorithmic challenges." style="width:100%;padding:10px 12px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.85rem;line-height:1.4;resize:vertical;">${this.escapeHtml(p.summary)}</textarea>
      </div>
    `;

    // Bind real-time input listeners
    ['name', 'title', 'email', 'phone', 'location', 'linkedin', 'github', 'portfolio', 'summary'].forEach(field => {
      const el = document.getElementById(`r-${field}`);
      if (el) {
        el.addEventListener('input', (e) => {
          this.resumeData.personal[field] = e.target.value;
          this.saveDraft();
          this.renderLivePreview();
        });
      }
    });
  },

  // ==========================================
  // STEP 2: EDUCATION
  // ==========================================
  renderStep2Education(container) {
    const listHtml = this.resumeData.education.map((edu, idx) => `
      <div style="background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:14px;margin-bottom:12px;position:relative;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <h4 style="margin:0;font-size:0.92rem;font-weight:800;color:var(--text-primary);">${edu.degree || 'Degree'}</h4>
            <div style="font-size:0.8rem;color:var(--brand-primary);font-weight:600;">${edu.institution || 'University / Institution'}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
              ${edu.startYear || ''} – ${edu.endYear || 'Present'} · Score: <strong>${edu.grade || 'N/A'}</strong>
            </div>
          </div>
          <button class="btn-text-action" onclick="ResumeBuilderView.deleteEducation(${idx})" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:0.8rem;" title="Delete entry">🗑️ Remove</button>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div style="margin-bottom:18px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h4 style="margin:0;font-size:0.85rem;font-weight:800;color:var(--text-primary);text-transform:uppercase;">Added Qualifications (${this.resumeData.education.length})</h4>
        </div>
        ${listHtml || `<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:0.82rem;border:1px dashed var(--border-subtle);border-radius:var(--radius-sm);">No education entries added yet. Use the form below to add your school, college, or diploma.</div>`}
      </div>

      <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px;">
        <h4 style="margin:0 0 12px 0;font-size:0.85rem;font-weight:800;color:var(--brand-primary);">+ Add Education Entry</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <div>
            <label style="font-size:0.72rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Degree / Certificate *</label>
            <input type="text" id="new-edu-degree" placeholder="e.g. B.Tech in Computer Science" style="width:100%;padding:8px 10px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.82rem;">
          </div>
          <div>
            <label style="font-size:0.72rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">College / School *</label>
            <input type="text" id="new-edu-inst" placeholder="e.g. Delhi Technological University (DTU)" style="width:100%;padding:8px 10px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.82rem;">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px;">
          <div>
            <label style="font-size:0.72rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Start Year</label>
            <input type="text" id="new-edu-start" placeholder="e.g. 2021" style="width:100%;padding:8px 10px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.82rem;">
          </div>
          <div>
            <label style="font-size:0.72rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">End / Completion Year</label>
            <input type="text" id="new-edu-end" placeholder="e.g. 2025" style="width:100%;padding:8px 10px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.82rem;">
          </div>
          <div>
            <label style="font-size:0.72rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">CGPA / Percentage</label>
            <input type="text" id="new-edu-grade" placeholder="e.g. 8.9 / 10 CGPA" style="width:100%;padding:8px 10px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.82rem;">
          </div>
        </div>
        <button class="btn btn-outline" onclick="ResumeBuilderView.handleAddEducation()" style="font-size:0.78rem;padding:6px 14px;">Add to Education List</button>
      </div>
    `;
  },

  handleAddEducation() {
    const degree = document.getElementById('new-edu-degree')?.value.trim();
    const institution = document.getElementById('new-edu-inst')?.value.trim();
    const startYear = document.getElementById('new-edu-start')?.value.trim();
    const endYear = document.getElementById('new-edu-end')?.value.trim();
    const grade = document.getElementById('new-edu-grade')?.value.trim();

    if (!degree || !institution) {
      if (typeof showToast === 'function') showToast('Please enter both Degree and Institution', 'error');
      return;
    }

    this.resumeData.education.push({ degree, institution, startYear, endYear, grade });
    this.saveDraft();
    this.renderFormStep();
    this.renderLivePreview();
  },

  deleteEducation(idx) {
    this.resumeData.education.splice(idx, 1);
    this.saveDraft();
    this.renderFormStep();
    this.renderLivePreview();
  },

  // ==========================================
  // STEP 3: SKILLS
  // ==========================================
  renderStep3Skills(container) {
    const skillsHtml = (this.resumeData.skills || []).map((s, idx) => `
      <span style="font-size:0.78rem;background:rgba(104,87,245,0.12);color:var(--brand-primary);padding:4px 10px;border-radius:16px;border:1px solid rgba(104,87,245,0.25);display:inline-flex;align-items:center;gap:6px;">
        <strong>${s.name}</strong> <span style="font-size:0.68rem;color:var(--text-muted);">(${s.category || 'General'})</span>
        <button onclick="ResumeBuilderView.deleteSkill(${idx})" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:0.85rem;padding:0;line-height:1;">&times;</button>
      </span>
    `).join('');

    container.innerHTML = `
      <div style="margin-bottom:18px;">
        <label style="font-size:0.75rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:8px;">Active Technical & Soft Skills (${this.resumeData.skills.length})</label>
        <div style="display:flex;flex-wrap:wrap;gap:8px;min-height:44px;padding:12px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);">
          ${skillsHtml || `<span style="font-size:0.8rem;color:var(--text-muted);">No skills added yet. Pick from the presets below or add custom skills.</span>`}
        </div>
      </div>

      <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px;margin-bottom:16px;">
        <h4 style="margin:0 0 10px 0;font-size:0.82rem;font-weight:800;color:var(--brand-primary);">+ Add Custom Skill</h4>
        <div style="display:flex;gap:10px;">
          <input type="text" id="new-skill-name" placeholder="e.g. React.js, Docker, MongoDB, System Design..." style="flex:1;padding:8px 12px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.85rem;">
          <select id="new-skill-cat" class="ctrl-select" style="padding:8px 12px;font-size:0.82rem;">
            <option value="Languages">Languages</option>
            <option value="Frameworks">Frameworks & Libs</option>
            <option value="Databases">Databases</option>
            <option value="DevOps & Cloud">DevOps & Cloud</option>
            <option value="Core Competencies">Core Competencies</option>
          </select>
          <button class="btn btn-primary" onclick="ResumeBuilderView.handleAddCustomSkill()" style="padding:8px 16px;font-size:0.82rem;">Add</button>
        </div>
      </div>

      <div>
        <label style="font-size:0.72rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:6px;text-transform:uppercase;">Quick In-Demand Presets (Tap to Add):</label>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${['JavaScript (ES6+)', 'TypeScript', 'Python', 'React.js', 'Node.js', 'Express.js', 'Next.js', 'MongoDB', 'PostgreSQL', 'Docker', 'Git & GitHub', 'REST APIs', 'Data Structures & Algorithms', 'System Design'].map(p => `
            <button type="button" class="btn-text-action" onclick="ResumeBuilderView.addPresetSkill('${p}')" style="background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);color:var(--text-secondary);padding:4px 10px;border-radius:14px;font-size:0.75rem;cursor:pointer;">
              + ${p}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  },

  handleAddCustomSkill() {
    const input = document.getElementById('new-skill-name');
    const cat = document.getElementById('new-skill-cat')?.value || 'General';
    const name = input?.value.trim();
    if (!name) return;

    if (!this.resumeData.skills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      this.resumeData.skills.push({ name, category: cat });
      this.saveDraft();
      this.renderFormStep();
      this.renderLivePreview();
    }
  },

  addPresetSkill(name) {
    if (!this.resumeData.skills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      this.resumeData.skills.push({ name, category: 'Technical' });
      this.saveDraft();
      this.renderFormStep();
      this.renderLivePreview();
    }
  },

  deleteSkill(idx) {
    this.resumeData.skills.splice(idx, 1);
    this.saveDraft();
    this.renderFormStep();
    this.renderLivePreview();
  },

  // ==========================================
  // STEP 4: PROJECTS & EXPERIENCE
  // ==========================================
  renderStep4Projects(container) {
    const listHtml = this.resumeData.projects.map((proj, idx) => `
      <div style="background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:14px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <h4 style="margin:0;font-size:0.92rem;font-weight:800;color:var(--text-primary);">${proj.title}</h4>
            <div style="font-size:0.78rem;color:var(--brand-secondary);font-weight:700;margin-top:2px;">${proj.role || 'Sole Developer'} · Stack: ${proj.techStack || 'Full-Stack'}</div>
            ${proj.link ? `<div style="font-size:0.72rem;color:var(--brand-primary);margin-top:2px;">🔗 ${proj.link}</div>` : ''}
            <ul style="padding-left:18px;margin:8px 0 0 0;font-size:0.78rem;color:var(--text-secondary);line-height:1.4;">
              ${(proj.bullets || []).map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
          <button class="btn-text-action" onclick="ResumeBuilderView.deleteProject(${idx})" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:0.8rem;" title="Delete project">🗑️ Remove</button>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div style="margin-bottom:18px;">
        <h4 style="margin:0 0 10px 0;font-size:0.85rem;font-weight:800;color:var(--text-primary);text-transform:uppercase;">Projects & Work Experience (${this.resumeData.projects.length})</h4>
        ${listHtml || `<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:0.82rem;border:1px dashed var(--border-subtle);border-radius:var(--radius-sm);">No projects added yet. Highlight personal, open-source, or academic projects below.</div>`}
      </div>

      <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px;">
        <h4 style="margin:0 0 12px 0;font-size:0.85rem;font-weight:800;color:var(--brand-primary);">+ Add High-Impact Project</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <div>
            <label style="font-size:0.72rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Project Title *</label>
            <input type="text" id="new-proj-title" placeholder="e.g. NextStep OS Learning Platform" style="width:100%;padding:8px 10px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.82rem;">
          </div>
          <div>
            <label style="font-size:0.72rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Your Role</label>
            <input type="text" id="new-proj-role" placeholder="e.g. Lead Full-Stack Architect" style="width:100%;padding:8px 10px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.82rem;">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <div>
            <label style="font-size:0.72rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Tech Stack (comma-separated)</label>
            <input type="text" id="new-proj-stack" placeholder="e.g. Node.js, Express, MongoDB, Vanilla JS" style="width:100%;padding:8px 10px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.82rem;">
          </div>
          <div>
            <label style="font-size:0.72rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Live Demo or GitHub URL</label>
            <input type="url" id="new-proj-link" placeholder="e.g. https://github.com/user/project" style="width:100%;padding:8px 10px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.82rem;">
          </div>
        </div>
        <div style="margin-bottom:12px;">
          <label style="font-size:0.72rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Key Quantified Achievements (one per line, XYZ formula: "Accomplished [X] by doing [Z] resulting in [Y]")</label>
          <textarea id="new-proj-bullets" rows="3" placeholder="• Built full-stack adaptive architecture serving 16 views with sub-100ms response times.&#10;• Integrated resilient dual-tier AI fallback ensuring 100% uptime without rate-limit disruptions." style="width:100%;padding:8px 10px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.82rem;resize:vertical;"></textarea>
        </div>
        <button class="btn btn-outline" onclick="ResumeBuilderView.handleAddProject()" style="font-size:0.78rem;padding:6px 14px;">Add Project to Resume</button>
      </div>
    `;
  },

  handleAddProject() {
    const title = document.getElementById('new-proj-title')?.value.trim();
    const role = document.getElementById('new-proj-role')?.value.trim();
    const techStack = document.getElementById('new-proj-stack')?.value.trim();
    const link = document.getElementById('new-proj-link')?.value.trim();
    const bulletsRaw = document.getElementById('new-proj-bullets')?.value.trim();

    if (!title) {
      if (typeof showToast === 'function') showToast('Please enter a project title', 'error');
      return;
    }

    const bullets = (bulletsRaw || '').split('\n').map(b => b.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);

    this.resumeData.projects.push({ title, role, techStack, link, bullets });
    this.saveDraft();
    this.renderFormStep();
    this.renderLivePreview();
  },

  deleteProject(idx) {
    this.resumeData.projects.splice(idx, 1);
    this.saveDraft();
    this.renderFormStep();
    this.renderLivePreview();
  },

  // ==========================================
  // STEP 5: CERTIFICATIONS & ACHIEVEMENTS
  // ==========================================
  renderStep5Certifications(container) {
    const certsHtml = (this.resumeData.certifications || []).map((c, idx) => `
      <div style="background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h4 style="margin:0;font-size:0.88rem;font-weight:800;color:var(--text-primary);">${c.name}</h4>
          <div style="font-size:0.75rem;color:var(--text-muted);">${c.issuer || 'Issuing Body'} · Year: ${c.year || '2024'}</div>
        </div>
        <button class="btn-text-action" onclick="ResumeBuilderView.deleteCertification(${idx})" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:0.8rem;">🗑️</button>
      </div>
    `).join('');

    container.innerHTML = `
      <div style="margin-bottom:18px;">
        <h4 style="margin:0 0 10px 0;font-size:0.85rem;font-weight:800;color:var(--text-primary);text-transform:uppercase;">Certifications & Credentials (${this.resumeData.certifications.length})</h4>
        ${certsHtml || `<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:0.82rem;border:1px dashed var(--border-subtle);border-radius:var(--radius-sm);">No certifications added yet. List verified credentials below.</div>`}
      </div>

      <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px;">
        <h4 style="margin:0 0 12px 0;font-size:0.85rem;font-weight:800;color:var(--brand-primary);">+ Add Credential / Certificate</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <div>
            <label style="font-size:0.72rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Certificate / Honor Title *</label>
            <input type="text" id="new-cert-name" placeholder="e.g. AWS Certified Cloud Practitioner" style="width:100%;padding:8px 10px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.82rem;">
          </div>
          <div>
            <label style="font-size:0.72rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Issuer / Organization</label>
            <input type="text" id="new-cert-issuer" placeholder="e.g. Amazon Web Services (AWS)" style="width:100%;padding:8px 10px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.82rem;">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <div>
            <label style="font-size:0.72rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Year / Issue Date</label>
            <input type="text" id="new-cert-year" placeholder="e.g. 2024" style="width:100%;padding:8px 10px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.82rem;">
          </div>
          <div>
            <label style="font-size:0.72rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px;">Credential ID / URL</label>
            <input type="text" id="new-cert-link" placeholder="e.g. aws.amazon.com/verify/..." style="width:100%;padding:8px 10px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);font-size:0.82rem;">
          </div>
        </div>
        <button class="btn btn-outline" onclick="ResumeBuilderView.handleAddCertification()" style="font-size:0.78rem;padding:6px 14px;">Add Certificate</button>
      </div>
    `;
  },

  handleAddCertification() {
    const name = document.getElementById('new-cert-name')?.value.trim();
    const issuer = document.getElementById('new-cert-issuer')?.value.trim();
    const year = document.getElementById('new-cert-year')?.value.trim();
    const link = document.getElementById('new-cert-link')?.value.trim();

    if (!name) {
      if (typeof showToast === 'function') showToast('Please enter a certificate name', 'error');
      return;
    }

    this.resumeData.certifications.push({ name, issuer, year, link });
    this.saveDraft();
    this.renderFormStep();
    this.renderLivePreview();
  },

  deleteCertification(idx) {
    this.resumeData.certifications.splice(idx, 1);
    this.saveDraft();
    this.renderFormStep();
    this.renderLivePreview();
  },

  // ==========================================
  // REAL-TIME ATS RESUME PREVIEW
  // ==========================================
  renderLivePreview() {
    const previewEl = document.getElementById('resume-live-preview');
    if (!previewEl) return;

    const p = this.resumeData.personal;
    const edu = this.resumeData.education;
    const skills = this.resumeData.skills;
    const projs = this.resumeData.projects;
    const certs = this.resumeData.certifications;

    // Contact items array
    const contacts = [
      p.email ? `<span>✉️ ${this.escapeHtml(p.email)}</span>` : '',
      p.phone ? `<span>📱 ${this.escapeHtml(p.phone)}</span>` : '',
      p.location ? `<span>📍 ${this.escapeHtml(p.location)}</span>` : '',
      p.linkedin ? `<span>🔗 ${this.escapeHtml(p.linkedin)}</span>` : '',
      p.github ? `<span>💻 ${this.escapeHtml(p.github)}</span>` : '',
      p.portfolio ? `<span>🌐 ${this.escapeHtml(p.portfolio)}</span>` : ''
    ].filter(Boolean);

    // Group skills by category
    const skillsByCategory = {};
    skills.forEach(s => {
      const cat = s.category || 'Technical';
      if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
      skillsByCategory[cat].push(s.name);
    });

    previewEl.innerHTML = `
      <div class="ats-resume-document" style="background:#ffffff;color:#1a202c;font-family:'Inter',system-ui,-apple-system,sans-serif;padding:36px 40px;line-height:1.45;box-shadow:var(--shadow-md);border-radius:var(--radius-sm);max-width:800px;margin:0 auto;">
        
        <!-- HEADER -->
        <header style="text-align:center;border-bottom:2px solid #2d3748;padding-bottom:14px;margin-bottom:16px;">
          <h1 style="margin:0;font-size:1.75rem;font-weight:900;letter-spacing:-0.02em;color:#1a202c;text-transform:uppercase;">
            ${this.escapeHtml(p.name || 'YOUR FULL NAME')}
          </h1>
          <div style="font-size:0.95rem;font-weight:700;color:#4a5568;margin-top:4px;">
            ${this.escapeHtml(p.title || 'Target Job Title / Engineering Specialization')}
          </div>
          <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:12px;font-size:0.78rem;color:#4a5568;margin-top:8px;">
            ${contacts.join(' · ') || '<span>contact@domain.com · +91 98765 43210 · City, Country</span>'}
          </div>
        </header>

        <!-- SUMMARY -->
        ${p.summary ? `
          <section style="margin-bottom:16px;">
            <h2 style="font-size:0.85rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#2b6cb0;border-bottom:1px solid #e2e8f0;padding-bottom:3px;margin:0 0 6px 0;">
              Professional Summary
            </h2>
            <p style="font-size:0.82rem;color:#2d3748;margin:0;line-height:1.5;">
              ${this.escapeHtml(p.summary)}
            </p>
          </section>
        ` : ''}

        <!-- EDUCATION -->
        ${edu.length > 0 ? `
          <section style="margin-bottom:16px;">
            <h2 style="font-size:0.85rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#2b6cb0;border-bottom:1px solid #e2e8f0;padding-bottom:3px;margin:0 0 8px 0;">
              Education
            </h2>
            ${edu.map(e => `
              <div style="margin-bottom:8px;">
                <div style="display:flex;justify-content:space-between;align-items:baseline;">
                  <span style="font-size:0.88rem;font-weight:800;color:#1a202c;">${this.escapeHtml(e.institution)}</span>
                  <span style="font-size:0.75rem;font-weight:700;color:#718096;">${this.escapeHtml(e.startYear || '')} – ${this.escapeHtml(e.endYear || 'Present')}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:#4a5568;margin-top:1px;">
                  <span>${this.escapeHtml(e.degree)}</span>
                  ${e.grade ? `<span style="font-weight:700;color:#2b6cb0;">CGPA: ${this.escapeHtml(e.grade)}</span>` : ''}
                </div>
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- SKILLS -->
        ${skills.length > 0 ? `
          <section style="margin-bottom:16px;">
            <h2 style="font-size:0.85rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#2b6cb0;border-bottom:1px solid #e2e8f0;padding-bottom:3px;margin:0 0 8px 0;">
              Technical & Core Skills
            </h2>
            <div style="font-size:0.82rem;color:#2d3748;line-height:1.6;">
              ${Object.keys(skillsByCategory).map(cat => `
                <div>
                  <strong style="color:#1a202c;">${this.escapeHtml(cat)}:</strong>
                  ${skillsByCategory[cat].map(s => this.escapeHtml(s)).join(', ')}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- PROJECTS -->
        ${projs.length > 0 ? `
          <section style="margin-bottom:16px;">
            <h2 style="font-size:0.85rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#2b6cb0;border-bottom:1px solid #e2e8f0;padding-bottom:3px;margin:0 0 8px 0;">
              Projects & Engineering Work
            </h2>
            ${projs.map(proj => `
              <div style="margin-bottom:10px;">
                <div style="display:flex;justify-content:space-between;align-items:baseline;">
                  <span style="font-size:0.88rem;font-weight:800;color:#1a202c;">
                    ${this.escapeHtml(proj.title)}
                    ${proj.role ? `<span style="font-weight:500;font-size:0.78rem;color:#718096;"> | ${this.escapeHtml(proj.role)}</span>` : ''}
                  </span>
                  ${proj.link ? `<span style="font-size:0.75rem;color:#2b6cb0;">[${this.escapeHtml(proj.link.replace(/^https?:\/\//, ''))}]</span>` : ''}
                </div>
                ${proj.techStack ? `
                  <div style="font-size:0.75rem;color:#718096;font-style:italic;margin-top:1px;">
                    Stack: ${this.escapeHtml(proj.techStack)}
                  </div>
                ` : ''}
                ${(proj.bullets && proj.bullets.length > 0) ? `
                  <ul style="padding-left:18px;margin:4px 0 0 0;font-size:0.8rem;color:#2d3748;line-height:1.45;">
                    ${proj.bullets.map(b => `<li>${this.escapeHtml(b)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- CERTIFICATIONS -->
        ${certs.length > 0 ? `
          <section style="margin-bottom:8px;">
            <h2 style="font-size:0.85rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#2b6cb0;border-bottom:1px solid #e2e8f0;padding-bottom:3px;margin:0 0 6px 0;">
              Certifications & Honors
            </h2>
            <div style="font-size:0.82rem;color:#2d3748;line-height:1.5;">
              ${certs.map(c => `
                <div style="display:flex;justify-content:space-between;">
                  <span><strong>${this.escapeHtml(c.name)}</strong> · ${this.escapeHtml(c.issuer || '')}</span>
                  <span style="font-size:0.75rem;color:#718096;">${this.escapeHtml(c.year || '')}</span>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

      </div>
    `;
  },

  // ==========================================
  // SAMPLE DATA LOADER
  // ==========================================
  loadSampleData() {
    this.resumeData = {
      personal: {
        name: 'Jaskaran Singh',
        title: 'Full-Stack Software Engineer | CS Undergraduate',
        email: 'jaskaran@pw.in',
        phone: '+91 98765 43210',
        location: 'New Delhi, India',
        linkedin: 'linkedin.com/in/jaskaran-tech',
        github: 'github.com/jaskaran-guru',
        portfolio: 'jaskaran.dev',
        summary: 'Passionate Computer Science undergraduate with expertise in scalable web architectures, micro-frontends, and distributed systems. Built high-throughput educational platforms supporting thousands of concurrent learners.'
      },
      education: [
        {
          degree: 'Bachelor of Technology in Computer Science & Engineering',
          institution: 'Delhi Technological University (DTU)',
          startYear: '2021',
          endYear: '2025',
          grade: '8.9 / 10 CGPA'
        },
        {
          degree: 'Class 12th Board Examination (CBSE Science)',
          institution: 'Delhi Public School, R.K. Puram',
          startYear: '2020',
          endYear: '2021',
          grade: '96.4%'
        }
      ],
      skills: [
        { name: 'JavaScript (ES6+)', category: 'Languages' },
        { name: 'TypeScript', category: 'Languages' },
        { name: 'Python', category: 'Languages' },
        { name: 'C++', category: 'Languages' },
        { name: 'React.js', category: 'Frameworks' },
        { name: 'Node.js', category: 'Frameworks' },
        { name: 'Express.js', category: 'Frameworks' },
        { name: 'MongoDB', category: 'Databases' },
        { name: 'PostgreSQL', category: 'Databases' },
        { name: 'Docker', category: 'DevOps & Cloud' },
        { name: 'Git & GitHub', category: 'DevOps & Cloud' },
        { name: 'Data Structures & Algorithms', category: 'Core Competencies' },
        { name: 'System Design', category: 'Core Competencies' }
      ],
      projects: [
        {
          title: 'NextStep OS — Lifecycle Educational & Career Operating System',
          role: 'Lead Architect & Full-Stack Developer',
          techStack: 'Node.js, Express, MongoDB Atlas, Vanilla JS SPA, Gemini AI',
          link: 'https://github.com/Jaskaran-Guru/Next-Step',
          bullets: [
            'Architected 16 responsive SPA views with zero bundle overhead, reducing initial page load time to under 120ms.',
            'Engineered resilient dual-tier AI pipeline with deterministic rule-based expert engine fallback, guaranteeing 100% test reliability.',
            'Implemented 7-stage life-cycle adaptation engine dynamically rewiring themes, navigation, and exam prep paths across ages 1 to 25+.'
          ]
        },
        {
          title: 'AI Saarthi — Real-Time Academic Doubt Solver & Recommendation Engine',
          role: 'Backend & ML Engineer',
          techStack: 'Node.js, REST API, Google Gemini API, WebSockets',
          link: 'https://github.com/Jaskaran-Guru/Next-Step',
          bullets: [
            'Developed natural language STEM doubt resolution engine answering complex JEE & NEET physics/math questions in sub-second latency.',
            'Constructed automated tagging and categorization system classifying student inquiries across 12 distinct competitive categories.'
          ]
        }
      ],
      certifications: [
        {
          name: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services (AWS)',
          year: '2024',
          link: 'aws.amazon.com'
        },
        {
          name: 'Meta Front-End Developer Professional Certificate',
          issuer: 'Meta (Coursera)',
          year: '2023',
          link: 'coursera.org'
        }
      ]
    };

    this.saveDraft();
    this.renderFormStep();
    this.renderLivePreview();
    if (typeof showToast === 'function') {
      showToast('Loaded top-tier sample resume profile!', 'success');
    }
  },

  clearDraft() {
    this.resumeData = {
      personal: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', summary: '' },
      education: [],
      skills: [],
      projects: [],
      certifications: []
    };
    this.saveDraft();
    this.renderFormStep();
    this.renderLivePreview();
    if (typeof showToast === 'function') {
      showToast('Resume draft cleared', 'info');
    }
  },

  // ==========================================
  // EXPORTS
  // ==========================================
  exportPDF() {
    window.print();
  },

  exportHTML() {
    const previewEl = document.getElementById('resume-live-preview');
    if (!previewEl) return;
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${this.escapeHtml(this.resumeData.personal.name || 'Resume')} – NextStep OS</title>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #f7fafc; padding: 40px; margin: 0; }
    .ats-resume-document { max-width: 800px; margin: 0 auto; background: #fff; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    @media print { body { background: #fff; padding: 0; } .ats-resume-document { box-shadow: none; padding: 20px; } }
  </style>
</head>
<body>
  ${previewEl.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(this.resumeData.personal.name || 'Resume').replace(/\s+/g, '_')}_NextStep.html`;
    a.click();
    URL.revokeObjectURL(url);
    if (typeof showToast === 'function') showToast('Downloaded standalone HTML resume', 'success');
  },

  copyPlainText() {
    const p = this.resumeData.personal;
    const edu = this.resumeData.education;
    const skills = this.resumeData.skills;
    const projs = this.resumeData.projects;
    const certs = this.resumeData.certifications;

    let text = `${p.name.toUpperCase()}\n${p.title}\n${[p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean).join(' | ')}\n\n`;

    if (p.summary) {
      text += `PROFESSIONAL SUMMARY\n${p.summary}\n\n`;
    }

    if (edu.length > 0) {
      text += `EDUCATION\n`;
      edu.forEach(e => {
        text += `${e.institution} — ${e.degree} (${e.startYear || ''} - ${e.endYear || 'Present'})\n`;
        if (e.grade) text += `CGPA/Percentage: ${e.grade}\n`;
      });
      text += `\n`;
    }

    if (skills.length > 0) {
      text += `TECHNICAL SKILLS\n${skills.map(s => s.name).join(', ')}\n\n`;
    }

    if (projs.length > 0) {
      text += `PROJECTS\n`;
      projs.forEach(pr => {
        text += `${pr.title} | ${pr.role || 'Developer'}\n`;
        if (pr.techStack) text += `Tech Stack: ${pr.techStack}\n`;
        (pr.bullets || []).forEach(b => { text += `• ${b}\n`; });
        text += `\n`;
      });
    }

    if (certs.length > 0) {
      text += `CERTIFICATIONS\n`;
      certs.forEach(c => {
        text += `• ${c.name} — ${c.issuer || ''} (${c.year || ''})\n`;
      });
    }

    navigator.clipboard.writeText(text).then(() => {
      if (typeof showToast === 'function') showToast('Plain-text ATS resume copied to clipboard!', 'success');
    }).catch(() => {
      if (typeof showToast === 'function') showToast('Failed to copy to clipboard', 'error');
    });
  },

  // ==========================================
  // ATS REVIEWER AUDIT
  // ==========================================
  async runATSAudit() {
    const auditContainer = document.getElementById('resume-ats-audit-container');
    if (!auditContainer) return;

    auditContainer.style.display = 'block';
    auditContainer.innerHTML = `
      <div style="background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:20px;text-align:center;">
        <div class="loader-spinner" style="width:24px;height:24px;border:2px solid var(--brand-primary);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 10px;"></div>
        <div style="font-weight:700;color:var(--text-primary);">Running ATS Readiness Audit...</div>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:4px;">Evaluating keyword density, measurable achievements & recruiter benchmark</div>
      </div>
    `;

    const skillsList = (this.resumeData.skills || []).map(s => s.name);
    const summaryInput = `${this.resumeData.personal.summary || ''} Projects: ${this.resumeData.projects.map(p => p.title + ': ' + (p.bullets || []).join(' ')).join('. ')}`;
    const roleInput = this.resumeData.personal.title || 'Full-Stack Software Engineer';

    try {
      const res = await API.reviewResume(skillsList, summaryInput, roleInput);
      if (res.success) {
        const score = res.readinessScore || 78;
        const scoreColor = score >= 80 ? 'var(--status-success)' : score >= 60 ? '#F5B942' : 'var(--status-error)';

        auditContainer.innerHTML = `
          <div style="background:var(--bg-surface);border:1px solid rgba(104,87,245,0.3);border-radius:var(--radius-lg);padding:24px;box-shadow:var(--shadow-md);">
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border-subtle);padding-bottom:14px;margin-bottom:16px;">
              <div>
                <h3 style="margin:0;font-size:1.15rem;font-weight:800;color:var(--text-primary);">🤖 ATS Recruiter Audit Result</h3>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">Target Role: <strong>${roleInput}</strong></div>
              </div>
              <div style="text-align:center;">
                <div style="font-size:1.8rem;font-weight:900;color:${scoreColor};line-height:1;">${score}/100</div>
                <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.05em;">ATS Match Score</div>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
              <!-- Strengths -->
              <div style="background:rgba(34,197,139,0.06);border:1px solid rgba(34,197,139,0.25);border-radius:var(--radius-sm);padding:14px;">
                <h4 style="margin:0 0 8px 0;font-size:0.82rem;font-weight:800;color:var(--status-success);">✅ Key Strengths</h4>
                <ul style="padding-left:18px;margin:0;font-size:0.78rem;color:var(--text-secondary);line-height:1.4;">
                  ${(res.strengths || []).map(s => `<li>${s}</li>`).join('')}
                </ul>
              </div>

              <!-- Critical Gaps -->
              <div style="background:rgba(240,100,116,0.06);border:1px solid rgba(240,100,116,0.25);border-radius:var(--radius-sm);padding:14px;">
                <h4 style="margin:0 0 8px 0;font-size:0.82rem;font-weight:800;color:#F06474;">⚠️ Identified Gaps</h4>
                <ul style="padding-left:18px;margin:0;font-size:0.78rem;color:var(--text-secondary);line-height:1.4;">
                  ${(res.criticalGaps || []).map(g => `<li>${g}</li>`).join('')}
                </ul>
              </div>
            </div>

            <!-- Actionable Improvements -->
            <div style="background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:14px;margin-bottom:14px;">
              <h4 style="margin:0 0 8px 0;font-size:0.82rem;font-weight:800;color:var(--brand-primary);">💡 Actionable Resume Improvements</h4>
              <ul style="padding-left:18px;margin:0;font-size:0.78rem;color:var(--text-secondary);line-height:1.4;">
                ${(res.actionableImprovements || []).map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            </div>

            <div style="display:flex;justify-content:flex-end;">
              <button class="btn btn-outline" onclick="document.getElementById('resume-ats-audit-container').style.display='none'" style="font-size:0.75rem;padding:5px 12px;">Close Audit Panel</button>
            </div>
          </div>
        `;
      } else {
        auditContainer.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);">Failed to complete ATS audit. Check network connection.</div>`;
      }
    } catch (err) {
      auditContainer.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);">Error running ATS audit.</div>`;
    }
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  },

  escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/"/g, '&quot;');
  }
};

window.ResumeBuilderView = ResumeBuilderView;


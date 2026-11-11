/**
 * EXAM PREPARATION CENTRE VIEW CONTROLLER
 * NextStep OS — Comprehensive national & state entrance exams, syllabi, roadmaps & tracking
 */

const ExamCentreView = {
  exams: [],
  categories: [],
  trackedExams: [],
  activeCategory: 'All',
  searchQuery: '',
  selectedExam: null,

  async init() {
    this.bindEvents();
    await this.loadInitialData();
  },

  bindEvents() {
    const searchInput = document.getElementById('exam-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderGrid();
      });
    }

    // Modal close handlers
    const detailModal = document.getElementById('exam-detail-modal');
    const roadmapModal = document.getElementById('exam-roadmap-modal');
    const addModal = document.getElementById('add-custom-exam-modal');

    document.getElementById('exam-detail-modal-close')?.addEventListener('click', () => {
      detailModal?.classList.remove('active');
    });

    document.getElementById('exam-roadmap-modal-close')?.addEventListener('click', () => {
      roadmapModal?.classList.remove('active');
    });

    document.getElementById('add-custom-exam-modal-close')?.addEventListener('click', () => {
      addModal?.classList.remove('active');
    });

    [detailModal, roadmapModal, addModal].forEach(m => {
      m?.addEventListener('click', (e) => {
        if (e.target === m) m.classList.remove('active');
      });
    });

    // Add exam form
    const addForm = document.getElementById('add-custom-exam-form');
    if (addForm) {
      addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleCreateCustomExam();
      });
    }
  },

  async loadInitialData() {
    try {
      const [examsRes, catRes, trackedRes] = await Promise.all([
        API.getExams(),
        API.getExamCategories(),
        API.getUserTrackedExams()
      ]);

      if (examsRes.success) {
        this.exams = examsRes.exams || [];
      }
      if (catRes.success) {
        this.categories = catRes.categories || [];
      }
      if (trackedRes.success) {
        this.trackedExams = trackedRes.trackedExams || [];
      }

      this.renderCategoryPills();
      this.renderTrackedBanner();
      this.renderGrid();
    } catch (err) {
      console.warn('Failed to load Exam Centre data:', err);
    }
  },

  renderCategoryPills() {
    const container = document.getElementById('exam-categories-container');
    if (!container) return;

    const allPill = `
      <button class="exam-category-pill ${this.activeCategory === 'All' ? 'active' : ''}" data-cat="All" onclick="ExamCentreView.selectCategory('All')" style="padding:6px 14px;border-radius:20px;font-size:0.78rem;font-weight:700;border:1px solid var(--border-subtle);background:${this.activeCategory === 'All' ? 'var(--brand-primary)' : 'var(--bg-surface-secondary)'};color:${this.activeCategory === 'All' ? '#fff' : 'var(--text-secondary)'};cursor:pointer;white-space:nowrap;">
        All Exams (${this.exams.length})
      </button>
    `;

    const catPills = this.categories.map(cat => {
      const isActive = this.activeCategory.toLowerCase() === cat.id.toLowerCase();
      return `
        <button class="exam-category-pill ${isActive ? 'active' : ''}" data-cat="${cat.id}" onclick="ExamCentreView.selectCategory('${cat.id}')" style="padding:6px 14px;border-radius:20px;font-size:0.78rem;font-weight:700;border:1px solid var(--border-subtle);background:${isActive ? 'var(--brand-primary)' : 'var(--bg-surface-secondary)'};color:${isActive ? '#fff' : 'var(--text-secondary)'};cursor:pointer;white-space:nowrap;">
          ${cat.label} (${cat.count})
        </button>
      `;
    }).join('');

    container.innerHTML = allPill + catPills;
  },

  selectCategory(cat) {
    this.activeCategory = cat;
    this.renderCategoryPills();
    this.renderGrid();
  },

  renderTrackedBanner() {
    const banner = document.getElementById('exam-tracked-banner');
    if (!banner) return;

    if (this.trackedExams.length === 0) {
      banner.style.display = 'none';
      return;
    }

    banner.style.display = 'block';
    const chipsHtml = this.trackedExams.map(t => `
      <div style="background:var(--bg-surface);border:1px solid rgba(104,87,245,0.3);border-radius:var(--radius-md);padding:10px 16px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="font-size:1.4rem;">🎯</div>
          <div>
            <div style="font-size:0.88rem;font-weight:800;color:var(--text-primary);">${t.examName} (${t.targetYear})</div>
            <div style="font-size:0.72rem;color:var(--text-muted);">Target: <strong>${t.targetScore}</strong> · Status: <span style="color:var(--status-success);font-weight:700;">${t.status}</span></div>
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-outline" onclick="ExamCentreView.openRoadmapModal('${t.examId}')" style="padding:4px 10px;font-size:0.75rem;">Study Roadmap 🗺️</button>
          <button class="btn-text-action" onclick="ExamCentreView.toggleTrack('${t.examId}')" style="background:none;border:none;color:var(--text-muted);font-size:0.8rem;cursor:pointer;" title="Stop tracking">✕</button>
        </div>
      </div>
    `).join('');

    banner.innerHTML = `
      <div style="background:rgba(104,87,245,0.06);border:1px solid rgba(104,87,245,0.25);border-radius:var(--radius-lg);padding:18px 20px;margin-bottom:24px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <div style="font-size:0.82rem;font-weight:800;color:var(--brand-primary);text-transform:uppercase;letter-spacing:0.05em;">
            🎯 My Active Target Exams (${this.trackedExams.length})
          </div>
          <span style="font-size:0.72rem;color:var(--text-muted);">Syncs with your Study Planner schedule</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:12px;">
          ${chipsHtml}
        </div>
      </div>
    `;
  },

  renderGrid() {
    const container = document.getElementById('exam-cards-grid');
    if (!container) return;

    let filtered = [...this.exams];
    if (this.activeCategory !== 'All') {
      filtered = filtered.filter(e => e.category.toLowerCase() === this.activeCategory.toLowerCase());
    }

    if (this.searchQuery) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(this.searchQuery) ||
        e.fullName.toLowerCase().includes(this.searchQuery) ||
        (e.targetDegree && e.targetDegree.toLowerCase().includes(this.searchQuery))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:var(--text-muted);">
          <div style="font-size:2.5rem;margin-bottom:12px;">🔍</div>
          <div style="font-weight:700;color:var(--text-primary);margin-bottom:4px;">No exams found</div>
          <div style="font-size:0.82rem;">Try clearing your search query or selecting a different category.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(exam => {
      const isTracked = this.trackedExams.some(t => t.examId === exam.id);
      return `
        <div class="exam-card" style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:24px;display:flex;flex-direction:column;justify-content:space-between;transition:transform 0.2s ease, border-color 0.2s ease;position:relative;">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;gap:8px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <div style="width:42px;height:42px;border-radius:12px;background:rgba(104,87,245,0.12);display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;">
                  ${exam.icon || '📝'}
                </div>
                <div>
                  <h3 style="margin:0;font-size:1.15rem;font-weight:800;color:var(--text-primary);">${exam.name}</h3>
                  <div style="font-size:0.72rem;color:var(--text-muted);">${exam.conductedBy || 'National Authority'}</div>
                </div>
              </div>
              <span style="font-size:0.68rem;font-weight:700;text-transform:uppercase;color:var(--brand-secondary);background:rgba(25,198,216,0.1);padding:3px 10px;border-radius:16px;">
                ${exam.category}
              </span>
            </div>

            <div style="font-size:0.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:10px;line-height:1.4;">
              ${exam.fullName}
            </div>

            <div style="background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:8px 12px;margin-bottom:14px;">
              <div style="font-size:0.7rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Leads To Degree / Role:</div>
              <div style="font-size:0.84rem;font-weight:700;color:var(--brand-primary);margin-top:2px;">
                🎓 ${exam.targetDegree || 'Undergraduate Degree'}
              </div>
            </div>

            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">
              <span style="font-size:0.72rem;background:var(--bg-surface-secondary);color:var(--text-secondary);padding:3px 8px;border-radius:4px;border:1px solid var(--border-subtle);">
                🏛️ Level: ${exam.level || 'National'}
              </span>
              <span style="font-size:0.72rem;background:var(--bg-surface-secondary);color:var(--text-secondary);padding:3px 8px;border-radius:4px;border:1px solid var(--border-subtle);">
                📋 Syllabus: Updated 2025
              </span>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
            <div style="display:flex;gap:8px;">
              <button class="btn btn-primary" onclick="ExamCentreView.openExamDetails('${exam.id}')" style="flex:1;font-size:0.82rem;padding:8px 12px;">
                Syllabus & Details →
              </button>
              <button class="btn btn-outline" onclick="ExamCentreView.openRoadmapModal('${exam.id}')" style="font-size:0.82rem;padding:8px 12px;" title="Generate AI Study Roadmap">
                🗺️ Roadmap
              </button>
            </div>
            <div style="display:flex;gap:8px;">
              <button class="btn btn-outline" onclick="ExamCentreView.toggleTrack('${exam.id}')" style="flex:1;font-size:0.78rem;padding:6px 10px;border-color:${isTracked ? 'var(--status-success)' : 'var(--border-subtle)'};color:${isTracked ? 'var(--status-success)' : 'var(--text-secondary)'};font-weight:700;">
                ${isTracked ? '✅ Active Target Exam' : '🎯 Track This Exam'}
              </button>
              <button class="btn btn-outline" onclick="BookmarksManager.toggleBookmark('exam', '${exam.id}', '${exam.name}', '${exam.fullName}', '${exam.icon || '📝'}')" style="padding:6px 10px;font-size:0.85rem;" title="Save to bookmarks">
                🔖
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  async openExamDetails(id) {
    const modal = document.getElementById('exam-detail-modal');
    const content = document.getElementById('exam-detail-modal-content');
    if (!modal || !content) return;

    modal.classList.add('active');
    content.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;padding:60px;gap:10px;color:var(--text-muted);">
        <div class="loader-spinner" style="width:24px;height:24px;border:2px solid var(--brand-primary);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
        <span>Loading comprehensive exam profile...</span>
      </div>
    `;

    try {
      const res = await API.getExamDetails(id);
      if (!res.success || !res.exam) {
        content.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);">Exam details not found.</div>`;
        return;
      }

      const exam = res.exam;
      this.selectedExam = exam;

      // Format subjects syllabus
      const syllabusKeys = Object.keys(exam.syllabus || {});
      const syllabusHtml = syllabusKeys.map(sub => `
        <div style="background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:14px;margin-bottom:10px;">
          <h4 style="margin:0 0 8px 0;font-size:0.88rem;font-weight:800;color:var(--brand-primary);">${sub}</h4>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${(exam.syllabus[sub] || []).map(topic => `
              <span style="font-size:0.75rem;background:var(--bg-surface);color:var(--text-primary);padding:3px 8px;border-radius:4px;border:1px solid var(--border-subtle);">
                • ${topic}
              </span>
            `).join('')}
          </div>
        </div>
      `).join('');

      // Format Important Dates
      const datesHtml = (exam.importantDates || []).map(d => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-subtle);font-size:0.82rem;">
          <span style="color:var(--text-primary);font-weight:600;">${d.event}</span>
          <span style="color:var(--brand-secondary);font-weight:700;">${d.date}</span>
        </div>
      `).join('');

      // Format Top Colleges
      const collegesHtml = (exam.topColleges || []).map(c => `
        <span style="font-size:0.75rem;background:rgba(37,99,235,0.1);color:#2563EB;padding:4px 10px;border-radius:16px;border:1px solid rgba(37,99,235,0.25);font-weight:700;">
          🏛️ ${c}
        </span>
      `).join('');

      content.innerHTML = `
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px;border-bottom:1px solid var(--border-color);padding-bottom:16px;">
          <div style="display:flex;gap:14px;align-items:center;">
            <div style="font-size:2.4rem;line-height:1;">${exam.icon || '📝'}</div>
            <div>
              <h2 style="margin:0;font-size:1.4rem;font-weight:900;color:var(--text-primary);">${exam.name}</h2>
              <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:2px;">${exam.fullName}</div>
              <div style="font-size:0.75rem;color:var(--brand-primary);font-weight:700;margin-top:4px;">Conducted by: ${exam.conductedBy}</div>
            </div>
          </div>
          ${exam.officialLink ? `
            <a href="${exam.officialLink}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size:0.8rem;padding:6px 14px;white-space:nowrap;text-decoration:none;">
              Official Site ↗
            </a>
          ` : ''}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
          <!-- Eligibility -->
          <div style="background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:16px;">
            <div style="font-size:0.75rem;font-weight:800;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">Eligibility Criteria</div>
            <div style="font-size:0.82rem;color:var(--text-primary);line-height:1.5;">
              <div><strong>Qualification:</strong> ${exam.eligibility?.qualification || '10+2'}</div>
              <div><strong>Min Marks:</strong> ${exam.eligibility?.minMarks || 'Standard aggregate'}</div>
              <div><strong>Age Limit:</strong> ${exam.eligibility?.ageLimit || 'None'}</div>
              <div><strong>Attempts:</strong> ${exam.eligibility?.attempts || 'Standard limits apply'}</div>
            </div>
          </div>

          <!-- Exam Pattern -->
          <div style="background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:16px;">
            <div style="font-size:0.75rem;font-weight:800;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">Exam Pattern</div>
            <div style="font-size:0.82rem;color:var(--text-primary);line-height:1.5;">
              <div><strong>Mode:</strong> ${exam.pattern?.mode || 'CBT'}</div>
              <div><strong>Duration:</strong> ${exam.pattern?.duration || '3 hours'}</div>
              <div><strong>Total Marks:</strong> ${exam.pattern?.totalMarks || '300'}</div>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;"><strong>Marking:</strong> ${exam.pattern?.marking || '+4 / -1'}</div>
            </div>
          </div>
        </div>

        <!-- Syllabus Breakdown -->
        <div style="margin-bottom:20px;">
          <h3 style="font-size:0.95rem;font-weight:800;color:var(--text-primary);margin-bottom:10px;">Subject-Wise Syllabus (Updated)</h3>
          ${syllabusHtml}
        </div>

        <!-- Important Dates Timeline -->
        <div style="margin-bottom:20px;">
          <h3 style="font-size:0.95rem;font-weight:800;color:var(--text-primary);margin-bottom:10px;">Important Dates</h3>
          <div style="background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:12px 16px;">
            ${datesHtml}
          </div>
        </div>

        <!-- Target Institutions -->
        <div style="margin-bottom:24px;">
          <h3 style="font-size:0.95rem;font-weight:800;color:var(--text-primary);margin-bottom:10px;">Target Institutions & Colleges</h3>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${collegesHtml}
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px;border-top:1px solid var(--border-color);padding-top:16px;">
          <button class="btn btn-outline" onclick="document.getElementById('exam-detail-modal').classList.remove('active')">Close</button>
          <button class="btn btn-primary" onclick="document.getElementById('exam-detail-modal').classList.remove('active'); ExamCentreView.openRoadmapModal('${exam.id}')">
            Generate Prep Roadmap 🗺️
          </button>
        </div>
      `;
    } catch (err) {
      content.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);">Error fetching exam details.</div>`;
    }
  },

  async openRoadmapModal(id) {
    const modal = document.getElementById('exam-roadmap-modal');
    const content = document.getElementById('exam-roadmap-modal-content');
    if (!modal || !content) return;

    modal.classList.add('active');
    content.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;padding:60px;gap:10px;color:var(--text-muted);">
        <div class="loader-spinner" style="width:24px;height:24px;border:2px solid var(--brand-primary);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
        <span>Generating personalized preparation roadmap...</span>
      </div>
    `;

    try {
      const res = await API.getExamRoadmap(id, 6);
      if (!res.success || !res.roadmap) {
        content.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);">Unable to generate roadmap at this time.</div>`;
        return;
      }

      const { examName, monthsAvailable, roadmap, source } = res;
      const phases = roadmap.phases || [];

      const phasesHtml = phases.map(p => `
        <div style="display:flex;gap:14px;margin-bottom:18px;position:relative;">
          <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.85rem;flex-shrink:0;">
            ${p.month}
          </div>
          <div style="flex:1;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:14px 16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <h4 style="margin:0;font-size:0.92rem;font-weight:800;color:var(--text-primary);">${p.title}</h4>
              <span style="font-size:0.7rem;font-weight:700;color:var(--brand-primary);text-transform:uppercase;">Month ${p.month}</span>
            </div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;">
              Focus Areas: <strong>${(p.focus || []).join(', ')}</strong>
            </div>
            <ul style="padding-left:18px;margin:0 0 8px 0;font-size:0.8rem;color:var(--text-secondary);line-height:1.4;">
              ${(p.tasks || []).map(t => `<li>${t}</li>`).join('')}
            </ul>
            <div style="font-size:0.75rem;background:rgba(34,197,139,0.08);border-left:3px solid var(--status-success);padding:6px 10px;border-radius:0 4px 4px 0;color:var(--text-primary);">
              💡 <strong>Coach Tip:</strong> ${p.tip}
            </div>
          </div>
        </div>
      `).join('');

      content.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;border-bottom:1px solid var(--border-color);padding-bottom:16px;">
          <div>
            <h2 style="margin:0;font-size:1.3rem;font-weight:900;color:var(--text-primary);">${examName} Preparation Roadmap</h2>
            <p style="margin:4px 0 0;font-size:0.8rem;color:var(--text-secondary);">
              Structured ${monthsAvailable}-Month Strategy · Generated via ${source === 'gemini' ? 'Gemini AI' : 'Rule-Based Response System'}
            </p>
          </div>
        </div>

        <div style="max-height:60vh;overflow-y:auto;padding-right:8px;">
          ${phasesHtml}
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px;border-top:1px solid var(--border-color);padding-top:16px;margin-top:16px;">
          <button class="btn btn-outline" onclick="document.getElementById('exam-roadmap-modal').classList.remove('active')">Close</button>
          <button class="btn btn-primary" onclick="ExamCentreView.toggleTrack('${id}'); document.getElementById('exam-roadmap-modal').classList.remove('active');">
            Add to My Target Schedule 🎯
          </button>
        </div>
      `;
    } catch (err) {
      content.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);">Error generating roadmap.</div>`;
    }
  },

  async toggleTrack(id) {
    try {
      const res = await API.toggleTrackExam(id);
      if (res.success) {
        this.trackedExams = res.trackedExams || [];
        this.renderTrackedBanner();
        this.renderGrid();
        if (typeof showToast === 'function') {
          showToast(res.message, res.isTracked ? 'success' : 'info');
        }
      }
    } catch (err) {
      console.warn('Track toggle error:', err);
    }
  },

  openAddCustomExamModal() {
    const modal = document.getElementById('add-custom-exam-modal');
    if (modal) modal.classList.add('active');
  },

  async handleCreateCustomExam() {
    const name = document.getElementById('new-exam-name')?.value.trim();
    const fullName = document.getElementById('new-exam-fullname')?.value.trim();
    const category = document.getElementById('new-exam-category')?.value;
    const conductedBy = document.getElementById('new-exam-authority')?.value.trim();
    const targetDegree = document.getElementById('new-exam-degree')?.value.trim();

    if (!name || !fullName || !category) {
      if (typeof showToast === 'function') showToast('Please fill all required fields', 'error');
      return;
    }

    try {
      const res = await API.createCustomExam({
        name,
        fullName,
        category,
        conductedBy,
        targetDegree,
        level: 'National / State'
      });

      if (res.success && res.exam) {
        this.exams.unshift(res.exam);
        this.renderGrid();
        document.getElementById('add-custom-exam-modal')?.classList.remove('active');
        document.getElementById('add-custom-exam-form')?.reset();
        if (typeof showToast === 'function') {
          showToast(`Exam "${name}" added successfully!`, 'success');
        }
      }
    } catch (err) {
      if (typeof showToast === 'function') showToast('Failed to add custom exam', 'error');
    }
  }
};

window.ExamCentreView = ExamCentreView;

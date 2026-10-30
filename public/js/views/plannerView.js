/**
 * NEXTSTEP OS - STUDY PLANNER & EXAM CALENDAR
 * ============================================
 * Live competitive examination countdowns & daily time-boxed focus routine
 */

const PlannerView = {
  exams: [],
  schedule: [],

  async init() {
    await Promise.all([this.fetchExams(), this.fetchSchedule()]);
    this.render();
  },

  async fetchExams() {
    try {
      const res = await API.getExamCountdowns();
      if (res.success && res.exams) this.exams = res.exams;
    } catch (e) {
      console.warn('Failed to load exam countdowns:', e);
    }
  },

  async fetchSchedule() {
    try {
      const res = await API.getStudySchedule();
      if (res.success && res.schedule) this.schedule = res.schedule;
    } catch (e) {
      console.warn('Failed to load study schedule:', e);
    }
  },

  render() {
    this.renderExamsGrid();
    this.renderScheduleTimeline();
    this.bindEvents();
  },

  renderExamsGrid() {
    const container = document.getElementById('planner-exams-grid');
    if (!container) return;

    container.innerHTML = this.exams.map(exam => `
      <div class="exam-countdown-card" style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:20px;display:flex;flex-direction:column;justify-content:space-between;transition:transform 0.2s;">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-size:0.7rem;font-weight:700;color:var(--brand-primary);background:rgba(104,87,245,0.1);padding:3px 8px;border-radius:12px;text-transform:uppercase;">
              ${exam.category}
            </span>
            <span style="font-size:0.75rem;font-weight:700;color:var(--status-warning);">
              ⏳ ${exam.daysRemaining} Days Left
            </span>
          </div>

          <h3 style="font-size:1.1rem;font-weight:800;color:var(--text-primary);margin-bottom:4px;">
            ${exam.title}
          </h3>

          <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:12px;">
            Conducting Body: <strong>${exam.conductingBody}</strong>
          </div>

          <div style="background:rgba(104,87,245,0.06);border:1px solid rgba(104,87,245,0.2);border-radius:var(--radius-sm);padding:8px 12px;margin-bottom:12px;">
            <div style="font-size:0.68rem;font-weight:700;color:var(--brand-primary);text-transform:uppercase;">High-Weightage Chapters:</div>
            <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:2px;">${exam.weightageFocus}</div>
          </div>
        </div>

        <div style="display:flex;gap:8px;margin-top:8px;">
          <a href="${exam.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="flex:1;text-align:center;font-size:0.78rem;padding:6px;text-decoration:none;">
            Official Portal ↗
          </a>
          <button class="btn btn-primary" style="flex:1;font-size:0.78rem;padding:6px;" onclick="window.Router.navigate('tests')">
            Practice Mocks →
          </button>
        </div>
      </div>
    `).join('');
  },

  renderScheduleTimeline() {
    const container = document.getElementById('planner-schedule-timeline');
    if (!container) return;

    container.innerHTML = this.schedule.map((item, idx) => `
      <div style="display:flex;gap:16px;padding:16px 20px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);margin-bottom:12px;align-items:flex-start;">
        <div style="background:linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));color:#fff;font-weight:800;font-size:0.75rem;padding:6px 10px;border-radius:var(--radius-sm);white-space:nowrap;letter-spacing:0.04em;">
          ${item.slot}
        </div>
        <div style="flex:1;">
          <h4 style="font-size:0.95rem;font-weight:700;color:var(--text-primary);margin-bottom:4px;">
            ${item.title}
          </h4>
          <div style="font-size:0.82rem;font-weight:600;color:var(--brand-secondary);margin-bottom:4px;">
            🎯 ${item.subject}
          </div>
          <div style="font-size:0.78rem;color:var(--text-muted);font-style:italic;">
            💡 Tip: ${item.tip}
          </div>
        </div>
      </div>
    `).join('');
  },

  bindEvents() {
    const form = document.getElementById('planner-add-slot-form');
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const slot = document.getElementById('new-slot-time')?.value;
        const title = document.getElementById('new-slot-title')?.value;
        const subject = document.getElementById('new-slot-subject')?.value;
        const tip = document.getElementById('new-slot-tip')?.value;

        if (!slot || !title) {
          showToast('Slot time and title are required', 'error');
          return;
        }

        try {
          const res = await API.addStudySlot({ slot, title, subject, tip });
          if (res.success) {
            this.schedule.push(res.slot);
            this.renderScheduleTimeline();
            form.reset();
            showToast('Study slot added to your daily schedule!', 'success');
          }
        } catch (err) {
          showToast('Failed to add slot', 'error');
        }
      };
    }
  }
};

window.PlannerView = PlannerView;


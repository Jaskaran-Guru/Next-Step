/**
 * NEXTSTEP OS - PERSONALITY & LIFE SKILLS DEVELOPMENT CENTRE
 * ==========================================================
 * Modules:
 *   1. Public Speaking & Executive Communication
 *   2. Financial Literacy & Compounding
 *   3. Critical Thinking & Mental Models
 *   4. Emotional Intelligence & Exam Anxiety Reset
 *   5. Time Management & Deep Work Focus
 *   6. Interactive Diagnostic Self-Assessment
 */

const LifeSkillsView = {
  modules: [],

  async init() {
    await this.fetchModules();
    this.render();
  },

  async fetchModules() {
    try {
      const res = await API.getLifeSkills();
      if (res.success && res.data) {
        this.modules = res.data;
      }
    } catch (e) {
      console.warn('Failed to load life skills modules:', e);
    }
  },

  render() {
    this.renderModulesGrid();
    this.bindEvents();
  },

  renderModulesGrid() {
    const container = document.getElementById('lifeskills-modules-grid');
    if (!container) return;

    container.innerHTML = this.modules.map(mod => `
      <div class="lifeskill-card" style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:24px;display:flex;flex-direction:column;justify-content:space-between;transition:transform 0.2s ease, border-color 0.2s ease;">
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <span style="font-size:0.7rem;font-weight:700;color:var(--brand-primary);background:rgba(104,87,245,0.1);padding:4px 10px;border-radius:20px;text-transform:uppercase;">
              ${mod.category}
            </span>
            <span style="font-size:0.75rem;color:var(--text-muted);">
              3 Lessons
            </span>
          </div>

          <h3 style="font-size:1.15rem;font-weight:700;color:var(--text-primary);margin-bottom:6px;">
            ${mod.title}
          </h3>

          <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.5;margin-bottom:16px;">
            ${mod.tagline}
          </p>

          <div style="background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:12px;margin-bottom:16px;">
            <div style="font-size:0.7rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">Curriculum Lessons:</div>
            ${(mod.lessons || []).map((les, idx) => `
              <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--text-primary);padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
                <span>${idx + 1}. ${les.title}</span>
                <span style="color:var(--text-muted);font-size:0.72rem;margin-left:8px;">${les.duration}</span>
              </div>
            `).join('')}
          </div>

          <div style="background:rgba(25,198,216,0.06);border-left:3px solid var(--brand-secondary);padding:8px 12px;border-radius:0 var(--radius-sm) var(--radius-sm) 0;margin-bottom:14px;">
            <div style="font-size:0.7rem;font-weight:700;color:var(--brand-secondary);text-transform:uppercase;">Weekly Practical Action:</div>
            <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:2px;">${mod.exercise}</div>
          </div>
        </div>

        <button class="btn btn-outline" style="width:100%;font-size:0.82rem;padding:8px;" onclick="showToast('Lesson player opened for ${mod.title}', 'info')">
          Start Lesson & Practice →
        </button>
      </div>
    `).join('');
  },

  bindEvents() {
    const diagnosticBtn = document.getElementById('btn-submit-lifeskills-quiz');
    diagnosticBtn?.addEventListener('click', async () => {
      const qSpeaking = document.getElementById('diag-speaking')?.value || 3;
      const qFinance = document.getElementById('diag-finance')?.value || 2;
      const qAnxiety = document.getElementById('diag-anxiety')?.value || 3;
      const qTime = document.getElementById('diag-time')?.value || 4;
      const qLogic = document.getElementById('diag-logic')?.value || 4;

      const resultArea = document.getElementById('lifeskills-diagnostic-result');
      if (!resultArea) return;

      try {
        const res = await API.submitLifeSkillsDiagnostic({
          publicSpeaking: qSpeaking,
          finance: qFinance,
          anxiety: qAnxiety,
          timeMgmt: qTime,
          logic: qLogic
        });

        if (res.success) {
          resultArea.innerHTML = `
            <div style="background:var(--bg-surface-secondary);border:1px solid rgba(104,87,245,0.3);border-radius:var(--radius-md);padding:20px;margin-top:16px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                <div>
                  <h4 style="font-size:1.1rem;font-weight:700;color:var(--text-primary);">Diagnostic Evaluation</h4>
                  <p style="font-size:0.82rem;color:var(--text-muted);">Overall Competency: <strong style="color:var(--brand-primary);">${res.level}</strong></p>
                </div>
                <div style="font-size:1.6rem;font-weight:900;color:var(--status-success);">${res.score}%</div>
              </div>
              <div style="font-size:0.82rem;font-weight:700;color:var(--brand-secondary);text-transform:uppercase;margin-bottom:6px;">Targeted Growth Priorities:</div>
              <ul style="padding-left:18px;margin:0;font-size:0.85rem;color:var(--text-secondary);line-height:1.6;">
                ${(res.recommendations || []).map(r => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          `;
          showToast('Self-assessment calculated!', 'success');
        }
      } catch (e) {
        showToast('Assessment evaluation failed', 'error');
      }
    });
  }
};

window.LifeSkillsView = LifeSkillsView;


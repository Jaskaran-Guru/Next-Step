/**
 * PW SAARTHI AI DOUBT SOLVER VIEW CONTROLLER
 * 24x7 intelligent query resolution with step-by-step reasoning and MongoDB persistence
 */

const DoubtsView = {
  currentSubject: 'Physics',
  doubtsHistory: [],

  async init() {
    this.bindEvents();
    await this.loadDoubtHistory();
  },

  bindEvents() {
    // Subject chips selection
    const chipsContainer = document.getElementById('doubt-subject-chips');
    chipsContainer?.addEventListener('click', (e) => {
      const chip = e.target.closest('.subject-chip');
      if (!chip) return;
      chipsContainer.querySelectorAll('.subject-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      this.currentSubject = chip.getAttribute('data-subject');
    });

    // Ask doubt button
    const askBtn = document.getElementById('ask-doubt-btn');
    const inputEl = document.getElementById('doubt-question-input');

    askBtn?.addEventListener('click', async () => {
      const text = inputEl.value.trim();
      if (!text) {
        showToast('Please type your doubt or question', 'error');
        return;
      }

      askBtn.disabled = true;
      askBtn.innerHTML = `<span>Thinking...</span>`;

      try {
        const res = await API.askDoubt(text, this.currentSubject);
        if (res.success && res.doubt) {
          showToast(res.message, 'success');
          this.renderSolution(res.doubt);
          inputEl.value = '';
          await AppState.initUser();
          await this.loadDoubtHistory();
        }
      } catch (err) {
        showToast('Could not resolve doubt. Please retry.', 'error');
      } finally {
        askBtn.disabled = false;
        askBtn.innerHTML = `<i data-lucide="sparkles"></i> Ask Saarthi`;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  },

  renderSolution(doubt) {
    const container = document.getElementById('saarthi-solution-container');
    if (!container) return;

    container.innerHTML = `
      <div class="solution-display-card">
        <div class="solution-header">
          <span class="solution-badge">
            <i data-lucide="check-check" style="width: 14px; height: 14px;"></i> Resolved by Saarthi AI (${doubt.subject})
          </span>
          <button class="btn btn-secondary" onclick="DoubtsView.upvote('${doubt._id}')" style="padding: 4px 12px; font-size: 0.78rem;">
            👍 Helpful (${doubt.helpfulVotes || 0})
          </button>
        </div>

        <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 12px; color: #fff;">
          Q: ${doubt.questionText}
        </div>

        <div class="solution-summary">
          ${doubt.solutionText}
        </div>

        <div style="margin-top: 18px;">
          ${(doubt.stepBreakdown || []).map(step => `
            <div class="step-card">
              <div class="step-heading">Step ${step.stepNumber}: ${step.heading}</div>
              <div class="step-content">${step.content}</div>
            </div>
          `).join('')}
        </div>

        ${doubt.conceptFormula ? `
          <div class="formula-highlight-box">
            <span style="font-size: 1.2rem;">📐</span>
            <div>
              <div style="font-size: 0.72rem; font-weight: 800; color: var(--accent-amber); text-transform: uppercase;">Master Formula / Concept Law</div>
              <code>${doubt.conceptFormula}</code>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  async loadDoubtHistory() {
    try {
      const res = await API.getDoubtHistory();
      if (res.success) {
        this.doubtsHistory = res.doubts;
        this.renderHistory();
      }
    } catch (err) {
      console.warn('Could not load doubt history');
    }
  },

  renderHistory() {
    const container = document.getElementById('doubt-history-container');
    if (!container) return;

    if (this.doubtsHistory.length === 0) {
      container.innerHTML = `<div style="color: var(--text-muted); font-size: 0.82rem; text-align: center; padding: 20px;">No doubts asked yet.<br>Ask any physics, chemistry or math doubt!</div>`;
      return;
    }

    container.innerHTML = this.doubtsHistory.map(d => `
      <div class="history-item" onclick="DoubtsView.showHistoricalDoubt('${d._id}')">
        <div class="history-subject-tag">${d.subject} • ${new Date(d.createdAt).toLocaleDateString()}</div>
        <div class="history-question-preview">${d.questionText}</div>
      </div>
    `).join('');
  },

  showHistoricalDoubt(doubtId) {
    const found = this.doubtsHistory.find(d => d._id === doubtId);
    if (found) {
      this.renderSolution(found);
    }
  },

  async upvote(doubtId) {
    try {
      const res = await API.upvoteDoubt(doubtId);
      if (res.success) {
        showToast('Thanks for your feedback! 👍', 'info');
        await this.loadDoubtHistory();
      }
    } catch (err) {}
  }
};

window.DoubtsView = DoubtsView;

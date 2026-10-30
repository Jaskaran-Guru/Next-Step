/**
 * DAILY PRACTICE PROBLEMS (DPP) VIEW CONTROLLER
 * Interactive MCQ practice, immediate evaluation, and persistent scoring in MongoDB
 */

const DppView = {
  currentDpp: null,
  currentSubmission: null,
  userAnswers: {},

  async loadDppForLecture(lectureId) {
    try {
      const res = await API.getDppForLecture(lectureId);
      if (res.success && res.dpp) {
        this.currentDpp = res.dpp;
        this.currentSubmission = res.submission;
        this.userAnswers = {};
        this.renderDpp();
      }
    } catch (err) {
      console.warn('No DPP found for lecture');
    }
  },

  renderDpp() {
    const container = document.getElementById('dpp-container');
    if (!container) return;

    if (!this.currentDpp) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; background: var(--bg-secondary); border-radius: var(--radius-lg);">
          <div style="font-size: 2.8rem; margin-bottom: 12px;">📝</div>
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">Select a lecture to solve its DPP</h3>
          <p style="color: var(--text-secondary); margin-bottom: 18px;">Each lecture in Lakshya, Yakeen & Arjuna includes a 5-10 question DPP with video solutions.</p>
          <button class="btn btn-primary" onclick="window.switchView('classroom')">Go to Classroom</button>
        </div>
      `;
      return;
    }

    const isSubmitted = !!this.currentSubmission;

    container.innerHTML = `
      <!-- DPP Header Card -->
      <div class="lecture-meta-card" style="margin-bottom: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div>
            <span class="batch-badge" style="position: static; display: inline-block; margin-bottom: 6px;">${this.currentDpp.subjectName || 'PHYSICS'}</span>
            <h2 style="font-size: 1.25rem; font-weight: 800; color: #fff;">${this.currentDpp.title}</h2>
          </div>
          ${isSubmitted ? `
            <div class="stat-pill" style="background: rgba(16, 185, 129, 0.2); border-color: var(--accent-emerald); color: var(--accent-emerald);">
              <span>Score: ${this.currentSubmission.score} / ${this.currentSubmission.maxScore} (${this.currentSubmission.accuracyPercentage}% Accuracy)</span>
            </div>
          ` : ''}
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; gap: 16px;">
          <span>📋 ${this.currentDpp.totalQuestions} Questions</span>
          <span>⏱ ${this.currentDpp.durationMinutes} Minutes</span>
          <span>🎯 +${this.currentDpp.marksPerQuestion} / -${this.currentDpp.negativeMarks} Marks</span>
        </div>
      </div>

      <!-- Questions List -->
      <div id="dpp-questions-list">
        ${this.currentDpp.questions.map((q, idx) => {
          const userSubAnswer = this.currentSubmission?.answers?.find(a => a.questionId === q.questionId);
          const selectedOpt = userSubAnswer ? userSubAnswer.selectedOption : this.userAnswers[q.questionId];

          return `
            <div class="lecture-meta-card" style="margin-bottom: 20px;" data-q-id="${q.questionId}">
              <div class="question-meta-row">
                <span class="question-number-badge">Question ${idx + 1}</span>
                <span style="font-size: 0.75rem; padding: 2px 8px; border-radius: var(--radius-sm); background: var(--bg-tertiary); color: var(--text-secondary);">${q.difficulty || 'Medium'}</span>
              </div>
              <div class="question-text-box" style="margin-bottom: 18px;">
                ${q.text}
              </div>

              <div class="options-list" style="margin-bottom: 16px;">
                ${q.options.map((opt, oIdx) => {
                  let optClass = '';
                  if (isSubmitted) {
                    if (oIdx === q.correctOption) optClass = 'selected' ; // correct
                    if (selectedOpt === oIdx && selectedOpt !== q.correctOption) optClass = 'wrong-selected';
                  } else {
                    if (selectedOpt === oIdx) optClass = 'selected';
                  }

                  const letter = String.fromCharCode(65 + oIdx);

                  return `
                    <div class="option-item ${optClass}" onclick="${isSubmitted ? '' : `DppView.selectOption(${q.questionId}, ${oIdx})`}" style="${isSubmitted && oIdx === q.correctOption ? 'border-color: var(--accent-emerald); background: rgba(16, 185, 129, 0.15);' : ''}">
                      <div class="option-circle" style="${isSubmitted && oIdx === q.correctOption ? 'background: var(--accent-emerald); border-color: var(--accent-emerald); color: #fff;' : ''}">${letter}</div>
                      <div class="option-text">${opt}</div>
                    </div>
                  `;
                }).join('')}
              </div>

              ${isSubmitted ? `
                <div style="background: rgba(15, 23, 42, 0.8); border-left: 3px solid var(--accent-cyan); border-radius: var(--radius-sm); padding: 12px 16px; margin-top: 12px;">
                  <div style="font-size: 0.78rem; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase; margin-bottom: 4px;">Kota Faculty Solution</div>
                  <div style="font-size: 0.85rem; color: #cbd5e1; line-height: 1.45;">${q.explanation}</div>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>

      <!-- Action Footer -->
      <div style="text-align: right; margin-top: 28px;">
        ${!isSubmitted ? `
          <button class="btn btn-primary" onclick="DppView.submitDpp()" style="padding: 12px 32px; font-size: 1rem;">
            <i data-lucide="send"></i> Submit DPP Answers
          </button>
        ` : `
          <button class="btn btn-secondary" onclick="DppView.reAttempt()" style="padding: 10px 24px;">
            <i data-lucide="rotate-ccw"></i> Re-attempt DPP
          </button>
        `}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  selectOption(questionId, optionIndex) {
    this.userAnswers[questionId] = optionIndex;
    this.renderDpp();
  },

  async submitDpp() {
    if (!this.currentDpp) return;

    const answeredCount = Object.keys(this.userAnswers).length;
    if (answeredCount === 0) {
      showToast('Please select at least one answer before submitting', 'error');
      return;
    }

    try {
      const res = await API.submitDpp(this.currentDpp._id, this.userAnswers, 180);
      if (res.success) {
        this.currentSubmission = res.submission;
        showToast(res.message, 'success');
        await AppState.initUser();
        this.renderDpp();
      }
    } catch (err) {
      showToast('DPP submission failed', 'error');
    }
  },

  reAttempt() {
    this.currentSubmission = null;
    this.userAnswers = {};
    this.renderDpp();
  }
};

window.DppView = DppView;

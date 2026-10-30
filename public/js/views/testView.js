/**
 * ALL-INDIA CBT TEST SERIES (AITS) VIEW CONTROLLER
 * Full NTA computer-based exam simulator with timer, question palette, and All-India Rank scorecard
 */

const TestView = {
  tests: [],
  activeTest: null,
  activeQuestionIndex: 0,
  userResponses: {}, // { questionId: { selectedOption: 0, status: 'answered' } }
  timerInterval: null,
  remainingSeconds: 180 * 60,

  async init() {
    this.bindSimulatorEvents();
    await this.loadTests();
  },

  async loadTests() {
    try {
      const res = await API.getTests();
      if (res.success) {
        this.tests = res.tests;
        this.renderTestsList();
      }
    } catch (err) {
      console.error('Failed to load mock tests:', err);
    }
  },

  renderTestsList() {
    const container = document.getElementById('available-tests-grid');
    if (!container) return;

    if (this.tests.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No tests available currently.</div>`;
      return;
    }

    container.innerHTML = this.tests.map(test => `
      <div class="batch-card" data-test-id="${test._id}">
        <div class="batch-thumbnail" style="height: 130px; background: linear-gradient(135deg, rgba(37, 99, 235, 0.4), rgba(15, 23, 42, 0.9)); display: flex; align-items: center; justify-content: center;">
          <div style="font-size: 2.5rem;">🏆</div>
          <span class="batch-badge">${test.examType}</span>
          ${test.isAttempted ? `<span class="batch-rating" style="background: var(--accent-amber); color: #000;">Attempted • Score: ${test.lastScore}</span>` : ''}
        </div>
        <div class="batch-body">
          <div class="batch-tagline">${test.totalQuestions} Questions • ${test.durationMinutes} Minutes</div>
          <h3 class="batch-title">${test.title}</h3>
          
          <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 18px;">
            <div>• Pattern: Single Correct Multiple Choice</div>
            <div>• Marking: +4 Correct, -1 Incorrect</div>
            <div>• Live Aspirants: ${(test.totalAttempts || 24000).toLocaleString()}+</div>
          </div>

          <div class="batch-footer">
            <button class="btn btn-primary" style="width: 100%;" onclick="TestView.startExam('${test._id}')">
              ${test.isAttempted ? 'Re-take CBT Mock Test' : 'Start CBT Examination'}
            </button>
          </div>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  async startExam(testId) {
    try {
      const res = await API.getTestDetails(testId);
      if (res.success && res.test) {
        this.activeTest = res.test;
        this.activeQuestionIndex = 0;
        this.userResponses = {};
        this.remainingSeconds = (this.activeTest.durationMinutes || 180) * 60;

        // Initialize question statuses
        this.activeTest.questions.forEach(q => {
          this.userResponses[q.questionId] = {
            selectedOption: -1,
            status: 'not_visited'
          };
        });

        // Set first question to not_answered if visited
        if (this.activeTest.questions.length > 0) {
          this.userResponses[this.activeTest.questions[0].questionId].status = 'not_answered';
        }

        // Switch to simulator view
        document.getElementById('tests-list-view').style.display = 'none';
        document.getElementById('cbt-exam-simulator').style.display = 'block';
        document.getElementById('cbt-title-display').textContent = this.activeTest.title;

        this.startTimer();
        this.renderCurrentQuestion();
        this.renderPalette();
      }
    } catch (err) {
      showToast('Could not launch CBT test environment', 'error');
    }
  },

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const clockEl = document.getElementById('cbt-countdown-clock');

    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      if (this.remainingSeconds <= 0) {
        clearInterval(this.timerInterval);
        showToast('Time expired! Auto-submitting exam...', 'info');
        this.submitExam();
        return;
      }

      const hrs = Math.floor(this.remainingSeconds / 3600);
      const mins = Math.floor((this.remainingSeconds % 3600) / 60);
      const secs = this.remainingSeconds % 60;

      clockEl.textContent = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
  },

  renderCurrentQuestion() {
    if (!this.activeTest || !this.activeTest.questions) return;
    const q = this.activeTest.questions[this.activeQuestionIndex];
    if (!q) return;

    // Update Question Meta
    document.getElementById('cbt-q-number').textContent = `Question ${this.activeQuestionIndex + 1} (${q.subject} - ${q.section || 'Sec A'})`;
    document.getElementById('cbt-q-text').textContent = q.text;

    // Update Section Tabs Active State
    const sectionTabs = document.querySelectorAll('.cbt-section-tab');
    sectionTabs.forEach(t => {
      if (t.getAttribute('data-subject') === q.subject) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // Render Options
    const currentResp = this.userResponses[q.questionId];
    const selectedOpt = currentResp ? currentResp.selectedOption : -1;

    const optContainer = document.getElementById('cbt-options-container');
    optContainer.innerHTML = q.options.map((opt, idx) => {
      const isSelected = selectedOpt === idx;
      const letter = String.fromCharCode(65 + idx);
      return `
        <div class="option-item ${isSelected ? 'selected' : ''}" onclick="TestView.selectOption(${idx})">
          <div class="option-circle">${letter}</div>
          <div class="option-text">${opt}</div>
        </div>
      `;
    }).join('');
  },

  renderPalette() {
    const grid = document.getElementById('cbt-palette-buttons-grid');
    if (!grid || !this.activeTest) return;

    grid.innerHTML = this.activeTest.questions.map((q, idx) => {
      const resp = this.userResponses[q.questionId] || { status: 'not_visited' };
      const isActive = idx === this.activeQuestionIndex;
      return `
        <button class="palette-btn ${resp.status} ${isActive ? 'active-q' : ''}" onclick="TestView.jumpToQuestion(${idx})">
          ${idx + 1}
        </button>
      `;
    }).join('');
  },

  selectOption(optIdx) {
    const q = this.activeTest.questions[this.activeQuestionIndex];
    this.userResponses[q.questionId].selectedOption = optIdx;
    this.renderCurrentQuestion();
  },

  saveAndNext() {
    const q = this.activeTest.questions[this.activeQuestionIndex];
    const resp = this.userResponses[q.questionId];

    if (resp.selectedOption !== -1) {
      resp.status = 'answered';
    } else {
      resp.status = 'not_answered';
    }

    this.advanceQuestion();
  },

  markForReview() {
    const q = this.activeTest.questions[this.activeQuestionIndex];
    const resp = this.userResponses[q.questionId];
    resp.status = 'review';
    this.advanceQuestion();
  },

  clearResponse() {
    const q = this.activeTest.questions[this.activeQuestionIndex];
    this.userResponses[q.questionId].selectedOption = -1;
    this.userResponses[q.questionId].status = 'not_answered';
    this.renderCurrentQuestion();
    this.renderPalette();
  },

  advanceQuestion() {
    if (this.activeQuestionIndex < this.activeTest.questions.length - 1) {
      this.activeQuestionIndex++;
      const nextQ = this.activeTest.questions[this.activeQuestionIndex];
      if (this.userResponses[nextQ.questionId].status === 'not_visited') {
        this.userResponses[nextQ.questionId].status = 'not_answered';
      }
    }
    this.renderCurrentQuestion();
    this.renderPalette();
  },

  jumpToQuestion(index) {
    this.activeQuestionIndex = index;
    const q = this.activeTest.questions[index];
    if (this.userResponses[q.questionId].status === 'not_visited') {
      this.userResponses[q.questionId].status = 'not_answered';
    }
    this.renderCurrentQuestion();
    this.renderPalette();
  },

  bindSimulatorEvents() {
    document.getElementById('cbt-btn-save-next')?.addEventListener('click', () => this.saveAndNext());
    document.getElementById('cbt-btn-review')?.addEventListener('click', () => this.markForReview());
    document.getElementById('cbt-btn-clear')?.addEventListener('click', () => this.clearResponse());
    document.getElementById('cbt-btn-submit-exam')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to finish and submit the examination?')) {
        this.submitExam();
      }
    });

    // Section Switching
    document.getElementById('cbt-sections-container')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.cbt-section-tab');
      if (!btn || !this.activeTest) return;
      const subject = btn.getAttribute('data-subject');
      const targetIdx = this.activeTest.questions.findIndex(q => q.subject === subject);
      if (targetIdx !== -1) {
        this.jumpToQuestion(targetIdx);
      }
    });
  },

  async submitExam() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    try {
      const timeSpent = (this.activeTest.durationMinutes * 60) - this.remainingSeconds;
      const res = await API.submitTest(this.activeTest._id, this.userResponses, timeSpent);

      if (res.success && res.submission) {
        showToast(res.message, 'success');
        await AppState.initUser();

        // Show Scorecard Modal
        this.showScorecard(res.submission, res.fullQuestions);

        // Reset Simulator
        document.getElementById('cbt-exam-simulator').style.display = 'none';
        document.getElementById('tests-list-view').style.display = 'block';
        await this.loadTests();
      }
    } catch (err) {
      showToast('Exam submission failed', 'error');
    }
  },

  showScorecard(sub, questions) {
    const modal = document.getElementById('scorecard-modal');
    const body = document.getElementById('scorecard-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
      <div class="scorecard-header">
        <div class="scorecard-hero">${sub.totalScore} <span style="font-size: 1.5rem; color: var(--text-muted);">/ ${sub.maxMarks}</span></div>
        <p style="font-size: 1rem; color: var(--accent-emerald); font-weight: 700;">Score Recorded in MongoDB Atlas</p>
      </div>

      <div class="scorecard-grid">
        <div class="scorecard-stat-box">
          <div class="stat-box-val" style="color: var(--accent-amber);">AIR ${sub.allIndiaRank}</div>
          <div class="stat-box-lbl">Projected Rank</div>
        </div>
        <div class="scorecard-stat-box">
          <div class="stat-box-val" style="color: var(--accent-cyan);">${sub.percentile}%</div>
          <div class="stat-box-lbl">NTA Percentile</div>
        </div>
        <div class="scorecard-stat-box">
          <div class="stat-box-val" style="color: var(--accent-emerald);">${sub.accuracyPercentage}%</div>
          <div class="stat-box-lbl">Accuracy</div>
        </div>
      </div>

      <div class="lecture-meta-card" style="margin-top: 14px; padding: 16px;">
        <h4 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 10px;">Subject-wise Score Breakdown</h4>
        <div style="display: flex; gap: 14px; justify-content: space-around;">
          ${Object.entries(sub.subjectBreakdown || {}).map(([subj, data]) => `
            <div style="text-align: center;">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">${subj}</div>
              <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${data.score} Marks</div>
              <div style="font-size: 0.72rem; color: var(--accent-emerald);">${data.correct} Correct • ${data.wrong} Wrong</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <button class="btn btn-primary" onclick="window.closeScorecardModal()">Close & Review Answers</button>
      </div>
    `;

    modal.classList.add('active');
  }
};

window.TestView = TestView;
window.closeScorecardModal = () => {
  document.getElementById('scorecard-modal')?.classList.remove('active');
};

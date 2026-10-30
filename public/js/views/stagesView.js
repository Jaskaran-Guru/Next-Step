/**
 * LIFE-STAGE & CAREER NAVIGATOR (BIRTH TO CAREER) VIEW CONTROLLER
 * NextStep OS - Empowering parents from child's birth, schooling, stream selection,
 * high-ROI college degrees to zero-unemployment careers.
 */

const StagesView = {
  stages: [],
  activeStageKey: 'playway_1_4',
  savedRoadmaps: [],

  async init() {
    this.bindEvents();
    await this.loadStages();
    await this.loadSavedRoadmaps();
  },

  async loadStages() {
    try {
      const res = await API.getStages();
      if (res.success && res.stages && res.stages.length > 0) {
        this.stages = res.stages;
        this.renderStageSelector();
        this.renderActiveStage();
      }
    } catch (err) {
      console.error('Failed to load life stages:', err);
    }
  },

  renderStageSelector() {
    const container = document.getElementById('stage-pills-bar');
    if (!container) return;

    container.innerHTML = this.stages.map(stg => {
      const isActive = stg.stageKey === this.activeStageKey;
      return `
        <button class="filter-pill ${isActive ? 'active' : ''}" onclick="StagesView.switchStage('${stg.stageKey}')">
          ${stg.ageGroup}
        </button>
      `;
    }).join('');
  },

  switchStage(stageKey) {
    this.activeStageKey = stageKey;
    this.renderStageSelector();
    this.renderActiveStage();
  },

  renderActiveStage() {
    const stage = this.stages.find(s => s.stageKey === this.activeStageKey);
    if (!stage) return;

    const detailContainer = document.getElementById('stage-details-content');
    if (!detailContainer) return;

    // Stream selector matrix (if Class 9-10 or College)
    const hasPathways = stage.futureCareerPathways && stage.futureCareerPathways.length > 0;

    detailContainer.innerHTML = `
      <!-- Active Stage Hero Banner -->
      <div class="hero-banner" style="margin-bottom: 24px;">
        <div class="hero-content">
          <span class="hero-badge">${stage.badge} • ${stage.ageGroup}</span>
          <h2 class="hero-title" style="font-size: 1.85rem;">${stage.title}</h2>
          <p class="hero-desc">${stage.tagline}</p>
          <div style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin-top: 10px;">
            ${stage.overview}
          </div>
        </div>
      </div>

      <!-- Common Parent Concerns & Solutions -->
      <div class="lecture-meta-card" style="margin-bottom: 24px; border-left: 4px solid var(--brand-secondary);">
        <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 12px;">
          👨‍👩‍👧 Common Parent Dilemmas at this Age & Scientific Approach
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
          ${(stage.parentConcerns || []).map(pc => `
            <div style="background: var(--bg-surface-secondary); padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); display: flex; align-items: center; gap: 8px;">
              <span style="color: var(--status-warning);">⚠️</span> ${pc}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Core Subjects, Playway & Practical Activities -->
      <div class="section-header">
        <div>
          <h3 class="section-title"><i data-lucide="book-open" style="color: var(--brand-primary);"></i> Learning Areas & Essential Activities</h3>
          <p class="section-subtitle">What your child should be practicing daily at this stage</p>
        </div>
      </div>

      <div class="batches-grid" style="margin-bottom: 32px;">
        ${(stage.subjectsAndActivities || []).map(act => `
          <div class="batch-card">
            <div class="batch-body">
              <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">${act.title}</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.5;">${act.description}</p>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto;">
                ${(act.skillsDeveloped || []).map(sk => `
                  <span style="font-size: 0.72rem; padding: 2px 8px; border-radius: var(--radius-sm); background: var(--bg-surface-secondary); color: var(--brand-accent); font-weight: 700; border: 1px solid var(--border-color);">
                    ✓ ${sk}
                  </span>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Personality Development & Character Blueprint -->
      <div class="section-header">
        <div>
          <h3 class="section-title"><i data-lucide="shield-check" style="color: var(--brand-secondary);"></i> Personality Development & Character Habits</h3>
          <p class="section-subtitle">Building emotional resilience, confidence, and self-discipline beyond academics</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 18px; margin-bottom: 32px;">
        ${(stage.personalityDevelopment || []).map(p => `
          <div class="saved-note-item" style="padding: 18px;">
            <div style="font-size: 0.95rem; font-weight: 800; color: var(--brand-secondary); margin-bottom: 6px;">
              🌟 ${p.trait}
            </div>
            <div style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 10px;">
              ${p.guideline}
            </div>
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--brand-primary); background: rgba(37, 99, 235, 0.08); padding: 6px 10px; border-radius: var(--radius-sm); border: 1px solid rgba(37, 99, 235, 0.2);">
              🎯 Parent Habit: ${p.actionableHabit}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Future Stream / Career Pathways (If applicable) -->
      ${hasPathways ? `
        <div class="section-header">
          <div>
            <h3 class="section-title"><i data-lucide="trending-up" style="color: var(--status-success);"></i> High-ROI Degree & Zero-Unemployment Pathways</h3>
            <p class="section-subtitle">Choosing future-proof streams, degrees, and skill-stacks so your child never faces unemployment</p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
          ${(stage.futureCareerPathways || []).map(path => `
            <div class="lecture-meta-card" style="margin-top: 0; border-left: 4px solid var(--brand-primary);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">${path.pathwayName}</h4>
                <span class="batch-badge" style="position: static; background: rgba(22, 163, 74, 0.15); color: var(--status-success); border-color: rgba(22, 163, 74, 0.3);">
                  ${path.roiOutlook}
                </span>
              </div>
              <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 14px;">
                <strong>Best Suited For:</strong> ${path.suitableFor}
              </p>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 0.82rem;">
                <div style="background: var(--bg-surface-secondary); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                  <strong style="color: var(--brand-primary); display: block; margin-bottom: 6px;">🎓 High-Value Recommended Degrees:</strong>
                  <ul style="padding-left: 18px; color: var(--text-secondary); line-height: 1.5;">
                    ${(path.degreesRecommended || []).map(d => `<li>${d}</li>`).join('')}
                  </ul>
                </div>
                <div style="background: var(--bg-surface-secondary); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                  <strong style="color: var(--brand-accent); display: block; margin-bottom: 6px;">⚡ Critical AI-Proof Skills Needed:</strong>
                  <ul style="padding-left: 18px; color: var(--text-secondary); line-height: 1.5;">
                    ${(path.inDemandSkills || []).map(s => `<li>${s}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  bindEvents() {
    const askAdvisorBtn = document.getElementById('ask-advisor-btn');
    const childNameInput = document.getElementById('advisor-child-name');
    const childAgeInput = document.getElementById('advisor-child-age');
    const queryInput = document.getElementById('advisor-query-input');

    askAdvisorBtn?.addEventListener('click', async () => {
      const parentQuery = queryInput.value.trim();
      if (!parentQuery) {
        showToast('Please enter your question or concern for the advisor', 'error');
        return;
      }

      askAdvisorBtn.disabled = true;
      askAdvisorBtn.innerHTML = `<span>Architecting Plan...</span>`;

      try {
        const res = await API.askStageAdvisor(
          childNameInput.value.trim() || 'My Child',
          childAgeInput.value.trim() || 'Current Stage',
          this.activeStageKey,
          parentQuery
        );

        if (res.success && res.roadmap) {
          showToast(res.message, 'success');
          this.renderAdvisorResponse(res.roadmap);
          queryInput.value = '';
          await this.loadSavedRoadmaps();
        }
      } catch (err) {
        showToast('Failed to generate roadmap', 'error');
      } finally {
        askAdvisorBtn.disabled = false;
        askAdvisorBtn.innerHTML = `<i data-lucide="sparkles"></i> Generate Personalized Child Roadmap`;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  },

  renderAdvisorResponse(roadmap) {
    const container = document.getElementById('advisor-results-container');
    if (!container) return;

    const analysis = roadmap.aiAnalysis;

    container.innerHTML = `
      <div class="solution-display-card" style="border-color: var(--brand-secondary); margin-top: 24px;">
        <div class="solution-header">
          <span class="solution-badge">
            <i data-lucide="shield-check" style="width: 14px; height: 14px;"></i> Saarthi Life-Stage & Career Blueprint (${roadmap.childName})
          </span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Saved to MongoDB Atlas</span>
        </div>

        <div class="solution-summary" style="font-weight: 600;">
          ${analysis.summary}
        </div>

        <!-- Immediate Steps -->
        <div style="margin: 18px 0;">
          <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--brand-primary); margin-bottom: 8px;">
            📌 Immediate Action Plan:
          </h4>
          ${(analysis.immediateNextSteps || []).map((step, idx) => `
            <div class="step-card" style="border-left-color: var(--brand-primary);">
              <div class="step-content"><strong>Action ${idx + 1}:</strong> ${step}</div>
            </div>
          `).join('')}
        </div>

        <!-- Personality & Habits -->
        <div style="margin: 18px 0;">
          <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--brand-secondary); margin-bottom: 8px;">
            🌱 Personality & Character Development:
          </h4>
          ${(analysis.personalityAndHabits || []).map((hab, idx) => `
            <div class="step-card" style="border-left-color: var(--brand-secondary);">
              <div class="step-content"><strong>Trait ${idx + 1}:</strong> ${hab}</div>
            </div>
          `).join('')}
        </div>

        <!-- Academic Milestones -->
        <div style="margin: 18px 0;">
          <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--brand-accent); margin-bottom: 8px;">
            📚 Academic & School Progression:
          </h4>
          ${(analysis.academicRoadmap || []).map((milestone, idx) => `
            <div class="step-card" style="border-left-color: var(--brand-accent);">
              <div class="step-content"><strong>Milestone ${idx + 1}:</strong> ${milestone}</div>
            </div>
          `).join('')}
        </div>

        <!-- Zero Unemployment Guarantee Architecture -->
        <div class="formula-highlight-box" style="border-color: var(--status-success); background: rgba(22, 163, 74, 0.08); flex-direction: column; align-items: flex-start;">
          <div style="font-size: 0.85rem; font-weight: 800; color: var(--status-success); text-transform: uppercase;">
            🛡️ Zero-Unemployment Immunity Architecture:
          </div>
          <div style="font-size: 0.88rem; color: var(--text-primary); line-height: 1.5; margin-top: 6px;">
            ${analysis.unemploymentImmunityPlan}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    container.scrollIntoView({ behavior: 'smooth' });
  },

  async loadSavedRoadmaps() {
    try {
      const res = await API.getSavedRoadmaps();
      if (res.success && res.roadmaps) {
        this.savedRoadmaps = res.roadmaps;
        this.renderSavedRoadmaps();
      }
    } catch (err) {}
  },

  renderSavedRoadmaps() {
    const container = document.getElementById('saved-roadmaps-list');
    if (!container) return;

    if (this.savedRoadmaps.length === 0) {
      container.innerHTML = `<div style="color: var(--text-muted); font-size: 0.82rem; text-align: center; padding: 20px;">No saved child roadmaps yet.<br>Ask your query above to generate one!</div>`;
      return;
    }

    container.innerHTML = this.savedRoadmaps.map(r => `
      <div class="history-item" onclick="StagesView.displayHistoricalRoadmap('${r._id}')">
        <div class="history-subject-tag">${r.childName} • ${r.childAge}</div>
        <div class="history-question-preview">${r.parentConcernOrQuery}</div>
      </div>
    `).join('');
  },

  displayHistoricalRoadmap(id) {
    const found = this.savedRoadmaps.find(r => r._id === id);
    if (found) {
      this.renderAdvisorResponse(found);
    }
  }
};

window.StagesView = StagesView;

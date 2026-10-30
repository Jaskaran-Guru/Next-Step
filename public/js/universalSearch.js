/**
 * NEXTSTEP OS - UNIVERSAL AI SEARCH ENGINE
 * ========================================
 * Context-aware natural language education query resolver powered by Gemini AI
 */

const UniversalSearch = {
  isSearching: false,

  init() {
    this.bindSearchInputs();
  },

  bindSearchInputs() {
    const headerInput = document.getElementById('global-search-input');
    if (headerInput) {
      headerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && headerInput.value.trim().length > 2) {
          e.preventDefault();
          this.openModal(headerInput.value.trim());
        }
      });
      // Click on search icon or input opens modal if empty or on focus
      headerInput.addEventListener('click', () => {
        if (!headerInput.value.trim()) {
          this.openModal();
        }
      });
    }

    // Header AI button
    const aiSearchBtn = document.getElementById('header-ai-search-btn');
    if (aiSearchBtn) {
      aiSearchBtn.addEventListener('click', () => this.openModal());
    }

    // Modal close button
    const closeBtn = document.getElementById('universal-search-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    // Modal search form
    const modalForm = document.getElementById('universal-search-form');
    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('universal-search-modal-input');
        if (input && input.value.trim()) {
          this.executeSearch(input.value.trim());
        }
      });
    }

    // Example chip clicks
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('.ai-search-suggestion-chip');
      if (chip) {
        const query = chip.getAttribute('data-query');
        if (query) {
          this.openModal(query);
          this.executeSearch(query);
        }
      }
    });
  },

  openModal(prefillQuery = '') {
    const modal = document.getElementById('universal-search-modal');
    const input = document.getElementById('universal-search-modal-input');
    if (!modal) return;

    modal.classList.add('active');
    if (input) {
      input.value = prefillQuery;
      input.focus();
    }

    if (prefillQuery) {
      this.executeSearch(prefillQuery);
    }
  },

  closeModal() {
    const modal = document.getElementById('universal-search-modal');
    if (modal) modal.classList.remove('active');
  },

  async executeSearch(query) {
    if (this.isSearching) return;
    this.isSearching = true;

    const resultContainer = document.getElementById('universal-search-result-container');
    const loader = document.getElementById('universal-search-loading');
    const suggestions = document.getElementById('universal-search-suggestions');

    if (suggestions) suggestions.style.display = 'none';
    if (loader) loader.style.display = 'flex';
    if (resultContainer) resultContainer.innerHTML = '';

    const activeStage = window.StageEngine ? window.StageEngine.activeStageKey : 'entrance_prep_17_18';

    try {
      const res = await API.universalSearch(query, activeStage);
      if (loader) loader.style.display = 'none';

      if (res.success && res.result) {
        this.renderResult(res.result);
      } else {
        if (resultContainer) {
          resultContainer.innerHTML = `<div style="color:var(--status-error);padding:20px;text-align:center;">Could not generate answer. Please try again.</div>`;
        }
      }
    } catch (err) {
      if (loader) loader.style.display = 'none';
      if (resultContainer) {
        resultContainer.innerHTML = `<div style="color:var(--status-error);padding:20px;text-align:center;">Network error while contacting AI Assistant.</div>`;
      }
    } finally {
      this.isSearching = false;
    }
  },

  renderResult(data) {
    const container = document.getElementById('universal-search-result-container');
    if (!container) return;

    // Convert markdown bold and lists to HTML
    let formattedText = (data.directAnswer || '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n- /g, '<br>• ');

    container.innerHTML = `
      <div class="ai-response-card" style="background:var(--bg-surface-secondary);border:1px solid rgba(104,87,245,0.25);border-radius:var(--radius-lg);padding:24px;box-shadow:var(--shadow-md);">
        
        <!-- Header Banner -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.2rem;">✨</span>
            <span style="font-size:0.85rem;font-weight:700;color:var(--brand-primary);text-transform:uppercase;letter-spacing:0.05em;">
              NextStep Universal AI Guidance
            </span>
          </div>
          ${data.recommendedStage ? `
            <span style="font-size:0.75rem;font-weight:700;background:rgba(25,198,216,0.12);color:var(--brand-secondary);padding:4px 12px;border-radius:20px;border:1px solid rgba(25,198,216,0.3);">
              Target Stage: ${data.recommendedStage.replace(/_/g, ' ').toUpperCase()}
            </span>
          ` : ''}
        </div>

        <!-- Direct Answer Content -->
        <div style="font-size:0.92rem;color:var(--text-primary);line-height:1.65;margin-bottom:20px;">
          ${formattedText}
        </div>

        <!-- Key Highlights -->
        ${data.keyHighlights && data.keyHighlights.length > 0 ? `
          <div style="margin-bottom:20px;background:rgba(21,29,50,0.5);border:1px solid var(--border-subtle);padding:14px;border-radius:var(--radius-md);">
            <div style="font-size:0.72rem;font-weight:700;color:var(--brand-secondary);text-transform:uppercase;margin-bottom:8px;">
              Key Takeaways:
            </div>
            <ul style="padding-left:18px;margin:0;font-size:0.85rem;color:var(--text-secondary);line-height:1.5;">
              ${data.keyHighlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Recommended Actions -->
        ${data.suggestedActions && data.suggestedActions.length > 0 ? `
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
            ${data.suggestedActions.map(act => `
              <button class="btn btn-primary" style="font-size:0.82rem;padding:8px 16px;" onclick="UniversalSearch.handleAction('${act.action}', '${act.target}')">
                ${act.label} →
              </button>
            `).join('')}
          </div>
        ` : ''}

        <!-- Related Follow-Up Queries -->
        ${data.relatedQueries && data.relatedQueries.length > 0 ? `
          <div style="border-top:1px solid var(--border-subtle);padding-top:16px;">
            <div style="font-size:0.72rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">
              Explore Related Questions:
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              ${data.relatedQueries.map(q => `
                <button class="ai-search-suggestion-chip" data-query="${q}" style="font-size:0.78rem;background:var(--bg-surface);border:1px solid var(--border-subtle);color:var(--text-secondary);padding:6px 12px;border-radius:var(--radius-full);cursor:pointer;text-align:left;">
                  💡 ${q}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;
  },

  handleAction(action, target) {
    this.closeModal();
    if (action === 'switch_stage' && window.StageEngine) {
      window.StageEngine.applyStage(target);
      if (window.Router) window.Router.navigate('batches');
    } else if (action === 'open_view' && window.Router) {
      window.Router.navigate(target);
    }
  }
};

window.UniversalSearch = UniversalSearch;

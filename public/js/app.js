/**
 * MAIN APP CONTROLLER & ROUTER
 * NextStep (Physics Wallah Clone) — Stage-Adaptive OS
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Theme
  initTheme();

  // 2. Initialize Icons
  if (window.lucide) window.lucide.createIcons();

  // 3. Initialize App State & User Profile
  await AppState.initUser();

  // 4. Apply Life Stage (rewires entire app) — silent on boot
  const userStage = AppState.currentUser?.lifeStage || 'entrance_prep_17_18';
  StageEngine.applyStage(userStage, { silent: true });

  // 5. Show first-visit stage picker if stage is still default and localStorage shows no visit
  const hasVisited = localStorage.getItem('nextstep_visited');
  if (!hasVisited || !AppState.currentUser?.lifeStage) {
    setTimeout(() => openStagePickerModal(true), 800);
  }

  // 6. Initialize Views
  await BatchesView.init();
  ClassroomView.init();
  await TestView.init();
  await DoubtsView.init();
  await StagesView.init();
  await CareerView.init();
  await ParentView.init();
  await KhazanaView.init();
  await AnalyticsView.init();
  UniversalSearch.init();

  // 7. Bind Global Navigation
  bindNavigation();

  // 8. Bind Search & Profile
  bindSearchAndProfile();

  // 9. Bind Stage Picker & Profile Modal stage grid
  buildStagePickerGrid();
  buildProfileStageGrid();

  // 10. Check initial route from hash
  const initialHash = window.location.hash.replace('#', '') || 'batches';
  switchView(initialHash);
});

window.Router = {
  navigate(viewId) {
    switchView(viewId);
  }
};

// =====================================================================
// THEME
// =====================================================================
function initTheme() {
  const savedTheme = localStorage.getItem('nextstep_theme') || 'dark';
  applyTheme(savedTheme);

  const toggleBtn = document.getElementById('theme-toggle-btn');
  toggleBtn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('nextstep_theme', next);
    showToast(`Switched to ${next === 'dark' ? 'Dark AI Workspace' : 'Clean Light Mode'}`, 'info');
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');
  if (icon && label) {
    icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    label.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }
  if (window.lucide) window.lucide.createIcons();
}

// =====================================================================
// VIEW ROUTING
// =====================================================================
function switchView(viewId) {
  const views = document.querySelectorAll('.page-view');
  views.forEach(v => v.classList.remove('active'));

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const targetView = document.getElementById(`view-${viewId}`);
  const targetNav = document.querySelector(`.nav-item[data-view="${viewId}"]`);

  if (targetView) {
    targetView.classList.add('active');
    AppState.activeView = viewId;
    window.location.hash = viewId;
  }
  if (targetNav) targetNav.classList.add('active');

  if (viewId === 'my-study') BatchesView.renderMyBatchesGrid?.();
  else if (viewId === 'analytics') AnalyticsView.loadAnalytics?.();
  else if (viewId === 'tests') TestView.loadTests?.();
  else if (viewId === 'careers') CareerView.init?.();
  else if (viewId === 'parent') ParentView.init?.();

  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.lucide) window.lucide.createIcons();
}

function bindNavigation() {
  // Delegate on main wrapper since sidebar nav is dynamic
  document.getElementById('dynamic-nav-area')?.addEventListener('click', e => {
    const navItem = e.target.closest('.nav-item');
    if (navItem) { e.preventDefault(); switchView(navItem.getAttribute('data-view')); }
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'batches';
    if (hash !== AppState.activeView) switchView(hash);
  });
}

// =====================================================================
// STAGE PICKER MODAL
// =====================================================================
function buildStagePickerGrid() {
  const grid = document.getElementById('stage-picker-grid');
  if (!grid) return;

  const stages = StageEngine.getAllStages();
  grid.innerHTML = stages.map(cfg => `
    <div class="stage-picker-card" data-stage="${cfg.stageKey}" onclick="selectStage('${cfg.stageKey}')"
      style="display:flex;align-items:center;gap:16px;padding:14px 18px;border-radius:var(--radius-sm);
             border:2px solid var(--border-color);cursor:pointer;transition:all 0.2s;margin-bottom:8px;
             background:var(--bg-surface);">
      <div style="font-size:1.6rem;width:40px;text-align:center;flex-shrink:0;">${cfg.label.split(' ')[0]}</div>
      <div>
        <div style="font-weight:800;font-size:0.95rem;color:var(--text-primary);">${cfg.label.split(' ').slice(1).join(' ')}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px;">${cfg.heroDesc.slice(0, 80)}…</div>
        <div style="font-size:0.72rem;font-weight:700;color:${cfg.accentColor};margin-top:4px;font-style:italic;">${cfg.brandSubtitle}</div>
      </div>
    </div>
  `).join('');
}

function buildProfileStageGrid() {
  const grid = document.getElementById('profile-stage-grid');
  if (!grid) return;

  const stages = StageEngine.getAllStages();
  const active = StageEngine.activeStageKey;

  grid.innerHTML = stages.map(cfg => {
    const isActive = cfg.stageKey === active;
    return `
      <label style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:var(--radius-sm);
                    border:1.5px solid ${isActive ? cfg.accentColor : 'var(--border-color)'};
                    background:${isActive ? `rgba(${cfg.accentRgb}, 0.1)` : 'var(--bg-surface-secondary)'};
                    cursor:pointer;transition:all 0.2s;" class="profile-stage-option">
        <input type="radio" name="profile-stage" value="${cfg.stageKey}" ${isActive ? 'checked' : ''}
          style="accent-color:${cfg.accentColor};width:16px;height:16px;flex-shrink:0;"
          onchange="onProfileStageChange('${cfg.stageKey}')">
        <span style="font-size:1.1rem;">${cfg.label.split(' ')[0]}</span>
        <span style="font-size:0.85rem;font-weight:700;color:var(--text-primary);">${cfg.label.split(' ').slice(1).join(' ')}</span>
      </label>
    `;
  }).join('');
}

function onProfileStageChange(stageKey) {
  // Preview the stage in real-time as they hover over options
  StageEngine.applyStage(stageKey, { silent: true });
  // Rebuild to reflect new active state colors
  buildProfileStageGrid();
  // Update profile field visibility
  updateProfileFieldVisibility(stageKey);
}

function updateProfileFieldVisibility(stageKey) {
  const cfg = StageEngine.getConfig(stageKey);
  if (!cfg) return;
  const pf = cfg.profileFields;
  const classRow = document.getElementById('profile-current-class-row');
  const childAgeRow = document.getElementById('profile-child-age-row');
  const examRow = document.getElementById('profile-target-exam-row');
  if (classRow) classRow.style.display = pf.showCurrentClass ? 'block' : 'none';
  if (childAgeRow) childAgeRow.style.display = pf.showChildAge ? 'block' : 'none';
  if (examRow) examRow.style.display = pf.showTargetExam ? 'block' : 'none';
}

async function selectStage(stageKey) {
  localStorage.setItem('nextstep_visited', 'true');
  localStorage.setItem('nextstep_stage', stageKey);

  // Apply immediately
  StageEngine.applyStage(stageKey, { silent: true });

  // Update sidebar stage label
  const sidebarLabel = document.getElementById('sidebar-stage-label');
  const cfg = StageEngine.getConfig(stageKey);
  if (sidebarLabel) { sidebarLabel.textContent = cfg.label; sidebarLabel.style.color = cfg.accentColor; }

  // Persist to MongoDB
  try {
    const res = await API.updateProfile({ lifeStage: stageKey });
    if (res.success) AppState.currentUser = res.user;
  } catch (e) {}

  closeStagePickerModal();
  showToast(`✨ App experience updated: ${cfg.label}`, 'success');
}

window.openStagePickerModal = function(isFirstVisit = false) {
  buildStagePickerGrid(); // refresh
  const modal = document.getElementById('stage-picker-modal');
  if (modal) {
    modal.classList.add('active');
    // Add skip button only on revisit
    const footer = modal.querySelector('.stage-picker-footer');
    if (!isFirstVisit && !footer) {
      const box = modal.querySelector('.modal-box');
      const skipDiv = document.createElement('div');
      skipDiv.className = 'stage-picker-footer';
      skipDiv.style.cssText = 'padding:16px 32px;border-top:1px solid var(--border-color);text-align:right;';
      skipDiv.innerHTML = `<button class="btn btn-secondary" onclick="closeStagePickerModal()" style="font-size:0.82rem;">Cancel</button>`;
      box.appendChild(skipDiv);
    }
  }
};

function closeStagePickerModal() {
  document.getElementById('stage-picker-modal')?.classList.remove('active');
}

window.closeStagePickerModal = closeStagePickerModal;

// =====================================================================
// SEARCH & PROFILE BINDINGS
// =====================================================================
function bindSearchAndProfile() {
  const searchInput = document.getElementById('global-search-input');
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) { BatchesView.renderBatchesGrid?.(); return; }
    const filtered = BatchesView.batches.filter(b =>
      b.title.toLowerCase().includes(query) ||
      b.tagline.toLowerCase().includes(query) ||
      b.examCategory.toLowerCase().includes(query) ||
      (b.faculty || []).some(f => f.name.toLowerCase().includes(query) || f.subject.toLowerCase().includes(query))
    );
    const container = document.getElementById('batches-grid-container');
    if (container) {
      if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px;">No results for "${query}".</div>`;
      } else {
        const tmp = BatchesView.batches;
        BatchesView.batches = filtered;
        BatchesView.renderBatchesGrid();
        BatchesView.batches = tmp;
      }
    }
  });

  // Profile Modal Open
  document.getElementById('profile-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('profile-modal');
    if (!modal) return;
    if (AppState.currentUser) {
      document.getElementById('profile-modal-name').textContent = AppState.currentUser.name;
      document.getElementById('profile-modal-email').textContent = AppState.currentUser.email;
      const examSel = document.getElementById('profile-exam-select');
      if (examSel && AppState.currentUser.targetExam) examSel.value = AppState.currentUser.targetExam;
      const classIn = document.getElementById('profile-class-input');
      if (classIn && AppState.currentUser.currentClass) classIn.value = AppState.currentUser.currentClass;
      const childAgeIn = document.getElementById('profile-child-age-input');
      if (childAgeIn && AppState.currentUser.childAge) childAgeIn.value = AppState.currentUser.childAge;
    }
    buildProfileStageGrid();
    updateProfileFieldVisibility(StageEngine.activeStageKey);
    modal.classList.add('active');
  });

  // Profile Save
  document.getElementById('save-profile-btn')?.addEventListener('click', async () => {
    const targetExam = document.getElementById('profile-exam-select')?.value;
    const currentClass = document.getElementById('profile-class-input')?.value;
    const childAge = document.getElementById('profile-child-age-input')?.value || '';
    const selectedStageEl = document.querySelector('input[name="profile-stage"]:checked');
    const lifeStage = selectedStageEl?.value || StageEngine.activeStageKey;

    try {
      const res = await API.updateProfile({ targetExam, currentClass, lifeStage, childAge });
      if (res.success) {
        AppState.currentUser = res.user;
        AppState.updateHeaderUI();

        // Apply the potentially new stage
        if (lifeStage !== StageEngine.activeStageKey) {
          StageEngine.applyStage(lifeStage, { silent: true });
          localStorage.setItem('nextstep_stage', lifeStage);
        }
        const cfg = StageEngine.getConfig(lifeStage);
        const sidebarLabel = document.getElementById('sidebar-stage-label');
        if (sidebarLabel) { sidebarLabel.textContent = cfg.label; sidebarLabel.style.color = cfg.accentColor; }

        window.closeProfileModal();
        showToast('Profile saved to MongoDB! ✅', 'success');
      }
    } catch (err) {
      showToast('Profile update failed', 'error');
    }
  });
}

window.closeProfileModal = () => document.getElementById('profile-modal')?.classList.remove('active');
window.switchView = switchView;


/**
 * MAIN APP CONTROLLER & ROUTER
 * NextStep (Physics Wallah Clone)
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Theme
  initTheme();

  // 2. Initialize Icons
  if (window.lucide) window.lucide.createIcons();

  // 3. Initialize App State & User Profile
  await AppState.initUser();

  // 4. Initialize Views
  await BatchesView.init();
  ClassroomView.init();
  await TestView.init();
  await DoubtsView.init();
  await StagesView.init();
  await KhazanaView.init();
  await AnalyticsView.init();

  // 5. Bind Global Navigation
  bindNavigation();

  // 6. Bind Search, Profile & Theme Toggle
  bindSearchAndProfile();

  // 7. Check initial route from hash
  const initialHash = window.location.hash.replace('#', '') || 'batches';
  switchView(initialHash);
});

// Theme Management (Light & Dark Hybrid)
function initTheme() {
  const savedTheme = localStorage.getItem('nextstep_theme') || 'dark';
  applyTheme(savedTheme);

  const toggleBtn = document.getElementById('theme-toggle-btn');
  toggleBtn?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('nextstep_theme', newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark AI Workspace' : 'Clean Light Mode'}`, 'info');
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');

  if (icon && label) {
    if (theme === 'dark') {
      icon.setAttribute('data-lucide', 'sun');
      label.textContent = 'Light';
    } else {
      icon.setAttribute('data-lucide', 'moon');
      label.textContent = 'Dark';
    }
  }

  if (window.lucide) window.lucide.createIcons();
}

// View Routing Switcher
function switchView(viewId) {
  const views = document.querySelectorAll('.page-view');
  const navItems = document.querySelectorAll('.nav-item');

  // Deactivate all
  views.forEach(v => v.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));

  // Activate target
  const targetView = document.getElementById(`view-${viewId}`);
  const targetNav = document.querySelector(`.nav-item[data-view="${viewId}"]`);

  if (targetView) {
    targetView.classList.add('active');
    AppState.activeView = viewId;
    window.location.hash = viewId;
  }

  if (targetNav) {
    targetNav.classList.add('active');
  }

  // Refresh data on view enter
  if (viewId === 'my-study') {
    BatchesView.renderMyBatchesGrid();
  } else if (viewId === 'analytics') {
    AnalyticsView.loadAnalytics();
  } else if (viewId === 'tests') {
    TestView.loadTests();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.lucide) window.lucide.createIcons();
}

// Navigation event bindings
function bindNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = item.getAttribute('data-view');
      switchView(viewId);
    });
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'batches';
    if (hash !== AppState.activeView) {
      switchView(hash);
    }
  });
}

// Global Search & Profile Modals
function bindSearchAndProfile() {
  const searchInput = document.getElementById('global-search-input');
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      BatchesView.renderBatchesGrid();
      return;
    }

    const filtered = BatchesView.batches.filter(b => 
      b.title.toLowerCase().includes(query) ||
      b.tagline.toLowerCase().includes(query) ||
      b.examCategory.toLowerCase().includes(query) ||
      (b.faculty || []).some(f => f.name.toLowerCase().includes(query) || f.subject.toLowerCase().includes(query))
    );

    const container = document.getElementById('batches-grid-container');
    if (container) {
      if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No batches matching "${query}".</div>`;
      } else {
        const currentBatches = BatchesView.batches;
        BatchesView.batches = filtered;
        BatchesView.renderBatchesGrid();
        BatchesView.batches = currentBatches;
      }
    }
  });

  // Target Exam Select in Topbar
  const examSelect = document.getElementById('header-exam-selector');
  examSelect?.addEventListener('change', async (e) => {
    const newExam = e.target.value;
    try {
      const res = await API.updateProfile({ targetExam: newExam });
      if (res.success) {
        AppState.currentUser = res.user;
        showToast(`Target exam updated to ${newExam} in MongoDB! 🎯`, 'success');
        // Match filter pill if exists
        const matchingPill = Array.from(document.querySelectorAll('.filter-pill')).find(p => p.getAttribute('data-category') === newExam);
        if (matchingPill) matchingPill.click();
      }
    } catch (err) {}
  });

  // Profile Modal Open
  const profileBtn = document.getElementById('profile-btn');
  profileBtn?.addEventListener('click', () => {
    const modal = document.getElementById('profile-modal');
    if (!modal) return;
    if (AppState.currentUser) {
      document.getElementById('profile-modal-name').textContent = AppState.currentUser.name;
      document.getElementById('profile-modal-email').textContent = AppState.currentUser.email;
      document.getElementById('profile-exam-select').value = AppState.currentUser.targetExam || 'JEE Mains & Advanced';
      document.getElementById('profile-class-input').value = AppState.currentUser.currentClass || 'Class 12th';
    }
    modal.classList.add('active');
  });

  // Profile Modal Save
  const saveProfileBtn = document.getElementById('save-profile-btn');
  saveProfileBtn?.addEventListener('click', async () => {
    const targetExam = document.getElementById('profile-exam-select').value;
    const currentClass = document.getElementById('profile-class-input').value;

    try {
      const res = await API.updateProfile({ targetExam, currentClass });
      if (res.success) {
        AppState.currentUser = res.user;
        AppState.updateHeaderUI();
        window.closeProfileModal();
        showToast('Profile updated in MongoDB Atlas! 👤', 'success');
      }
    } catch (err) {
      showToast('Profile update failed', 'error');
    }
  });
}

window.closeProfileModal = () => {
  document.getElementById('profile-modal')?.classList.remove('active');
};

window.switchView = switchView;

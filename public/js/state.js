/**
 * CENTRAL APP STATE & EVENT SYSTEM
 */

const AppState = {
  currentUser: null,
  activeView: 'batches',
  activeBatch: null,
  activeLecture: null,
  activeTest: null,
  activeDpp: null,
  currentCategoryFilter: 'All',
  listeners: [],

  subscribe(listener) {
    this.listeners.push(listener);
  },

  notify(event, data) {
    this.listeners.forEach(fn => fn(event, data));
  },

  async initUser() {
    try {
      const res = await API.getProfile();
      if (res.success && res.user) {
        this.currentUser = res.user;
        this.updateHeaderUI();
        this.notify('user_updated', this.currentUser);
      }
    } catch (err) {
      console.warn('Could not fetch user profile:', err);
    }
  },

  updateHeaderUI() {
    if (!this.currentUser) return;
    const nameEl = document.getElementById('header-user-name');
    const avatarEl = document.getElementById('header-user-avatar');
    const streakEl = document.getElementById('header-streak-count');
    const coinsEl = document.getElementById('header-coins-count');
    const enrolledCountEl = document.getElementById('sidebar-enrolled-count');
    const examSelect = document.getElementById('header-exam-selector');

    if (nameEl) nameEl.textContent = this.currentUser.name.split(' ')[0];
    if (avatarEl && this.currentUser.avatar) avatarEl.src = this.currentUser.avatar;
    if (streakEl) streakEl.textContent = this.currentUser.streakDays || 14;
    if (coinsEl) coinsEl.textContent = this.currentUser.coins || 250;
    if (enrolledCountEl) enrolledCountEl.textContent = this.currentUser.enrolledBatches?.length || 0;
    if (examSelect && this.currentUser.targetExam) examSelect.value = this.currentUser.targetExam;
  }
};

window.AppState = AppState;

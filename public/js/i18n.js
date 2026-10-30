/**
 * NEXTSTEP OS - MULTILINGUAL LOCALIZATION (i18n)
 * ==============================================
 * Supports English, Hindi (हिंदी), and Hinglish
 */

const I18N_DICTIONARY = {
  en: {
    brandSubtitle: 'Physics Wallah OS',
    searchPlaceholder: "Ask anything: 'What after 10th?', 'Playway for 3yo', 'SDE after BTech'...",
    askAiBtn: 'Ask AI →',
    launchAiTutor: 'Launch AI Tutor →',
    exploreLearning: 'Explore Learning →',
    allStreams: 'All Streams',
    daysRemaining: 'Days Left'
  },
  hi: {
    brandSubtitle: 'फिजिक्स वाला ओएस',
    searchPlaceholder: 'कुछ भी पूछें: 10वीं के बाद क्या करें? 3 साल के बच्चे के खेल? बीटेक के बाद जॉब?',
    askAiBtn: 'AI से पूछें →',
    launchAiTutor: 'AI ट्यूटर शुरू करें →',
    exploreLearning: 'कोर्स देखें →',
    allStreams: 'सभी स्ट्रीम',
    daysRemaining: 'दिन शेष'
  },
  hinglish: {
    brandSubtitle: 'Physics Wallah OS',
    searchPlaceholder: 'Kuch bhi poochiye: 10th ke baad kya lein? 3-year baby activities? SDE job guide?',
    askAiBtn: 'AI se Poocho →',
    launchAiTutor: 'AI Tutor Kholo →',
    exploreLearning: 'Courses Dekho →',
    allStreams: 'Sabhi Streams',
    daysRemaining: 'Days Bache Hain'
  }
};

const I18nEngine = {
  currentLang: 'en',

  init() {
    const saved = localStorage.getItem('nextstep_lang') || 'en';
    this.setLanguage(saved, true);
    this.bindSelector();
  },

  setLanguage(lang, silent = false) {
    if (!I18N_DICTIONARY[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('nextstep_lang', lang);

    const dict = I18N_DICTIONARY[lang];
    const heroInput = document.getElementById('hero-ai-search-input');
    if (heroInput) heroInput.placeholder = dict.searchPlaceholder;

    const globalInput = document.getElementById('global-search-input');
    if (globalInput) globalInput.placeholder = dict.searchPlaceholder;

    const langLabel = document.getElementById('current-lang-label');
    if (langLabel) {
      langLabel.textContent = lang === 'hi' ? '🇮🇳 हिंदी' : lang === 'hinglish' ? '🗣️ Hinglish' : '🌐 English';
    }

    if (!silent) showToast(`Language changed to ${lang.toUpperCase()}`, 'info');
  },

  bindSelector() {
    const btn = document.getElementById('header-lang-btn');
    btn?.addEventListener('click', () => {
      const order = ['en', 'hi', 'hinglish'];
      const nextIdx = (order.indexOf(this.currentLang) + 1) % order.length;
      this.setLanguage(order[nextIdx]);
    });
  }
};

window.I18nEngine = I18nEngine;


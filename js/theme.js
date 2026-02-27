/**
 * theme.js — Dark/Light Toggle + Accent Color Switcher
 *
 * Preferensi disimpan di localStorage agar persisten antar sesi.
 * Cara ganti warna aksen default: ubah nilai 'defaultAccent' di bawah.
 */

(function ThemeModule() {
  const STORAGE_THEME  = 'pf-theme';
  const STORAGE_ACCENT = 'pf-accent';
  const DEFAULT_THEME  = 'dark';  // 'dark' | 'light'
  const DEFAULT_ACCENT = 'indigo'; // 'indigo' | 'cyan' | 'emerald'

  // ── Ambil preferensi dari localStorage atau gunakan default ──
  function getSavedTheme()  { return localStorage.getItem(STORAGE_THEME)  || DEFAULT_THEME; }
  function getSavedAccent() { return localStorage.getItem(STORAGE_ACCENT) || DEFAULT_ACCENT; }

  // ── Terapkan tema ke <html> element ──
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_THEME, theme);
    updateThemeToggleIcon(theme);
  }

  // ── Terapkan aksen ke <html> element ──
  function applyAccent(accent) {
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem(STORAGE_ACCENT, accent);
    updateAccentDots(accent);
  }

  // ── Update icon tombol toggle (moon/sun) ──
  function updateThemeToggleIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    // Icon SVG inline — sun untuk light, moon untuk dark
    if (theme === 'dark') {
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
      </svg>`;
      btn.setAttribute('aria-label', 'Aktifkan mode terang');
    } else {
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
      </svg>`;
      btn.setAttribute('aria-label', 'Aktifkan mode gelap');
    }
  }

  // ── Update visual active state dot pada accent switcher ──
  function updateAccentDots(activeAccent) {
    document.querySelectorAll('.accent-dot').forEach(dot => {
      dot.classList.toggle('active', dot.dataset.accent === activeAccent);
    });
  }

  // ── Inisialisasi saat DOM ready ──
  function init() {
    // Terapkan preferensi yang tersimpan
    applyTheme(getSavedTheme());
    applyAccent(getSavedAccent());

    // Event: tombol toggle tema
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    // Event: klik setiap dot aksen
    document.querySelectorAll('.accent-dot').forEach(dot => {
      dot.addEventListener('click', () => applyAccent(dot.dataset.accent));
    });
  }

  // Jalankan segera setelah DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * theme.js — Safe (no MutationObserver loop)
 * - Dark/Light + Accent saved in localStorage
 * - Works even if navbar injected later (event delegation + components:ready)
 */
(() => {
  const STORAGE_THEME = "pf-theme";
  const STORAGE_ACCENT = "pf-accent";

  const DEFAULT_THEME = "dark";
  const DEFAULT_ACCENT = "indigo";

  const sunIcon = `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" stroke="currentColor" stroke-width="2"/>
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M5 19l1.5-1.5"
        stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  const moonIcon = `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 13.2A8.2 8.2 0 0 1 10.8 3a7.2 7.2 0 1 0 10.2 10.2Z"
        stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `;

  const getTheme = () => localStorage.getItem(STORAGE_THEME) || DEFAULT_THEME;
  const getAccent = () => localStorage.getItem(STORAGE_ACCENT) || DEFAULT_ACCENT;

  function updateThemeToggleIcon(theme) {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    const desired = theme === "dark" ? sunIcon : moonIcon;
    // update hanya kalau beda (hindari kerja berulang)
    if (btn.__iconState !== theme) {
      btn.innerHTML = desired;
      btn.__iconState = theme;
    }
    btn.setAttribute("aria-label", theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap");
  }

  function updateAccentDots(activeAccent) {
    document.querySelectorAll(".accent-dot").forEach((dot) => {
      dot.classList.toggle("active", dot.dataset.accent === activeAccent);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_THEME, theme);
    syncUI();
  }

  function setAccent(accent) {
    document.documentElement.setAttribute("data-accent", accent);
    localStorage.setItem(STORAGE_ACCENT, accent);
    syncUI();
  }

  function syncUI() {
    const theme = document.documentElement.getAttribute("data-theme") || DEFAULT_THEME;
    const accent = document.documentElement.getAttribute("data-accent") || DEFAULT_ACCENT;
    updateThemeToggleIcon(theme);
    updateAccentDots(accent);
  }

  function init() {
    // apply saved
    setTheme(getTheme());
    setAccent(getAccent());

    // delegation: tombol muncul setelah inject pun tetap kebaca
    document.addEventListener("click", (e) => {
      const toggle = e.target.closest("#theme-toggle");
      if (toggle) {
        const current = document.documentElement.getAttribute("data-theme") || DEFAULT_THEME;
        setTheme(current === "dark" ? "light" : "dark");
        return;
      }

      const dot = e.target.closest(".accent-dot");
      if (dot?.dataset?.accent) setAccent(dot.dataset.accent);
    });

    document.addEventListener("keydown", (e) => {
      const dot = e.target.closest?.(".accent-dot");
      if (!dot) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        dot.click();
      }
    });

    // setelah navbar di-inject, sync icon/dots
    document.addEventListener("components:ready", syncUI);

    syncUI();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
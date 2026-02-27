/**
 * theme.js — Dark/Light Toggle + Accent Switcher
 * - Disimpan ke localStorage
 * - Icon tombol theme dibuat rapi (SVG)
 */
(() => {
  const STORAGE_THEME = "pf-theme";
  const STORAGE_ACCENT = "pf-accent";

  const DEFAULT_THEME = "dark"; // "dark" | "light"
  const DEFAULT_ACCENT = "indigo"; // "indigo" | "cyan" | "emerald"

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

  const getSavedTheme = () => localStorage.getItem(STORAGE_THEME) || DEFAULT_THEME;
  const getSavedAccent = () => localStorage.getItem(STORAGE_ACCENT) || DEFAULT_ACCENT;

  function updateThemeToggleIcon(theme) {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    if (theme === "dark") {
      btn.innerHTML = sunIcon;
      btn.setAttribute("aria-label", "Aktifkan mode terang");
    } else {
      btn.innerHTML = moonIcon;
      btn.setAttribute("aria-label", "Aktifkan mode gelap");
    }
  }

  function updateAccentDots(activeAccent) {
    document.querySelectorAll(".accent-dot").forEach((dot) => {
      dot.classList.toggle("active", dot.dataset.accent === activeAccent);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_THEME, theme);
    updateThemeToggleIcon(theme);
  }

  function applyAccent(accent) {
    document.documentElement.setAttribute("data-accent", accent);
    localStorage.setItem(STORAGE_ACCENT, accent);
    updateAccentDots(accent);
  }

  function init() {
    applyTheme(getSavedTheme());
    applyAccent(getSavedAccent());

    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || DEFAULT_THEME;
        applyTheme(current === "dark" ? "light" : "dark");
      });
    }

    document.querySelectorAll(".accent-dot").forEach((dot) => {
      dot.addEventListener("click", () => applyAccent(dot.dataset.accent));
      dot.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dot.click();
        }
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
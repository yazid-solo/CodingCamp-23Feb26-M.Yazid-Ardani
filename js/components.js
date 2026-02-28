/**
 * components.js — Shared Components (UPGRADED)
 * - Navbar profesional + SVG icons
 * - Mobile drawer lebih rapih
 * - Command palette lebih keren
 * - Page transition & progress & toast
 */

const navItems = [
  { label: "Home", href: "index.html", icon: "home" },
  { label: "About", href: "about.html", icon: "user" },
  { label: "Projects", href: "projects.html", icon: "folder" },
  { label: "Resume", href: "resume.html", icon: "file" },
  { label: "Contact", href: "contact.html", icon: "mail" },
];

const commandItems = [
  ...navItems,
  { label: "Skills & Tools", href: "resume.html#skills", icon: "spark" },
  { label: "Featured Projects", href: "projects.html", icon: "star" },
  { label: "Hubungi via WhatsApp", href: "contact.html#contact", icon: "chat" },
];

function getActivePage() {
  return window.location.pathname.split("/").pop() || "index.html";
}

/* --- SVG icon set (simple + modern) --- */
function icon(name) {
  const map = {
    home: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21a8 8 0 1 0-16 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" stroke-width="2"/></svg>`,
    folder: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
    file: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 2v5h5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16v12H4V6Z" stroke="currentColor" stroke-width="2"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" stroke="currentColor" stroke-width="2"/><path d="M16.5 16.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    spark: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2l1.4 5.3L19 9l-5.6 1.7L12 16l-1.4-5.3L5 9l5.6-1.7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 2 3 7 7 .7-5.3 4.6 1.6 7.7L12 18.7 5.7 22l1.6-7.7L2 9.7 9 9l3-7Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
    chat: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 12a8 8 0 0 1-8 8H7l-4 2 1.2-4.5A8 8 0 1 1 21 12Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };
  return map[name] || "";
}

function renderNavbar() {
  const active = getActivePage();

  const linksHTML = navItems
    .map(
      (item) => `
    <li>
      <a href="${item.href}"
         class="${active === item.href ? "active" : ""}"
         ${active === item.href ? 'aria-current="page"' : ""}
         data-magnetic>
        ${icon(item.icon)}
        <span>${item.label}</span>
      </a>
    </li>
  `
    )
    .join("");

  const mobileLinksHTML = navItems
    .map(
      (item) => `
    <a href="${item.href}" class="${active === item.href ? "active" : ""}" data-magnetic>
      ${icon(item.icon)}
      <span>${item.label}</span>
    </a>
  `
    )
    .join("");

  return `
    <!-- Scroll Progress Bar -->
    <div id="scroll-progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="Scroll progress"></div>

    <!-- Page Transition Overlay -->
    <div id="page-transition" aria-hidden="true"></div>

    <!-- Toast -->
    <div id="toast" role="status" aria-live="polite">
      <span class="toast-icon">${icon("check")}</span>
      <span id="toast-msg"></span>
    </div>

    <!-- Command Palette -->
    <div id="command-palette-overlay" role="dialog" aria-modal="true" aria-label="Command palette">
      <div id="command-palette">
        <div class="cp-input-wrap">
          <span class="cp-icon">${icon("search")}</span>
          <input id="cp-search" type="text" placeholder="Cari halaman atau fitur..." autocomplete="off" spellcheck="false" />
        </div>
        <div class="cp-results" id="cp-results"></div>
        <div class="cp-footer">
          <span><kbd>↑↓</kbd> navigasi</span>
          <span><kbd>Enter</kbd> buka</span>
          <span><kbd>Esc</kbd> tutup</span>
        </div>
      </div>
    </div>

    <!-- Navbar -->
    <nav id="navbar" role="navigation" aria-label="Navigasi utama">
      <div class="nav-inner">
        <!-- Logo -->
        <a href="index.html" class="nav-logo" aria-label="Muchamad Yazid Ardani - Beranda" data-magnetic>
          <span class="nav-logo-badge" aria-hidden="true">
            <img
              src="assets/img/foto 1.png"
              alt=""
              onerror="this.remove(); this.parentElement.textContent='YA';"
            />
          </span>
          <span>Muchamad Yazid Ardani</span>
        </a>

        <!-- Desktop Links -->
        <ul class="nav-links" role="list">${linksHTML}</ul>

        <!-- Actions -->
        <div class="nav-actions">
          <div class="accent-switcher" role="group" aria-label="Pilih warna aksen">
            <span class="accent-dot" data-accent="indigo" role="button" tabindex="0" aria-label="Warna indigo"></span>
            <span class="accent-dot" data-accent="cyan" role="button" tabindex="0" aria-label="Warna cyan"></span>
            <span class="accent-dot" data-accent="emerald" role="button" tabindex="0" aria-label="Warna emerald"></span>
          </div>

          <button id="cp-trigger" class="icon-btn" aria-label="Buka command palette (Ctrl+K)" title="Command Palette (Ctrl+K)" data-magnetic>
            ${icon("search")}
          </button>

          <button id="theme-toggle" class="icon-btn" aria-label="Toggle tema" data-magnetic></button>

          <button class="nav-hamburger" id="nav-hamburger" aria-label="Buka menu mobile" aria-expanded="false" aria-controls="nav-mobile">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Nav -->
    <div id="nav-mobile" class="nav-mobile" aria-label="Menu mobile">
      ${mobileLinksHTML}
    </div>
  `;
}

function renderFooter() {
  const year = new Date().getFullYear();
  return `
    <footer id="footer">
      <div class="container">
        <div class="footer-inner">
          <div>
            <p class="footer-copy">
              © ${year} <strong>Muchamad Yazid Ardani</strong> — Dibuat dengan ☕ dan semangat belajar.
            </p>
            <p class="footer-copy" style="margin-top:0.25rem; font-size:0.85rem;">
              Mahasiswa Informatika · Universitas Nahdlatul Ulama Yogyakarta
            </p>
          </div>
          <nav class="footer-links" aria-label="Footer links">
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="projects.html">Projects</a>
            <a href="resume.html">Resume</a>
            <a href="contact.html">Contact</a>
          </nav>
        </div>
      </div>
    </footer>
  `;
}

function injectComponents() {
  const navContainer = document.getElementById("nav-container");
  if (navContainer) navContainer.innerHTML = renderNavbar();

  const footerContainer = document.getElementById("footer-container");
  if (footerContainer) footerContainer.innerHTML = renderFooter();
}

/* Scroll progress */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  const onScroll = () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + "%";
    bar.setAttribute("aria-valuenow", Math.round(pct));
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* Navbar glass on scroll */
function initNavbarScroll() {
  const nav = document.getElementById("navbar");
  if (!nav) return;

  const handler = () => nav.classList.toggle("scrolled", window.scrollY > 16);
  window.addEventListener("scroll", handler, { passive: true });
  handler();
}

/* Mobile menu */
function initMobileMenu() {
  const hamburger = document.getElementById("nav-hamburger");
  const mobileNav = document.getElementById("nav-mobile");
  if (!hamburger || !mobileNav) return;

  const spans = hamburger.querySelectorAll("span");

  const open = () => {
    mobileNav.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";

    spans[0].style.transform = "translateY(7px) rotate(45deg)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "translateY(-7px) rotate(-45deg)";
  };

  const close = () => {
    mobileNav.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";

    spans[0].style.transform = "";
    spans[1].style.opacity = "";
    spans[2].style.transform = "";
  };

  hamburger.addEventListener("click", () => {
    mobileNav.classList.contains("open") ? close() : open();
  });

  // close on link click
  mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

  // close on outside click
  document.addEventListener("click", (e) => {
    if (hamburger.contains(e.target) || mobileNav.contains(e.target)) return;
    close();
  });

  // close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* Page transition */
function initPageTransitions() {
  const overlay = document.getElementById("page-transition");
  if (!overlay) return;

  overlay.style.opacity = "1";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => (overlay.style.opacity = "0"));
  });

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      link.target === "_blank"
    )
      return;

    e.preventDefault();
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "all";
    setTimeout(() => (window.location.href = href), 260);
  });
}

/* Command palette */
function initCommandPalette() {
  const overlay = document.getElementById("command-palette-overlay");
  const searchInput = document.getElementById("cp-search");
  const resultsEl = document.getElementById("cp-results");
  const trigger = document.getElementById("cp-trigger");

  if (!overlay || !searchInput || !resultsEl) return;

  let activeIdx = 0;
  let current = [...commandItems];

  function setActive(idx) {
    const items = resultsEl.querySelectorAll(".cp-item");
    if (!items.length) return;
    items.forEach((el) => el.classList.remove("active"));
    activeIdx = Math.max(0, Math.min(idx, items.length - 1));
    items[activeIdx].classList.add("active");
    items[activeIdx].scrollIntoView({ block: "nearest" });
  }

  function renderResults(query) {
    const q = query.toLowerCase().trim();
    current = q ? commandItems.filter((it) => it.label.toLowerCase().includes(q)) : [...commandItems];

    if (!current.length) {
      resultsEl.innerHTML = `<p style="padding:1.2rem;text-align:center;color:var(--text-muted);font-size:0.9rem;">Tidak ada hasil untuk "${q}"</p>`;
      return;
    }

    resultsEl.innerHTML = current
      .map(
        (it, i) => `
        <a href="${it.href}" class="cp-item ${i === 0 ? "active" : ""}">
          <span class="cp-item-icon">${icon(it.icon)}</span>
          <span>${it.label}</span>
        </a>
      `
      )
      .join("");

    activeIdx = 0;

    resultsEl.querySelectorAll(".cp-item").forEach((el, i) => {
      el.addEventListener("mouseenter", () => setActive(i));
      el.addEventListener("click", () => close());
    });
  }

  function open() {
    overlay.classList.add("open");
    searchInput.value = "";
    renderResults("");
    requestAnimationFrame(() => searchInput.focus());
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (trigger) trigger.addEventListener("click", open);

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      overlay.classList.contains("open") ? close() : open();
      return;
    }
    if (!overlay.classList.contains("open")) return;

    if (e.key === "Escape") close();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(activeIdx + 1);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(activeIdx - 1);
    }
    if (e.key === "Enter") {
      const items = resultsEl.querySelectorAll(".cp-item");
      items[activeIdx]?.click();
    }
  });

  searchInput.addEventListener("input", (e) => renderResults(e.target.value));

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
}

/* Toast utility */
window.showToast = function (msg, duration = 3000) {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toast-msg");
  if (!toast || !msgEl) return;

  msgEl.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
};

/* Accent dots keyboard */
function initAccentKeyboard() {
  document.querySelectorAll(".accent-dot[tabindex]").forEach((dot) => {
    dot.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        dot.click();
      }
    });
  });
}

/* Run */
document.addEventListener("DOMContentLoaded", () => {
  injectComponents();

  requestAnimationFrame(() => {
    initScrollProgress();
    initNavbarScroll();
    initMobileMenu();
    initPageTransitions();
    initCommandPalette();
    initAccentKeyboard();

    document.dispatchEvent(new Event("components:ready"));
  });
});
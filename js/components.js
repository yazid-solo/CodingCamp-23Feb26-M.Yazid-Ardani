/**
 * components.js — Shared Components
 *
 * Inject navbar dan footer ke setiap halaman via JavaScript
 * supaya perubahan cukup dilakukan di satu tempat (file ini).
 *
 * Cara update menu navbar: ubah array `navItems` di bawah.
 * Cara update footer: ubah fungsi `renderFooter()`.
 */

// ── Navigasi data ──────────────────────────────────────────────
const navItems = [
  { label: 'Home',     href: 'index.html',    icon: '🏠' },
  { label: 'About',    href: 'about.html',    icon: '👤' },
  { label: 'Projects', href: 'projects.html', icon: '🗂️' },
  { label: 'Resume',   href: 'resume.html',   icon: '📄' },
  { label: 'Contact',  href: 'contact.html',  icon: '✉️' },
];

// Command palette items (halaman + section penting)
const commandItems = [
  ...navItems,
  { label: 'Skills & Tools',  href: 'resume.html#skills',   icon: '🛠️' },
  { label: 'Featured Projects', href: 'projects.html',      icon: '✨' },
  { label: 'Hubungi via WhatsApp', href: 'contact.html#contact', icon: '💬' },
];

// ── Helper: dapatkan path halaman aktif ──
function getActivePage() {
  const path = window.location.pathname;
  // ambil nama file saja, fallback ke index.html
  return path.split('/').pop() || 'index.html';
}

// ── Render Navbar HTML ──────────────────────────────────────────
function renderNavbar() {
  const activePage = getActivePage();

  const linksHTML = navItems.map(item => `
    <li>
      <a href="${item.href}"
         class="${activePage === item.href ? 'active' : ''}"
         ${activePage === item.href ? 'aria-current="page"' : ''}>
        ${item.label}
      </a>
    </li>
  `).join('');

  const mobileLinksHTML = navItems.map(item => `
    <a href="${item.href}" class="${activePage === item.href ? 'active' : ''}">
      ${item.icon} ${item.label}
    </a>
  `).join('');

  return `
    <!-- Scroll Progress Bar -->
    <div id="scroll-progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="Scroll progress"></div>

    <!-- Page Transition Overlay -->
    <div id="page-transition" aria-hidden="true"></div>

    <!-- Toast Notification -->
    <div id="toast" role="status" aria-live="polite">
      <span class="toast-icon">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
      <span id="toast-msg"></span>
    </div>

    <!-- Command Palette Overlay -->
    <div id="command-palette-overlay" role="dialog" aria-modal="true" aria-label="Command palette">
      <div id="command-palette">
        <div class="cp-input-wrap">
          <span class="cp-icon">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input id="cp-search" type="text" placeholder="Cari halaman atau fitur..." autocomplete="off" spellcheck="false"/>
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
        <a href="index.html" class="nav-logo" aria-label="Muchamad Yazid Ardani - Beranda">
          <img src="assets/img/foto 1.png" alt="Logo" class="nav-logo-img" width="60" height="80"/>
          <span>Muchamad Yazid Ardani</span>
        </a>

        <!-- Desktop Nav Links -->
        <ul class="nav-links" role="list">${linksHTML}</ul>

        <!-- Actions -->
        <div class="nav-actions">
          <!-- Accent Switcher -->
          <div class="accent-switcher" role="group" aria-label="Pilih warna aksen">
            <span class="accent-dot" data-accent="indigo" role="button" tabindex="0" aria-label="Warna indigo"></span>
            <span class="accent-dot" data-accent="cyan"   role="button" tabindex="0" aria-label="Warna cyan"></span>
            <span class="accent-dot" data-accent="emerald"role="button" tabindex="0" aria-label="Warna emerald"></span>
          </div>

          <!-- Command Palette Trigger -->
          <button id="cp-trigger" class="icon-btn" aria-label="Buka command palette (Ctrl+K)" title="Command Palette (Ctrl+K)">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>
            </svg>
          </button>

          <!-- Theme Toggle -->
          <button id="theme-toggle" class="icon-btn" aria-label="Toggle tema"></button>

          <!-- Hamburger (mobile) -->
          <button class="nav-hamburger" id="nav-hamburger" aria-label="Buka menu mobile" aria-expanded="false" aria-controls="nav-mobile">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Nav Drawer -->
    <div id="nav-mobile" class="nav-mobile" aria-label="Menu mobile">
      ${mobileLinksHTML}
    </div>
  `;
}

// ── Render Footer HTML ──────────────────────────────────────────
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
            <p class="footer-copy" style="margin-top:0.25rem; font-size:0.8rem;">
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

// ── Inject komponen ke dalam halaman ──────────────────────────
function injectComponents() {
  // Navbar: masukkan di awal <body>
  const navContainer = document.getElementById('nav-container');
  if (navContainer) {
    navContainer.innerHTML = renderNavbar();
  }

  // Footer: masukkan di akhir <body>
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = renderFooter();
  }
}

// ── Scroll progress bar ────────────────────────────────────────
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }, { passive: true });
}

// ── Navbar scroll shadow ───────────────────────────────────────
function initNavbarScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const handler = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', handler, { passive: true });
  handler(); // cek initial state
}

// ── Mobile hamburger menu ──────────────────────────────────────
function initMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('nav-mobile');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    // Animasikan garis hamburger
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Tutup saat klik di luar
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Page Transition ────────────────────────────────────────────
function initPageTransitions() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  // Fade in saat halaman pertama kali dimuat
  overlay.style.opacity = '1';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.opacity = '0';
    });
  });

  // Intercept semua link internal untuk transisi smooth
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    // Hanya untuk link HTML internal (bukan anchor, bukan eksternal, bukan #)
    if (!href ||
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        link.target === '_blank') return;

    e.preventDefault();
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    setTimeout(() => {
      window.location.href = href;
    }, 280);
  });
}

// ── Command Palette ────────────────────────────────────────────
function initCommandPalette() {
  const overlay   = document.getElementById('command-palette-overlay');
  const searchInput = document.getElementById('cp-search');
  const resultsEl = document.getElementById('cp-results');
  const trigger   = document.getElementById('cp-trigger');

  if (!overlay || !searchInput || !resultsEl) return;

  let activeIdx = 0;

  function open() {
    overlay.classList.add('open');
    searchInput.value = '';
    renderResults('');
    requestAnimationFrame(() => searchInput.focus());
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderResults(query) {
    const q = query.toLowerCase().trim();
    const filtered = q
      ? commandItems.filter(item => item.label.toLowerCase().includes(q))
      : commandItems;

    if (filtered.length === 0) {
      resultsEl.innerHTML = `<p style="padding:1.5rem;text-align:center;color:var(--text-muted);font-size:0.875rem;">Tidak ada hasil untuk "${q}"</p>`;
      return;
    }

    activeIdx = 0;
    resultsEl.innerHTML = filtered.map((item, i) => `
      <a href="${item.href}" class="cp-item ${i === 0 ? 'active' : ''}" data-idx="${i}">
        <span class="cp-item-icon" aria-hidden="true">${item.icon}</span>
        <span>${item.label}</span>
      </a>
    `).join('');

    // Keyboard navigation helpers
    resultsEl.querySelectorAll('.cp-item').forEach((el, i) => {
      el.addEventListener('mouseenter', () => {
        setActive(i);
      });
    });
  }

  function setActive(idx) {
    const items = resultsEl.querySelectorAll('.cp-item');
    if (!items.length) return;
    items.forEach(el => el.classList.remove('active'));
    activeIdx = Math.max(0, Math.min(idx, items.length - 1));
    items[activeIdx]?.classList.add('active');
    items[activeIdx]?.scrollIntoView({ block: 'nearest' });
  }

  // Event: tombol trigger
  if (trigger) trigger.addEventListener('click', open);

  // Event: Ctrl+K
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      overlay.classList.contains('open') ? close() : open();
    }
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIdx + 1); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(activeIdx - 1); }
    if (e.key === 'Enter') {
      const active = resultsEl.querySelector('.cp-item.active');
      if (active) active.click();
    }
  });

  // Ketik di search
  searchInput.addEventListener('input', e => renderResults(e.target.value));

  // Klik di luar palette
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });
}

// ── Toast utility ──────────────────────────────────────────────
// Panggil window.showToast('Pesan kamu') dari mana saja
window.showToast = function(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
};

// ── Dot accent keyboard support ───────────────────────────────
function initAccentKeyboard() {
  document.querySelectorAll('.accent-dot[tabindex]').forEach(dot => {
    dot.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dot.click();
      }
    });
  });
}

// ── Jalankan semua ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectComponents();

  // Setelah inject, jalankan semua inisialisasi
  requestAnimationFrame(() => {
    initScrollProgress();
    initNavbarScroll();
    initMobileMenu();
    initPageTransitions();
    initCommandPalette();
    initAccentKeyboard();

    // Dispatch event supaya main.js tahu komponen sudah siap
    document.dispatchEvent(new Event('components:ready'));
  });
});

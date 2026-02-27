/**
 * main.js — Logika Utama Per Halaman
 *
 * File ini mendeteksi halaman yang sedang aktif dan menjalankan
 * fungsi yang relevan saja (tidak memuat semua kode di semua halaman).
 *
 * Cara tambah project baru: cukup tambahkan objek ke data/projects.json.
 * Format sudah didokumentasikan di README.md.
 */

document.addEventListener('components:ready', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '') initHomePage();
  if (page === 'projects.html')            initProjectsPage();
  if (page === 'resume.html')              initResumePage();
  if (page === 'contact.html')             initContactPage();
  if (page === 'about.html')              initAboutPage();
});

// ════════════════════════════════════════════════════════════════
// HOME PAGE
// ════════════════════════════════════════════════════════════════
function initHomePage() {
  // Muat dan render featured projects (3 pertama)
  fetch('data/projects.json')
    .then(r => r.json())
    .then(projects => {
      renderFeaturedProjects(projects.slice(0, 3));
    })
    .catch(err => console.warn('Gagal muat projects:', err));
}

function renderFeaturedProjects(projects) {
  const container = document.getElementById('featured-projects-grid');
  if (!container) return;

  container.innerHTML = projects.map(p => `
    <article class="project-card card tilt" data-id="${p.id}">
      <div class="project-card-scan" aria-hidden="true"></div>
      <img src="${p.image}" alt="Screenshot proyek ${p.title}" class="project-card-img" loading="lazy">
      <span class="project-badge">${p.category.toUpperCase()}</span>
      <h3 style="font-size:1.1rem;margin-bottom:0.5rem;">${p.title}</h3>
      <p style="font-size:0.875rem;color:var(--text-muted);line-height:1.6;">${p.description.substring(0, 120)}...</p>
      <div class="tech-tags">
        ${p.tech.slice(0, 3).map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>
    </article>
  `).join('');

  // Re-init tilt untuk card yang baru di-render
  document.querySelectorAll('.tilt').forEach(el => {
    el.addEventListener('mousemove', handleTiltMoveGlobal);
    el.addEventListener('mouseleave', handleTiltLeaveGlobal);
  });

  // Re-init scroll reveal
  document.querySelectorAll('#featured-projects-grid .reveal').forEach(el => {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    }, { threshold: 0.1 }).observe(el);
  });
}

// Tilt helpers (duplikat dari animations.js untuk akses global)
function handleTiltMoveGlobal(e) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const cx = (e.clientX - rect.left) / rect.width  - 0.5;
  const cy = (e.clientY - rect.top)  / rect.height - 0.5;
  card.style.transition = 'transform 0.1s ease';
  card.style.transform  = `perspective(800px) rotateX(${-cy*8}deg) rotateY(${cx*12}deg) scale3d(1.02,1.02,1.02)`;
}
function handleTiltLeaveGlobal(e) {
  const card = e.currentTarget;
  card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
  card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
}

// ════════════════════════════════════════════════════════════════
// PROJECTS PAGE
// ════════════════════════════════════════════════════════════════
let allProjects = []; // cache

function initProjectsPage() {
  fetch('data/projects.json')
    .then(r => r.json())
    .then(projects => {
      allProjects = projects;
      renderAllProjects(allProjects);
      initProjectFilters();
      initProjectSearch();
      initProjectModal();
    })
    .catch(err => {
      console.warn('Gagal muat projects:', err);
      const grid = document.getElementById('all-projects-grid');
      if (grid) grid.innerHTML = `<p style="color:var(--text-muted)">Gagal memuat proyek. Pastikan server berjalan.</p>`;
    });
}

function renderAllProjects(projects) {
  const container = document.getElementById('all-projects-grid');
  if (!container) return;

  if (projects.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:3rem 0">Tidak ada proyek ditemukan.</p>`;
    return;
  }

  container.innerHTML = projects.map(p => `
    <article class="project-card card tilt reveal" data-id="${p.id}" data-category="${p.category}" tabindex="0" role="button" aria-label="Lihat detail proyek ${p.title}">
      <div class="project-card-scan" aria-hidden="true"></div>
      <img src="${p.image}" alt="Screenshot proyek ${p.title}" class="project-card-img" loading="lazy">
      <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;margin-bottom:0.75rem;">
        <span class="project-badge">${p.category.toUpperCase()}</span>
        ${p.status === 'in-progress' ? '<span class="project-badge" style="background:rgba(251,146,60,0.15);color:#fb923c;border-color:rgba(251,146,60,0.3)">IN PROGRESS</span>' : ''}
      </div>
      <h3 style="font-size:1.1rem;margin-bottom:0.5rem;">${p.title}</h3>
      <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.6;margin-bottom:0.5rem;">${p.description.substring(0, 110)}...</p>
      <div class="tech-tags">
        ${p.tech.slice(0, 4).map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>
    </article>
  `).join('');

  // Event: klik card buka modal
  container.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openProjectModal(parseInt(card.dataset.id)));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') openProjectModal(parseInt(card.dataset.id));
    });
    // Re-attach tilt
    card.addEventListener('mousemove', handleTiltMoveGlobal);
    card.addEventListener('mouseleave', handleTiltLeaveGlobal);
  });

  // Trigger scroll reveal
  setTimeout(() => {
    document.querySelectorAll('#all-projects-grid .reveal').forEach(el => {
      el.classList.add('visible');
    });
  }, 50);
}

function initProjectFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      const filtered = cat === 'all' ? allProjects : allProjects.filter(p => p.category === cat);
      renderAllProjects(filtered);
    });
  });
}

function initProjectSearch() {
  const input = document.getElementById('project-search');
  if (!input) return;

  let debounceTimer;
  input.addEventListener('input', e => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = e.target.value.toLowerCase().trim();
      const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
      const base = activeFilter === 'all' ? allProjects : allProjects.filter(p => p.category === activeFilter);
      const filtered = q
        ? base.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tech.some(t => t.toLowerCase().includes(q))
          )
        : base;
      renderAllProjects(filtered);
    }, 250);
  });
}

// ── Project Modal ──
function initProjectModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  // Tutup saat klik overlay
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  // Tutup dengan Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
}

function openProjectModal(id) {
  const project  = allProjects.find(p => p.id === id);
  const overlay  = document.getElementById('modal-overlay');
  const modal    = document.getElementById('modal');
  if (!project || !overlay || !modal) return;

  const linksHTML = `
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-top:1.5rem;">
      <a href="${project.demo}" target="_blank" rel="noopener" class="btn btn-primary">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Live Demo
      </a>
      <a href="${project.github}" target="_blank" rel="noopener" class="btn btn-outline">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        GitHub
      </a>
    </div>
  `;

  modal.innerHTML = `
    <button class="modal-close" id="modal-close-btn" aria-label="Tutup modal">✕ Tutup</button>
    <img src="${project.image}" alt="Screenshot ${project.title}" class="modal-img" loading="lazy">
    <div class="modal-body">
      <span class="project-badge" style="margin-bottom:0.75rem">${project.category.toUpperCase()} · ${project.year}</span>
      <h2 style="font-size:1.5rem;margin-bottom:0.75rem;">${project.title}</h2>
      <p style="font-size:0.925rem;color:var(--text-dim);line-height:1.7;margin-bottom:1rem;">${project.longDescription}</p>
      <p style="font-size:0.8rem;font-family:var(--font-mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.5rem;">Fitur Utama</p>
      <ul class="modal-feature-list">
        ${project.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <p style="font-size:0.8rem;font-family:var(--font-mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.5rem;margin-top:1rem;">Tech Stack</p>
      <div class="tech-tags">${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
      ${linksHTML}
    </div>
  `;

  // Close button
  modal.querySelector('#modal-close-btn').addEventListener('click', closeModal);

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Fokus ke modal untuk aksesibilitas
  modal.focus();
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ════════════════════════════════════════════════════════════════
// RESUME PAGE
// ════════════════════════════════════════════════════════════════
function initResumePage() {
  // Skill bars akan dianimasikan oleh animations.js via IntersectionObserver
  // Tidak diperlukan kode tambahan untuk halaman resume.
  console.log('[Resume] Halaman resume siap.');
}

// ════════════════════════════════════════════════════════════════
// ABOUT PAGE
// ════════════════════════════════════════════════════════════════
function initAboutPage() {
  // About page: tidak ada logika dinamis khusus, animasi ditangani animations.js
  console.log('[About] Halaman about siap.');
}

// ════════════════════════════════════════════════════════════════
// CONTACT PAGE
// ════════════════════════════════════════════════════════════════
function initContactPage() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', handleContactSubmit);

  // Hapus error saat user mulai mengetik
  form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('input', () => clearFieldError(input));
  });
}

function handleContactSubmit(e) {
  e.preventDefault();
  const form    = e.target;
  const name    = form.querySelector('#name');
  const email   = form.querySelector('#email');
  const message = form.querySelector('#message');

  // Reset semua error
  [name, email, message].forEach(clearFieldError);

  let isValid = true;

  if (!name.value.trim()) {
    showFieldError(name, 'Nama tidak boleh kosong.');
    isValid = false;
  }
  if (!email.value.trim()) {
    showFieldError(email, 'Email tidak boleh kosong.');
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    showFieldError(email, 'Format email tidak valid.');
    isValid = false;
  }
  if (!message.value.trim() || message.value.trim().length < 10) {
    showFieldError(message, 'Pesan minimal 10 karakter.');
    isValid = false;
  }

  if (!isValid) return;

  // Dummy handler — tampilkan tombol loading lalu success
  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg style="animation:spin 1s linear infinite;width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
    Mengirim...
  `;

  // Simulasikan pengiriman (ganti ini dengan fetch() ke backend/EmailJS/Formspree)
  setTimeout(() => {
  emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {
  from_name: name.value,
  from_email: email.value,
  message: message.value
}).then(() => {
  window.showToast('Pesan terkirim!');
  form.reset();
});

    // Opsional: kirim via mailto sebagai fallback
    // window.location.href = `mailto:yazid@example.com?subject=Pesan dari ${name.value}&body=${message.value}`;
  }, 1500);
}

function showFieldError(input, msg) {
  input.classList.add('error');
  const errEl = input.parentElement.querySelector('.form-error');
  if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
}

function clearFieldError(input) {
  input.classList.remove('error');
  const errEl = input.parentElement.querySelector('.form-error');
  if (errEl) errEl.classList.remove('show');
}

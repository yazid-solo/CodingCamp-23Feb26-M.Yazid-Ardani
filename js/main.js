/**
 * main.js — FIXED (no global variable collisions)
 * Penyebab bug: const prefersReducedMotion bentrok dengan animations.js
 * Solusi: bungkus main.js dalam IIFE + pakai nama lokal.
 */
(() => {
  "use strict";

  document.addEventListener("components:ready", () => {
    const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

    if (page === "index.html" || page === "") initHomePage();
    if (page === "projects.html") initProjectsPage();
    if (page === "resume.html") initResumePage();
    if (page === "contact.html") initContactPage();
    if (page === "about.html") initAboutPage();
  });

  /* ─────────────────────────────────────────────
     Helpers
  ───────────────────────────────────────────── */
  const PRM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function debounce(fn, wait = 240) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  async function fetchJSON(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    // parse manual biar error JSON kelihatan jelas
    const txt = await res.text();
    try {
      return JSON.parse(txt);
    } catch (e) {
      throw new Error(`JSON parse error (${url}): ${e.message}`);
    }
  }

  function safeStr(v, fallback = "") {
    return typeof v === "string" ? v : fallback;
  }

  /* Reveal for dynamic elements */
  let __revealIO = null;
  function ensureRevealObserver() {
    if (__revealIO || PRM) return;

    __revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("visible");
          __revealIO.unobserve(en.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );
  }

  function observeReveal(root = document) {
    if (PRM) {
      root.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
      return;
    }
    ensureRevealObserver();
    root.querySelectorAll(".reveal:not(.visible)").forEach((el) => __revealIO.observe(el));
  }

  function refreshFX(root = document) {
    observeReveal(root);

    // pointer glow vars
    root.querySelectorAll(".tilt, .card, .btn, .project-card, .tool-chip, .highlight-card").forEach((el) => {
      if (el.__hasPointerGlow) return;
      el.__hasPointerGlow = true;

      el.addEventListener(
        "pointermove",
        (e) => {
          const r = el.getBoundingClientRect();
          const mx = ((e.clientX - r.left) / r.width) * 100;
          const my = ((e.clientY - r.top) / r.height) * 100;
          el.style.setProperty("--mx", `${mx}%`);
          el.style.setProperty("--my", `${my}%`);
        },
        { passive: true }
      );

      el.addEventListener(
        "pointerleave",
        () => {
          el.style.removeProperty("--mx");
          el.style.removeProperty("--my");
        },
        { passive: true }
      );
    });

    // tilt (ambil dari animations.js kalau ada)
    const tiltMove = window.__tiltMove;
    const tiltLeave = window.__tiltLeave;
    if (typeof tiltMove === "function" && typeof tiltLeave === "function") {
      root.querySelectorAll(".tilt").forEach((el) => {
        if (el.__tiltBound) return;
        el.__tiltBound = true;
        el.addEventListener("pointermove", tiltMove, { passive: true });
        el.addEventListener("pointerleave", tiltLeave, { passive: true });
        el.addEventListener("mousemove", tiltMove, { passive: true });
        el.addEventListener("mouseleave", tiltLeave, { passive: true });
      });
    }

    // magnetic fallback
    root.querySelectorAll("[data-magnetic]").forEach((btn) => {
      if (btn.__magneticBound || PRM) return;
      btn.__magneticBound = true;

      btn.addEventListener(
        "pointermove",
        (e) => {
          const r = btn.getBoundingClientRect();
          const x = e.clientX - (r.left + r.width / 2);
          const y = e.clientY - (r.top + r.height / 2);
          btn.style.transform = `translate3d(${x * 0.10}px, ${y * 0.10}px, 0)`;
        },
        { passive: true }
      );

      btn.addEventListener(
        "pointerleave",
        () => {
          btn.style.transform = "";
        },
        { passive: true }
      );
    });
  }

  /* ─────────────────────────────────────────────
     HOME
  ───────────────────────────────────────────── */
  function initHomePage() {
    fetchJSON("data/projects.json")
      .then((projects) => {
        if (!Array.isArray(projects)) throw new Error("projects.json harus berupa array []");
        renderFeaturedProjects(projects.slice(0, 3));
      })
      .catch((err) => {
        console.warn("Gagal muat projects:", err);
        const container = document.getElementById("featured-projects-grid");
        if (container) container.innerHTML = `<p style="color:var(--text-muted)">Gagal load projects.json</p>`;
      });
  }

  function renderFeaturedProjects(projects) {
    const container = document.getElementById("featured-projects-grid");
    if (!container) return;

    container.innerHTML = projects
      .map(
        (p, i) => `
      <article class="project-card card tilt reveal ${i ? `reveal-delay-${Math.min(i, 4)}` : ""}" data-id="${p.id}"
               tabindex="0" role="button" aria-label="Lihat detail proyek ${safeStr(p.title)}">
        <div class="project-card-scan" aria-hidden="true"></div>
        <img src="${safeStr(p.image)}" alt="Screenshot proyek ${safeStr(p.title)}" class="project-card-img" loading="lazy">
        <span class="project-badge">${safeStr(p.category).toUpperCase()}</span>
        <h3 style="font-size:1.1rem;margin-bottom:0.5rem;">${safeStr(p.title)}</h3>
        <p style="color:var(--text-muted);line-height:1.7;">
          ${safeStr(p.description).slice(0, 120)}${safeStr(p.description).length > 120 ? "..." : ""}
        </p>
        <div class="tech-tags">
          ${(p.tech || []).slice(0, 3).map((t) => `<span class="tech-tag">${safeStr(t)}</span>`).join("")}
        </div>
      </article>
    `
      )
      .join("");

    container.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("click", () => (window.location.href = "projects.html"));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") window.location.href = "projects.html";
      });
    });

    refreshFX(container);
  }

  /* ─────────────────────────────────────────────
     PROJECTS
  ───────────────────────────────────────────── */
  let allProjects = [];

  function initProjectsPage() {
    fetchJSON("data/projects.json")
      .then((projects) => {
        if (!Array.isArray(projects)) throw new Error("projects.json harus berupa array []");
        allProjects = projects;
        renderAllProjects(allProjects);
        initProjectFilters();
        initProjectSearch();
        initProjectModal();
      })
      .catch((err) => {
        console.warn("Gagal muat projects:", err);
        const grid = document.getElementById("all-projects-grid");
        if (grid) grid.innerHTML = `<p style="color:var(--text-muted)">Gagal memuat projects.json</p>`;
      });
  }

  function projectCardHTML(p) {
    const statusBadge =
      p.status === "in-progress"
        ? `<span class="project-badge" style="background:rgba(251,146,60,0.15);color:#fb923c;border-color:rgba(251,146,60,0.3)">IN PROGRESS</span>`
        : "";

    return `
      <article class="project-card card tilt reveal" data-id="${p.id}" data-category="${safeStr(p.category)}"
               tabindex="0" role="button" aria-label="Lihat detail proyek ${safeStr(p.title)}">
        <div class="project-card-scan" aria-hidden="true"></div>
        <img src="${safeStr(p.image)}" alt="Screenshot proyek ${safeStr(p.title)}" class="project-card-img" loading="lazy">
        <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;margin-bottom:0.75rem;">
          <span class="project-badge">${safeStr(p.category).toUpperCase()}</span>
          ${statusBadge}
        </div>
        <h3 style="font-size:1.1rem;margin-bottom:0.5rem;">${safeStr(p.title)}</h3>
        <p style="color:var(--text-muted);line-height:1.7;margin-bottom:0.6rem;">
          ${safeStr(p.description).slice(0, 120)}${safeStr(p.description).length > 120 ? "..." : ""}
        </p>
        <div class="tech-tags">
          ${(p.tech || []).slice(0, 4).map((t) => `<span class="tech-tag">${safeStr(t)}</span>`).join("")}
        </div>
      </article>
    `;
  }

  function renderAllProjects(projects) {
    const container = document.getElementById("all-projects-grid");
    if (!container) return;

    if (!projects.length) {
      container.innerHTML = `<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:3rem 0">Tidak ada proyek ditemukan.</p>`;
      return;
    }

    container.innerHTML = projects.map(projectCardHTML).join("");

    container.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("click", () => openProjectModal(parseInt(card.dataset.id, 10)));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") openProjectModal(parseInt(card.dataset.id, 10));
      });
    });

    refreshFX(container);
  }

  function initProjectFilters() {
    const buttons = Array.from(document.querySelectorAll(".filter-btn"));
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });

        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");

        const cat = btn.dataset.filter;
        const filtered = cat === "all" ? allProjects : allProjects.filter((p) => p.category === cat);
        renderAllProjects(filtered);
      });
    });
  }

  function initProjectSearch() {
    const input = document.getElementById("project-search");
    if (!input) return;

    const run = () => {
      const q = input.value.toLowerCase().trim();
      const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";
      const base = activeFilter === "all" ? allProjects : allProjects.filter((p) => p.category === activeFilter);

      const filtered = q
        ? base.filter(
            (p) =>
              safeStr(p.title).toLowerCase().includes(q) ||
              safeStr(p.description).toLowerCase().includes(q) ||
              (p.tech || []).some((t) => safeStr(t).toLowerCase().includes(q))
          )
        : base;

      renderAllProjects(filtered);
    };

    input.addEventListener("input", debounce(run, 240));
  }

  /* Modal */
  function initProjectModal() {
    const overlay = document.getElementById("modal-overlay");
    if (!overlay) return;

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
    });
  }

  function openProjectModal(id) {
    const project = allProjects.find((p) => p.id === id);
    const overlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal");
    if (!project || !overlay || !modal) return;

    const demoOk = project.demo && project.demo !== "#";
    const githubOk = project.github && project.github !== "#";

    modal.innerHTML = `
      <button class="modal-close" id="modal-close-btn" aria-label="Tutup modal">✕ Tutup</button>
      <img src="${safeStr(project.image)}" alt="Screenshot ${safeStr(project.title)}" class="modal-img" loading="lazy">
      <div class="modal-body">
        <span class="project-badge" style="margin-bottom:0.75rem">${safeStr(project.category).toUpperCase()} · ${project.year ?? "-"}</span>
        <h2 style="font-size:1.55rem;margin-bottom:0.75rem;">${safeStr(project.title)}</h2>
        <p style="color:var(--text-dim);line-height:1.8;margin-bottom:1rem;">${safeStr(project.longDescription) || safeStr(project.description)}</p>

        <p style="font-size:0.82rem;font-family:var(--font-mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.5rem;">Fitur Utama</p>
        <ul class="modal-feature-list">${(project.features || []).map((f) => `<li>${safeStr(f)}</li>`).join("")}</ul>

        <p style="font-size:0.82rem;font-family:var(--font-mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-top:1rem;margin-bottom:0.5rem;">Tech Stack</p>
        <div class="tech-tags">${(project.tech || []).map((t) => `<span class="tech-tag">${safeStr(t)}</span>`).join("")}</div>

        <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.5rem;">
          ${demoOk ? `<a href="${project.demo}" target="_blank" rel="noopener" class="btn btn-primary" data-magnetic>Live Demo</a>` : ""}
          ${githubOk ? `<a href="${project.github}" target="_blank" rel="noopener" class="btn btn-outline" data-magnetic>GitHub</a>` : ""}
        </div>
      </div>
    `;

    modal.querySelector("#modal-close-btn")?.addEventListener("click", closeModal);

    overlay.classList.add("open");
    document.body.style.overflow = "hidden";

    refreshFX(modal);
  }

  function closeModal() {
    const overlay = document.getElementById("modal-overlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ───────────────────────────────────────────── */
  function initResumePage() {}
  function initAboutPage() {}

  function initContactPage() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    refreshFX(form);
  }
})();
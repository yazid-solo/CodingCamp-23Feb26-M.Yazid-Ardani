/**
 * animations.js — Animasi & Efek Visual
 * - Scroll reveal
 * - Skill bar animation
 * - Tilt (card) + Magnetic button
 * - Parallax ringan
 * - Three.js hero
 * - Counter angka
 */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if (prefersReducedMotion) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("visible");
        io.unobserve(en.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
  );

  els.forEach((el) => io.observe(el));
}

/* ---------- Skill Bars ---------- */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-fill");
  if (!bars.length) return;

  if (prefersReducedMotion) {
    bars.forEach((bar) => (bar.style.width = `${bar.dataset.level || 0}%`));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        setTimeout(() => (el.style.width = `${el.dataset.level || 0}%`), 150);
        io.unobserve(el);
      });
    },
    { threshold: 0.35 }
  );

  bars.forEach((bar) => io.observe(bar));
}

/* ---------- Tilt Cards (expose to window for main.js reuse) ---------- */
function tiltMove(e) {
  if (prefersReducedMotion) return;
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const cx = (e.clientX - rect.left) / rect.width - 0.5;
  const cy = (e.clientY - rect.top) / rect.height - 0.5;

  card.style.transition = "transform 120ms ease";
  card.style.transform = `perspective(900px) rotateX(${-cy * 8}deg) rotateY(${cx * 12}deg) translateY(-2px)`;
}

function tiltLeave(e) {
  const card = e.currentTarget;
  card.style.transition = "transform 520ms cubic-bezier(0.34,1.56,0.64,1)";
  card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
}

function initTilt() {
  if (prefersReducedMotion) return;
  document.querySelectorAll(".tilt").forEach((el) => {
    el.addEventListener("mousemove", tiltMove);
    el.addEventListener("mouseleave", tiltLeave);
  });
}
window.__tiltMove = tiltMove;
window.__tiltLeave = tiltLeave;

/* ---------- Magnetic Buttons ---------- */
function initMagnetic() {
  if (prefersReducedMotion) return;

  document.querySelectorAll("[data-magnetic]").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* ---------- Parallax ---------- */
function initParallax() {
  if (prefersReducedMotion) return;
  const targets = document.querySelectorAll("[data-parallax]");
  if (!targets.length) return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      targets.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || "0.12");
        el.style.transform = `translateY(${y * speed}px)`;
      });
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- Counters ---------- */
function initCounters() {
  if (prefersReducedMotion) return;
  const els = document.querySelectorAll("[data-count]");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;

        const el = en.target;
        const end = parseInt(el.dataset.count || "0", 10);
        let startTime = null;

        const step = (ts) => {
          if (!startTime) startTime = ts;
          const p = Math.min((ts - startTime) / 1300, 1);
          const eased = 1 - Math.pow(1 - p, 2);
          el.textContent = String(Math.floor(eased * end));
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = String(end);
        };

        requestAnimationFrame(step);
        io.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );

  els.forEach((el) => io.observe(el));
}

/* ---------- Three.js Hero ---------- */
function initHeroThreeJS() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  if (typeof THREE === "undefined") {
    canvas.style.display = "none";
    const fallback = document.getElementById("hero-fallback");
    if (fallback) fallback.style.display = "grid";
    return;
  }

  const parent = canvas.parentElement;
  const getSize = () => {
    const w = parent ? parent.clientWidth : 420;
    const h = parent ? parent.clientHeight : 420;
    return { w, h };
  };

  try {
    const { w, h } = getSize();

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.set(0, 0, 4);

    const geometry = new THREE.TorusKnotGeometry(1.1, 0.35, 128, 16, 2, 3);
    const material = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.62,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < positions.length; i++) positions[i] = (Math.random() - 0.5) * 12;
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.05,
      transparent: true,
      opacity: 0.33,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const accentMap = {
      indigo: 0x818cf8,
      cyan: 0x22d3ee,
      emerald: 0x34d399,
    };

    const htmlEl = document.documentElement;
    const applyAccentColor = () => {
      const c = accentMap[htmlEl.getAttribute("data-accent")] || accentMap.indigo;
      material.color.setHex(c);
      particleMat.color.setHex(c);
    };
    applyAccentColor();

    new MutationObserver(applyAccentColor).observe(htmlEl, {
      attributes: true,
      attributeFilter: ["data-accent"],
    });

    let mouseX = 0,
      mouseY = 0,
      tx = 0,
      ty = 0;
    document.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const clock = new THREE.Clock();

    const loop = () => {
      requestAnimationFrame(loop);

      if (!prefersReducedMotion) {
        const t = clock.getElapsedTime();
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;

        tx += (mouseX * 0.4 - tx) * 0.05;
        ty += (mouseY * 0.3 - ty) * 0.05;
        mesh.rotation.y += tx * 0.012;
        mesh.rotation.x += ty * 0.012;

        particles.rotation.y = t * 0.05;
        particles.rotation.x = t * 0.03;

        mesh.scale.setScalar(1 + Math.sin(t * 0.9) * 0.02);
      }

      renderer.render(scene, camera);
    };
    loop();

    // Resize observer (lebih akurat daripada window resize doang)
    const ro = new ResizeObserver(() => {
      const s = getSize();
      if (!s.w || !s.h) return;
      camera.aspect = s.w / s.h;
      camera.updateProjectionMatrix();
      renderer.setSize(s.w, s.h);
    });
    if (parent) ro.observe(parent);
  } catch (err) {
    console.warn("Three.js hero gagal:", err);
    canvas.style.display = "none";
    const fallback = document.getElementById("hero-fallback");
    if (fallback) fallback.style.display = "grid";
  }
}

function initAnimations() {
  initScrollReveal();
  initSkillBars();
  initTilt();
  initMagnetic();
  initParallax();
  initCounters();
  initHeroThreeJS();
}

document.addEventListener("components:ready", initAnimations);
document.addEventListener("DOMContentLoaded", () => setTimeout(initAnimations, 200));
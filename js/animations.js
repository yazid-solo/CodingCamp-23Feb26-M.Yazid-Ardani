/**
 * animations.js — Animasi & Efek Visual (UPGRADED)
 * - Scroll reveal (auto-stagger)
 * - Skill bar animation
 * - 3D Tilt (smooth / premium) + pointer glow
 * - Magnetic buttons (smooth)
 * - Parallax ringan (translate3d)
 * - Three.js hero (lebih depth)
 * - Counter angka
 */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const lerp = (a, b, t) => a + (b - a) * t;

let __animationsInited = false;

/* ---------- Scroll Reveal (auto stagger) ---------- */
function initScrollReveal() {
  const els = Array.from(document.querySelectorAll(".reveal"));
  if (!els.length) return;

  if (prefersReducedMotion) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }

  // Auto-stagger untuk element yang belum punya delay class
  const hasDelayClass = (el) =>
    ["reveal-delay-1", "reveal-delay-2", "reveal-delay-3", "reveal-delay-4"].some((c) =>
      el.classList.contains(c)
    );

  // group by section/container
  const groups = new Map();
  els.forEach((el) => {
    const group = el.closest("section") || el.parentElement;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(el);
  });

  groups.forEach((groupEls) => {
    groupEls.forEach((el, i) => {
      if (!hasDelayClass(el) && !el.style.transitionDelay) {
        el.style.transitionDelay = `${Math.min(i * 70, 350)}ms`;
      }
    });
  });

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
        setTimeout(() => (el.style.width = `${el.dataset.level || 0}%`), 120);
        io.unobserve(el);
      });
    },
    { threshold: 0.35 }
  );

  bars.forEach((bar) => io.observe(bar));
}

/* ---------- 3D Pointer Glow (shine ikut pointer) ---------- */
function add3DPointerGlow(selector = ".tilt, .card, .btn, .project-card, .tool-chip, .highlight-card") {
  const els = document.querySelectorAll(selector);
  els.forEach((el) => {
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
}

/* ---------- Smooth 3D Tilt (premium) ---------- */
function initTilt() {
  if (prefersReducedMotion) return;

  const tiltEls = document.querySelectorAll(".tilt");
  if (!tiltEls.length) return;

  // state per element (smooth lerp)
  const states = new Map();
  let rafId = null;

  const tick = () => {
    let stillRunning = false;

    states.forEach((s, el) => {
      // Smooth to target
      s.rx = lerp(s.rx, s.trx, 0.12);
      s.ry = lerp(s.ry, s.try, 0.12);
      s.tx = lerp(s.tx, s.ttx, 0.12);
      s.ty = lerp(s.ty, s.tty, 0.12);

      // if close enough, stop
      const done =
        Math.abs(s.rx - s.trx) < 0.01 &&
        Math.abs(s.ry - s.try) < 0.01 &&
        Math.abs(s.tx - s.ttx) < 0.05 &&
        Math.abs(s.ty - s.tty) < 0.05;

      const lift = parseFloat(el.dataset.tiltLift || "-5"); // bisa override
      const persp = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--tilt-persp")) || 950;

      el.style.transform = `perspective(${persp}px) rotateX(${s.rx}deg) rotateY(${s.ry}deg) translate3d(${s.tx}px, ${lift + s.ty}px, 0)`;

      if (!done) stillRunning = true;
    });

    if (stillRunning) rafId = requestAnimationFrame(tick);
    else rafId = null;
  };

  const ensureTick = () => {
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  function onMove(e) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width - 0.5;
    const cy = (e.clientY - r.top) / r.height - 0.5;

    const maxRX = parseFloat(el.dataset.tiltRx || "10");
    const maxRY = parseFloat(el.dataset.tiltRy || "14");

    const trx = clamp(-cy * maxRX, -maxRX, maxRX);
    const tryy = clamp(cx * maxRY, -maxRY, maxRY);

    const ttx = cx * 6; // geser halus
    const tty = cy * 3;

    const s = states.get(el);
    if (!s) return;

    s.trx = trx;
    s.try = tryy;
    s.ttx = ttx;
    s.tty = tty;

    ensureTick();
  }

  function onEnter(e) {
    const el = e.currentTarget;
    el.style.willChange = "transform";
    if (!states.has(el)) {
      states.set(el, { rx: 0, ry: 0, tx: 0, ty: 0, trx: 0, try: 0, ttx: 0, tty: 0 });
    }
  }

  function onLeave(e) {
    const el = e.currentTarget;
    const s = states.get(el);
    if (!s) return;

    s.trx = 0;
    s.try = 0;
    s.ttx = 0;
    s.tty = 0;

    ensureTick();

    // cleanup will-change after settle
    setTimeout(() => {
      el.style.willChange = "";
    }, 650);
  }

  tiltEls.forEach((el) => {
    if (el.__hasTilt) return;
    el.__hasTilt = true;

    el.addEventListener("pointerenter", onEnter, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
  });

  // expose for main.js reuse if needed
  window.__tiltMove = (e) => onMove(e);
  window.__tiltLeave = (e) => onLeave(e);
}

/* ---------- Magnetic Buttons (smooth) ---------- */
function initMagnetic() {
  if (prefersReducedMotion) return;

  const btns = document.querySelectorAll("[data-magnetic]");
  if (!btns.length) return;

  btns.forEach((btn) => {
    if (btn.__hasMagnetic) return;
    btn.__hasMagnetic = true;

    let tx = 0,
      ty = 0,
      rtx = 0,
      rty = 0,
      raf = null;

    const tick = () => {
      tx = lerp(tx, rtx, 0.18);
      ty = lerp(ty, rty, 0.18);

      // sedikit rotate biar “hidup”
      const rot = clamp((tx + ty) * 0.15, -3, 3);
      btn.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateZ(${rot}deg)`;

      const done = Math.abs(tx - rtx) < 0.05 && Math.abs(ty - rty) < 0.05;
      if (!done) raf = requestAnimationFrame(tick);
      else raf = null;
    };

    const ensure = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    btn.addEventListener(
      "pointermove",
      (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);

        rtx = x * 0.10;
        rty = y * 0.10;

        ensure();
      },
      { passive: true }
    );

    btn.addEventListener(
      "pointerleave",
      () => {
        rtx = 0;
        rty = 0;
        ensure();
        setTimeout(() => {
          if (!raf) btn.style.transform = "";
        }, 380);
      },
      { passive: true }
    );
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
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
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
          const p = Math.min((ts - startTime) / 1200, 1);
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

/* ---------- Three.js Hero (lebih depth) ---------- */
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
    const w = parent ? parent.clientWidth : 520;
    const h = parent ? parent.clientHeight : 520;
    return { w, h };
  };

  try {
    const { w, h } = getSize();

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    // Lights (biar 3D kerasa)
    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(2.2, 2.6, 2.2);
    scene.add(key);

    const rim = new THREE.PointLight(0xffffff, 0.75, 20);
    rim.position.set(-2.5, -1.8, 3.2);
    scene.add(rim);

    const geometry = new THREE.TorusKnotGeometry(1.1, 0.34, 180, 18, 2, 3);
    const material = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      metalness: 0.25,
      roughness: 0.25,
      transparent: true,
      opacity: 0.82,
      emissive: new THREE.Color(0x111827),
      emissiveIntensity: 0.25,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Particles
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(150 * 3);
    for (let i = 0; i < positions.length; i++) positions[i] = (Math.random() - 0.5) * 12;
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.055,
      transparent: true,
      opacity: 0.32,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Accent sync
    const accentMap = { indigo: 0x818cf8, cyan: 0x22d3ee, emerald: 0x34d399 };
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

    // Mouse smoothing
    let mouseX = 0,
      mouseY = 0,
      tx = 0,
      ty = 0;

    document.addEventListener(
      "pointermove",
      (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      },
      { passive: true }
    );

    const clock = new THREE.Clock();

    const loop = () => {
      requestAnimationFrame(loop);

      if (!prefersReducedMotion) {
        const t = clock.getElapsedTime();

        // base rotation
        mesh.rotation.x += 0.0026;
        mesh.rotation.y += 0.0038;

        // follow pointer (soft)
        tx += (mouseX * 0.45 - tx) * 0.05;
        ty += (mouseY * 0.30 - ty) * 0.05;

        mesh.rotation.y += tx * 0.02;
        mesh.rotation.x += ty * 0.02;

        particles.rotation.y = t * 0.06;
        particles.rotation.x = t * 0.04;

        // breathing scale
        mesh.scale.setScalar(1 + Math.sin(t * 0.9) * 0.02);

        // subtle camera float
        camera.position.x = Math.sin(t * 0.3) * 0.06;
        camera.position.y = Math.cos(t * 0.25) * 0.05;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };
    loop();

    // Resize observer
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

/* ---------- Init All (safe/once) ---------- */
function initAnimations() {
  if (__animationsInited) return;
  __animationsInited = true;

  initScrollReveal();
  initSkillBars();
  initTilt();
  initMagnetic();
  initParallax();
  initCounters();
  initHeroThreeJS();
  add3DPointerGlow(); // penting buat efek “premium”
}

document.addEventListener("components:ready", initAnimations);
document.addEventListener("DOMContentLoaded", () => setTimeout(initAnimations, 100));
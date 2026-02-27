/**
 * animations.js — Animasi & Efek Visual
 *
 * 1. Scroll reveal via IntersectionObserver
 * 2. Skill bar animation
 * 3. 3D tilt pada card (mouse move)
 * 4. Parallax ringan
 * 5. Three.js hero scene (canvas terkurung di kolom kanan)
 * 6. Counter angka
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── 1. Scroll Reveal ──────────────────────────────────────────
function initScrollReveal() {
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── 2. Skill Bar Animation ────────────────────────────────────
function initSkillBars() {
  if (prefersReducedMotion) {
    document.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = bar.dataset.level + '%';
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.width = (entry.target.dataset.level || 0) + '%';
        }, 150);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-fill').forEach(bar => observer.observe(bar));
}

// ── 3. 3D Tilt Effect ─────────────────────────────────────────
function initTilt() {
  if (prefersReducedMotion) return;
  document.querySelectorAll('.tilt').forEach(el => {
    el.addEventListener('mousemove', handleTiltMove);
    el.addEventListener('mouseleave', handleTiltLeave);
  });
}

function handleTiltMove(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const cx = (e.clientX - rect.left) / rect.width  - 0.5;
  const cy = (e.clientY - rect.top)  / rect.height - 0.5;
  card.style.transition = 'transform 0.1s ease';
  card.style.transform  = `perspective(800px) rotateX(${-cy * 8}deg) rotateY(${cx * 12}deg) scale3d(1.02,1.02,1.02)`;
}

function handleTiltLeave(e) {
  const card = e.currentTarget;
  card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
  card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
}

// ── 4. Parallax ───────────────────────────────────────────────
function initParallax() {
  if (prefersReducedMotion) return;
  const targets = document.querySelectorAll('[data-parallax]');
  if (!targets.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        targets.forEach(el => {
          el.style.transform = `translateY(${scrollY * (parseFloat(el.dataset.parallax) || 0.2)}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ── 5. Three.js Hero Scene ────────────────────────────────────
/*
  PENTING: Canvas sekarang hidup di dalam .hero-canvas-col,
  sehingga ukurannya mengikuti parent-nya — bukan window.
  Ini yang membuat teks tidak tertimpa lagi.
*/
function initHeroThreeJS() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  if (typeof THREE === 'undefined') {
    canvas.style.display = 'none';
    showHeroFallback();
    return;
  }

  try {
    // Ambil ukuran dari elemen parent (kolom kanan hero)
    const parent = canvas.parentElement;
    const W = parent ? parent.clientWidth  : 400;
    const H = parent ? parent.clientHeight : 400;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.set(0, 0, 4);

    // Wireframe torus knot — bentuk ikonik futuristik
    const geometry = new THREE.TorusKnotGeometry(1.1, 0.35, 128, 16, 2, 3);
    const material = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Partikel floating di background
    const particleGeo  = new THREE.BufferGeometry();
    const positions    = new Float32Array(80 * 3);
    for (let i = 0; i < 80 * 3; i++) positions[i] = (Math.random() - 0.5) * 12;
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat  = new THREE.PointsMaterial({ color: 0x818cf8, size: 0.05, transparent: true, opacity: 0.35 });
    const particles    = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Tracking posisi mouse untuk rotasi responsif
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Update warna saat accent berubah
    const accentColorMap = { indigo: 0x818cf8, cyan: 0x22d3ee, emerald: 0x34d399 };
    const htmlEl = document.documentElement;
    new MutationObserver(() => {
      const c = accentColorMap[htmlEl.getAttribute('data-accent')] || accentColorMap.indigo;
      material.color.setHex(c);
      particleMat.color.setHex(c);
    }).observe(htmlEl, { attributes: true, attributeFilter: ['data-accent'] });

    // Set warna awal
    const initColor = accentColorMap[htmlEl.getAttribute('data-accent')] || accentColorMap.indigo;
    material.color.setHex(initColor);
    particleMat.color.setHex(initColor);

    // Animasi loop
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        const elapsed = clock.getElapsedTime();
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;

        // Lerp (smooth follow) mouse
        targetX += (mouseX * 0.4 - targetX) * 0.05;
        targetY += (mouseY * 0.3 - targetY) * 0.05;
        mesh.rotation.y += targetX * 0.01;
        mesh.rotation.x += targetY * 0.01;

        particles.rotation.y = elapsed * 0.04;
        particles.rotation.x = elapsed * 0.02;

        // Efek "bernapas" — scale naik-turun pelan
        mesh.scale.setScalar(1 + Math.sin(elapsed * 0.8) * 0.02);
      }

      renderer.render(scene, camera);
    }
    animate();

    // Resize: pakai dimensi parent (kolom kanan), bukan window
    window.addEventListener('resize', () => {
      const p  = canvas.parentElement;
      const W2 = p ? p.clientWidth  : canvas.clientWidth;
      const H2 = p ? p.clientHeight : canvas.clientHeight;
      if (!W2 || !H2) return;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    });

  } catch (err) {
    console.warn('Three.js hero gagal:', err);
    canvas.style.display = 'none';
    showHeroFallback();
  }
}

function showHeroFallback() {
  const fallback = document.getElementById('hero-fallback');
  if (fallback) fallback.style.display = 'block';
}

// ── 6. Counter Angka ─────────────────────────────────────────
function initCounters() {
  if (prefersReducedMotion) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count, 10);
      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / 1500, 1);
        const eased    = 1 - Math.pow(1 - progress, 2);
        el.textContent = Math.floor(eased * end);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = end;
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

// ── Init: dipanggil setelah components selesai inject ─────────
function initAnimations() {
  initScrollReveal();
  initSkillBars();
  initTilt();
  initParallax();
  initCounters();

  if (document.getElementById('hero-canvas')) {
    if (typeof THREE !== 'undefined') {
      initHeroThreeJS();
    } else {
      // Polling singkat jika CDN belum selesai
      let tries = 0;
      const check = setInterval(() => {
        if (typeof THREE !== 'undefined') { clearInterval(check); initHeroThreeJS(); }
        else if (++tries > 20)            { clearInterval(check); showHeroFallback(); }
      }, 150);
    }
  }
}

document.addEventListener('components:ready', initAnimations);
document.addEventListener('DOMContentLoaded', () => setTimeout(initAnimations, 200));
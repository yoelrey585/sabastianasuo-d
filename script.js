/* ══════════════════════════════════════════
   SPACE CANVAS — hero background
══════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('spaceCanvas');
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], nebulaClouds = [], animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  /* ── stars ── */
  function initStars() {
    stars = [];
    const count = Math.floor((W * H) / 3200);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.4 + 0.1,
        twinkleOffset: Math.random() * Math.PI * 2,
        col: Math.random() > 0.85
          ? `rgba(93,255,154,`
          : Math.random() > 0.7
            ? `rgba(200,240,200,`
            : `rgba(220,240,225,`
      });
    }
  }

  /* ── nebula clouds (soft blobs) ── */
  function initNebula() {
    nebulaClouds = [
      { x: W * 0.15, y: H * 0.3,  rx: W * 0.28, ry: H * 0.22, col: 'rgba(16,60,28,0.55)' },
      { x: W * 0.75, y: H * 0.2,  rx: W * 0.22, ry: H * 0.18, col: 'rgba(8,40,20,0.45)'  },
      { x: W * 0.5,  y: H * 0.75, rx: W * 0.35, ry: H * 0.2,  col: 'rgba(12,48,24,0.4)'  },
      { x: W * 0.9,  y: H * 0.65, rx: W * 0.2,  ry: H * 0.25, col: 'rgba(93,255,154,0.04)'},
    ];
  }

  function drawNebula() {
    nebulaClouds.forEach(n => {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, Math.max(n.rx, n.ry));
      g.addColorStop(0, n.col);
      g.addColorStop(1, 'transparent');
      ctx.save();
      ctx.scale(n.rx / Math.max(n.rx, n.ry), n.ry / Math.max(n.rx, n.ry));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(
        n.x * (Math.max(n.rx, n.ry) / n.rx),
        n.y * (Math.max(n.rx, n.ry) / n.ry),
        Math.max(n.rx, n.ry), 0, Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    });
  }

  let t = 0;
  function draw() {
    t += 0.012;

    /* base — deep forest-space gradient */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0,   '#03100a');
    bg.addColorStop(0.4, '#060e08');
    bg.addColorStop(1,   '#091408');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* nebula */
    drawNebula();

    /* horizon glow — where the image meets the scene */
    const hg = ctx.createLinearGradient(0, H * 0.55, 0, H);
    hg.addColorStop(0, 'transparent');
    hg.addColorStop(0.6, 'rgba(15,45,20,0.45)');
    hg.addColorStop(1,   'rgba(6,14,8,0.85)');
    ctx.fillStyle = hg;
    ctx.fillRect(0, 0, W, H);

    /* stars */
    stars.forEach(s => {
      const alpha = s.a * (0.5 + 0.5 * Math.sin(t * s.speed + s.twinkleOffset));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.col + alpha + ')';
      ctx.fill();
    });

    /* subtle scan lines (very faint) */
    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    for (let y = 0; y < H; y += 3) {
      ctx.fillRect(0, y, W, 1);
    }

    animId = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    initStars();
    initNebula();
    if (animId) cancelAnimationFrame(animId);
    draw();
  }

  window.addEventListener('resize', () => { init(); });
  init();
})();


/* ══════════════════════════════════════════
   NAV — scroll class
══════════════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ══════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════ */
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ══════════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ══════════════════════════════════════════
   SIDE DOTS — active state on scroll
══════════════════════════════════════════ */
const sideDots = document.querySelectorAll('.side-dot');
const sections = ['home', 'projects', 'about', 'contact'];

function updateDots() {
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.scrollY >= el.offsetTop - window.innerHeight / 2) current = id;
  });
  sideDots.forEach(d => {
    d.classList.toggle('active', d.dataset.section === current);
  });
}

window.addEventListener('scroll', updateDots, { passive: true });
updateDots();


/* ══════════════════════════════════════════
   FADE IN — intersection observer
══════════════════════════════════════════ */
const io = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => io.observe(el));


/* ══════════════════════════════════════════
   TICKER — duplicate content for seamless loop
══════════════════════════════════════════ */
const strip = document.querySelector('.intro-strip-inner');
if (strip) {
  strip.innerHTML += strip.innerHTML;
}


/* ══════════════════════════════════════════
   PROJECT CARD TILT — desktop only
══════════════════════════════════════════ */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.work-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transition = 'transform 0.08s ease, background 0.35s';
      card.style.transform  = `perspective(800px) rotateX(${-y * 2.5}deg) rotateY(${x * 2.5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease, background 0.35s';
      card.style.transform  = '';
    });
  });
}
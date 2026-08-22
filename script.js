/* ── SPACE CANVAS ── */
(function () {
  const canvas = document.getElementById('spaceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], shootingStars = [], nebulas = [], animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function initStars() {
    stars = [];
    const count = Math.floor((W * H) / 2800);
    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.15,
        a: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.35 + 0.08,
        phase: Math.random() * Math.PI * 2,
        col: roll > 0.9
          ? `rgba(120,192,255,`
          : roll > 0.75
            ? `rgba(180,215,255,`
            : `rgba(230,240,255,`
      });
    }
  }

  function initNebulas() {
    nebulas = [
      { x: W*0.12, y: H*0.22, rx: W*0.30, ry: H*0.25, col:'rgba(10,25,55,0.6)'    },
      { x: W*0.78, y: H*0.18, rx: W*0.25, ry: H*0.20, col:'rgba(8,18,45,0.5)'     },
      { x: W*0.50, y: H*0.72, rx: W*0.38, ry: H*0.22, col:'rgba(5,15,40,0.45)'    },
      { x: W*0.88, y: H*0.60, rx: W*0.22, ry: H*0.28, col:'rgba(30,70,130,0.07)'  },
      { x: W*0.25, y: H*0.80, rx: W*0.20, ry: H*0.18, col:'rgba(20,55,110,0.06)'  },
    ];
  }

  function drawNebulas() {
    nebulas.forEach(n => {
      const maxR = Math.max(n.rx, n.ry);
      const sx   = n.rx / maxR;
      const sy   = n.ry / maxR;
      const g    = ctx.createRadialGradient(
        n.x / sx, n.y / sy, 0,
        n.x / sx, n.y / sy, maxR
      );
      g.addColorStop(0, n.col);
      g.addColorStop(1, 'transparent');
      ctx.save();
      ctx.scale(sx, sy);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x / sx, n.y / sy, maxR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function spawnShooting() {
    if (shootingStars.length > 2) return;
    if (Math.random() > 0.004) return;
    const y0 = Math.random() * H * 0.5;
    shootingStars.push({
      x: Math.random() * W * 0.6,
      y: y0,
      len: Math.random() * 120 + 60,
      speed: Math.random() * 8 + 6,
      a: 1,
      angle: Math.PI / 5 + Math.random() * 0.2,
    });
  }

  function drawShooting() {
    shootingStars = shootingStars.filter(s => s.a > 0.01);
    shootingStars.forEach(s => {
      const dx = Math.cos(s.angle) * s.len;
      const dy = Math.sin(s.angle) * s.len;
      const g  = ctx.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy);
      g.addColorStop(0, `rgba(180,220,255,${s.a})`);
      g.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - dx, s.y - dy);
      ctx.strokeStyle = g;
      ctx.lineWidth   = 1.2;
      ctx.stroke();
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.a -= 0.018;
    });
  }

  let t = 0;
  function draw() {
    t += 0.01;

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0,    '#02060f');
    bg.addColorStop(0.35, '#020408');
    bg.addColorStop(1,    '#010204');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    drawNebulas();

    const hg = ctx.createLinearGradient(0, H * 0.5, 0, H);
    hg.addColorStop(0,   'transparent');
    hg.addColorStop(0.7, 'rgba(2,4,10,0.5)');
    hg.addColorStop(1,   'rgba(2,4,10,0.92)');
    ctx.fillStyle = hg;
    ctx.fillRect(0, 0, W, H);

    stars.forEach(s => {
      const alpha = s.a * (0.4 + 0.6 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.col + alpha + ')';
      ctx.fill();
    });

    spawnShooting();
    drawShooting();

    animId = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    initStars();
    initNebulas();
    if (animId) cancelAnimationFrame(animId);
    draw();
  }

  window.addEventListener('resize', init);
  init();
})();

/* ── NAV SCROLL STATE ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── MOBILE MENU ── */
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

/* ── SMOOTH SCROLL ── */
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

/* ── SIDE DOTS — scroll tracking, all 7 sections ── */
const sideDots = document.querySelectorAll('.side-dot');
const sections = ['home', 'about', 'research', 'clinical', 'creative', 'skills', 'contact'];

function updateDots() {
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - window.innerHeight / 2) current = id;
  });
  sideDots.forEach(d => d.classList.toggle('active', d.dataset.section === current));
}

window.addEventListener('scroll', updateDots, { passive: true });
updateDots();

/* ── FADE IN ── */
const io = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 85);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

/* ── TICKER — seamless loop ── */
const strip = document.querySelector('.intro-strip-inner');
if (strip) strip.innerHTML += strip.innerHTML;

/* ── CARD TILT — desktop only ── */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.research-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transition = 'transform 0.08s ease, border-color 0.3s';
      card.style.transform  = `perspective(900px) rotateX(${-y * 1.5}deg) rotateY(${x * 1.5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s ease, border-color 0.3s';
      card.style.transform  = '';
    });
  });
}
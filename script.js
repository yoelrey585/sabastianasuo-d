/* ── SPACE CANVAS WITH PARALLAX ── */
(function () {
  const canvas = document.getElementById('spaceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], shootingStars = [], nebulas = [], animId;
  let mouseX = 0, mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
  });

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function initStars() {
    stars = [];
    const count = Math.floor((W * H) / 2500);
    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * 0.6 + 0.4,
        speed: Math.random() * 0.2 + 0.05,
        phase: Math.random() * Math.PI * 2,
        col: roll > 0.9
          ? `rgba(0, 242, 255,`
          : roll > 0.75
            ? `rgba(240, 154, 56,`
            : `rgba(255, 255, 255,`
      });
    }
  }

  function initNebulas() {
    nebulas = [
      { x: W * 0.15, y: H * 0.25, rx: W * 0.35, ry: H * 0.30, col: 'rgba(0, 242, 255, 0.03)' },
      { x: W * 0.80, y: H * 0.20, rx: W * 0.30, ry: H * 0.25, col: 'rgba(240, 154, 56, 0.02)' },
      { x: W * 0.50, y: H * 0.75, rx: W * 0.40, ry: H * 0.25, col: 'rgba(0, 242, 255, 0.02)' }
    ];
  }

  function drawNebulas() {
    nebulas.forEach(n => {
      const maxR = Math.max(n.rx, n.ry);
      const sx = n.rx / maxR;
      const sy = n.ry / maxR;
      const g = ctx.createRadialGradient(n.x / sx, n.y / sy, 0, n.x / sx, n.y / sy, maxR);
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
    if (Math.random() > 0.003) return;
    const y0 = Math.random() * H * 0.4;
    shootingStars.push({
      x: Math.random() * W * 0.7,
      y: y0,
      len: Math.random() * 100 + 50,
      speed: Math.random() * 6 + 5,
      a: 1,
      angle: Math.PI / 4 + Math.random() * 0.3,
    });
  }

  function drawShooting() {
    shootingStars = shootingStars.filter(s => s.a > 0.01);
    shootingStars.forEach(s => {
      const dx = Math.cos(s.angle) * s.len;
      const dy = Math.sin(s.angle) * s.len;
      const g = ctx.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy);
      g.addColorStop(0, `rgba(0, 242, 255, ${s.a})`);
      g.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - dx, s.y - dy);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1;
      ctx.stroke();
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.a -= 0.015;
    });
  }

  let t = 0;
  function draw() {
    t += 0.005;

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#020408');
    bg.addColorStop(0.5, '#050810');
    bg.addColorStop(1, '#080C14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    drawNebulas();

    // Parallax offset
    ctx.save();
    ctx.translate(mouseX * 0.3, mouseY * 0.3);

    stars.forEach(s => {
      const alpha = s.a * (0.3 + 0.7 * Math.sin(t * s.speed * 10 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.col + alpha + ')';
      ctx.fill();
    });

    ctx.restore();

    // Horizon fade
    const hg = ctx.createLinearGradient(0, H * 0.6, 0, H);
    hg.addColorStop(0, 'transparent');
    hg.addColorStop(1, 'rgba(2, 4, 8, 0.95)');
    ctx.fillStyle = hg;
    ctx.fillRect(0, 0, W, H);

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
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── MOBILE MENU ── */
const menuBtn = document.getElementById('menuBtn');
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

/* ── SIDE DOTS — scroll tracking ── */
const sideDots = document.querySelectorAll('.side-dot');
const sections = ['home', 'about', 'research', 'clinical', 'creative', 'skills', 'contact'];

function updateDots() {
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - window.innerHeight / 2.5) {
      current = id;
    }
  });
  sideDots.forEach(d => d.classList.toggle('active', d.dataset.section === current));
}

window.addEventListener('scroll', updateDots, { passive: true });
updateDots();

/* ── FADE IN OBSERVER ── */
const io = new IntersectionObserver(entries => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

/* ── TICKER — seamless loop ── */
const strip = document.querySelector('.intro-strip-inner');
if (strip) strip.innerHTML += strip.innerHTML;

/* ── CARD TILT EFFECT ── */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const tiltElements = document.querySelectorAll('[data-tilt], .glass-panel');
  
  tiltElements.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      
      card.style.transition = 'transform 0.1s ease, border-color 0.4s ease, box-shadow 0.4s ease';
      card.style.transform = `perspective(1000px) rotateX(${-y * 2}deg) rotateY(${x * 2}deg) scale3d(1.01, 1.01, 1.01)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s ease, border-color 0.4s ease, box-shadow 0.4s ease';
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}
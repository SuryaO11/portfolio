/* ============================================================
   SURYA RANJAN VERMA — PORTFOLIO JavaScript
   GSAP Animations + Interactive Features
   ============================================================ */

// ===== GSAP SETUP =====
gsap.registerPlugin(ScrollTrigger);

// ===== TYPED TEXT EFFECT =====
const phrases = [
  'AI-powered solutions.',
  'RAG pipelines.',
  'LLM applications.',
  'intelligent chatbots.',
  'computer vision apps.',
  'GenAI workflows.',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeEffect() {
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 55 : 95;

  if (!isDeleting && charIndex === current.length) {
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 400;
  }

  setTimeout(typeEffect, speed);
}

window.addEventListener('load', () => {
  setTimeout(typeEffect, 800);
});

// ===== HERO ENTRANCE ANIMATIONS =====
const heroTl = gsap.timeline({ delay: 0.2 });

heroTl
  .from('#hero-badge', {
    opacity: 0, y: -20, duration: 0.6, ease: 'back.out(1.7)'
  })
  .from('.name-first', {
    opacity: 0, x: -40, duration: 0.7, ease: 'power3.out'
  }, '-=0.2')
  .from('.name-last', {
    opacity: 0, x: -40, duration: 0.7, ease: 'power3.out'
  }, '-=0.4')
  .from('#hero-title', {
    opacity: 0, y: 20, duration: 0.6, ease: 'power2.out'
  }, '-=0.3')
  .from('#hero-tagline', {
    opacity: 0, y: 16, duration: 0.5, ease: 'power2.out'
  }, '-=0.2')
  .from('#hero-actions a', {
    opacity: 0, y: 20, stagger: 0.12, duration: 0.5, ease: 'power2.out'
  }, '-=0.2')
  .from('#hero-socials .social-link', {
    opacity: 0, scale: 0.6, stagger: 0.1, duration: 0.4, ease: 'back.out(1.7)'
  }, '-=0.2')
  .from('#hero-avatar', {
    opacity: 0, scale: 0.8, duration: 0.8, ease: 'power3.out'
  }, '-=0.8')
  .from('.floating-tag', {
    opacity: 0, scale: 0, stagger: 0.15, duration: 0.5, ease: 'back.out(2)'
  }, '-=0.4')
  .from('.hero-scroll-hint', {
    opacity: 0, y: 10, duration: 0.5, ease: 'power2.out'
  }, '-=0.2');

// ===== NEURAL NETWORK CANVAS =====
(function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createNodes(count) {
    return Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update positions
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }

    // Draw connections
    const maxDist = 140;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.35;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(45, 212, 191, 0.6)';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  nodes = createNodes(60);
  draw();
  window.addEventListener('resize', () => { resize(); });
})();

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings in same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target) {
  const isYear = target > 999;
  let start = isYear ? target - 10 : 0;
  const duration = isYear ? 600 : 1200;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.count, 10));
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-count]').forEach(el => counterObserver.observe(el));

// ===== GSAP SCROLL ANIMATIONS =====
// Fix: Use gsap.set() + ScrollTrigger onEnter + gsap.to() so the final
// opacity is explicitly 1, which overrides the .reveal CSS opacity:0.

// Skills categories stagger
gsap.utils.toArray('.skill-category').forEach((el, i) => {
  gsap.set(el, { opacity: 0, y: 30 });
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.6, delay: i * 0.09, ease: 'power2.out' }),
  });
});

// Project cards
gsap.utils.toArray('.project-card').forEach((el, i) => {
  gsap.set(el, { opacity: 0, y: 40 });
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.13, ease: 'power3.out' }),
  });
});

// Cert cards
gsap.utils.toArray('.cert-card').forEach((el, i) => {
  gsap.set(el, { opacity: 0, x: -24 });
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => gsap.to(el, { opacity: 1, x: 0, duration: 0.6, delay: i * 0.1, ease: 'power2.out' }),
  });
});

// Timeline
gsap.utils.toArray('.timeline-item').forEach((el) => {
  gsap.set(el, { opacity: 0, x: 40 });
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => gsap.to(el, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }),
  });
});

// Section titles
gsap.utils.toArray('.section-title').forEach(el => {
  gsap.set(el, { opacity: 0, y: 20 });
  ScrollTrigger.create({
    trigger: el,
    start: 'top 92%',
    once: true,
    onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }),
  });
});

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');
const submitBtn = document.getElementById('form-submit-btn');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('form-name').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const message = document.getElementById('form-message').value.trim();

  if (!name || !email || !message) {
    // Shake invalid fields
    [document.getElementById('form-name'), document.getElementById('form-email'), document.getElementById('form-message')].forEach(field => {
      if (!field.value.trim()) {
        gsap.fromTo(field, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)', clearProps: 'x' });
        field.style.borderColor = 'rgba(248,113,113,0.5)';
        setTimeout(() => field.style.borderColor = '', 2000);
      }
    });
    return;
  }

  // Simulate send
  const btnText = submitBtn.querySelector('.btn-text');
  btnText.textContent = 'Sending...';
  submitBtn.disabled = true;

  setTimeout(() => {
    btnText.textContent = 'Send Message';
    submitBtn.disabled = false;
    successMsg.classList.add('show');
    form.reset();
    gsap.from(successMsg, { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' });

    // Open mailto as a nice fallback
    const subject = encodeURIComponent(document.getElementById('form-subject').value || 'Portfolio Contact');
    const body = encodeURIComponent(`Hi Surya,\n\nName: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:Surya2004ranjan@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => successMsg.classList.remove('show'), 6000);
  }, 1200);
});

// ===== SMOOTH CURSOR GLOW (desktop only) =====
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 400px; height: 400px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(34,211,238,0.045) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

// ===== SKILL TAG INTERACTIVE HOVER =====
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    gsap.to(tag, { scale: 1.08, duration: 0.2, ease: 'power1.out' });
  });
  tag.addEventListener('mouseleave', () => {
    gsap.to(tag, { scale: 1, duration: 0.2, ease: 'power1.out' });
  });
});

// ===== COPY EMAIL ON CLICK =====
document.getElementById('contact-email-link').addEventListener('click', (e) => {
  if (navigator.clipboard) {
    // Let the href handle mailto, but also copy
    navigator.clipboard.writeText('Surya2004ranjan@gmail.com').catch(() => {});
  }
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
});

// ===== TECH BADGE INTERACTIVE =====
document.querySelectorAll('.tech-badge').forEach(badge => {
  badge.addEventListener('mouseenter', () => {
    gsap.to(badge, { y: -3, duration: 0.2, ease: 'power1.out' });
  });
  badge.addEventListener('mouseleave', () => {
    gsap.to(badge, { y: 0, duration: 0.2, ease: 'power1.out' });
  });
});

// ===== AVATAR HOVER EFFECT =====
const avatarCore = document.querySelector('.avatar-core');
if (avatarCore) {
  avatarCore.addEventListener('mouseenter', () => {
    gsap.to('.avatar-core', { scale: 1.06, duration: 0.3, ease: 'power2.out' });
    gsap.to('.ring-1', { scale: 1.05, duration: 0.3, ease: 'power2.out' });
  });
  avatarCore.addEventListener('mouseleave', () => {
    gsap.to(['.avatar-core', '.ring-1'], { scale: 1, duration: 0.3, ease: 'power2.out' });
  });
}



console.log('%c SRV Portfolio ✦ Built with GSAP + Vanilla JS ', 
  'background: #022837; color: #22d3ee; padding: 8px 16px; border-radius: 6px; font-weight: bold; font-size: 14px;');

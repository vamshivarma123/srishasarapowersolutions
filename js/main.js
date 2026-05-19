/**
 * Srishasara PowerTech Solutions — Main JS + GSAP
 */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ——— Power grid canvas ——— */
  function initPowerGrid() {
    const canvas = document.getElementById('powerGrid');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w, h, nodes, animId;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      const cols = Math.floor(w / 50);
      const rows = Math.floor(h / 50);
      nodes = [];
      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          nodes.push({ x: x * 50, y: y * 50, pulse: Math.random() });
        }
      }
    }

    function draw(time) {
      ctx.clearRect(0, 0, w, h);
      const t = time * 0.001;

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
      ctx.lineWidth = 1;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const glow = 0.3 + 0.7 * Math.sin(t * 2 + n.pulse * 10);

        if (i % 7 === 0) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2 * glow, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 229, 255, ${0.15 * glow})`;
          ctx.fill();
        }

        const right = nodes[i + 1];
        const below = nodes.find((m) => m.x === n.x && m.y === n.y + 50);
        if (right && right.y === n.y && Math.random() > 0.92) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(right.x, right.y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${0.12 * glow})`;
          ctx.stroke();
        }
        if (below && Math.random() > 0.94) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(below.x, below.y);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    animId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animId);
  }

  /* ——— Hero particles ——— */
  function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const count = 40;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'hero__particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      container.appendChild(p);

      gsap.to(p, {
        y: `+=${-80 - Math.random() * 120}`,
        x: `+=${(Math.random() - 0.5) * 60}`,
        opacity: 0,
        duration: 4 + Math.random() * 4,
        repeat: -1,
        delay: Math.random() * 4,
        ease: 'none',
        onRepeat: () => {
          gsap.set(p, {
            left: `${Math.random() * 100}%`,
            top: `${80 + Math.random() * 20}%`,
            opacity: 0.6,
            y: 0,
            x: 0,
          });
        },
      });
    }
  }

  /* ——— Header scroll ——— */
  function initHeader() {
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    if (header) {
      ScrollTrigger.create({
        start: 'top -80',
        onUpdate: (self) => {
          header.classList.toggle('scrolled', self.scroll() > 50);
        },
      });
    }

    if (hamburger && nav) {
      hamburger.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });

      nav.querySelectorAll('.nav__link').forEach((link) => {
        link.addEventListener('click', () => {
          nav.classList.remove('open');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* ——— GSAP scroll reveals ——— */
  function initReveals() {
    gsap.utils.toArray('.reveal-up').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });
    });

    gsap.utils.toArray('.reveal-left').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    });

    gsap.utils.toArray('.reveal-right').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        x: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    });

    /* Hero stagger */
    const hero = document.querySelector('.hero__content');
    if (hero) {
      gsap.from('.hero__badge, .hero__title .line, .hero__subtitle, .hero__actions, .hero__stats', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        delay: 0.2,
        ease: 'power3.out',
      });
    }

    /* Page hero */
    gsap.from('.page-hero__content > *', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
    });
  }

  /* ——— Animated counters ——— */
  function initCounters() {
    document.querySelectorAll('.counter-item__num, [data-count]').forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;

      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.floor(obj.val) + (target >= 100 ? '+' : '');
            },
          });
        },
      });
    });

    document.querySelectorAll('.hero__stats [data-count]').forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        delay: 1,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.floor(obj.val) + '+';
        },
      });
    });
  }

  /* ——— Service card 3D tilt ——— */
  function initTiltCards() {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -8;
        const rotateY = ((x - cx) / cx) * 8;

        card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--my', `${(y / rect.height) * 100}%`);

        gsap.to(card, {
          rotateX,
          rotateY,
          transformPerspective: 800,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      });
    });
  }

  /* ——— Parallax ——— */
  function initParallax() {
    document.querySelectorAll('.parallax-layer').forEach((el) => {
      const speed = parseFloat(el.dataset.speed) || 0.2;
      gsap.to(el, {
        y: () => window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.hero') || el,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  /* ——— Cursor glow ——— */
  function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow || window.matchMedia('(max-width: 768px)').matches) return;

    document.addEventListener('mousemove', (e) => {
      gsap.to(glow, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.6,
        ease: 'power2.out',
      });
    });
  }

  /* ——— Contact form ——— */
  function initForm() {
    const form = document.getElementById('quoteForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;

      gsap.to(btn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });

      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        let msg = form.querySelector('.form-success');
        if (!msg) {
          msg = document.createElement('div');
          msg.className = 'form-success';
          form.appendChild(msg);
        }
        msg.textContent =
          'Thank you! We will contact you within 24 hours. For urgent needs, WhatsApp us directly.';
        btn.textContent = original;
        btn.disabled = false;
        form.reset();

        gsap.from(msg, { opacity: 0, y: 10, duration: 0.5 });
      }, 1200);
    });

    form.querySelectorAll('input, textarea, select').forEach((field) => {
      field.addEventListener('focus', () => {
        gsap.to(field.parentElement, { scale: 1.01, duration: 0.2 });
      });
      field.addEventListener('blur', () => {
        gsap.to(field.parentElement, { scale: 1, duration: 0.2 });
      });
    });
  }

  /* ——— Smooth anchor highlight ——— */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ——— Init ——— */
  function init() {
    initPowerGrid();
    initParticles();
    initHeader();
    initReveals();
    initCounters();
    initTiltCards();
    initParallax();
    initCursorGlow();
    initForm();
    initSmoothAnchors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

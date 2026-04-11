/* ============================================================
   JS — Christoph Reinartz Portfolio
   ============================================================ */

const rot13 = (s) =>
  s.replace(/[a-zA-Z]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() <= 'm' ? 13 : -13))
  );

// Decode obfuscated contact info as soon as the script runs (DOM is ready at end of body).
document.querySelectorAll('[data-obf]').forEach((el) => {
  const email = rot13(el.getAttribute('data-obf'));
  el.setAttribute('href', `mailto:${email}`);
  el.textContent = email;
});

document.querySelectorAll('[data-name]').forEach((el) => {
  el.textContent = rot13(el.getAttribute('data-name'));
});

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = prefersReducedMotion();

  const skipLink = document.querySelector('.skip-link');
  const mainEl = document.getElementById('main-content');
  if (skipLink && mainEl) {
    skipLink.addEventListener('click', () => {
      requestAnimationFrame(() => mainEl.focus({ preventScroll: true }));
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const nav = document.querySelector('.nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.nav-links a');

  const setMenuOpen = (open) => {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-menu-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      setMenuOpen(!nav.classList.contains('is-open'));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 480) setMenuOpen(false);
    });
  }

  // --- Scroll Reveal ---
  const reveals = document.querySelectorAll('.reveal');

  if (!reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  const scrollBehavior = reduceMotion ? 'auto' : 'smooth';

  // --- Smooth scroll for in-page links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const top =
          target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top, behavior: scrollBehavior });
        setMenuOpen(false);
      }
    });
  });

  // --- Nav background on scroll ---
  const bgRgb = getComputedStyle(document.documentElement)
    .getPropertyValue('--bg-rgb')
    .trim();

  if (nav) {
    window.addEventListener(
      'scroll',
      () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
          nav.style.background = `rgba(${bgRgb}, 0.94)`;
          nav.style.borderBottomColor = 'rgba(255,255,255,0.1)';
        } else {
          nav.style.background = `rgba(${bgRgb}, 0.88)`;
          nav.style.borderBottomColor = 'rgba(255,255,255,0.07)';
        }
      },
      { passive: true }
    );
  }

  // --- Active nav link highlight on scroll ---
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.style.color =
              link.getAttribute('href') === `#${id}`
                ? 'var(--text)'
                : 'var(--text-muted)';
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  // --- Ambient floating particles (Hello World example) ---
  if (!reduceMotion) {
    const particleRoot = document.getElementById('ambient-particles');
    if (particleRoot) {
      const count = 40;
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'ambient-particle';
        p.style.left = `${Math.random() * 100}vw`;
        p.style.animationDuration = `${6 + Math.random() * 12}s`;
        p.style.animationDelay = `${Math.random() * 15}s`;
        const size = 1 + Math.random() * 3;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.opacity = String(0.3 + Math.random() * 0.5);
        particleRoot.appendChild(p);
      }
    }
  }
});

/* ============================================================
   JS — Christoph Reinartz Portfolio
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- ROT13 decoder ---
  const rot13 = s => s.replace(/[a-zA-Z]/g, c =>
    String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() <= 'm' ? 13 : -13))
  );

  // Emails
  document.querySelectorAll('[data-obf]').forEach(el => {
    const email = rot13(el.getAttribute('data-obf'));
    el.setAttribute('href', `mailto:${email}`);
    el.textContent = email;
  });

  // Names
  document.querySelectorAll('[data-name]').forEach(el => {
    el.textContent = rot13(el.getAttribute('data-name'));
  });

  // --- Year in footer ---
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // --- Scroll Reveal (Intersection Observer) ---
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop observing to save resources
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  reveals.forEach((el) => revealObserver.observe(el));


  // --- Smooth scroll for nav links (fallback for older browsers) ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // --- Nav background on scroll ---
  const nav = document.querySelector('.nav');
  const bgRgb = getComputedStyle(document.documentElement)
    .getPropertyValue('--bg-rgb').trim();

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      nav.style.background = `rgba(${bgRgb}, 0.94)`;
      nav.style.borderBottomColor = 'rgba(255,255,255,0.1)';
    } else {
      nav.style.background = `rgba(${bgRgb}, 0.88)`;
      nav.style.borderBottomColor = 'rgba(255,255,255,0.07)';
    }
  }, { passive: true });


  // --- Active nav link highlight on scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.style.color = link.getAttribute('href') === `#${id}`
              ? 'var(--text)'
              : 'var(--text-muted)';
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
  );

  sections.forEach((s) => sectionObserver.observe(s));

});

// Nav scroll state
const navWrap = document.querySelector('.nav-wrap');
window.addEventListener('scroll', () => {
  navWrap.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Mobile burger
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll(
  '.service-card, .stat, .timeline-item, .about-text, .about-stats, .contact-intro, .contact-email'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-delay-1');
  if (i % 3 === 2) el.classList.add('reveal-delay-2');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

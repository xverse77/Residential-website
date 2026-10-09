import './style.css';

const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');
const progress = document.querySelector('[data-scroll-progress]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const closeMenu = () => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menu?.classList.remove('is-open');
};

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menu?.classList.toggle('is-open', !isOpen);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    closeMenu();
  });
});

document.querySelectorAll('[data-scroll-contact]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  });
});

const updateScrollState = () => {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = scrollable ? scrollTop / scrollable : 0;
  header?.classList.toggle('is-scrolled', scrollTop > 20);
  if (progress) progress.style.transform = `scaleX(${scrollPercent})`;

  if (!reducedMotion) {
    document.querySelectorAll('[data-parallax]').forEach((element) => {
      const speed = Number(element.dataset.parallax) || 0;
      const rect = element.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
      element.style.setProperty('--parallax-y', `${offset}px`);
    });
  }
};

if (reducedMotion) document.documentElement.classList.add('reduced-motion');
window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', updateScrollState, { passive: true });
updateScrollState();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

document.querySelectorAll('.reveal, .fade-up, .media-reveal').forEach((element, index) => {
  if (reducedMotion) element.classList.add('is-visible');
  else {
    element.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 70}ms`);
    revealObserver.observe(element);
  }
});

const form = document.querySelector('[data-interest-form]');
const formNote = document.querySelector('[data-form-note]');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  form.reset();
  if (formNote) {
    formNote.textContent = 'Thank you — your private viewing request is on its way.';
    formNote.classList.add('is-success');
  }
});

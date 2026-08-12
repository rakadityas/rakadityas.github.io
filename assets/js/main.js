(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'theme';

  const applyTheme = (theme) => {
    if (theme) root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');
  };

  const stored = localStorage.getItem(STORAGE_KEY);
  applyTheme(stored);

  themeToggle.addEventListener('click', () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const current = root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  // Sticky nav shadow on scroll
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const burger = document.getElementById('nav-burger');
  const navLinks = document.querySelector('.nav-links');
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    navLinks.classList.toggle('mobile-open', open);
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();
})();

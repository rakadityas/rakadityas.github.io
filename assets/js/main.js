(() => {
  'use strict';

  const root = document.documentElement;

  /* ---------- Theme ----------
     The stored theme is applied by an inline script in <head> to avoid a flash
     of the wrong theme; here we only wire up the toggle and sync its state. */
  const STORAGE_KEY = 'theme';
  const themeToggle = document.getElementById('theme-toggle');
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const isDark = () => {
    const set = root.getAttribute('data-theme');
    return set ? set === 'dark' : darkQuery.matches;
  };

  const syncToggle = () => {
    if (!themeToggle) return;
    const dark = isDark();
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };

  syncToggle();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
      syncToggle();
    });
  }

  // Follow the OS while the visitor hasn't made an explicit choice.
  darkQuery.addEventListener('change', () => {
    if (!root.getAttribute('data-theme')) syncToggle();
  });

  /* ---------- Sticky nav shadow ---------- */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');

  if (burger && navLinks) {
    const setMenu = (open) => {
      burger.classList.toggle('open', open);
      navLinks.classList.toggle('mobile-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    burger.addEventListener('click', () => setMenu(!burger.classList.contains('open')));

    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && burger.classList.contains('open')) {
        setMenu(false);
        burger.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (!burger.classList.contains('open')) return;
      if (!navLinks.contains(e.target) && !burger.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('in-view'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Scrollspy: highlight the section in view ---------- */
  const spyLinks = Array.from(
    document.querySelectorAll('.nav-links a[href^="#"]')
  ).filter((a) => a.getAttribute('href').length > 1);

  if (spyLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map();
    const sections = [];

    spyLinks.forEach((link) => {
      const section = document.getElementById(link.getAttribute('href').slice(1));
      if (!section) return;
      byId.set(section.id, link);
      sections.push(section);
    });

    const visible = new Set();

    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });

      // Highlight the topmost section currently in view.
      const current = sections.find((s) => visible.has(s.id));
      spyLinks.forEach((l) => l.classList.remove('active'));
      if (current) {
        const link = byId.get(current.id);
        if (link) link.classList.add('active');
      }
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });

    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Hero typewriter ----------
     Types a phrase, holds, deletes it, moves to the next. The element is
     aria-hidden; a static equivalent sits beside it for assistive tech. */
  const typer = document.getElementById('typer');

  if (typer) {
    const PHRASES = [
      'distributed systems engineer',
      'Go backend specialist',
      'promotion platform architect',
      '80k req/s at sub-50ms',
      'team lead & mentor',
    ];

    if (reduceMotion) {
      typer.textContent = PHRASES[0];
    } else {
      const TYPE_MS = 55;
      const DELETE_MS = 28;
      const HOLD_MS = 1600;
      const GAP_MS = 400;

      let phrase = 0;
      let chars = 0;
      let deleting = false;

      const tick = () => {
        const text = PHRASES[phrase];
        chars += deleting ? -1 : 1;
        typer.textContent = text.slice(0, chars);

        let delay = deleting ? DELETE_MS : TYPE_MS;

        if (!deleting && chars === text.length) {
          deleting = true;
          delay = HOLD_MS;
        } else if (deleting && chars === 0) {
          deleting = false;
          phrase = (phrase + 1) % PHRASES.length;
          delay = GAP_MS;
        }

        setTimeout(tick, delay);
      };

      tick();
    }
  }

  /* ---------- Derived values ---------- */
  const CAREER_START = new Date(2018, 2); // March 2018

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const yearsEl = document.getElementById('years-exp');
  if (yearsEl) {
    const now = new Date();
    let years = now.getFullYear() - CAREER_START.getFullYear();
    if (now.getMonth() < CAREER_START.getMonth()) years -= 1;
    yearsEl.textContent = String(years);
  }
})();

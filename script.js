// script.js
// Wrap everything to run after DOM is ready
document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------
     Utility: inject minimal CSS for animations + mobile toggle visuals
     ------------------------------ */
  (function injectCSS() {
    const css = `
      /* injected by script.js */
      .mobile-nav-toggle {
        display: none;
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 22px;
        color: white;
      }
      @media (max-width: 768px) {
        .mobile-nav-toggle { display: inline-block; }
        header nav { display: none; }
        header nav.open { display: block; background: rgba(9,40,74,0.98); padding: 15px; border-radius: 8px; margin-top: 10px; }
        header nav ul { flex-direction: column; gap: 10px; }
      }

      /* reveal animation */
      .reveal-hidden { opacity: 0; transform: translateY(20px); transition: opacity 600ms ease, transform 600ms ease; }
      .reveal-visible { opacity: 1; transform: translateY(0); }

      /* typing caret */
      .typing-caret { border-right: 2px solid rgba(255,255,255,0.9); animation: blink 900ms steps(2, start) infinite; }
      @keyframes blink { 50% { border-color: transparent; } }

      /* toast */
      .pu-toast {
        position: fixed;
        right: 20px;
        bottom: 20px;
        background: rgba(9,40,74,0.95);
        color: #fff;
        padding: 10px 14px;
        border-radius: 8px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.2);
        z-index: 9999;
        font-weight: 600;
      }

      /* back to top */
      .pu-backtotop {
        position: fixed;
        right: 20px;
        bottom: 80px;
        background: #00bcd4;
        color: #09284A;
        border: none;
        padding: 10px 12px;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 6px 18px rgba(0,0,0,0.15);
        display: none;
        z-index: 9998;
      }
    `;
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  })();

  /* ------------------------------
     Mobile nav toggle (created dynamically, so no HTML edits required)
     ------------------------------ */
  (function mobileNav() {
    const header = document.querySelector('header .container');
    if (!header) return;

    // create toggle button
    const btn = document.createElement('button');
    btn.className = 'mobile-nav-toggle';
    btn.setAttribute('aria-label', 'Toggle navigation');
    btn.innerHTML = '&#9776;'; // hamburger
    header.insertBefore(btn, header.firstChild);

    const nav = document.querySelector('header nav');
    btn.addEventListener('click', () => {
      nav.classList.toggle('open');
      // toggle button icon
      btn.innerHTML = nav.classList.contains('open') ? '&#10005;' : '&#9776;';
    });

    // close mobile nav when a link is clicked
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          btn.innerHTML = '&#9776;';
        }
      });
    });
  })();

  /* ------------------------------
     Smooth scroll for internal anchor links
     ------------------------------ */
  (function smoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        // allow external anchors like "#!" or others if needed
        const href = link.getAttribute('href');
        if (!href || href === '#' || href === '#0') return;
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          // Use native smooth scroll
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // update focus for accessibility
          setTimeout(() => { targetEl.setAttribute('tabindex', '-1'); targetEl.focus(); }, 600);
        }
      });
    });
  })();

  /* ------------------------------
     Active nav highlight based on scroll (sections with IDs)
     ------------------------------ */
  (function activeNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('header nav a');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector(`header nav a[href="#${id}"]`);
        if (link) {
          if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.5 });

    sections.forEach(s => observer.observe(s));
  })();

  /* ------------------------------
     Typing effect for hero headline (cycles phrases)
     Targets first h2 inside element with class .text-content
     ------------------------------ */
  (function typingEffect() {
    const target = document.querySelector('.text-content h2');
    if (!target) return;

    const phrases = [
      "Hello, I'm Vikash Upadhyay",
      "Web Developer",
      "Designer",
      "Coder",
      "Learning Java & OS"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const typingSpeed = 70;
    const pauseAfter = 1400;

    // wrap in span to support caret
    target.innerHTML = '<span class="typing-text"></span><span class="typing-caret"></span>';
    const textSpan = target.querySelector('.typing-text');

    function tick() {
      const current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        textSpan.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, pauseAfter);
        } else {
          setTimeout(tick, typingSpeed);
        }
      } else {
        charIndex--;
        textSpan.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 300);
        } else {
          setTimeout(tick, typingSpeed / 1.8);
        }
      }
    }
    tick();
  })();

  /* ------------------------------
     Scroll reveal animations using IntersectionObserver
     Automatically adds .reveal-hidden to elements and makes them visible on enter
     Targets common containers (cards, hero-content, about-content, project-card, cert-card, contact-form, contact-info, footer)
     ------------------------------ */
  (function scrollReveal() {
    const selectors = [
      '.hero-content',
      '.text-content',
      '.about-container',
      '.about-content',
      '.about-image',
      '.project-card',
      '.cert-card',
      '.contact-form',
      '.contact-info',
      'footer'
    ];
    const nodes = Array.from(document.querySelectorAll(selectors.join(',')));

    nodes.forEach(n => n.classList.add('reveal-hidden'));

    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          entry.target.classList.remove('reveal-hidden');
          // optionally unobserve to animate only once
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    nodes.forEach(n => revealObs.observe(n));
  })();

  /* ------------------------------
     Contact Form Validation + localStorage storage
     - Saves to localStorage key "portfolioContacts" as an array of objects
     - Shows toast on success or validation error
     - Keeps form accessible and prevents page reload
     ------------------------------ */
  (function contactFormHandler() {
    const form = document.querySelector('form');
    if (!form) return;

    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const msgInput = form.querySelector('#message');

    function showToast(message, timeout = 3000) {
      const existing = document.querySelector('.pu-toast');
      if (existing) existing.remove();
      const t = document.createElement('div');
      t.className = 'pu-toast';
      t.textContent = message;
      document.body.appendChild(t);
      setTimeout(() => t.remove(), timeout);
    }

    function validateEmail(email) {
      // simple email regex (not perfect but ok for client-side check)
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = msgInput.value.trim();

      if (!name) { showToast('Please enter your name'); nameInput.focus(); return; }
      if (!email || !validateEmail(email)) { showToast('Please enter a valid email'); emailInput.focus(); return; }
      if (!message) { showToast('Please enter a message'); msgInput.focus(); return; }

      const record = {
        name,
        email,
        message,
        savedAt: new Date().toISOString()
      };

      try {
        const key = 'portfolioContacts';
        const raw = localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        arr.push(record);
        localStorage.setItem(key, JSON.stringify(arr));
        showToast('Thank You For Contact !✅');

        // nice UX: reset form
        form.reset();

        // for dev: log count to console
        console.log(`Saved contact. Total messages: ${arr.length}`, arr);

      } catch (err) {
        console.error('Failed to save message', err);
        showToast('Failed to save. Check browser storage settings.');
      }
    });

    // Optional: add a small hidden admin command: ctrl+shift+m to open saved messages in console
    document.addEventListener('keydown', (ev) => {
      if (ev.ctrlKey && ev.shiftKey && ev.key.toLowerCase() === 'm') {
        const raw = localStorage.getItem('portfolioContacts');
        console.log('--- portfolioContacts ---', raw ? JSON.parse(raw) : []);
        showToast('Saved messages logged to console');
      }
    });
  })();

  /* ------------------------------
     Back to Top button
     ------------------------------ */
  (function backToTop() {
    const btn = document.createElement('button');
    btn.className = 'pu-backtotop';
    btn.setAttribute('aria-label', 'Back to top');
    btn.textContent = '↑';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) btn.style.display = 'block';
      else btn.style.display = 'none';
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  /* ------------------------------
     Small accessibility improvement: focus outlines for keyboard users
     ------------------------------ */
  (function keyboardFocus() {
    function handleFirstTab(e) {
      if (e.key === 'Tab') {
        document.documentElement.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    }
    window.addEventListener('keydown', handleFirstTab);
  })();

}); // DOMContentLoaded end

/* ================================================================
   KLARIOS — Shared JavaScript
   ================================================================ */

(function () {
  'use strict';

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('[data-r]');
  if (revealEls.length) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('vis');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  }

  /* ---- Nav scroll state ---- */
  var navWrap = document.getElementById('navWrap');
  if (navWrap) {
    window.addEventListener('scroll', function () {
      navWrap.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
    // Initial check
    navWrap.classList.toggle('scrolled', window.scrollY > 60);
  }

  /* ---- Dropdown toggles ---- */
  var dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(function (dd) {
    var trigger = dd.querySelector('.nav-link');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      // Close other dropdowns
      dropdowns.forEach(function (other) {
        if (other !== dd) other.classList.remove('open');
      });
      dd.classList.toggle('open');
    });
  });
  document.addEventListener('click', function (e) {
    dropdowns.forEach(function (dd) {
      if (!dd.contains(e.target)) dd.classList.remove('open');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdowns.forEach(function (dd) { dd.classList.remove('open'); });
    }
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(function (i) {
        i.classList.remove('open');
      });
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---- Billing toggle (pricing page) ---- */
  var toggle = document.getElementById('billingToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      var isAnnual = toggle.classList.contains('active');
      document.querySelectorAll('[data-monthly]').forEach(function (el) {
        el.textContent = isAnnual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
      });
      document.querySelectorAll('[data-period-text]').forEach(function (el) {
        el.textContent = isAnnual ? 'per month, billed annually' : 'per month';
      });
    });
  }

  /* ---- Mobile nav toggle ---- */
  var hamburger = document.getElementById('navHamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded',
        mobileMenu.classList.contains('open') ? 'true' : 'false');
    });
  }

  /* ---- Smooth anchor scroll offset for fixed nav ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = 80;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
      // Close mobile menu if open
      if (mobileMenu) mobileMenu.classList.remove('open');
    });
  });

  /* ---- Waitlist form submission ---- */
  var wForm = document.getElementById('waitlistForm');
  var wSuccess = document.getElementById('wfSuccess');
  if (wForm) {
    wForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('wfSubmit');
      btn.disabled = true;
      btn.textContent = 'Submitting...';
      var data = {
        name: document.getElementById('wf-name').value,
        email: document.getElementById('wf-email').value,
        whatsapp: document.getElementById('wf-whatsapp').value || '',
        role: document.getElementById('wf-role').value,
      };
      fetch('https://app.klarios.io/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          wForm.style.display = 'none';
          wSuccess.style.display = 'block';
        })
        .catch(function () {
          wForm.style.display = 'none';
          wSuccess.style.display = 'block';
        });
    });
  }

})();

/* shell.js — Module 5: The Shell */
'use strict';

(function () {

  /* ── Page Entrance Animation ─────────────────────────────── */
  // Trigger fade-in after first paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add('page-ready');
    });
  });

  /* ── Nav Link Transitions ────────────────────────────────── */
  // Intercept nav link clicks → play exit animation → navigate
  function wireNavLinks() {
    const links = document.querySelectorAll('.top-nav .nav-links a:not(.nav-logout)');
    links.forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href.startsWith('#') || this.classList.contains('active')) return;

        e.preventDefault();

        // Exit animation
        document.body.classList.remove('page-ready');
        document.body.classList.add('page-exit');

        // Navigate after exit animation completes (380ms)
        setTimeout(() => {
          window.location.href = href;
        }, 360);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', wireNavLinks);

}());

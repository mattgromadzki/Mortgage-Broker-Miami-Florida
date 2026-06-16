(function () {
  'use strict';

  // Canonical fallback used only on pages that have no inline .nav
  var FALLBACK = [
    ['index.html', 'Home'],
    ['start.html', 'Start'],
    ['mortgage-broker-miami.html', 'Mortgage Broker Miami'],
    ['miami-dade-mortgage-broker.html', 'Miami-Dade Areas'],
    ['miami-mortgage-guides.html', 'Guides'],
    ['mortgage-tools.html', 'Tools'],
    ['get-preapproved-miami.html', 'Preapproval'],
    ['miami-mortgage-rates.html', 'Rates'],
    ['mortgage-calculator-florida.html', 'Calculator']
  ];

  function build() {
    var header = document.querySelector('.site-header .header-inner');
    if (!header || document.querySelector('.nav-toggle')) return;

    // Collect links from this page's own nav, or fall back to the canonical set
    var links = [];
    var navLinks = document.querySelectorAll('.site-header .nav a');
    if (navLinks.length) {
      navLinks.forEach(function (a) { links.push([a.getAttribute('href'), a.textContent.trim()]); });
    } else {
      links = FALLBACK.slice();
    }

    // Hamburger button (placed inside the existing header CTA cluster)
    var toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'mobileNav');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    var cta = header.querySelector('.header-cta');
    if (cta) { cta.appendChild(toggle); } else { header.appendChild(toggle); }

    // Drawer
    var linkHTML = links.map(function (l) {
      return '<a href="' + l[0] + '">' + l[1] + '</a>';
    }).join('');

    var drawer = document.createElement('div');
    drawer.className = 'mobile-nav';
    drawer.id = 'mobileNav';
    drawer.innerHTML =
      '<div class="mobile-nav-overlay" data-close></div>' +
      '<nav class="mobile-nav-panel" aria-label="Site">' +
        '<div class="mobile-nav-head">' +
          '<span class="mobile-nav-title">Menu</span>' +
          '<button class="mobile-nav-close" aria-label="Close menu" data-close>&times;</button>' +
        '</div>' +
        '<div class="mobile-nav-links">' + linkHTML + '</div>' +
        '<div class="mobile-nav-cta">' +
          '<a class="btn btn-primary full" href="start.html">Start Mortgage Review</a>' +
          '<a class="phone-row" href="tel:+13059884806">Call (305) 988-4806</a>' +
        '</div>' +
      '</nav>';
    document.body.appendChild(drawer);

    var panel = drawer.querySelector('.mobile-nav-panel');
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      drawer.classList.add('is-open');
      toggle.classList.add('is-active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
      var first = panel.querySelector('.mobile-nav-close') || panel.querySelector('a, button');
      if (first) first.focus();
      document.addEventListener('keydown', onKey);
    }
    function close() {
      drawer.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
      document.removeEventListener('keydown', onKey);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        // simple focus trap within the panel
        var f = panel.querySelectorAll('a, button');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    toggle.addEventListener('click', function () {
      drawer.classList.contains('is-open') ? close() : open();
    });
    drawer.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });
    drawer.querySelectorAll('.mobile-nav-links a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    // Close if resized back up to desktop width
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1180 && drawer.classList.contains('is-open')) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();

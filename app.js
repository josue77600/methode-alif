/* ==========================================================================
   Méthode Alif — v2
   Aucune dépendance externe.
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     RÉGLAGES — les trois seules lignes à modifier
     ====================================================================== */

  /* 1. L'adresse de ta page de commande.
        Tant que la valeur vaut '#tarif', les boutons ramènent à la section tarif. */
  var CHECKOUT_URL = 'https://commande.methode-alif.com/pagedepaiement';

  /* 2. L'adresse de ta page de capture, celle qui donne les premiers cours gratuits.
        Tous les boutons « essayer gratuitement » du site pointeront dessus.
        Tant que la valeur vaut '#essai', ils ramènent à la section essai gratuit. */
  var FREE_LESSON_URL = 'https://defi.methode-alif.com/';

  /* 3. Ton numéro WhatsApp pour la bulle de contact en bas à droite.
        Format international, sans espace ni signe plus. Exemple : 33612345678
        Laisse vide : la bulle bascule alors sur ton adresse électronique. */
  var WHATSAPP_NUMBER = '33695888979';

  /* 3 bis. Si tu préfères envoyer les visiteurs vers un groupe WhatsApp plutôt que
        vers une conversation privée, colle ici le lien d'invitation du groupe
        (il ressemble à https://chat.whatsapp.com/XXXXXXXXXXXX).
        Rempli, il prend le dessus sur le numéro ci-dessus. Laisse vide sinon.
        Attention : dans un groupe, chaque membre voit le numéro de tous les autres. */
  var WHATSAPP_GROUP_URL = '';

  var CONTACT_URL = WHATSAPP_GROUP_URL
    ? WHATSAPP_GROUP_URL
    : (WHATSAPP_NUMBER
      ? 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent('Salam, j\x27ai une question sur la Méthode Alif avant d\x27acheter.')
      : 'mailto:contact@methode-alif.com');


  /* ====================================================================== */

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ------------------------------------------------------ Boutons d'achat */
  $$('[data-buy]').forEach(function (a) {
    a.setAttribute('href', CHECKOUT_URL);
    if (/^https?:/i.test(CHECKOUT_URL)) { a.setAttribute('rel', 'noopener'); }
  });

  /* ------------------------------------------ Boutons « essayer gratuitement » */
  $$('[data-contact]').forEach(function (a) { a.setAttribute('href', CONTACT_URL); if (/^https?:/i.test(CONTACT_URL)) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); } });

  $$('[data-free]').forEach(function (a) {
    a.setAttribute('href', FREE_LESSON_URL);
    if (/^https?:/i.test(FREE_LESSON_URL)) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    }
  });

  /* ---------------------------------- Logo de marque, s'il est fourni */
  $$('.brand__mark img').forEach(function (img) {
    function ok() { img.parentElement.classList.add('has-logo'); }
    if (img.complete) { if (img.naturalWidth > 0) { ok(); } } else { img.addEventListener('load', ok); }
  });

  /* ------------------------------- Emplacements photo : vide ou rempli ? */
  $$('.shot img').forEach(function (img) {
    var box = img.parentElement;
    function fill() { box.classList.add('is-filled'); }
    function empty() { box.classList.remove('is-filled'); img.style.display = 'none'; }
    if (img.complete) {
      if (img.naturalWidth > 0) { fill(); } else { empty(); }
    } else {
      img.addEventListener('load', fill);
      img.addEventListener('error', empty);
    }
  });

  /* ----------------------------- Lecteurs audio des témoignages */
  $$('.audio-card audio').forEach(function (a) {
    function absent() { a.closest('.audio-card').classList.add('is-missing'); }
    a.addEventListener('error', absent);
    if (a.error) { absent(); }
    a.load();
  });

  /* -------------------------------- Barre de progrès, navbar, CTA collante */
  var bar = $('#bar'), nav = $('#nav'), sticky = $('#contactFab'), ticking = false;
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) { bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%'; }
    if (nav) { nav.classList.toggle('is-stuck', y > 20); }
    if (sticky) { sticky.classList.toggle('is-on', y > window.innerHeight * 0.9); }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* --------------------------------------------------------- Menu mobile */
  var burger = $('#burger'), sheet = $('#msheet');
  function setMenu(open) {
    if (!burger || !sheet) return;
    burger.classList.toggle('is-open', open);
    sheet.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.classList.toggle('is-locked', open);
    $$('a', sheet).forEach(function (a, i) {
      a.style.transitionDelay = open ? (0.06 * i + 0.08) + 's' : '0s';
    });
  }
  if (burger) burger.addEventListener('click', function () { setMenu(!sheet.classList.contains('is-open')); });
  if (sheet) $$('a', sheet).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* --------------------------------------------------- Lien actif (navbar) */
  var navLinks = $$('#navLinks a');
  var sections = navLinks.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  if (sections.length && hasIO) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------- Révélations au scroll */
  $$('[data-stagger]').forEach(function (g) {
    $$('[data-r]', g).forEach(function (el, i) { el.style.transitionDelay = Math.min(i * 0.08, 0.5) + 's'; });
  });
  var revealables = $$('[data-r]');
  if (reduced || !hasIO) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var rev = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
    revealables.forEach(function (el) { rev.observe(el); });
  }

  /* ----------------------------------------------------- Compteurs animés */
  function animate(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400, start = null, done = false;
    function finish() { if (done) return; done = true; el.textContent = target.toLocaleString('fr-FR') + suffix; }
    if (reduced) { finish(); return; }
    function frame(ts) {
      if (done) return;
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('fr-FR') + suffix;
      if (p < 1) { window.requestAnimationFrame(frame); } else { done = true; }
    }
    window.requestAnimationFrame(frame);
    /* Si l'onglet passe en arrière-plan, requestAnimationFrame se met en pause :
       on force alors la valeur finale plutôt que de laisser un zéro à l'écran. */
    window.setTimeout(finish, dur + 400);
  }
  var counters = $$('[data-count]');
  if (counters.length && hasIO) {
    var cObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) { if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cObs.observe(c); });
  } else {
    counters.forEach(animate);
  }

  /* --------------------------- Témoignages : duplication pour le défilé */
  $$('.trow').forEach(function (row) {
    var tracks = $$('.trow__t', row);
    if (tracks.length === 2 && tracks[1].children.length === 0) {
      tracks[1].innerHTML = tracks[0].innerHTML;
    }
  });

  /* ------------------------------------------------------- Accordéons */
  function panelH(p) { return p.scrollHeight + 'px'; }
  function accordion(itemSel, btnSel, panelSel) {
    var items = $$(itemSel);
    items.forEach(function (item) {
      var btn = $(btnSel, item), panel = $(panelSel, item);
      if (!btn || !panel) return;
      if (item.classList.contains('is-open')) panel.style.maxHeight = panelH(panel);
      btn.addEventListener('click', function () {
        var open = item.classList.contains('is-open');
        items.forEach(function (o) {
          if (o === item) return;
          o.classList.remove('is-open');
          var op = $(panelSel, o), ob = $(btnSel, o);
          if (op) op.style.maxHeight = null;
          if (ob) ob.setAttribute('aria-expanded', 'false');
        });
        item.classList.toggle('is-open', !open);
        btn.setAttribute('aria-expanded', String(!open));
        panel.style.maxHeight = open ? null : panelH(panel);
      });
    });
    window.addEventListener('resize', function () {
      items.forEach(function (item) {
        if (!item.classList.contains('is-open')) return;
        var p = $(panelSel, item);
        if (p) p.style.maxHeight = panelH(p);
      });
    });
  }
  accordion('.mod', '.mod__btn', '.mod__panel');
  accordion('.faq-i', '.faq-i__q', '.faq-i__a');

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      $$('.mod.is-open .mod__panel, .faq-i.is-open .faq-i__a').forEach(function (p) { p.style.maxHeight = panelH(p); });
    });
  }

  /* ------------------------------------------------ Défilement doux (ancres) */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var t = $(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });

  /* ------------------------------------------------------------ Année */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();

/* =============================================================
   Colombo Court Hotel & Spa  ·  subpages
   Loaded after main.js, which already owns the header, the menu,
   the consent gate, the booking helper and the forms. This file
   adds only what a subpage needs.
   ============================================================= */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var motionOff = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===========================================================
     1.  Booking from a room or an offer

     The engine is SiteMinder (book-directonline.com). It takes the
     stay dates and the number of adults as query parameters and
     opens on the availability screen, where every room is listed.
     The room a button belongs to is still sent to the measurement
     tools, so the reports show which room was clicked.
     =========================================================== */
  var BOOKING = 'https://book-directonline.com/colombo-court-hotel-and-spa/properties/COLOMBOCOURTHOTELSPADIRECT';

  function iso(d) { return d.toISOString().slice(0, 10); }

  /* Measurement lives in main.js, section 14: consent, the tools and the
     event names. This passes straight through to it. */
  function track(name, params) {
    if (window.cchTrack) window.cchTrack(name, params);
  }

  /* main.js already binds every [data-book]. This runs first on the
     capture phase so a room-specific button can take over, and only
     for the ones that name a room. */
  $$('[data-book][data-room]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var room = el.dataset.room;
      var now = Date.now();
      var q = [
        'checkInDate=' + encodeURIComponent(iso(new Date(now + 864e5))),
        'checkOutDate=' + encodeURIComponent(iso(new Date(now + 3 * 864e5))),
        'items[0][adults]=2'
      ];
      track('booking_click', { placement: window.cchWhere ? window.cchWhere(el) : 'page', room: room });
      window.open(BOOKING + '?' + q.join('&'), '_blank', 'noopener');
    }, true);
  });

  /* ===========================================================
     2.  The photograph lightbox
     Frames come from a <template data-shots="..."> inside the room,
     so a new photograph is one more <img> in the markup.
     =========================================================== */
  (function lightbox() {
    var box = $('#lbx');
    if (!box) return;
    var img = $('#lbxImg'), count = $('#lbxCount');
    var prev = $('#lbxPrev'), next = $('#lbxNext'), close = $('#lbxClose');
    var shots = [], i = 0, opener = null;

    function paint() {
      var s = shots[i];
      img.src = s.src;
      img.alt = s.alt;
      count.textContent = (i + 1) + ' of ' + shots.length;
      /* keep the neighbours warm so stepping through does not flash */
      [shots[(i + 1) % shots.length], shots[(i - 1 + shots.length) % shots.length]]
        .forEach(function (n) { var p = new Image(); p.src = n.src; });
    }
    function step(d) { i = (i + d + shots.length) % shots.length; paint(); }

    function open(key, from) {
      var tpl = $('template[data-shots="' + key + '"]');
      if (!tpl) return;
      shots = $$('img', tpl.content).map(function (n) {
        return { src: n.getAttribute('src'), alt: n.getAttribute('alt') || '' };
      });
      if (!shots.length) return;
      i = 0; opener = from;
      box.hidden = false;
      document.documentElement.classList.add('lbx-open');
      document.body.classList.add('lbx-open');
      paint();
      close.focus();
      track('gallery_open', { gallery: key });
    }
    function shut() {
      box.hidden = true;
      document.documentElement.classList.remove('lbx-open');
      document.body.classList.remove('lbx-open');
      img.src = '';
      if (opener) opener.focus();
    }

    $$('[data-lightbox]').forEach(function (b) {
      b.addEventListener('click', function () { open(b.dataset.lightbox, b); });
    });
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    close.addEventListener('click', shut);
    box.addEventListener('click', function (e) { if (e.target === box) shut(); });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') { shut(); return; }
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      /* a dialog keeps the tab ring inside itself */
      if (e.key === 'Tab') {
        var f = [close, prev, next];
        var at = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(at + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });

    /* a swipe steps it on a phone */
    var x0 = null;
    box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  })();

  /* ===========================================================
     3.  Reading depth, for the ad pages
     Meta and GA both optimise better on intent than on pageviews.
     Fires once per threshold, and only after consent, because
     track() is a no-op until dataLayer and fbq exist.
     =========================================================== */
  (function depth() {
    var marks = [25, 50, 75, 100], hit = {};
    var page = document.body.className.replace(/.*page--(\w+).*/, '$1') || 'page';
    function check() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (h <= 0) return;
      var pct = Math.round((window.scrollY / h) * 100);
      marks.forEach(function (m) {
        if (pct >= m && !hit[m]) { hit[m] = 1; track('scroll_depth', { page: page, percent: m }); }
      });
    }
    var ticking = false;
    addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; check(); });
    }, { passive: true });
  })();

  /* 4.  WhatsApp clicks are counted once, for every page, in main.js. */


  /* ===========================================================
     5.  The menu reader
     A PDF opened inside the page: the visitor never leaves it and
     never downloads a file they did not ask for. The file is
     checked before the frame is built, so a missing menu shows a
     panel that offers WhatsApp instead of a broken viewer.
     =========================================================== */
  (function menus() {
    var box = $('#mnu');
    if (!box) return;
    var body = $('#mnuBody'), title = $('#mnuTitle'), newTab = $('#mnuNew'), close = $('#mnuClose');
    var dl = $('#mnuDl');
    var opener = null;

    var MENUS = {
      amber: { name: 'Amber Poolside menu', file: '../assets/menus/amber-poolside-menu.pdf' },
      cloud: { name: 'Cloud Café menu',     file: '../assets/menus/cloud-cafe-menu.pdf' },
      spa:   { name: 'The Court Spa menu',      file: '../assets/menus/court-spa-menu.pdf' },
      events:     { name: 'Events menu',        file: '../assets/menus/events-menu.pdf' },
      conference: { name: 'Conference package', file: '../assets/menus/conference-package.pdf' }
      /* [PLACEHOLDER] The beverage and shareables menus are 14 MB each in the
         current PDFs, which is too heavy to open on a phone. Compress them
         first, then add them here as more entries and add a button. */
    };

    function frame(m) {
      body.innerHTML = '';
      var f = document.createElement('iframe');
      f.title = m.name;
      f.setAttribute('loading', 'lazy');
      /* #view fits the page to the frame; #toolbar=0 hides the browser's own
         chrome where it is honoured. Both are ignored gracefully elsewhere. */
      f.src = m.file + '#view=FitH&toolbar=0&navpanes=0';
      body.appendChild(f);
    }

    function missing(m) {
      if (dl) dl.hidden = true;   /* nothing to download if it is not there */
      body.innerHTML =
        '<div class="mnu__miss">' +
        '<p class="h3">This menu is not up yet.</p>' +
        '<p>It changes often enough that we would rather show you the current one than an old one. Ask us and we will send it straight over.</p>' +
        '<a class="btn btn--ghost" href="https://wa.me/94766680971?text=' +
        encodeURIComponent('Hello Colombo Court, could you send me the ' + m.name + '?') +
        '" target="_blank" rel="noopener">Ask for it on WhatsApp</a></div>';
    }

    function open(key, from) {
      var m = MENUS[key];
      if (!m) return;

      /* A phone cannot show a PDF inside a frame (Android shows nothing,
         iOS only the first page), so there the menu opens in its own tab. */
      if (window.matchMedia && matchMedia('(pointer: coarse)').matches) {
        window.open(m.file, '_blank', 'noopener');
        track('menu_open', { menu: key, menu_name: m.name });
        return;
      }
      opener = from;
      title.textContent = m.name;
      newTab.href = m.file;
      if (dl) {
        dl.href = m.file;
        /* the file the guest saves is named for the menu, not for our folders */
        dl.setAttribute('download', m.name.replace(/[^\w ]+/g, '').replace(/\s+/g, '-') + '.pdf');
        dl.hidden = false;
      }
      box.hidden = false;
      document.documentElement.classList.add('mnu-open');
      document.body.classList.add('mnu-open');
      close.focus();
      track('menu_open', { menu: key, menu_name: m.name });

      /* The frame goes in straight away, because in production the file is
         there and a round-trip before anything appears reads as a hang. The
         check runs behind it and only swaps in the fallback on a real 404;
         a slow or unhelpful server leaves the frame alone. */
      frame(m);
      var stop = setTimeout(function () { ctrl && ctrl.abort(); }, 4000);
      var ctrl = window.AbortController ? new AbortController() : null;
      fetch(m.file, ctrl ? { signal: ctrl.signal } : {})
        .then(function (r) { if (r.status === 404) missing(m); })
        .catch(function () { /* offline, aborted, or blocked: keep the frame */ })
        .then(function () { clearTimeout(stop); });
    }
    function shut() {
      box.hidden = true;
      document.documentElement.classList.remove('mnu-open');
      document.body.classList.remove('mnu-open');
      body.innerHTML = '';
      if (opener) opener.focus();
    }

    $$('[data-menu]').forEach(function (b) {
      b.addEventListener('click', function () { open(b.dataset.menu, b); });
    });
    close.addEventListener('click', shut);
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') shut();
    });
  })();

  /* ===========================================================
     6.  Table requests
     One press emails the details to the hotel through api/enquiry.php
     (the sender lives in main.js as window.cchEnquiry). If the email
     cannot be sent, the guest is offered a ready-written email.
     =========================================================== */
  (function requestForm() {
    var form = $('#tform') || $('#sform');
    if (!form) return;
    var spa = form.id === 'sform';
    var card = spa ? $('#spaForm') : $('#tableForm');
    var ok = spa ? $('#sformOk') : $('#tformOk');

    /* a table cannot be booked for yesterday */
    var date = $('#tf-date') || $('#sf-date');
    if (date) date.min = new Date().toISOString().slice(0, 10);

    /* the Reserve buttons in each venue preselect that venue */
    $$('a[data-venue]').forEach(function (a) {
      a.addEventListener('click', function () {
        var sel = $('#tf-venue');
        if (!sel) return;
        var want = a.dataset.venue;
        $$('option', sel).forEach(function (o) { if (o.textContent.trim() === want.trim()) sel.value = o.value; });
      });
    });

    function err(input, on) {
      var field = input.closest('.field');
      if (!field) return;
      field.classList.toggle('has-err', on);
      var e = $('.err', field);
      if (e) e.hidden = !on;
      input.setAttribute('aria-invalid', String(on));
    }

    /* The spa request and the table request carry different middle lines.
       Everything either side of them is identical, so they share the code. */
    function details(d) {
      return (spa
        ? [['Treatment', d.venue], ['Staying with us', d.stay]]
        : [['Where', d.venue], ['Occasion', d.occasion && d.occasion !== 'Just a table' ? d.occasion : '']])
        .concat([['Date', d.date], ['Time', d.time], [spa ? 'People' : 'Guests', d.guests]]);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.company && form.company.value) return;   /* a bot filled the honeypot */

      var f = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        venue: (form.venue || form.package).value,
        stay: form.stay ? form.stay.value : '',
        occasion: form.occasion ? form.occasion.value : '',
        date: form.date.value,
        time: form.time.value || (spa ? '16:00' : '19:30'),
        guests: form.guests.value || '1',
        message: form.message.value.trim()
      };
      var bad = false;
      [['name', !f.name], ['phone', f.phone.length < 6], ['email', !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)], ['date', !f.date]]
        .forEach(function (pair) {
          var input = form[pair[0]];
          err(input, pair[1]);
          if (pair[1] && !bad) { bad = true; input.focus(); }
        });
      if (bad) return;

      var title = spa ? 'Spa booking request' : 'Table request';
      var payload = {
        form: spa ? 'spa' : 'table', name: f.name, phone: f.phone, email: f.email,
        details: details(f), message: f.message, company: ''
      };
      var btn = $('button[type="submit"]', form);
      if (btn) { btn.disabled = true; btn.textContent = 'Sending'; }
      window.cchEnquiry.send(payload, function (sent) {
        form.hidden = true;
        var note = $('.form-card__note', card);
        if (note) note.hidden = true;
        window.cchEnquiry.result(sent, ok, title, payload);
        if (sent) track('generate_lead', { form: spa ? 'spa' : 'table', item: f.venue, guests: f.guests });
      });
    });
  })();

  /* ===========================================================
     7.  The dish and drinks slider

     It advances on its own, which is only acceptable if it is easy
     to stop: it pauses on hover, on keyboard focus, while the tab
     is hidden, while it is off screen, and for six seconds after
     anyone scrolls or drags it themselves. Under
     prefers-reduced-motion it never starts, and the arrows are
     then the only way it moves — which is the honest fallback.

     It runs as a circle, not a carousel that rewinds: the set is
     cloned once and appended, so the first picture follows the
     last with nothing between them.
     =========================================================== */
  $$('[data-slider]').forEach(function (row) {
    /* A page can hold more than one of these, so the arrows are looked up
       inside the slider's own block rather than anywhere on the page. */
    var block = row.closest('.dishes') || document;
    var nav = block.querySelector('[data-slidenav]');
    var prev = nav && nav.querySelector('[data-slide="-1"]');
    var next = nav && nav.querySelector('[data-slide="1"]');

    /* The loop. One copy of the set is appended, so there is always a
       next picture; when the scroll passes the end of the original set
       we subtract its width, which lands on identical pixels and is
       therefore invisible. The copies are hidden from assistive tech,
       and their images stay lazy, so nothing is fetched until it is
       genuinely on screen. To add a picture, add one more <li> to the
       row in the HTML: the count is read here at runtime. */
    var count = row.children.length;
    var looped = count > 2;
    if (looped) {
      [].slice.call(row.children).forEach(function (li) {
        var copy = li.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        copy.setAttribute('data-clone', '');
        row.appendChild(copy);
      });
    }

    var EVERY = 3000;
    var held = 0;          /* pause requests: hover, focus, off screen */
    var quietUntil = 0;    /* set when the visitor moves it themselves */
    var timer = null;

    function step() {
      var first = row.firstElementChild;
      if (!first) return 0;
      var gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      return first.getBoundingClientRect().width + gap;
    }
    function maxLeft() { return row.scrollWidth - row.clientWidth; }
    /* where the copy of the set begins: one whole set, gaps included */
    function setWidth() { return looped ? step() * count : 0; }

    /* Fold the resting position back onto the original set. The copy is
       pixel for pixel the same, so subtracting one set width cannot be
       seen. It happens before each move rather than during one, so an
       animation in flight is never cut off half way, and again when a
       scroll the visitor started themselves comes to rest. */
    function fold() {
      var w = setWidth();
      if (w && row.scrollLeft >= w - 1) row.scrollLeft = row.scrollLeft - w;
    }
    var settle = null;
    row.addEventListener('scroll', function () {
      clearTimeout(settle);
      settle = setTimeout(fold, 160);
    }, { passive: true });

    function go(dir) {
      if (!looped) {
        var to = row.scrollLeft + step() * dir;
        if (to > maxLeft() - 2) to = dir > 0 ? 0 : maxLeft();
        if (to < 0) to = maxLeft();
        row.scrollTo({ left: to, behavior: motionOff ? 'auto' : 'smooth' });
        return;
      }
      fold();
      /* Going back from the very first picture: step forward onto the copy
         first, so there is always something to the left to move on to. */
      if (dir < 0 && row.scrollLeft < 2) row.scrollLeft = setWidth();
      row.scrollTo({ left: row.scrollLeft + step() * dir, behavior: motionOff ? 'auto' : 'smooth' });
    }

    function syncNav() {
      if (!prev) return;
      var over = maxLeft() > 2;
      prev.disabled = !over;
      next.disabled = !over;
    }

    function tick() {
      if (held || Date.now() < quietUntil || document.hidden) return;
      go(1);
    }

    if (!motionOff) {
      timer = setInterval(tick, EVERY);
      var hold = function () { held++; };
      var free = function () { held = Math.max(0, held - 1); };
      row.addEventListener('pointerenter', hold);
      row.addEventListener('pointerleave', free);
      row.addEventListener('focusin', hold);
      row.addEventListener('focusout', free);
      if (nav) {
        nav.addEventListener('pointerenter', hold);
        nav.addEventListener('pointerleave', free);
      }
      /* a scroll the visitor started, not one we started */
      var quiet = function () { quietUntil = Date.now() + 6000; };
      row.addEventListener('wheel', quiet, { passive: true });
      row.addEventListener('touchstart', quiet, { passive: true });

      if ('IntersectionObserver' in window) {
        var seen = true;
        new IntersectionObserver(function (es) {
          var now = es[0].isIntersecting;
          if (now === seen) return;
          seen = now;
          if (now) free(); else hold();
        }, { threshold: 0.2 }).observe(row);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () { quietUntil = Date.now() + 6000; go(-1); });
      next.addEventListener('click', function () { quietUntil = Date.now() + 6000; go(1); });
    }
    syncNav();
    addEventListener('resize', syncNav, { passive: true });
    void timer;
  });

  /* ===========================================================
     8.  [TEMPORARY] A YouTube stand-in for a room film

     Identical in behaviour to the homepage hero: nothing loads
     until the visitor has answered the cookie bar, the frame is
     revealed only once the player reports PLAYING, and the local
     film underneath is stopped at that moment so the two never
     run together. If the id is wrong, the network is slow, or the
     visitor declined cookies, the local film plays and nobody
     sees a black box.

     The id in data-yt is NOT our footage. Delete the attribute
     from the markup before launch and everything below turns
     itself off, because it does nothing without one.
     =========================================================== */
  (function roomStandIn() {
    var box = document.querySelector('[data-yt]');
    if (!box || motionOff) return;

    var id = box.dataset.yt;
    var start = parseInt(box.dataset.ytStart || '0', 10) || 0;
    var built = false;

    function mount() {
      if (built) return;
      built = true;

      var frame = document.createElement('div');
      frame.className = 'ytbox';
      frame.setAttribute('aria-hidden', 'true');
      var slot = document.createElement('div');
      slot.id = 'roomYt';
      frame.appendChild(slot);
      box.appendChild(frame);

      window.onYouTubeIframeAPIReady = function () {
        new YT.Player('roomYt', {
          videoId: id,
          host: 'https://www.youtube-nocookie.com',
          playerVars: {
            autoplay: 1, mute: 1, controls: 0, disablekb: 1,
            start: start, loop: 1, playlist: id, playsinline: 1,
            rel: 0, modestbranding: 1, iv_load_policy: 3, fs: 0
          },
          events: {
            onReady: function (e) { e.target.mute(); e.target.playVideo(); },
            onStateChange: function (e) {
              /* 1 is PLAYING. Only then is the frame worth showing. */
              if (e.data === 1) {
                box.classList.add('yt-on');
                var v = box.querySelector('video.reel');
                if (v) { v.pause(); v.removeAttribute('src'); }
              }
              /* the loop parameter is unreliable on a single video, so
                 send it back to the start point ourselves */
              if (e.data === 0) { e.target.seekTo(start); e.target.playVideo(); }
            }
          }
        });
      };

      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    /* main.js sets this once the visitor has answered the cookie bar */
    /* Only after the visitor has accepted cookies. The old fallback timer
       mounted YouTube after 1.2 seconds whatever the answer; it is gone. */
    if (window.cchConsent && window.cchConsent() === 'all') { mount(); }
    else { addEventListener('cch:consent', mount); }
  })();

  void motionOff;
})();

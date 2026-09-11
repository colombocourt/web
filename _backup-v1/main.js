/* =============================================================
   Colombo Court Hotel & Spa  ·  homepage behaviour
   Vanilla JS, no dependencies, no build step.
   Everything degrades: the page is complete with JS switched off.
   ============================================================= */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  var reduceQ = matchMedia('(prefers-reduced-motion: reduce)');
  var motionOff = reduceQ.matches;

  /* -----------------------------------------------------------
     CONFIG  ·  the only things a developer needs to touch
     ----------------------------------------------------------- */
  var CFG = {
    /* [PLACEHOLDER] Booking engine. Swap in the live URL and the query keys
       the engine expects. Everything else in this file already feeds it. */
    bookingUrl: 'https://live.ipms247.com/booking/book-rooms-colombocourthotel',
    bookingKeys: { checkin: 'checkin', checkout: 'checkout', adults: 'adult' },

    /* Event enquiries. The form opens a prefilled WhatsApp message to the
       first number; the success panel offers the second and an email copy. */
    eventsWhatsApp: ['94770058779', '94772089230'],
    reservationsEmail: 'reservations@colombocourthotel.com',

    /* [PLACEHOLDER] Optional. Set this and the enquiry is also posted
       silently to the hotel's inbox or CRM at the same time. */
    eventEndpoint: '',

    /* [PLACEHOLDER] Brevo. Leave empty to keep the honest local success state. */
    brevoEndpoint: '',

    /* how long each photograph and each review holds, in milliseconds */
    galleryDwell: 5200,
    railDwell: 5000,
    reviewDwell: 7000
  };

  /* ===========================================================
     1.  Ready
     =========================================================== */
  document.documentElement.classList.add('is-ready');
  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
  if (motionOff) document.body.classList.add('motion-off');

  /* ===========================================================
     2.  Header: transparent over the hero, solid past it, always present.
     BOOK NOW has to stay reachable at every scroll position, which is
     the whole point of a direct-booking site.
     =========================================================== */
  var head = $('#head');
  var hero = $('.hero');
  var phero = $('.phero');
  var stickAt = 400;

  /* The subpage heroes are shorter and their copy sits at the foot of the
     frame, so a fixed threshold left white type running underneath a still
     transparent header. Measure instead: go solid the moment the header
     would otherwise cover the first line of the hero copy. Read on load and
     on resize only, never inside the scroll frame. */
  function measureStick() {
    if (!phero) { stickAt = hero ? hero.offsetHeight - 120 : 400; return; }
    var copy = phero.querySelector('.phero__in');
    var first = copy && copy.firstElementChild;
    var deep = phero.offsetHeight - 100;
    if (first) {
      var top = first.getBoundingClientRect().top + window.scrollY;
      deep = Math.min(deep, top - head.offsetHeight - 10);
    }
    stickAt = Math.max(40, deep);
  }

  function headState() {
    head.classList.toggle('is-stuck', window.scrollY > stickAt);
  }

  measureStick();
  addEventListener('resize', measureStick, { passive: true });
  addEventListener('load', measureStick);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureStick);

  /* ===========================================================
     3.  The page's light
     The canvas warms from morning through noon into late
     afternoon. Written only when the colour actually changes.
     =========================================================== */
  var canvas = $('#canvas');
  var lightEnd = $('#book');
  var RAMP = [
    [0.00, [237, 232, 224]],   /* morning   #EDE8E0 */
    [0.18, [245, 241, 234]],
    [0.42, [250, 240, 230]],   /* noon      #FAF0E6 */
    [0.68, [242, 231, 217]],
    [1.00, [231, 213, 190]]    /* late gold #E7D5BE */
  ];
  var lastPaint = '';

  function rampColour(t) {
    t = clamp(t, 0, 1);
    for (var i = 1; i < RAMP.length; i++) {
      if (t <= RAMP[i][0]) {
        var a = RAMP[i - 1], b = RAMP[i];
        var f = (t - a[0]) / (b[0] - a[0]);
        f = f * f * (3 - 2 * f);
        return 'rgb(' +
          Math.round(a[1][0] + (b[1][0] - a[1][0]) * f) + ',' +
          Math.round(a[1][1] + (b[1][1] - a[1][1]) * f) + ',' +
          Math.round(a[1][2] + (b[1][2] - a[1][2]) * f) + ')';
      }
    }
    return 'rgb(231,213,190)';
  }

  function paintLight() {
    if (!canvas || !lightEnd) return;
    var end = lightEnd.getBoundingClientRect().top + window.scrollY;
    var t = window.scrollY / Math.max(1, end - window.innerHeight * 0.5);
    var c = rampColour(t);
    if (c !== lastPaint) { lastPaint = c; canvas.style.backgroundColor = c; }
  }

  /* ===========================================================
     4.  One scroll listener, one rAF, both resting when idle
     =========================================================== */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      headState();
      paintLight();
      dockState();
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });

  /* ===========================================================
     5.  Mobile menu
     =========================================================== */
  var burger = $('#burger'), menu = $('#menu'), menuOpen = false, lastFocus = null;

  function setMenu(open) {
    menuOpen = open;
    burger.setAttribute('aria-expanded', String(open));
    if (open) {
      lastFocus = document.activeElement;
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add('is-open'); });
      document.body.style.overflow = 'hidden';
      var first = $('a, button', menu);
      if (first) first.focus();
    } else {
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(function () { if (!menuOpen) menu.hidden = true; }, motionOff ? 0 : 450);
      if (lastFocus) lastFocus.focus();
    }
    dockState();
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menuOpen); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) setMenu(false);
      if (e.key === 'Tab' && menuOpen) {
        var f = $$('a[href], button:not([disabled])', menu);
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ===========================================================
     6.  Reveals  ·  images wipe in like a print, text just arrives
     =========================================================== */
  var revealTargets = $$('.reveal, .venue, .room, .stagewide, .card');
  $$('.stagewide, .venue__media, .spa__media, .room__media').forEach(function (el) {
    var host = el.closest('.reveal, .venue, .room, .stagewide') || el;
    host.classList.add('wipe');
  });

  if ('IntersectionObserver' in window && !motionOff) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ===========================================================
     7.  The one interactive moment
     Press and hold: the court turns from day to night.
     Release early and it eases back. It never snaps.
     =========================================================== */
  (function turnMoment() {
    var wrap = $('#turn'), btn = $('#turnBtn'), label = $('#turnLabel');
    if (!wrap || !btn) return;

    var COPY = { idle: 'Press and hold. Watch the court turn.', done: '18:40. The lamps come on.' };
    var p = 0, holding = false, raf = null, last = 0;

    function write() {
      wrap.style.setProperty('--turn', p.toFixed(3));
      btn.style.setProperty('--turn-o', (125.6 * (1 - p)).toFixed(1));
      var want = p > 0.92 ? COPY.done : COPY.idle;
      if (label.textContent !== want) label.textContent = want;
      btn.setAttribute('aria-pressed', p > 0.92 ? 'true' : 'false');
    }
    function tick(now) {
      var dt = Math.min(64, now - (last || now)); last = now;
      var target = holding ? 1 : 0;
      var k = holding ? 0.0011 : 0.0016;   /* fill in ~0.9s, ease back a touch faster */
      p = holding ? Math.min(1, p + dt * k) : Math.max(0, p - dt * k);
      write();
      if (p !== target) raf = requestAnimationFrame(tick);
      else { raf = null; last = 0; }
    }
    function start(e) {
      if (e && e.type === 'keydown' && e.key !== ' ' && e.key !== 'Enter') return;
      if (e && e.preventDefault) e.preventDefault();
      if (motionOff) { p = 1; write(); return; }
      if (holding) return;
      holding = true;
      if (raf === null) raf = requestAnimationFrame(tick);
    }
    function stop() {
      if (motionOff || !holding) return;
      holding = false;
      if (raf === null) raf = requestAnimationFrame(tick);
    }

    btn.addEventListener('pointerdown', start);
    addEventListener('pointerup', stop);
    addEventListener('pointercancel', stop);
    btn.addEventListener('keydown', start);
    btn.addEventListener('keyup', stop);
    btn.addEventListener('blur', stop);
    if (motionOff) { p = 1; }
    write();

    window.__turnPin = function () { p = 1; holding = false; write(); };
  })();

  /* ===========================================================
     7b. The film reels
     A <video> carrying data-reel=["a.mp4","b.mp4"] plays its clips end
     to end and then round again. Nothing is fetched until the block is
     near the screen, and the poster is what a visitor sees until the
     first clip can actually play, so the swap is never a flash of empty
     frame. Reduced motion leaves the poster alone and loads nothing.
     =========================================================== */
  $$('video[data-reel]').forEach(function (v) {
    var list;
    try { list = JSON.parse(v.getAttribute('data-reel')); } catch (e) { list = null; }
    if (!Array.isArray(list) || !list.length || motionOff) return;

    var i = 0, started = false, onScreen = false;

    function go() {
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* a browser that will not autoplay keeps the poster */ });
    }
    function load(n) {
      i = (n + list.length) % list.length;
      v.src = list[i];
      v.load();
    }
    /* Play from canplay, not from load. A play() issued while readyState is
       still 0 is refused often enough to matter, and the poster is what a
       visitor sees until the frames are actually there anyway. */
    v.addEventListener('canplay', function () { v.classList.add('is-on'); if (onScreen) go(); });
    /* one clip still has to come round again, so loop by hand either way */
    v.addEventListener('ended', function () { load(i + 1); });

    function start() {
      if (started) return;
      started = true;
      load(0);
    }
    function wake() { if (!started) { start(); return; } if (v.paused && v.readyState > 2) go(); }
    function rest() { if (started && !v.paused) v.pause(); }

    /* Two ways of asking the same question. The observer is the cheap one,
       but it reports nothing at all inside some embedded and transformed
       contexts, and a film that never starts is worse than a few rect
       reads, so a throttled scroll check backs it up. */
    function near() {
      var b = v.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      return b.bottom > -240 && b.top < vh + 240 && b.width > 0;
    }
    function check() {
      onScreen = near();
      onScreen ? wake() : rest();
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        onScreen = en[0].isIntersecting;
        onScreen ? wake() : rest();
      }, { rootMargin: '240px 0px', threshold: 0.01 }).observe(v);
    }
    var ticking = false;
    addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; check(); });
    }, { passive: true });
    addEventListener('resize', check, { passive: true });
    setTimeout(check, 60);
  });

  /* ===========================================================
     8.  The photo galleries
     One generic component for the two restaurants, the spa and the
     events block. Each advances on its own; hovering, focusing or
     swiping hands control back to the visitor. There are no arrows
     and no dots by design, so the picture is the whole interface.
     =========================================================== */
  $$('[data-gal]').forEach(function (gal) {
    var imgs = $$('.gal__img', gal);
    var dots = $('[data-gal-dots]', gal);
    var prev = $('[data-gal-prev]', gal);
    var next = $('[data-gal-next]', gal);
    if (imgs.length < 2) {
      if (prev) prev.hidden = true;
      if (next) next.hidden = true;
      if (dots) dots.hidden = true;
      return;                       /* one photograph is a photograph, not a gallery */
    }
    var i = 0, timer = null, onScreen = true, held = false;

    /* Dots are optional. The page ships without them; if a future template
       puts a [data-gal-dots] back, they build themselves from the alt text. */
    var dotEls = [];
    if (dots) {
      dots.innerHTML = imgs.map(function (im, n) {
        var name = (im.getAttribute('alt') || ('Photograph ' + (n + 1))).slice(0, 70);
        return '<button class="gdot" type="button" role="tab" aria-selected="' + (n === 0) +
               '" aria-label="' + name.replace(/"/g, '&quot;') + '"></button>';
      }).join('');
      dotEls = $$('.gdot', dots);
    }

    function show(n) {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach(function (im, k) { im.classList.toggle('is-on', k === i); });
      dotEls.forEach(function (d, k) { d.setAttribute('aria-selected', String(k === i)); });
      var ahead = imgs[(i + 1) % imgs.length];   /* the next one is likely: start it */
      if (ahead && ahead.loading === 'lazy') ahead.loading = 'eager';
    }
    function play() {
      stop();
      if (motionOff || !onScreen || held) return;
      timer = setInterval(function () { show(i + 1); }, CFG.galleryDwell);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function hold() { held = true; stop(); }
    function release() { held = false; play(); }

    dotEls.forEach(function (d, n) { d.addEventListener('click', function () { show(n); hold(); }); });
    if (prev) prev.addEventListener('click', function () { show(i - 1); hold(); });
    if (next) next.addEventListener('click', function () { show(i + 1); hold(); });
    gal.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { show(i + 1); hold(); }
      if (e.key === 'ArrowLeft')  { show(i - 1); hold(); }
    });
    gal.addEventListener('mouseenter', stop);
    gal.addEventListener('mouseleave', release);
    gal.addEventListener('focusin', stop);
    gal.addEventListener('focusout', release);

    /* a swipe on a phone does what a swipe should do */
    var x0 = null;
    gal.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    gal.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) { show(dx < 0 ? i + 1 : i - 1); hold(); }
      x0 = null;
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        onScreen = en[0].isIntersecting;
        onScreen ? play() : stop();
      }, { threshold: 0.25 }).observe(gal);
    }
    play();   /* start regardless: a misreporting observer must never freeze it */
  });

  /* ===========================================================
     9.  Experiences rail
     Four cards at a time on desktop, stepping along on its own.
     Touching, hovering or using the arrows stops the auto-step.
     =========================================================== */
  (function rail() {
    var r = $('#rail'), prev = $('#railPrev'), next = $('#railNext');
    if (!r || !prev || !next) return;
    var timer = null, onScreen = true, held = false;

    function step() {
      var card = $('.card', r);
      if (!card) return r.clientWidth * 0.8;
      var gap = parseFloat(getComputedStyle(r).columnGap || '20') || 20;
      return card.offsetWidth + gap;
    }
    function atEnd() { return r.scrollLeft >= r.scrollWidth - r.clientWidth - 8; }
    function sync() {
      prev.disabled = r.scrollLeft < 8;
      next.disabled = atEnd();
    }
    /* The glide is animated here rather than with scroll-behavior or
       scrollBy: scroll snapping cancels native smooth scrolling in some
       engines, which left the carousel frozen. */
    var tween = null;
    function tweenTo(target) {
      if (tween) cancelAnimationFrame(tween);
      var from = r.scrollLeft, delta = target - from, t0 = performance.now(), dur = 480;
      /* a hidden tab does not run rAF, so jump rather than freeze */
      if (motionOff || document.hidden || Math.abs(delta) < 2) { r.scrollLeft = target; return; }
      (function frame(now) {
        var f = Math.min(1, (now - t0) / dur);
        r.scrollLeft = from + delta * (1 - Math.pow(1 - f, 3));
        if (f < 1) tween = requestAnimationFrame(frame); else tween = null;
      })(t0);
    }
    function go(dir) {
      var max = r.scrollWidth - r.clientWidth;
      tweenTo(Math.max(0, Math.min(max, r.scrollLeft + dir * step())));
    }
    function play() {
      stop();
      if (motionOff || !onScreen || held) return;
      timer = setInterval(function () {
        if (atEnd()) tweenTo(0);
        else go(1);
      }, CFG.railDwell);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function hold() { held = true; stop(); }

    prev.addEventListener('click', function () { go(-1); hold(); });
    next.addEventListener('click', function () { go(1); hold(); });
    r.addEventListener('scroll', function () { requestAnimationFrame(sync); }, { passive: true });
    r.addEventListener('mouseenter', stop);
    r.addEventListener('mouseleave', function () { if (!held) play(); });
    r.addEventListener('focusin', stop);
    r.addEventListener('focusout', function () { if (!held) play(); });
    r.addEventListener('touchstart', hold, { passive: true });
    addEventListener('resize', sync, { passive: true });
    sync();

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        onScreen = en[0].isIntersecting;
        onScreen ? play() : stop();
      }, { threshold: 0.2 }).observe(r);
    }
    play();
  })();

  /* ===========================================================
     10.  Reviews slider
     [INTEGRATION] Tripadvisor. If a feed sets window.CCH_REVIEWS to an
     array of { stars, text, name, meta }, it replaces the markup below.
     Send it already filtered to 5 stars and newest first; this slider
     shows whatever it is given, 3 to 10 items.
     =========================================================== */
  (function reviews() {
    var track = $('#reviewTrack'), dots = $('#revDots');
    var prev = $('#revPrev'), next = $('#revNext');
    if (!track || !dots) return;

    if (Array.isArray(window.CCH_REVIEWS) && window.CCH_REVIEWS.length >= 3) {
      var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
      track.innerHTML = window.CCH_REVIEWS
        .filter(function (r) { return (r.stars || 5) >= 5; })
        .slice(0, 10)
        .map(function (r, i) {
          return '<figure class="quote' + (i === 0 ? ' is-on' : '') + '">' +
            '<p class="quote__stars" aria-label="5 out of five">★★★★★</p>' +
            '<blockquote><p>' + esc(r.text) + '</p></blockquote>' +
            '<figcaption>' + esc(r.name) + ' <span>' + esc(r.meta) + '</span></figcaption></figure>';
        }).join('');
    }

    var slides = $$('.quote', track);
    if (slides.length < 2) { if (prev) prev.hidden = true; if (next) next.hidden = true; return; }

    var i = 0, timer = null, held = false, onScreen = true;

    dots.innerHTML = slides.map(function (_, n) {
      return '<button class="dot" type="button" role="tab" aria-selected="' + (n === 0) +
             '" aria-label="Review ' + (n + 1) + ' of ' + slides.length + '"></button>';
    }).join('');
    var dotEls = $$('.dot', dots);

    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
      dotEls.forEach(function (d, k) { d.setAttribute('aria-selected', String(k === i)); });
    }
    function play() { stop(); if (motionOff || !onScreen || held) return; timer = setInterval(function () { show(i + 1); }, CFG.reviewDwell); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function hold() { held = true; stop(); }

    dotEls.forEach(function (d, n) { d.addEventListener('click', function () { show(n); hold(); }); });
    if (prev) prev.addEventListener('click', function () { show(i - 1); hold(); });
    if (next) next.addEventListener('click', function () { show(i + 1); hold(); });

    var slider = $('#reviewSlider');
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', function () { if (!held) play(); });
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', function () { if (!held) play(); });
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { show(i + 1); hold(); }
      if (e.key === 'ArrowLeft')  { show(i - 1); hold(); }
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        onScreen = en[0].isIntersecting;
        onScreen ? play() : stop();
      }, { threshold: 0.2 }).observe(slider);
    }
    play();
  })();

  /* ===========================================================
     11.  Good to know: one question open at a time
     The <details> elements work on their own with JS off. This only
     closes the others, so the section never becomes a wall of text.
     =========================================================== */
  (function accordion() {
    var items = $$('.faq__list .qa');
    items.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        items.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  })();

  /* ===========================================================
     12.  Booking
     =========================================================== */
  function iso(d) { return d.toISOString().slice(0, 10); }
  function goBooking(source) {
    var now = Date.now();
    var q = [
      CFG.bookingKeys.checkin + '=' + encodeURIComponent(iso(new Date(now + 864e5))),
      CFG.bookingKeys.checkout + '=' + encodeURIComponent(iso(new Date(now + 3 * 864e5))),
      CFG.bookingKeys.adults + '=2'
    ];
    var u = CFG.bookingUrl + (CFG.bookingUrl.indexOf('?') > -1 ? '&' : '?') + q.join('&');
    track('begin_checkout', { source: source || 'button' });
    window.open(u, '_blank', 'noopener');
  }

  $$('[data-book]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      goBooking(a.closest('.head') ? 'header' : a.closest('.dockbar') ? 'mobile_dock' : 'page');
    });
  });

  /* Subpage links already carry their real future URLs. Until those pages
     exist, data-soon says what to do instead: "book" opens the booking
     engine, anything else is an on-page anchor.
     [DELETE THIS BLOCK] once stay/, eat-drink/, wellness/, experiences/
     and our-story/ are published. The markup needs no other change. */
  $$('[data-soon]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var to = a.dataset.soon;
      e.preventDefault();
      track('select_content', { page: a.getAttribute('href') });
      if (to === 'book') { goBooking('room_card'); return; }
      var el = document.querySelector(to);
      if (el) {
        el.scrollIntoView({ behavior: motionOff ? 'auto' : 'smooth', block: 'start' });
        el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      }
    });
  });

  /* Sticky actions appear once the hero is behind you:
     the full bar on phones, one WhatsApp button on desktop. */
  var dockbar = $('#dockbar'), waFloat = $('#waFloat');
  function dockState() {
    var h = hero ? hero.offsetHeight : 600;
    var on = window.scrollY > h * 0.8;
    if (dockbar) dockbar.classList.toggle('is-on', on && !menuOpen);
    if (waFloat) waFloat.classList.toggle('is-on', on && !menuOpen);
    if (window.__heroFilm) window.__heroFilm(window.scrollY > h);
  }

  /* ===========================================================
     13.  Forms
     =========================================================== */
  function fieldError(input, on) {
    var field = input.closest('.field');
    if (!field) return;
    field.classList.toggle('has-err', on);
    var err = $('.err', field);
    if (err) err.hidden = !on;
    input.setAttribute('aria-invalid', String(on));
  }
  function prettyNumber(n) {
    return '+' + n.replace(/(\d{2})(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4');
  }

  (function eventForm() {
    var form = $('#eventForm'), ok = $('#eventOk');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if ($('#ef-company').value) return;              /* honeypot caught a bot */

      var fields = [$('#ef-name'), $('#ef-phone'), $('#ef-email'), $('#ef-msg')];
      var bad = null;
      fields.forEach(function (f) {
        var invalid = !f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(f.value));
        fieldError(f, invalid);
        if (invalid && !bad) bad = f;
      });
      if (bad) { bad.focus(); return; }

      var data = {
        name:    $('#ef-name').value.trim(),
        phone:   $('#ef-phone').value.trim(),
        email:   $('#ef-email').value.trim(),
        message: $('#ef-msg').value.trim()
      };

      var body =
        'Event enquiry from the Colombo Court website' +
        '\n\nName: ' + data.name +
        '\nContact number: ' + data.phone +
        '\nEmail: ' + data.email +
        '\n\n' + data.message;
      var enc = encodeURIComponent(body);
      var first = CFG.eventsWhatsApp[0], second = CFG.eventsWhatsApp[1];

      /* Opened inside the click, so it is never treated as a popup. */
      window.open('https://wa.me/' + first + '?text=' + enc, '_blank', 'noopener');

      /* [INTEGRATION] a copy to the inbox or CRM, if an endpoint is set */
      if (CFG.eventEndpoint) {
        fetch(CFG.eventEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        }).catch(function () {});
      }

      var note = $('.form-card__note');
      if (note) note.hidden = true;
      form.hidden = true;
      ok.hidden = false;
      ok.innerHTML =
        '<p class="form-ok__t">Thank you, ' + data.name.split(' ')[0].replace(/[<>&"]/g, '') + '.</p>' +
        '<p>Your enquiry has opened as a WhatsApp message to our events team on ' +
        prettyNumber(first) + '. Press send there and we will reply within one working day.</p>' +
        '<div class="form-ok__acts">' +
          '<a class="btn btn--wa" target="_blank" rel="noopener" href="https://wa.me/' + second + '?text=' + enc + '">Also send to ' + prettyNumber(second) + '</a>' +
          '<a class="btn btn--line" href="mailto:' + CFG.reservationsEmail +
            '?subject=' + encodeURIComponent('Event enquiry from ' + data.name) + '&body=' + enc + '">Send a copy by email</a>' +
        '</div>';
      ok.focus();
      track('generate_lead', { form: 'events' });
    });
  })();

  (function newsletter() {
    var form = $('#newsForm'), ok = $('#newsOk');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      var email = $('#nl-email'), consent = $('input[name="OPT_IN"]', form);
      var invalid = !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email.value);
      fieldError(email, invalid);
      if (invalid) { e.preventDefault(); email.focus(); return; }
      if (!consent.checked) { e.preventDefault(); consent.focus(); return; }

      /* [INTEGRATION] With a Brevo endpoint set, post to it. Without one,
         keep the form from pretending it sent anything to a server. */
      if (!CFG.brevoEndpoint) {
        e.preventDefault();
        form.querySelector('.news__row').hidden = true;
        form.querySelector('.check').hidden = true;
        ok.hidden = false;
        ok.textContent = 'Almost there. Confirm the subscription in the email we have sent, and you are on the list.';
        track('sign_up', { list: 'newsletter' });
      }
    });
  })();

  /* ===========================================================
     14.  Cookie consent  ·  nothing non-essential runs first
     =========================================================== */
  var CK = 'cch-consent-v1';
  function consentRead() {
    try {
      var raw = localStorage.getItem(CK);
      if (!raw) return null;
      var v = JSON.parse(raw);
      if (!v || Date.now() > v.exp) { localStorage.removeItem(CK); return null; }
      return v.value;
    } catch (e) { return null; }
  }
  function consentWrite(value) {
    try { localStorage.setItem(CK, JSON.stringify({ value: value, exp: Date.now() + 365 * 864e5 })); } catch (e) {}
  }

  var banner = $('#cookie');
  function showBanner() {
    if (!banner) return;
    banner.hidden = false;
    requestAnimationFrame(function () { banner.classList.add('is-on'); });
  }
  function hideBanner() {
    if (!banner) return;
    banner.classList.remove('is-on');
    setTimeout(function () { banner.hidden = true; }, motionOff ? 0 : 500);
  }
  if (banner) {
    $('#ckAccept').addEventListener('click', function () { consentWrite('all'); loadTags(); hideBanner(); });
    $('#ckReject').addEventListener('click', function () { consentWrite('essential'); hideBanner(); });
  }
  var prefsBtn = $('#cookiePrefs');
  if (prefsBtn) prefsBtn.addEventListener('click', function () { showBanner(); $('#ckAccept').focus(); });

  var consent = consentRead();
  if (consent === 'all') loadTags();
  else if (consent === null) setTimeout(showBanner, 1200);

  function loadTags() {
    var t = window.CCH_CONSENT_TAGS || {};
    /* Google Tag Manager */
    if (t.gtmId && t.gtmId.indexOf('X') === -1) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtm.js?id=' + t.gtmId;
      document.head.appendChild(s);
    }
    /* Meta Pixel */
    if (t.metaPixelId && t.metaPixelId !== '0000000000000') {
      /* eslint-disable */
      !function(f,b,e,v,n,t2,s2){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t2=b.createElement(e);t2.async=!0;
      t2.src=v;s2=b.getElementsByTagName(e)[0];s2.parentNode.insertBefore(t2,s2)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', t.metaPixelId); fbq('track', 'PageView');
      /* eslint-enable */
    }
  }

  /* One conversion-tracking call the whole page uses. Silent without consent. */
  function track(name, params) {
    if (consentRead() !== 'all') return;
    if (window.dataLayer) window.dataLayer.push(Object.assign({ event: name }, params || {}));
    if (window.fbq) {
      var map = { begin_checkout: 'InitiateCheckout', generate_lead: 'Lead', sign_up: 'CompleteRegistration' };
      if (map[name]) window.fbq('track', map[name]);
    }
  }

  /* ===========================================================
     15.  The hero film
     Landscape file on wide screens, portrait file on phones, and the
     still it was cut from underneath either way. Skipped entirely on
     reduced motion or a saver connection, so the page is never slow
     because of it.
     =========================================================== */
  (function heroVideo() {
    var v = $('#heroVideo');
    if (!v || motionOff) return;
    var conn = navigator.connection || {};
    if (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '')) return;

    /* innerWidth can read 0 inside some embedded previews, so fall back
       rather than serving every desktop the phone cut. */
    var w = window.innerWidth || document.documentElement.clientWidth || 1280;
    var src = w <= 720 ? 'assets/media/hero-portrait.mp4' : 'assets/media/hero.mp4';

    /* No HEAD probe: some hosts and CDNs refuse it. Point the element at the
       file and let its own error event decide. If the file is missing the
       still simply stays, which is the designed fallback anyway. */
    v.addEventListener('canplay', function () {
      v.play().then(function () { hero.classList.add('video-on'); }).catch(function () {});
    }, { once: true });
    v.addEventListener('error', function () { hero.classList.remove('video-on'); }, { once: true });

    /* The still wins the bandwidth race by design: the film only starts
       downloading once the poster is on screen (or has given up). */
    var started = false;
    function startFilm() {
      if (started) return;
      started = true;
      v.src = src;
      v.load();
    }
    var img = $('#heroImg');
    if (img && img.complete) startFilm();
    else if (img) { img.addEventListener('load', startFilm, { once: true }); img.addEventListener('error', startFilm, { once: true }); }
    setTimeout(startFilm, 3000);   /* safety: a stalled poster never blocks it forever */

    /* Costs nothing once the hero is behind you. Driven by the same scroll
       pass as everything else, so there is no second observer to get wrong. */
    window.__heroFilm = function (past) {
      if (!v.src || motionOff) return;
      if (past) { if (!v.paused) v.pause(); }
      else if (v.paused) v.play().catch(function () {});
    };
  })();

  /* ===========================================================
     16.  Motion preference, honoured live in both directions
     =========================================================== */
  function pinToFinalStates() {
    document.body.classList.add('motion-off');
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
    if (window.__turnPin) window.__turnPin();
    var v = $('#heroVideo'); if (v) v.pause();
  }
  reduceQ.addEventListener('change', function (e) {
    motionOff = e.matches;
    if (e.matches) pinToFinalStates();
    else document.body.classList.remove('motion-off');
  });

  /* Pause every loop on a hidden tab */
  document.addEventListener('visibilitychange', function () {
    document.body.classList.toggle('paused', document.hidden);
  });

  /* first paint */
  onScroll();
})();

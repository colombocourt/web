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
    /* Booking engine (SiteMinder). Every "Book now" and room button opens
       this address. bookingKeys names the query keys the engine reads for
       dates and guests; leave one empty and that value is not sent. */
    bookingUrl: 'https://book-directonline.com/colombo-court-hotel-and-spa/properties/COLOMBOCOURTHOTELSPADIRECT',
    bookingKeys: { checkin: 'checkInDate', checkout: 'checkOutDate', adults: 'items[0][adults]' },

    /* Enquiry forms (events, table, spa) are emailed to the hotel by
       api/enquiry.php. Nothing goes to WhatsApp. If the email cannot be
       sent, the guest is offered a ready-written email to this address. */
    enquiryEndpoint: '',
    enquiryEmail: 'info@colombocourthotel.com',

    /* [PLACEHOLDER] Brevo. Leave empty to keep the honest local success state. */
    brevoEndpoint: '',

    /* [PLACEHOLDER] Measurement. The IDs go here and nowhere else. Each
       tool stays off while its ID is empty, and none of them loads until
       the visitor accepts cookies. Section 14 does the rest.
         ga4Id        Google Analytics > Admin > Data streams > Measurement ID (G-...)
         clarityId    Microsoft Clarity > Settings > Setup > Project ID
         metaPixelId  Meta Events Manager > Data sources > the pixel > Pixel ID
         capiEndpoint the Conversions API relay on this server. Leave it as it
                      is: the Meta access token goes in the settings file
                      described in api/meta-capi.php, never in this file
         linkDomains  the booking engine's domain once SiteMinder is live, so
                      GA4 follows a guest from this site into the booking,
                      e.g. ['book-directonline.com'] (check the live link) */
    tags: {
      ga4Id: '',
      clarityId: '',
      metaPixelId: '',
      capiEndpoint: '',
      linkDomains: ['book-directonline.com']
    },

    /* how long each photograph and each review holds, in milliseconds */
    galleryDwell: 5200,
    railDwell: 5000,
    reviewDwell: 7000
  };

  /* One source of truth for the numbers and the endpoints. events.js on
     /events/ reads this rather than keeping its own copy, so the WhatsApp
     numbers cannot end up different on two pages. */
  window.CCH_CFG = CFG;

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
    /* A hero carrying no words can go solid almost at once: there is
       nothing underneath for the header to cover, and a transparent bar
       over moving film is harder to read than over a still. */
    var top = hero || phero;
    if (top && top.dataset.stick) { stickAt = parseInt(top.dataset.stick, 10) || 70; return; }
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
     2b. The page you are on
     Every copy of the navigation (header, phone menu, footer) marks
     the link to this page, so a visitor can always see where they
     are. Links to a part of a page, such as /stay/#offers, are left
     alone. The look is in v2.css, section 27.
     =========================================================== */
  (function currentPage() {
    function norm(p) {
      p = p.replace(/index\.html$/, '');
      return p.charAt(p.length - 1) === '/' ? p : p + '/';
    }
    var here = norm(location.pathname);
    $$('.nav__list a, .menu__list a, .foot__nav a, .foot__links a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) !== '/' || href.indexOf('#') > -1) return;
      if (norm(href) === here) a.setAttribute('aria-current', 'page');
      else if (a.getAttribute('aria-current') === 'page') a.removeAttribute('aria-current');
    });
  })();

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
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      var first = $('a, button', menu);
      if (first) first.focus();
    } else {
      menu.classList.remove('is-open');
      document.documentElement.style.overflow = '';
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
    /* A stand-in is mounted over this frame, so do not fetch the local
       film as well. Remove the data-yt attribute and this film is what
       plays. See section 8 of pages.js. */
    if (v.closest && v.closest("[data-yt]")) return;

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

    /* A continuous loop rather than a run to the end and a jump back to
       the start. One copy of the set of cards is appended; whenever the
       scroll position passes the start of that copy it is moved back by
       exactly one set, which lands on identical pixels and so cannot be
       seen. The copies are inert: hidden from screen readers, out of the
       tab order, and their images stay lazy. To add a guide, add one
       more card to the markup; the count is read here. */
    var cards = [].slice.call(r.children);
    var count = cards.length;
    var looped = count > 1;
    if (looped) {
      cards.forEach(function (card) {
        var copy = card.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        copy.setAttribute('data-clone', '');
        copy.setAttribute('inert', '');
        [].forEach.call(copy.querySelectorAll('a, button'), function (el) { el.setAttribute('tabindex', '-1'); });
        r.appendChild(copy);
      });
    }

    function step() {
      var card = $('.card', r);
      if (!card) return r.clientWidth * 0.8;
      var gap = parseFloat(getComputedStyle(r).columnGap || '20') || 20;
      return card.offsetWidth + gap;
    }
    /* the distance from the first card to its copy: one whole set */
    function setWidth() {
      if (!looped) return 0;
      return r.children[count].offsetLeft - r.children[0].offsetLeft;
    }
    function fold() {
      var w = setWidth();
      if (w && r.scrollLeft >= w - 1) r.scrollLeft = r.scrollLeft - w;
    }
    function sync() {
      var over = r.scrollWidth - r.clientWidth > 8;
      prev.disabled = !over;
      next.disabled = !over;
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
        if (f < 1) tween = requestAnimationFrame(frame); else { tween = null; fold(); }
      })(t0);
    }
    function go(dir) {
      if (!looped) {
        var max = r.scrollWidth - r.clientWidth;
        tweenTo(Math.max(0, Math.min(max, r.scrollLeft + dir * step())));
        return;
      }
      if (tween) { cancelAnimationFrame(tween); tween = null; }
      fold();
      /* going back from anywhere inside the first card: step onto the copy
         first, so there is always a whole card to the left to move to */
      if (dir < 0 && r.scrollLeft < step() - 1) r.scrollLeft = r.scrollLeft + setWidth();
      tweenTo(r.scrollLeft + dir * step());
    }
    function play() {
      stop();
      if (motionOff || !onScreen || held) return;
      timer = setInterval(function () { go(1); }, CFG.railDwell);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function hold() { held = true; stop(); }

    /* a scroll the visitor made themselves is folded back once it rests */
    var settle = null;
    r.addEventListener('scroll', function () {
      clearTimeout(settle);
      settle = setTimeout(function () { if (!tween) fold(); }, 160);
    }, { passive: true });

    prev.addEventListener('click', function () { go(-1); hold(); });
    next.addEventListener('click', function () { go(1); hold(); });
    r.addEventListener('mouseenter', stop);
    r.addEventListener('mouseleave', function () { if (!held) play(); });
    r.addEventListener('focusin', stop);
    r.addEventListener('focusout', function () { if (!held) play(); });
    r.addEventListener('touchstart', hold, { passive: true });
    addEventListener('resize', function () { sync(); fold(); }, { passive: true });
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
     10a.  Guest reviews slider
     The hub writes the chosen reviews as a plain list (.quotes).
     This shows them one at a time and moves on by itself. It
     stops while the pointer or the keyboard is on it, when it is
     off screen, and for good once a visitor picks a review.
     =========================================================== */
  (function quoteSlider() {
    var list = $('.quotes');
    if (!list) return;
    var slides = $$('.quote', list);
    if (slides.length < 2) return;
    list.classList.add('is-slider');

    var dots = document.createElement('div');
    dots.className = 'quotes__dots';
    dots.setAttribute('role', 'group');
    dots.setAttribute('aria-label', 'Choose a review');
    dots.innerHTML = slides.map(function (_, n) {
      return '<button class="dot" type="button" aria-label="Review ' + (n + 1) + ' of ' + slides.length + '"></button>';
    }).join('');
    list.parentNode.insertBefore(dots, list.nextSibling);
    var dotEls = $$('.dot', dots);

    var i = 0, timer = null, held = false, onScreen = true;
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        s.classList.toggle('is-on', k === i);
        s.setAttribute('aria-hidden', String(k !== i));
      });
      dotEls.forEach(function (d, k) { d.setAttribute('aria-current', String(k === i)); });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function play() { stop(); if (motionOff || !onScreen || held) return; timer = setInterval(function () { show(i + 1); }, CFG.reviewDwell); }

    dotEls.forEach(function (d, n) { d.addEventListener('click', function () { held = true; stop(); show(n); }); });
    [list, dots].forEach(function (el) {
      el.addEventListener('mouseenter', stop);
      el.addEventListener('mouseleave', play);
      el.addEventListener('focusin', stop);
      el.addEventListener('focusout', play);
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; onScreen ? play() : stop(); }, { threshold: 0.2 }).observe(list);
    }
    show(0);
    play();
  })();

  /* ===========================================================
     10.  The site's own pop-up, and the quick forms
     One dialog for the whole site. cchModal.notice(title, text)
     shows a message (the enquiry forms use it to confirm a send).
     cchModal.form(kind) opens a short form: "dining" reserves a
     table or a Dine & Dip day and goes to the sales executive,
     "reception" asks the reception team a question, "staycation" and
     "daycation" ask about those offers (also to reception). Any link
     or button with data-quickform="<kind>" opens one. Sent through
     api/enquiry.php like every other form.
     =========================================================== */
  var modal = null, lastFocus = null;
  function modalEl() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.hidden = true;
    modal.innerHTML =
      '<div class="modal__scrim" data-close></div>' +
      '<div class="modal__panel form-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle" tabindex="-1">' +
        '<button class="modal__close" type="button" data-close aria-label="Close">&times;</button>' +
        '<div class="modal__body" id="modalBody"></div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeModal(); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal && !modal.hidden) closeModal(); });
    return modal;
  }
  function openModal(html) {
    var m = modalEl(), body = $('#modalBody', m);
    body.innerHTML = html;
    lastFocus = document.activeElement;
    m.hidden = false;
    document.body.classList.add('modal-open');
    var first = $('input, select, textarea', body) || $('.modal__panel', m);
    setTimeout(function () { first.focus(); }, 30);
  }
  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function notice(title, text) {
    openModal('<p class="form-ok__t" id="modalTitle">' + title + '</p><p class="modal__p">' + text + '</p>' +
      '<div class="modal__acts"><button class="btn btn--line" type="button" data-close>Close</button></div>');
  }

  var QUICK = {
    dining: {
      title: 'Reserve a table', form: 'dining', subject: 'Table reservation',
      note: 'Tell us when you would like to come and our team will confirm by email.',
      fields: [
        ['name', 'Name', 'text', { required: true, autocomplete: 'name' }],
        ['phone', 'Contact number', 'tel', { required: true, autocomplete: 'tel' }],
        ['email', 'Email', 'email', { required: true, autocomplete: 'email' }],
        ['outlet', 'Where', 'select', { options: ['Amber Poolside', 'Cloud Café & Bar', 'Dine & Dip (a day at the pool)'] }],
        ['date', 'Date', 'date', { required: true }],
        ['time', 'Time', 'time', {}],
        ['guests', 'Guests', 'number', { min: 1, max: 40, value: 2 }],
        ['message', 'Occasion or details', 'textarea', {}]
      ]
    },
    reception: {
      title: 'Ask our reception team', form: 'reception', subject: 'Guest enquiry',
      note: 'Send us your question and our reception team will reply by email.',
      fields: [
        ['name', 'Name', 'text', { required: true, autocomplete: 'name' }],
        ['phone', 'Contact number', 'tel', { required: true, autocomplete: 'tel' }],
        ['email', 'Email', 'email', { required: true, autocomplete: 'email' }],
        ['arrival', 'Arrival date, if you have booked', 'date', {}],
        ['message', 'Your question', 'textarea', { required: true }]
      ]
    },
    staycation: {
      title: 'Ask about the Staycation', form: 'staycation', subject: 'Staycation enquiry',
      note: 'Tell us your dates and our reception team will reply by email with availability and the rate.',
      fields: [
        ['name', 'Name', 'text', { required: true, autocomplete: 'name' }],
        ['phone', 'Contact number', 'tel', { required: true, autocomplete: 'tel' }],
        ['email', 'Email', 'email', { required: true, autocomplete: 'email' }],
        ['guests', 'Guests', 'number', { min: 1, max: 6, value: 2 }],
        ['checkin', 'Check-in', 'date', { required: true }],
        ['checkout', 'Check-out', 'date', { required: true }],
        ['message', 'Anything else', 'textarea', {}]
      ]
    },
    daycation: {
      title: 'Ask about the Daycation', form: 'daycation', subject: 'Daycation enquiry',
      note: 'Tell us the day you have in mind and our reception team will reply by email with availability and the rate.',
      fields: [
        ['name', 'Name', 'text', { required: true, autocomplete: 'name' }],
        ['phone', 'Contact number', 'tel', { required: true, autocomplete: 'tel' }],
        ['email', 'Email', 'email', { required: true, autocomplete: 'email' }],
        ['guests', 'Guests', 'number', { min: 1, max: 6, value: 2 }],
        ['date', 'Date', 'date', { required: true }],
        ['message', 'Anything else', 'textarea', {}]
      ]
    }
  };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fieldHtml(f) {
    var id = 'qf-' + f[0], o = f[3], attrs = ' id="' + id + '" name="' + f[0] + '"' + (o.required ? ' required' : '') +
      (o.autocomplete ? ' autocomplete="' + o.autocomplete + '"' : '') + (o.min != null ? ' min="' + o.min + '"' : '') +
      (o.max != null ? ' max="' + o.max + '"' : '') + (o.value != null ? ' value="' + o.value + '"' : '');
    var ctl;
    if (f[2] === 'select') ctl = '<select' + attrs + '>' + o.options.map(function (v) { return '<option>' + esc(v) + '</option>'; }).join('') + '</select>';
    else if (f[2] === 'textarea') ctl = '<textarea' + attrs + ' rows="3"></textarea>';
    else ctl = '<input type="' + f[2] + '"' + attrs + (f[2] === 'tel' ? ' inputmode="tel"' : '') + '>';
    return '<div class="field' + (f[2] === 'textarea' ? ' f-msg' : '') + '"><label for="' + id + '">' + esc(f[1]) + '</label>' + ctl +
      '<p class="err" hidden>Please complete this.</p></div>';
  }
  function openQuick(kind) {
    var cfg = QUICK[kind]; if (!cfg) return;
    openModal('<h3 class="h3" id="modalTitle">' + cfg.title + '</h3><p class="form-card__note">' + cfg.note + '</p>' +
      '<form class="eform eform--modal" novalidate>' + cfg.fields.map(fieldHtml).join('') +
      '<div class="hp" aria-hidden="true"><label for="qf-company">Company</label><input type="text" id="qf-company" name="company" tabindex="-1" autocomplete="off"></div>' +
      '<div class="f-send"><button class="btn btn--solid btn--full" type="submit">Send</button></div>' +
      '<p class="form-card__legal">We use your details to answer this enquiry and nothing else. <a href="/privacy-policy/">Privacy Policy</a>.</p></form>');
    var form = $('form', modal);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.company.value) return;
      var bad = null;
      cfg.fields.forEach(function (f) {
        var el = form[f[0]], v = el.value.trim();
        var wrong = (f[3].required && !v) || (f[2] === 'email' && v && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v));
        fieldError(el, wrong);
        if (wrong && !bad) bad = el;
      });
      if (bad) { bad.focus(); return; }
      var payload = { form: cfg.form, name: form.name.value.trim(), phone: form.phone.value.trim(), email: form.email.value.trim(), details: [], message: form.message.value.trim(), company: '' };
      cfg.fields.forEach(function (f) {
        if (['name', 'phone', 'email', 'message'].indexOf(f[0]) > -1) return;
        payload.details.push([f[1], form[f[0]].value]);
      });
      var btn = $('button[type="submit"]', form);
      btn.disabled = true; btn.textContent = 'Sending';
      sendEnquiry(payload, function (sent) {
        var body = $('#modalBody', modal);
        body.innerHTML = '';
        enquiryResult(sent, body, cfg.subject, payload);
        body.insertAdjacentHTML('beforeend', '<div class="modal__acts"><button class="btn btn--line" type="button" data-close>Close</button></div>');
        if (sent) track('generate_lead', { form: kind });
      });
    });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-quickform]');
    if (!a) return;
    e.preventDefault();
    openQuick(a.getAttribute('data-quickform'));
  });
  window.cchModal = { notice: notice, form: openQuick, close: closeModal };

  /* ===========================================================
     10b.  Events photographs
     Three frames, each holding a few photographs. All three change
     at the same moment with a slow crossfade, so the trio reads as
     one picture. Stops off screen and under reduced motion.
     =========================================================== */
  (function eventSlides() {
    var box = $('.msplit--slides'); if (!box) return;
    var frames = $$('[data-slides]', box).map(function (f) { return $$('.slide', f); });
    var n = Math.min.apply(null, frames.map(function (f) { return f.length; }));
    if (!frames.length || n < 2) return;
    var i = 0, timer = null, on = true;
    function show(k) {
      i = k % n;
      frames.forEach(function (f) { f.forEach(function (img, j) { img.classList.toggle('is-on', j === i); }); });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function play() { stop(); if (motionOff || !on) return; timer = setInterval(function () { show(i + 1); }, 5200); }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { on = en[0].isIntersecting; on ? play() : stop(); }, { threshold: 0.2 }).observe(box);
    }
    show(0);
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
    track('booking_click', { placement: source || 'page' });
    window.open(u, '_blank', 'noopener');
  }

  $$('[data-book]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      goBooking(where(a));
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

  /* One sender for every enquiry form on the site. payload carries
     form, name, phone, email, details ([label, value] pairs), message
     and the honeypot. done(true) means the hotel has the email. */
  function sendEnquiry(payload, done) {
    if (!CFG.enquiryEndpoint) { setTimeout(function () { done(true); }, 600); return; }
    payload.page = location.pathname;
    fetch(CFG.enquiryEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.ok ? r.json() : { ok: false }; })
      .then(function (j) { done(!!(j && j.ok)); })
      .catch(function () { done(false); });
  }
  /* The same details as plain text, for the email fallback. */
  function enquiryText(title, p) {
    return title + ' from the Colombo Court website' +
      '\n\nName: ' + p.name + '\nContact number: ' + p.phone + '\nEmail: ' + p.email + '\n\n' +
      (p.details || []).filter(function (d) { return d[1]; }).map(function (d) { return d[0] + ': ' + d[1]; }).join('\n') +
      (p.message ? '\n\n' + p.message : '');
  }
  function enquiryResult(ok, box, title, p) {
    var first = p.name.split(' ')[0].replace(/[<>&"]/g, '');
    box.hidden = false;
    box.innerHTML = ok
      ? '<p class="form-ok__t">Thank you, ' + first + '.</p>' +
        '<p>We have received your message. Our team will reply by email within one working day.</p>'
      : '<p class="form-ok__t">Sorry, ' + first + ', that did not send.</p>' +
        '<p>Please send your enquiry by email instead. The button below opens it ready to send.</p>' +
        '<div class="form-ok__acts"><a class="btn btn--line" href="mailto:' + CFG.enquiryEmail +
          '?subject=' + encodeURIComponent(title + ' from ' + p.name) +
          '&body=' + encodeURIComponent(enquiryText(title, p)) + '">Send by email</a></div>';
    box.focus();
  }
  window.cchEnquiry = { send: sendEnquiry, result: enquiryResult };

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

      var payload = {
        form: 'events', name: data.name, phone: data.phone, email: data.email,
        details: [
          ['Changing room or overnight stay needed', $('#ef-stay') ? $('#ef-stay').value : '']
        ],
        message: data.message, company: ''
      };
      var btn = $('button[type="submit"]', form);
      if (btn) { btn.disabled = true; btn.textContent = 'Sending'; }
      sendEnquiry(payload, function (sent) {
        if (btn) { btn.disabled = false; btn.textContent = 'Plan your event'; }
        if (sent) {
          form.reset();
          notice('Thank you, ' + data.name.split(' ')[0].replace(/[<>&"]/g, '') + '.',
            'We have received your message. Our events team will reply by email within one working day.');
          track('generate_lead', { form: 'events' });
        } else {
          var note = $('.form-card__note');
          if (note) note.hidden = true;
          form.hidden = true;
          enquiryResult(sent, ok, 'Event enquiry', payload);
        }
      });
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
     14.  Cookie consent and measurement
     Nothing that measures or advertises loads before the visitor
     accepts. After that, one call, track(name, details), sends each
     named action to every tool whose ID is set in CFG.tags:
       Google Analytics 4  the action under its own name
       Microsoft Clarity   a custom event, so heatmaps and recordings
                           can be filtered to the visits that did it
       Meta Pixel          the matching Meta event, sent twice with one
                           shared event ID: from the browser, and from
                           this server through the Conversions API
                           (api/meta-capi.php). Meta counts it once.
     pages.js and events.js use the same function as window.cchTrack.
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
  window.cchConsent = consentRead;

  /* The named actions, and the event Meta receives for each. `custom`
     marks a Meta custom event rather than a standard one. Anything not
     listed, such as scroll_depth or gallery_open, goes to GA4 and
     Clarity only. In GA4, mark booking_click, whatsapp_click,
     phone_click and generate_lead as key events (Admin > Events). */
  var EVENTS = {
    booking_click:    { meta: 'InitiateCheckout' },
    whatsapp_click:   { meta: 'Contact' },
    phone_click:      { meta: 'Contact' },
    email_click:      { meta: 'Contact' },
    directions_click: { meta: 'FindLocation' },
    menu_open:        { meta: 'ViewContent' },
    offer_click:      { meta: 'OfferClick', custom: true },
    video_open:       { meta: 'VideoOpen', custom: true },
    generate_lead:    { meta: 'Lead' },
    sign_up:          { meta: 'CompleteRegistration' }
  };

  var TAGS = CFG.tags || {};
  var loaded = {};

  function isId(v) { return typeof v === 'string' && /^[A-Za-z0-9-]{4,40}$/.test(v) && !/XXXX/i.test(v); }
  function addScript(src) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }
  function readCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  function pageType() {
    var m = document.body.className.match(/page--([a-z0-9-]+)/);
    return m ? m[1] : (location.pathname === '/' ? 'home' : 'page');
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
    $('#ckReject').addEventListener('click', function () { consentWrite('essential'); stopTags(); hideBanner(); });
  }
  var prefsBtn = $('#cookiePrefs');
  if (prefsBtn) prefsBtn.addEventListener('click', function () { showBanner(); $('#ckAccept').focus(); });

  var consent = consentRead();
  if (consent === 'all') loadTags();
  else if (consent === null) setTimeout(showBanner, 1200);

  function loadTags() {
    document.documentElement.classList.add('consent-yes');
    var granted = { analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' };

    /* Google Analytics 4, with consent mode set before anything is sent */
    if (isId(TAGS.ga4Id)) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      if (!loaded.ga4) {
        loaded.ga4 = true;
        window.gtag('consent', 'default', granted);
        window.gtag('js', new Date());
        window.gtag('config', TAGS.ga4Id, TAGS.linkDomains && TAGS.linkDomains.length ? { linker: { domains: TAGS.linkDomains } } : {});
        addScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(TAGS.ga4Id));
      } else {
        window.gtag('consent', 'update', granted);
      }
    }

    /* Microsoft Clarity: heatmaps, recordings, rage clicks and dead clicks */
    if (isId(TAGS.clarityId)) {
      if (!loaded.clarity) {
        loaded.clarity = true;
        window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
        addScript('https://www.clarity.ms/tag/' + encodeURIComponent(TAGS.clarityId));
        window.clarity('set', 'page_type', pageType());
      }
      window.clarity('consentv2', { ad_Storage: 'granted', analytics_Storage: 'granted' });
    }

    /* Meta Pixel, with the Conversions API beside it */
    if (isId(TAGS.metaPixelId)) {
      if (!loaded.meta) {
        loaded.meta = true;
        /* eslint-disable */
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
        /* eslint-enable */
        window.fbq('init', TAGS.metaPixelId);
        metaSend('PageView', {}, false);
      } else {
        window.fbq('consent', 'grant');
      }
    }

    /* the temporary film stand-ins wait for this before they load YouTube */
    try { window.dispatchEvent(new Event('cch:consent')); } catch (e) {}
  }

  /* "Essential only" after an earlier yes: the tools are told to stop,
     and the cookies they had already set are removed. */
  function stopTags() {
    document.documentElement.classList.remove('consent-yes');
    var denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
    if (loaded.ga4 && window.gtag) window.gtag('consent', 'update', denied);
    if (loaded.clarity && window.clarity) window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
    if (loaded.meta && window.fbq) window.fbq('consent', 'revoke');
    var host = location.hostname, base = host.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^(_ga|_gid|_gcl_|_fbp|_fbc|_clck|_clsk)/.test(name)) return;
      ['', ';domain=' + host, ';domain=.' + base].forEach(function (d) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/' + d;
      });
    });
  }

  /* One Meta event, from the browser and from the server, with one ID. */
  function metaSend(event, data, custom) {
    if (!window.fbq) return;
    var id = Date.now().toString(36) + '.' + Math.random().toString(36).slice(2, 12);
    window.fbq(custom ? 'trackCustom' : 'track', event, data, { eventID: id });
    if (!TAGS.capiEndpoint) return;
    function send() {
      var fbc = readCookie('_fbc');
      if (!fbc) {
        var click = /[?&]fbclid=([^&#]+)/.exec(location.search);
        if (click) fbc = 'fb.1.' + Date.now() + '.' + decodeURIComponent(click[1]);
      }
      var body = JSON.stringify({
        consent: 'all', event_name: event, event_id: id,
        event_source_url: location.href, custom_data: data,
        fbp: readCookie('_fbp'), fbc: fbc
      });
      try {
        if (navigator.sendBeacon && navigator.sendBeacon(TAGS.capiEndpoint, body)) return;
        fetch(TAGS.capiEndpoint, { method: 'POST', body: body, keepalive: true, credentials: 'same-origin' }).catch(function () {});
      } catch (e) {}
    }
    /* the first page view waits a moment, so the pixel has set the
       _fbp cookie that the server copy carries; clicks go at once,
       because the visitor may be leaving the page */
    if (event === 'PageView') setTimeout(send, 1500); else send();
  }

  function track(name, details) {
    if (consentRead() !== 'all') return;
    details = details || {};
    if (loaded.ga4 && window.gtag) window.gtag('event', name, details);
    if (loaded.clarity && window.clarity) window.clarity('event', name);
    var m = EVENTS[name];
    if (m && loaded.meta) {
      var data = {};
      ['placement', 'room', 'offer', 'form', 'menu', 'film'].forEach(function (k) {
        if (details[k] !== undefined && details[k] !== null && details[k] !== '') data[k] = String(details[k]).slice(0, 100);
      });
      if (m.meta === 'Contact') data.method = name.replace('_click', '');
      if (name === 'menu_open') { data.content_type = 'menu'; data.content_name = String(details.menu_name || details.menu || ''); }
      metaSend(m.meta, data, !!m.custom);
    }
  }
  window.cchTrack = track;

  /* Where on the page an action happened, in words a report can use. */
  function where(el) {
    if (el.closest('.head')) return 'header';
    if (el.closest('.menu')) return 'phone_menu';
    if (el.closest('.dockbar')) return 'phone_bar';
    if (el.closest('.wafloat')) return 'whatsapp_button';
    if (el.closest('.foot')) return 'footer';
    if (el.closest('.hero, .phero')) return 'hero';
    if (el.closest('.book')) return 'closing_band';
    var sec = el.closest('section');
    if (sec) return sec.id || String(sec.className).split(' ').pop() || 'section';
    return 'page';
  }
  window.cchWhere = where;

  function offerName(a) {
    var card = a.closest('article, li, .offer, .what, .card');
    var h = card && card.querySelector('h2, h3, h4');
    return ((h || a).textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  }

  /* Every WhatsApp, phone, email, map, offer and social link on every
     page, counted once here rather than wired one by one. */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href');
    var at = where(a);
    if (/^https:\/\/wa\.me\//.test(href)) track('whatsapp_click', { placement: at });
    else if (/^tel:/.test(href)) track('phone_click', { placement: at });
    else if (/^mailto:/.test(href)) track('email_click', { placement: at });
    else if (/google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/.test(href)) track('directions_click', { placement: at });
    else if (a.hasAttribute('data-offer') || /#(offers|whats-on)$/.test(href)) track('offer_click', { placement: at, offer: a.getAttribute('data-offer') || offerName(a) });
    else if (/instagram\.com|facebook\.com|tiktok\.com|tripadvisor\.|linkedin\.com/.test(href)) track('social_click', { placement: at, network: a.hostname.replace(/^(www|lk)\./, '') });
  }, true);

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
    if (hero && hero.dataset.yt) return;   /* a stand-in film is in charge */
    /* Only a genuinely slow connection skips it; the phone cut is 1.2 MB. */
    var conn = navigator.connection || {};
    if (/(^|-)2g$/.test(conn.effectiveType || '')) return;

    /* innerWidth can read 0 inside some embedded previews, so fall back
       rather than serving every desktop the phone cut. */
    var w = window.innerWidth || document.documentElement.clientWidth || 1280;
    /* data-film on the hero names the pair, so the homepage can change its
       film without this file changing. */
    var set = (hero.dataset.film || 'hero').split(',');
    var src = 'assets/media/' + (w <= 720 ? (set[1] || set[0] + '-portrait') : set[0]) + '.mp4';

    /* No HEAD probe: some hosts and CDNs refuse it. Point the element at the
       file and let its own error event decide. If the file is missing the
       still simply stays, which is the designed fallback anyway. */
    function tryPlay() {
      var p = v.play();
      if (p && p.then) p.then(function () { hero.classList.add('video-on'); }).catch(function () {});
    }
    v.addEventListener('canplay', tryPlay, { once: true });
    v.addEventListener('playing', function () { hero.classList.add('video-on'); });
    /* Phones in a low-power mode refuse autoplay until the visitor touches
       the page; the first touch or scroll asks again. */
    ['touchstart', 'scroll', 'click'].forEach(function (t) {
      addEventListener(t, function () { if (v.src && v.paused && !(window.scrollY > (hero.offsetHeight || 600))) tryPlay(); }, { passive: true });
    });
    v.addEventListener('error', function () { hero.classList.remove('video-on'); }, { once: true });

    /* The still wins the bandwidth race by design: the film only starts
       downloading once the poster is on screen (or has given up). */
    var started = false;
    function startFilm() {
      if (started) return;
      started = true;
      v.preload = 'auto';
      v.src = src;
      v.load();
      /* Some builds never reach canplay from load() alone under preload=none. */
      setTimeout(function () { if (v.paused) tryPlay(); }, 1500);
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
     15b. Arriving on a link to part of a page
     A link such as /events/#faq makes the browser jump before
     the web fonts have arrived. When Playfair and Poppins swap in,
     every heading above the target changes height and the target
     drifts up under the fixed header. So once the fonts are ready,
     and again when the page has finished loading, the target is
     lined up one more time. scroll-padding-top in styles.css keeps
     the header clear of it. If the visitor has already started
     scrolling themselves, it leaves them alone.
     =========================================================== */
  (function hashLanding() {
    var id = location.hash ? decodeURIComponent(location.hash.slice(1)) : '';
    if (!id) return;
    var touched = false;
    function mark() { touched = true; }
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) {
      addEventListener(t, mark, { passive: true, once: true });
    });
    function align() {
      if (touched) return;
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(align);
    addEventListener('load', align, { once: true });
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

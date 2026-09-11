/* =============================================================
   Colombo Court  ·  homepage version two
   Loaded only by index.html, after main.js.

   Two jobs: the restaurant card that changes every six seconds,
   and the stand-in hero film.

   To go back: delete the <script> line in index.html.
   ============================================================= */
(function () {
  'use strict';

  var motionOff = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------
     1.  The restaurant card
     ----------------------------------------------------------- */
  (function rotator() {
    var rot = document.querySelector('[data-rot]');
    if (!rot) return;

    var cards = Array.prototype.slice.call(rot.querySelectorAll('.rot__card'));
    var prev  = rot.querySelector('[data-slide="-1"]');
    var next  = rot.querySelector('[data-slide="1"]');
    var count = rot.querySelector('[data-rot-n]');
    if (cards.length < 2) return;

    var EVERY = 6000;
    var i = 0;
    var held = 0;          /* hover, focus, off screen */
    var quietUntil = 0;    /* someone used the arrows */

    function show(n) {
      i = (n + cards.length) % cards.length;
      cards.forEach(function (c, k) {
        var on = k === i;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-hidden', on ? 'false' : 'true');
        Array.prototype.forEach.call(c.querySelectorAll('a,button'), function (el) {
          if (on) el.removeAttribute('tabindex'); else el.setAttribute('tabindex', '-1');
        });
      });
      if (count) count.textContent = ('0' + (i + 1)).slice(-2);
    }

    function tick() {
      if (held || Date.now() < quietUntil || document.hidden) return;
      show(i + 1);
    }

    show(0);

    function step(d) { quietUntil = Date.now() + 12000; show(i + d); }
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });

    /* Motion nobody asked for stops readily: on hover, on keyboard focus,
       while the tab is hidden, while the band is off screen, and for twelve
       seconds after anyone uses the arrows. Under prefers-reduced-motion it
       never starts and the arrows are the only way through. */
    if (!motionOff) {
      setInterval(tick, EVERY);
      var hold = function () { held++; };
      var free = function () { held = Math.max(0, held - 1); };
      rot.addEventListener('pointerenter', hold);
      rot.addEventListener('pointerleave', free);
      rot.addEventListener('focusin', hold);
      rot.addEventListener('focusout', free);

      if ('IntersectionObserver' in window) {
        var seen = true;
        new IntersectionObserver(function (es) {
          var now = es[0].isIntersecting;
          if (now === seen) return;
          seen = now;
          if (now) free(); else hold();
        }, { threshold: 0.15 }).observe(rot);
      }
    }
  })();

  /* -----------------------------------------------------------
     2.  The stand-in hero film

     [TEMPORARY] A YouTube embed, used only to show the directors
     the treatment. It is not the hotel's film and it is not for
     launch. Deleting data-yt on the hero brings the hotel's own
     cut straight back.

     It runs through YouTube's iframe API rather than a plain
     iframe for one reason: the frame is only revealed once the
     player reports it is actually PLAYING, so the poster frame,
     the big play button and the buffering spinner are never
     seen. controls, keyboard and the related-video grid are all
     off as well.
     ----------------------------------------------------------- */
  (function standIn() {
    var hero = document.querySelector('.hero[data-yt]');
    if (!hero || motionOff) return;

    var id = hero.dataset.yt;
    var start = parseInt(hero.dataset.ytStart || '0', 10) || 0;
    var built = false;

    function mount() {
      if (built) return;
      built = true;

      var box = document.createElement('div');
      box.className = 'hero__yt';
      box.setAttribute('aria-hidden', 'true');
      var slot = document.createElement('div');
      slot.id = 'heroYt';
      box.appendChild(slot);
      hero.insertBefore(box, hero.firstChild);

      window.onYouTubeIframeAPIReady = function () {
        new YT.Player('heroYt', {
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
                hero.classList.add('yt-on');
                var v = document.getElementById('heroVideo');
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
})();

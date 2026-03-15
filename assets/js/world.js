/**
 * Living World Layer
 * Spirited Away train scene / solarpunk terrarium
 *
 * Critters walk on "platforms" — visible DOM elements with borders/backgrounds.
 * They are pinned to the same z-depth as their platform element.
 */
(function () {
  'use strict';

  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED_MOTION) return;

  var IS_MOBILE = window.innerWidth < 768;

  // ========================================================================
  // CONFIG
  // ========================================================================

  var BASE_URL = (document.querySelector('meta[name="baseurl"]') || {}).content || '';
  var SPRITE_BASE = BASE_URL + '/assets/world/sprites/';

  var CRITTER_DEFS = [
    { name: 'fox',       folder: 'fox',       prefix: 'red',   hasLie: true,  size: 'normal' },
    { name: 'totoro',    folder: 'totoro',    prefix: 'gray',  hasLie: true,  size: 'large'  },
    { name: 'cockatiel', folder: 'cockatiel', prefix: 'brown', hasLie: false, size: 'normal' },
    { name: 'crab',      folder: 'crab',      prefix: 'red',   hasLie: false, size: 'normal' },
    { name: 'snail',     folder: 'snail',     prefix: 'brown', hasLie: false, size: 'small'  },
    { name: 'turtle',    folder: 'turtle',    prefix: 'green', hasLie: true,  size: 'normal' },
    { name: 'chicken',   folder: 'chicken',   prefix: 'white', hasLie: false, size: 'normal' }
  ];

  var MAX_PLATFORM_CRITTERS = IS_MOBILE ? 2 : 4;
  var MAX_GROUND_CRITTERS = IS_MOBILE ? 1 : 2;
  var MAX_CLOUDS = IS_MOBILE ? 4 : 8;
  var MAX_SPARKLES = IS_MOBILE ? 10 : 25;
  var MAX_STARS = IS_MOBILE ? 25 : 60;

  // ========================================================================
  // UTILITY
  // ========================================================================

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max)); }
  function pick(arr) { return arr[randInt(0, arr.length)]; }

  function shuffleArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = randInt(0, i + 1);
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  // ========================================================================
  // CLOUDS — pure CSS, created via JS for randomness
  // ========================================================================

  function createClouds() {
    var container = document.getElementById('world-clouds');
    if (!container) return;

    for (var i = 0; i < MAX_CLOUDS; i++) {
      var el = document.createElement('div');
      var sizeClass = pick(['small', 'medium', 'large']);
      el.className = 'world-cloud world-cloud--' + sizeClass;

      // Random vertical position in upper sky
      el.style.top = rand(5, 40) + '%';
      // Random opacity for depth
      el.style.opacity = rand(0.55, 0.95);

      // Faster animation: 15-40s, spread out with random delays
      var duration = rand(15, 40);
      var delay = rand(0, duration);
      el.style.animation = 'cloud-drift ' + duration + 's -' + delay + 's linear infinite';

      container.appendChild(el);
    }
  }

  // ========================================================================
  // STARS
  // ========================================================================

  function createStars() {
    var container = document.getElementById('world-stars');
    if (!container) return;

    for (var i = 0; i < MAX_STARS; i++) {
      var star = document.createElement('div');
      var bright = Math.random() > 0.85;
      star.className = 'world-star' + (bright ? ' world-star--bright' : '');
      star.style.left = rand(0, 100) + '%';
      star.style.top = rand(0, 100) + '%';
      star.style.animationDelay = rand(0, 6) + 's';
      star.style.animationDuration = rand(2, 5) + 's';
      container.appendChild(star);
    }
  }

  // ========================================================================
  // SPARKLES
  // ========================================================================

  function createSparkles() {
    var container = document.getElementById('world-sparkles');
    if (!container) return;

    for (var i = 0; i < MAX_SPARKLES; i++) {
      var el = document.createElement('div');
      var large = Math.random() > 0.8;
      el.className = 'world-sparkle' + (large ? ' world-sparkle--large' : '');
      el.style.left = rand(3, 97) + '%';
      el.style.top = rand(5, 90) + '%';
      el.style.animationDelay = rand(0, 5) + 's';
      el.style.animationDuration = rand(2, 4.5) + 's';
      container.appendChild(el);
    }
  }

  // ========================================================================
  // PLATFORM DETECTION
  // Only select elements with a visible border/background that critters
  // can believably "stand on".
  // ========================================================================

  function hasVisibleBoundary(el) {
    var style = window.getComputedStyle(el);
    var bg = style.backgroundColor || '';
    var border = style.borderTopWidth;
    var shadow = style.boxShadow;
    var backdrop = style.backdropFilter || style.webkitBackdropFilter || '';

    // Check for visible background (not transparent)
    var hasBackground = bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)';
    // Check for border
    var hasBorder = border && parseFloat(border) > 0;
    // Check for box-shadow
    var hasShadow = shadow && shadow !== 'none';
    // Check for backdrop-filter (frosted glass)
    var hasBackdrop = backdrop && backdrop !== 'none';

    return hasBackground || hasBorder || hasShadow || hasBackdrop;
  }

  function findPlatforms() {
    var platforms = [];
    var seen = new Set();

    // Selectors for elements that could be platforms
    var selectors = [
      '.navbar',
      '.card',
      '.container.mt-5 > .post',
      '.container.mt-5 > .row',
      '.container.mt-5 > article',
      '.profile',
      'a.btn, button.btn',
      '.btn-group'
    ];

    selectors.forEach(function (sel) {
      try {
        var els = document.querySelectorAll(sel);
        els.forEach(function (el) {
          if (seen.has(el)) return;
          seen.add(el);
          var rect = el.getBoundingClientRect();

          // Skip too small, off-screen, or invisible
          if (rect.width < 80 || rect.height < 10) return;
          if (rect.bottom < 0 || rect.top > window.innerHeight + 200) return;
          if (rect.right < 0 || rect.left > window.innerWidth) return;

          // Only place on elements with a visible boundary
          if (!hasVisibleBoundary(el)) return;

          // Determine z-class based on element type
          var zClass = 'content';
          if (el.classList.contains('navbar') || el.closest('.navbar')) {
            zClass = 'navbar';
          }

          platforms.push({
            el: el,
            rect: rect,
            zClass: zClass
          });
        });
      } catch (e) {
        // Ignore invalid selectors
      }
    });

    return platforms;
  }

  // ========================================================================
  // CRITTER SYSTEM
  // ========================================================================

  var critters = [];

  function spriteUrl(def, action) {
    return SPRITE_BASE + def.folder + '/' + def.prefix + '_' + action + '_8fps.gif';
  }

  function getCritterHeight(def) {
    if (def.size === 'large') return 48;
    if (def.size === 'small') return 24;
    return 32;
  }

  function createCritter(def, platform) {
    var el = document.createElement('div');
    el.className = 'world-critter';
    if (def.size === 'large') el.className += ' world-critter--large';
    if (def.size === 'small') el.className += ' world-critter--small';

    // Set z-class based on platform type
    if (!platform) {
      el.className += ' world-critter--ground';
    } else if (platform.zClass === 'navbar') {
      el.className += ' world-critter--navbar';
    } else {
      el.className += ' world-critter--content';
    }

    var img = document.createElement('img');
    img.src = spriteUrl(def, 'idle');
    img.alt = '';
    img.draggable = false;
    img.onerror = function() {
      el.style.display = 'none';
    };
    el.appendChild(img);

    document.body.appendChild(el);

    var h = getCritterHeight(def);
    var bounds;

    if (platform) {
      var rect = platform.rect;
      bounds = {
        left: rect.left,
        right: rect.right,
        top: rect.top - h
      };
    } else {
      bounds = {
        left: 10,
        right: window.innerWidth - 40,
        top: window.innerHeight - h - 4
      };
    }

    var x = rand(bounds.left + 5, Math.max(bounds.left + 10, bounds.right - 35));
    el.style.left = x + 'px';
    el.style.top = bounds.top + 'px';

    var c = {
      el: el,
      imgEl: img,
      x: x,
      state: 'idle',
      direction: Math.random() > 0.5 ? 1 : -1,
      stateTimer: rand(3000, 7000),
      speed: rand(8, 25),
      def: def,
      bounds: bounds,
      platformEl: platform ? platform.el : null,
      isGround: !platform
    };

    if (c.direction === -1) el.classList.add('facing-left');
    return c;
  }

  function setCritterState(c, newState) {
    c.state = newState;
    c.stateTimer = rand(3000, 8000);

    var action;
    switch (newState) {
      case 'walk':
        action = 'walk';
        c.direction = Math.random() > 0.5 ? 1 : -1;
        break;
      case 'lie':
        action = 'lie';
        c.stateTimer = rand(5000, 12000);
        break;
      default:
        action = 'idle';
        break;
    }

    c.imgEl.src = spriteUrl(c.def, action);

    if (c.direction === -1) {
      c.el.classList.add('facing-left');
    } else {
      c.el.classList.remove('facing-left');
    }
  }

  function nextCritterState(c) {
    var roll = Math.random();
    var next;

    if (c.state === 'walk') {
      if (roll < 0.4) next = 'idle';
      else if (roll < 0.55 && c.def.hasLie) next = 'lie';
      else next = 'walk';
    } else if (c.state === 'lie') {
      if (roll < 0.6) next = 'idle';
      else next = 'walk';
    } else {
      if (roll < 0.6) next = 'walk';
      else if (roll < 0.75 && c.def.hasLie) next = 'lie';
      else next = 'walk';
    }

    setCritterState(c, next);
  }

  function updateCritterBounds(c) {
    if (c.platformEl) {
      var rect = c.platformEl.getBoundingClientRect();
      var h = getCritterHeight(c.def);
      c.bounds.left = rect.left;
      c.bounds.right = rect.right;
      c.bounds.top = rect.top - h;
    } else {
      var h2 = getCritterHeight(c.def);
      c.bounds.left = 10;
      c.bounds.right = window.innerWidth - 40;
      c.bounds.top = window.innerHeight - h2 - 4;
    }
  }

  function updateCritter(c, dt) {
    c.stateTimer -= dt;
    if (c.stateTimer <= 0) {
      nextCritterState(c);
    }

    if (c.state === 'walk') {
      c.x += c.direction * c.speed * (dt / 1000);

      if (c.x > c.bounds.right - 30) {
        c.x = c.bounds.right - 30;
        c.direction = -1;
        c.el.classList.add('facing-left');
      }
      if (c.x < c.bounds.left + 2) {
        c.x = c.bounds.left + 2;
        c.direction = 1;
        c.el.classList.remove('facing-left');
      }
    }

    c.el.style.left = c.x + 'px';
    c.el.style.top = c.bounds.top + 'px';
  }

  // ========================================================================
  // SPAWN CRITTERS
  // ========================================================================

  function spawnCritters() {
    var platforms = findPlatforms();
    var shuffledDefs = shuffleArray(CRITTER_DEFS);
    var defIndex = 0;

    function nextDef() {
      var d = shuffledDefs[defIndex % shuffledDefs.length];
      defIndex++;
      return d;
    }

    var shuffledPlatforms = shuffleArray(platforms);
    var platformCount = Math.min(MAX_PLATFORM_CRITTERS, shuffledPlatforms.length);

    for (var i = 0; i < platformCount; i++) {
      var p = shuffledPlatforms[i];
      var rect = p.rect;
      if (rect.width < 80) continue;

      var def = nextDef();
      if (def.size === 'large' && rect.width < 200) {
        def = nextDef();
      }

      critters.push(createCritter(def, {
        el: p.el,
        rect: rect,
        zClass: p.zClass
      }));
    }

    // Ground critters
    for (var j = 0; j < MAX_GROUND_CRITTERS; j++) {
      critters.push(createCritter(nextDef(), null));
    }
  }

  // ========================================================================
  // SCROLL HANDLER
  // ========================================================================

  var scrollTicking = false;

  function onScroll() {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(function () {
        for (var i = 0; i < critters.length; i++) {
          updateCritterBounds(critters[i]);
        }
        scrollTicking = false;
      });
    }
  }

  // ========================================================================
  // MAIN LOOP
  // ========================================================================

  var lastTime = 0;

  function loop(time) {
    var dt = lastTime ? (time - lastTime) : 16;
    lastTime = time;
    if (dt > 200) dt = 16;

    for (var i = 0; i < critters.length; i++) {
      updateCritter(critters[i], dt);
    }

    requestAnimationFrame(loop);
  }

  // ========================================================================
  // RESIZE HANDLER
  // ========================================================================

  var resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      critters.forEach(function (c) { c.el.remove(); });
      critters.length = 0;
      spawnCritters();
    }, 500);
  }

  // ========================================================================
  // INIT
  // ========================================================================

  function init() {
    createClouds();
    createStars();
    createSparkles();

    // Delay critter spawning to ensure layout is settled
    setTimeout(function() {
      spawnCritters();
    }, 500);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    requestAnimationFrame(loop);
  }

  // Boot after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 200);
  }
})();

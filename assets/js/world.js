/**
 * Living World Layer
 * Spirited Away train scene / solarpunk terrarium
 *
 * Creates animated clouds, sparkles, stars, and wandering critters
 * over a sky-gradient + water background.
 */
(function () {
  'use strict';

  // ========================================================================
  // GUARDS
  // ========================================================================

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

  var MAX_CRITTERS = IS_MOBILE ? 3 : 6;
  var MAX_CLOUDS   = IS_MOBILE ? 3 : 7;
  var MAX_SPARKLES = IS_MOBILE ? 10 : 25;
  var MAX_STARS    = IS_MOBILE ? 25 : 60;

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
  // THEME AWARENESS
  // ========================================================================

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function setWaterAssets() {
    var suffix = isDark() ? 'dark' : 'light';
    var waterImg = document.querySelector('.world-water-bg');
    if (waterImg) {
      waterImg.src = SPRITE_BASE + 'backgrounds/beach_background-' + suffix + '.png';
    }
  }

  // ========================================================================
  // CLOUD SYSTEM — JS creates DOM, CSS animates
  // ========================================================================

  function createClouds() {
    var container = document.getElementById('world-clouds');
    if (!container) return;

    var sizes = ['small', 'medium', 'large'];
    for (var i = 0; i < MAX_CLOUDS; i++) {
      var el = document.createElement('div');
      var size = pick(sizes);
      el.className = 'world-cloud world-cloud--' + size;

      el.style.top = rand(5, 45) + '%';

      var duration = rand(45, 100);
      var delay = rand(0, 60);
      el.style.animation = 'cloud-drift ' + duration + 's ' + delay + 's linear infinite';

      container.appendChild(el);
    }
  }

  // ========================================================================
  // STAR SYSTEM — dark-mode twinkling dots
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
  // SPARKLE SYSTEM — gold/moonlight dots on water
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
  // CRITTER SYSTEM — state machine with wander AI
  // ========================================================================

  var critters = [];

  function spriteUrl(def, action) {
    return SPRITE_BASE + def.folder + '/' + def.prefix + '_' + action + '_8fps.gif';
  }

  function createCritter(def) {
    var el = document.createElement('div');
    el.className = 'world-critter';
    if (def.size === 'large') el.className += ' world-critter--large';
    if (def.size === 'small') el.className += ' world-critter--small';

    var img = document.createElement('img');
    img.src = spriteUrl(def, 'idle');
    img.alt = '';
    img.draggable = false;
    el.appendChild(img);

    var x = rand(8, 88);
    el.style.left = x + '%';

    document.getElementById('world-critters').appendChild(el);

    return {
      el: el,
      imgEl: img,
      x: x,
      state: 'idle',
      direction: Math.random() > 0.5 ? 1 : -1,
      stateTimer: rand(3000, 7000),
      speed: rand(0.4, 1.2),
      def: def
    };
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
        c.stateTimer = rand(5000, 12000); // lie down longer
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
      // After walking, rest or keep going
      if (roll < 0.4) next = 'idle';
      else if (roll < 0.55 && c.def.hasLie) next = 'lie';
      else next = 'walk';
    } else if (c.state === 'lie') {
      // After lying, get up
      if (roll < 0.6) next = 'idle';
      else next = 'walk';
    } else {
      // After idling, walk or lie
      if (roll < 0.6) next = 'walk';
      else if (roll < 0.75 && c.def.hasLie) next = 'lie';
      else next = 'walk';
    }

    setCritterState(c, next);
  }

  function updateCritter(c, dt) {
    c.stateTimer -= dt;
    if (c.stateTimer <= 0) {
      nextCritterState(c);
    }

    if (c.state === 'walk') {
      c.x += c.direction * c.speed * (dt / 1000);

      // Boundary bounce
      if (c.x > 92) {
        c.x = 92;
        c.direction = -1;
        c.el.classList.add('facing-left');
      }
      if (c.x < 3) {
        c.x = 3;
        c.direction = 1;
        c.el.classList.remove('facing-left');
      }

      c.el.style.left = c.x + '%';
    }
  }

  // ========================================================================
  // MAIN LOOP
  // ========================================================================

  var lastTime = 0;

  function loop(time) {
    var dt = lastTime ? (time - lastTime) : 16;
    lastTime = time;

    // Cap dt to avoid huge jumps when tab is backgrounded
    if (dt > 200) dt = 16;

    for (var i = 0; i < critters.length; i++) {
      updateCritter(critters[i], dt);
    }

    requestAnimationFrame(loop);
  }

  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  function init() {
    setWaterAssets();
    createClouds();
    createStars();
    createSparkles();

    // Pick a random subset of critters
    var shuffled = shuffleArray(CRITTER_DEFS);
    var selected = shuffled.slice(0, MAX_CRITTERS);
    for (var i = 0; i < selected.length; i++) {
      critters.push(createCritter(selected[i]));
    }

    requestAnimationFrame(loop);
  }

  // Listen for theme changes
  window.addEventListener('world:theme-changed', setWaterAssets);

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

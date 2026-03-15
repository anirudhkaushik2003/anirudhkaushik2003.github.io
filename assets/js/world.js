/**
 * Living World Layer
 */
(function () {
  'use strict';

  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED_MOTION) return;

  var IS_MOBILE = window.innerWidth < 768;

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

  var MAX_TOTAL_CRITTERS = IS_MOBILE ? 6 : 14;
  var MAX_GROUND_CRITTERS = IS_MOBILE ? 2 : 3;
  var NAVBAR_CRITTERS = IS_MOBILE ? 1 : 2;
  var MAX_CLOUDS = IS_MOBILE ? 4 : 8;
  var MAX_SPARKLES = IS_MOBILE ? 10 : 25;
  var MAX_STARS = IS_MOBILE ? 25 : 60;

  // ── Utility ──

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

  // ── Clouds — VERY slow drift (90-200s) ──

  function createClouds() {
    var container = document.getElementById('world-clouds');
    if (!container) return;

    for (var i = 0; i < MAX_CLOUDS; i++) {
      var el = document.createElement('div');
      el.className = 'world-cloud world-cloud--' + pick(['small', 'medium', 'large']);
      el.style.top = rand(5, 38) + '%';
      el.style.opacity = rand(0.6, 0.95);

      var duration = rand(90, 200);
      var delay = rand(0, duration);
      el.style.animation = 'cloud-drift ' + duration + 's -' + delay + 's linear infinite';

      container.appendChild(el);
    }
  }

  // ── Stars ──

  function createStars() {
    var container = document.getElementById('world-stars');
    if (!container) return;
    for (var i = 0; i < MAX_STARS; i++) {
      var star = document.createElement('div');
      star.className = 'world-star' + (Math.random() > 0.85 ? ' world-star--bright' : '');
      star.style.left = rand(0, 100) + '%';
      star.style.top = rand(0, 100) + '%';
      star.style.animationDelay = rand(0, 6) + 's';
      star.style.animationDuration = rand(3, 7) + 's';
      container.appendChild(star);
    }
  }

  // ── Sparkles ──

  function createSparkles() {
    var container = document.getElementById('world-sparkles');
    if (!container) return;
    for (var i = 0; i < MAX_SPARKLES; i++) {
      var el = document.createElement('div');
      el.className = 'world-sparkle' + (Math.random() > 0.8 ? ' world-sparkle--large' : '');
      el.style.left = rand(3, 97) + '%';
      el.style.top = rand(5, 90) + '%';
      el.style.animationDelay = rand(0, 6) + 's';
      el.style.animationDuration = rand(4, 8) + 's';
      container.appendChild(el);
    }
  }

  // ── Overgrown Plants ──

  var PLANT_BASE = SPRITE_BASE + 'plants/';

  // Plant types with placement rules
  var VINE_SPRITES = ['vine1.png', 'vine2.png', 'vine3.png'];
  var LEAF_SPRITES = ['leaves1.png', 'leaves2.png', 'leaves3.png', 'leaves4.png'];
  var GRASS_SPRITES = ['grass1.png', 'grass2.png', 'grass3.png', 'grass5.png'];
  var FLOWER_SPRITES = ['flower1.png', 'flower2.png', 'flower3.png', 'flower4.png'];
  var BUSH_SPRITES = ['bush1.png'];
  var MUSHROOM_SPRITES = ['mushroom1.png', 'mushroom2.png'];

  var plants = [];

  var MAX_NAVBAR_VINES = IS_MOBILE ? 3 : 8;
  var MAX_CARD_PLANTS = IS_MOBILE ? 3 : 6;
  var MAX_NAVBAR_CORNER_PLANTS = IS_MOBILE ? 2 : 4;

  function createPlantEl(src, cssClass, extraClass) {
    var el = document.createElement('div');
    el.className = 'world-plant ' + cssClass + (extraClass ? ' ' + extraClass : '');
    var img = document.createElement('img');
    img.src = PLANT_BASE + src;
    img.alt = '';
    img.draggable = false;
    img.onerror = function() { el.style.display = 'none'; };
    el.appendChild(img);
    document.body.appendChild(el);
    return el;
  }

  function placePlantsOnNavbar() {
    var navbar = document.querySelector('.navbar') || document.querySelector('nav.navbar');
    if (!navbar) return;
    var rect = navbar.getBoundingClientRect();
    if (rect.width < 100) return;

    // Vines hanging from the bottom edge of the navbar
    for (var i = 0; i < MAX_NAVBAR_VINES; i++) {
      var vine = pick(VINE_SPRITES);
      var el = createPlantEl(vine, 'world-plant--vine world-plant--navbar-level');
      var xOff = rand(20, rect.width - 40);
      el.style.left = (rect.left + xOff) + 'px';
      el.style.top = (rect.bottom - 6) + 'px';
      el.style.animationDelay = rand(0, 6) + 's';
      el.style.animationDuration = rand(5, 9) + 's';
      if (Math.random() > 0.5) el.classList.add('world-plant--flipped');
      plants.push({ el: el, targetEl: navbar, xOff: xOff, yOff: -6, placement: 'navbar-vine' });
    }

    // Leaves and flowers on corners/edges of navbar
    for (var j = 0; j < MAX_NAVBAR_CORNER_PLANTS; j++) {
      var isLeft = j % 2 === 0;
      var sprite, cssType;
      var roll = Math.random();
      if (roll < 0.4) {
        sprite = pick(LEAF_SPRITES);
        cssType = 'world-plant--leaf';
      } else if (roll < 0.7) {
        sprite = pick(FLOWER_SPRITES);
        cssType = 'world-plant--flower';
      } else {
        sprite = pick(GRASS_SPRITES);
        cssType = 'world-plant--grass';
      }
      var el2 = createPlantEl(sprite, cssType + ' world-plant--navbar-level');
      var xOff2 = isLeft ? rand(0, 30) : (rect.width - rand(20, 50));
      el2.style.left = (rect.left + xOff2) + 'px';
      el2.style.top = (rect.bottom - 16) + 'px';
      if (Math.random() > 0.5) el2.classList.add('world-plant--flipped');
      plants.push({ el: el2, targetEl: navbar, xOff: xOff2, yOff: -16, placement: 'navbar-corner' });
    }
  }

  function placePlantsOnCards() {
    var cardSelectors = [
      '.card',
      '.container.mt-5 > .post',
      '.container.mt-5 > .row',
      '.container.mt-5 > article'
    ];
    var seen = new Set();
    var allCards = [];

    cardSelectors.forEach(function(sel) {
      try {
        document.querySelectorAll(sel).forEach(function(el) {
          if (seen.has(el)) return;
          seen.add(el);
          var rect = el.getBoundingClientRect();
          if (rect.width < 80 || rect.height < 30) return;
          if (rect.bottom < -200 || rect.top > window.innerHeight + 400) return;
          allCards.push({ el: el, rect: rect });
        });
      } catch(e) {}
    });

    allCards.forEach(function(card) {
      var rect = card.rect;
      var plantsForCard = Math.min(MAX_CARD_PLANTS, Math.floor(rect.width / 100) + 1);

      for (var i = 0; i < plantsForCard; i++) {
        var edge = Math.random();
        var sprite, cssType, xOff, yOff;

        if (edge < 0.35) {
          // Top edge — leaves and small vines
          var topRoll = Math.random();
          if (topRoll < 0.45) {
            sprite = pick(LEAF_SPRITES);
            cssType = 'world-plant--leaf';
          } else if (topRoll < 0.7) {
            sprite = pick(VINE_SPRITES);
            cssType = 'world-plant--vine';
          } else {
            sprite = pick(FLOWER_SPRITES);
            cssType = 'world-plant--flower';
          }
          xOff = rand(5, rect.width - 30);
          yOff = -rand(8, 16); // above top edge
        } else if (edge < 0.65) {
          // Bottom edge — grass, flowers, mushrooms
          var botRoll = Math.random();
          if (botRoll < 0.35) {
            sprite = pick(GRASS_SPRITES);
            cssType = 'world-plant--grass';
          } else if (botRoll < 0.6) {
            sprite = pick(FLOWER_SPRITES);
            cssType = 'world-plant--flower';
          } else if (botRoll < 0.8) {
            sprite = pick(BUSH_SPRITES);
            cssType = 'world-plant--bush';
          } else {
            sprite = pick(MUSHROOM_SPRITES);
            cssType = 'world-plant--mushroom';
          }
          xOff = rand(5, rect.width - 40);
          yOff = rect.height - rand(10, 18); // near bottom edge
        } else {
          // Corners — leaves, mushrooms
          var isLeft = Math.random() > 0.5;
          var cornerRoll = Math.random();
          if (cornerRoll < 0.5) {
            sprite = pick(LEAF_SPRITES);
            cssType = 'world-plant--leaf';
          } else if (cornerRoll < 0.8) {
            sprite = pick(MUSHROOM_SPRITES);
            cssType = 'world-plant--mushroom';
          } else {
            sprite = pick(FLOWER_SPRITES);
            cssType = 'world-plant--flower';
          }
          xOff = isLeft ? -rand(2, 8) : (rect.width - rand(15, 25));
          yOff = rect.height - rand(12, 22);
        }

        var el = createPlantEl(sprite, cssType);
        el.style.left = (rect.left + xOff) + 'px';
        el.style.top = (rect.top + yOff) + 'px';
        if (Math.random() > 0.5) el.classList.add('world-plant--flipped');
        plants.push({ el: el, targetEl: card.el, xOff: xOff, yOff: yOff, placement: 'card' });
      }
    });
  }

  function spawnPlants() {
    placePlantsOnNavbar();
    placePlantsOnCards();
  }

  function updatePlantPositions() {
    plants.forEach(function(p) {
      if (!p.targetEl) return;
      var rect = p.targetEl.getBoundingClientRect();

      if (p.placement === 'navbar-vine' || p.placement === 'navbar-corner') {
        p.el.style.left = (rect.left + p.xOff) + 'px';
        p.el.style.top = (rect.bottom + p.yOff) + 'px';
      } else if (p.placement === 'card') {
        p.el.style.left = (rect.left + p.xOff) + 'px';
        p.el.style.top = (rect.top + p.yOff) + 'px';
      }
    });
  }

  function removePlants() {
    plants.forEach(function(p) { p.el.remove(); });
    plants.length = 0;
  }

  // ── Platform detection ──

  function findPlatforms() {
    var platforms = [];
    var seen = new Set();

    var selectors = [
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
        document.querySelectorAll(sel).forEach(function (el) {
          if (seen.has(el)) return;
          seen.add(el);
          var rect = el.getBoundingClientRect();
          if (rect.width < 80 || rect.height < 10) return;
          if (rect.bottom < 0 || rect.top > window.innerHeight + 200) return;

          var style = window.getComputedStyle(el);
          var bg = style.backgroundColor || '';
          var hasBg = bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)';
          var hasBorder = parseFloat(style.borderTopWidth) > 0;
          var hasShadow = style.boxShadow && style.boxShadow !== 'none';
          var hasBackdrop = (style.backdropFilter && style.backdropFilter !== 'none') ||
                            (style.webkitBackdropFilter && style.webkitBackdropFilter !== 'none');
          if (!hasBg && !hasBorder && !hasShadow && !hasBackdrop) return;

          platforms.push({ el: el, rect: rect, zClass: 'content' });
        });
      } catch (e) {}
    });

    return platforms;
  }

  // ── Critter system ──

  var critters = [];

  function spriteUrl(def, action) {
    return SPRITE_BASE + def.folder + '/' + def.prefix + '_' + action + '_8fps.gif';
  }

  function getCritterHeight(def) {
    if (def.size === 'large') return 48;
    if (def.size === 'small') return 24;
    return 32;
  }

  function createCritter(def, platform, zClass) {
    var el = document.createElement('div');
    el.className = 'world-critter';
    if (def.size === 'large') el.className += ' world-critter--large';
    if (def.size === 'small') el.className += ' world-critter--small';
    el.className += ' world-critter--' + zClass;

    var img = document.createElement('img');
    img.src = spriteUrl(def, 'idle');
    img.alt = '';
    img.draggable = false;
    img.onerror = function() { el.style.display = 'none'; };
    el.appendChild(img);
    document.body.appendChild(el);

    var h = getCritterHeight(def);
    var bounds;

    if (platform) {
      bounds = {
        left: platform.left,
        right: platform.right,
        top: platform.top - h
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
      stateTimer: rand(4000, 9000),
      speed: rand(6, 16),
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
    c.stateTimer = rand(5000, 12000);

    var action;
    switch (newState) {
      case 'walk':
        action = 'walk';
        c.direction = Math.random() > 0.5 ? 1 : -1;
        break;
      case 'lie':
        action = 'lie';
        c.stateTimer = rand(8000, 18000);
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
      next = roll < 0.4 ? 'idle' : (roll < 0.55 && c.def.hasLie ? 'lie' : 'walk');
    } else if (c.state === 'lie') {
      next = roll < 0.6 ? 'idle' : 'walk';
    } else {
      next = roll < 0.5 ? 'walk' : (roll < 0.65 && c.def.hasLie ? 'lie' : 'walk');
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
    if (c.stateTimer <= 0) nextCritterState(c);

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

  // ── Spawn ──

  function spawnCritters() {
    var shuffledDefs = shuffleArray(CRITTER_DEFS);
    var defIndex = 0;
    var totalSpawned = 0;

    function nextDef() {
      var d = shuffledDefs[defIndex % shuffledDefs.length];
      defIndex++;
      return d;
    }

    // 1) ALWAYS spawn critters on the navbar first
    var navbar = document.querySelector('#navbar') || document.querySelector('.navbar') || document.querySelector('nav.navbar');
    if (navbar) {
      var nbRect = navbar.getBoundingClientRect();
      if (nbRect.width > 100 && nbRect.height > 5) {
        var platform = { el: navbar, left: nbRect.left, right: nbRect.right, top: nbRect.top + nbRect.height };
        for (var n = 0; n < NAVBAR_CRITTERS; n++) {
          var nbDef = nextDef();
          // Only small/normal critters on navbar
          while (nbDef.size === 'large') { nbDef = nextDef(); }
          critters.push(createCritter(nbDef, platform, 'navbar'));
          totalSpawned++;
        }
      }
    }

    // 2) Spawn on other platforms
    var platforms = findPlatforms();
    var shuffledPlatforms = shuffleArray(platforms);

    for (var i = 0; i < shuffledPlatforms.length && totalSpawned < MAX_TOTAL_CRITTERS - MAX_GROUND_CRITTERS; i++) {
      var p = shuffledPlatforms[i];
      var rect = p.rect;
      if (rect.width < 80) continue;

      var count = rect.width > 400 ? randInt(1, 3) : 1;

      for (var k = 0; k < count && totalSpawned < MAX_TOTAL_CRITTERS - MAX_GROUND_CRITTERS; k++) {
        var def = nextDef();
        if (def.size === 'large' && rect.width < 200) def = nextDef();

        var plat = { el: p.el, left: rect.left, right: rect.right, top: rect.top };
        critters.push(createCritter(def, plat, p.zClass));
        totalSpawned++;
      }
    }

    // 3) Ground critters
    for (var j = 0; j < MAX_GROUND_CRITTERS; j++) {
      critters.push(createCritter(nextDef(), null, 'ground'));
    }
  }

  // ── Scroll / Loop / Resize ──

  var scrollTicking = false;
  function onScroll() {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(function () {
        for (var i = 0; i < critters.length; i++) updateCritterBounds(critters[i]);
        updatePlantPositions();
        scrollTicking = false;
      });
    }
  }

  var lastTime = 0;
  function loop(time) {
    var dt = lastTime ? (time - lastTime) : 16;
    lastTime = time;
    if (dt > 200) dt = 16;
    for (var i = 0; i < critters.length; i++) updateCritter(critters[i], dt);
    requestAnimationFrame(loop);
  }

  var resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      critters.forEach(function (c) { c.el.remove(); });
      critters.length = 0;
      removePlants();
      spawnCritters();
      spawnPlants();
    }, 500);
  }

  // ── Init ──

  function init() {
    createClouds();
    createStars();
    createSparkles();
    setTimeout(function() {
      spawnCritters();
      spawnPlants();
    }, 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 200);
  }
})();

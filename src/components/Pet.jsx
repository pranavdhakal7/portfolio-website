import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const FOOD_TYPES = [
  { emoji: '🍖', color: '#ff6b6b', weight: 25, name: 'meat' },
  { emoji: '🎂', color: '#ffb6c1', weight: 20, name: 'cake' },
  { emoji: '🍫', color: '#8b4513', weight: 20, name: 'choc' },
  { emoji: '🍇', color: '#9370db', weight: 20, name: 'grape' },
  { emoji: '🦴', color: '#f5deb3', weight: 15, name: 'bone' },
];

function randFood() {
  let r = Math.random() * 100, acc = 0;
  for (const f of FOOD_TYPES) { acc += f.weight; if (r <= acc) return f; }
  return FOOD_TYPES[0];
}

const DOG_W = 110;
const GROUND_Y = 90;

export default function Pet() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Make container fixed at bottom
    container.style.position = 'fixed';
    container.style.bottom = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '180px';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '99999';
    container.style.overflow = 'visible';

    // ── State ──────────────────────────────────────────────────────────────
    let idN = 0;
    const uid = () => ++idN;

    let dog = { x: 100, y: GROUND_Y, facingRight: true, walking: true, eating: false, happy: false, target: null };
    let walkDir = 1;
    let foods = [];
    let fallingFoods = [];
    let particles = [];

    const fallingEls = {};
    const foodEls = {};



    // Score display
    const scoreEl = document.createElement('div');
    scoreEl.style.cssText = `position:absolute;top:12px;left:16px;background:rgba(255,255,255,0.85);
      border-radius:20px;padding:6px 16px;font-size:0.85rem;font-weight:600;color:#333;z-index:200;pointer-events:auto;`;
    scoreEl.textContent = '🍖 Fed: 0';
    container.appendChild(scoreEl);
    let fedCount = 0;

    // Instruction
    const hint = document.createElement('div');
    hint.style.cssText = `position:absolute;bottom:12px;left:50%;transform:translateX(-50%);
      background:rgba(0,0,0,0.35);color:white;border-radius:20px;padding:5px 14px;
      font-size:0.75rem;z-index:200;pointer-events:none;`;
    container.appendChild(hint);

    // Particle layer
    const pLayer = document.createElement('div');
    pLayer.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:90;';
    container.appendChild(pLayer);

    // ── Dog DOM ──────────────────────────────────────────────────────────
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      @keyframes twag  { 0%,100%{transform:rotate(-15deg)} 50%{transform:rotate(25deg)} }
      @keyframes lmv   { 0%,100%{transform:rotate(-20deg) translateY(0)} 50%{transform:rotate(20deg) translateY(-6px)} }
      @keyframes lmvo  { 0%,100%{transform:rotate(20deg) translateY(-6px)} 50%{transform:rotate(-20deg) translateY(0)} }
      @keyframes bbob  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
      @keyframes hbob  { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
      @keyframes hbnc  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
      @keyframes eatm  { 0%,100%{transform:translateY(0) rotate(0)} 25%,75%{transform:translateY(-4px) rotate(-2deg)} }
      @keyframes blink { 0%,92%,100%{transform:scaleY(1)} 96%{transform:scaleY(0.1)} }
      @keyframes fbounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-5px)} }
      .d-leg  { width:16px;height:32px;background:linear-gradient(180deg,#8b4513,#a0522d);border-radius:8px;
                position:absolute;transform-origin:top center;animation:lmv 0.5s linear infinite; }
      .d-lego { animation:lmvo 0.5s linear infinite; }
      .d-tail { position:absolute;right:8px;top:20px;width:30px;height:10px;
                background:linear-gradient(90deg,#d2691e,#cd853f);border-radius:5px;
                transform-origin:right center;animation:twag 0.4s ease-in-out infinite; }
      .d-body-wrap { animation:bbob 0.5s ease-in-out infinite; }
      .d-head-wrap { animation:hbob 0.5s ease-in-out infinite; }
      .d-paused { animation-play-state:paused !important; }
      .d-happy  { animation:hbnc 0.4s ease-in-out infinite !important; }
      .d-eating { animation:eatm 0.25s ease-in-out infinite !important; }
      .d-eye  { position:absolute;right:12px;top:10px;width:9px;height:11px;
                background:#2c1810;border-radius:50%;animation:blink 4s infinite;
                box-shadow:inset 1px 1px 2px rgba(255,255,255,0.3); }
      .d-food-item { animation:fbounce 1s ease-in-out infinite; }
    `;
    document.head.appendChild(styleTag);

    const dogEl = document.createElement('div');
    dogEl.style.cssText = `position:absolute;width:${DOG_W}px;height:90px;pointer-events:auto;z-index:70;`;
    dogEl.innerHTML = `
      <div class="d-tail" id="dtail"></div>

      <!-- Back legs (behind body) -->
      <div class="d-leg d-lego" style="left:18px;bottom:0;z-index:1;"></div>
      <div class="d-leg"        style="right:45px;bottom:0;z-index:1;opacity:0.9;"></div>

      <!-- Body -->
      <div class="d-body-wrap" id="dbodywrap" style="position:absolute;inset:0;">
        <div id="dtorso" style="position:absolute;left:12px;top:18px;width:85px;height:45px;
          background:linear-gradient(180deg,#d2691e 0%,#cd853f 50%,#deb887 100%);
          border-radius:22px;box-shadow:inset -4px -4px 12px rgba(0,0,0,0.1);z-index:2;">
          <div style="position:absolute;left:18px;top:10px;width:22px;height:22px;
            background:#8b4513;border-radius:50%;opacity:0.2;"></div>
        </div>
      </div>

      <!-- Front legs (in front of body) -->
      <div class="d-leg d-lego" style="left:35px;bottom:0;z-index:3;opacity:0.9;"></div>
      <div class="d-leg"        style="right:22px;bottom:0;z-index:3;"></div>

      <!-- Head group -->
      <div class="d-head-wrap" id="dheadwrap" style="position:absolute;inset:0;">
        <div id="dhead" style="position:absolute;right:-8px;top:0;width:50px;height:45px;
          background:linear-gradient(145deg,#d2691e,#cd853f);border-radius:50%;
          box-shadow:inset -3px -3px 8px rgba(0,0,0,0.1);z-index:4;">
          <!-- Ear -->
          <div style="position:absolute;left:4px;top:4px;width:16px;height:22px;
            background:linear-gradient(180deg,#8b4513,#a0522d);border-radius:50%;
            transform:rotate(-15deg);transform-origin:top center;"></div>
          <!-- Eye -->
          <div class="d-eye">
            <div style="position:absolute;right:2px;top:2px;width:3px;height:3px;background:white;border-radius:50%;"></div>
          </div>
          <!-- Muzzle -->
          <div style="position:absolute;right:-4px;top:16px;width:22px;height:18px;
            background:#deb887;border-radius:9px;z-index:5;">
            <div style="position:absolute;right:-1px;top:2px;width:10px;height:9px;
              background:#2c1810;border-radius:50%;"></div>
          </div>
          <!-- Mouth -->
          <div id="dmouth" style="position:absolute;right:4px;top:28px;width:18px;height:6px;
            border:2px solid #2c1810;border-top:none;border-radius:0 0 9px 9px;
            background:transparent;transition:height 0.15s,background 0.15s;z-index:5;"></div>
        </div>
        <!-- Collar -->
        <div style="position:absolute;right:12px;top:40px;width:22px;height:7px;
          background:linear-gradient(90deg,#ff4444,#cc0000);border-radius:3px;z-index:5;">
          <div style="position:absolute;left:50%;top:5px;transform:translateX(-50%);
            width:8px;height:8px;background:gold;border-radius:50%;
            box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>
        </div>
      </div>
    `;
    container.appendChild(dogEl);

    // Grab refs to animated parts
    const dtail = dogEl.querySelector('#dtail');
    const dbodywrap = dogEl.querySelector('#dbodywrap');
    const dheadwrap = dogEl.querySelector('#dheadwrap');
    const dtorso = dogEl.querySelector('#dtorso');
    const dhead = dogEl.querySelector('#dhead');
    const dmouth = dogEl.querySelector('#dmouth');
    const dlegs = dogEl.querySelectorAll('.d-leg');

    // ── Feed Button ────────────────────────────────────────────────────────
    const btn = document.createElement('button');
    btn.textContent = '🎁 Drop Food!';
    btn.style.cssText = `
      position:absolute;padding:10px 22px;font-size:0.88rem;cursor:pointer;
      background:linear-gradient(135deg,#ff9a56,#ff6b6b);border:none;
      border-radius:25px;color:white;font-weight:700;z-index:200;pointer-events:auto;
      transform:translateX(-50%);white-space:nowrap;
      box-shadow:0 4px 14px rgba(255,107,107,0.45);transition:box-shadow 0.15s,transform 0.1s;
    `;
    btn.onmouseenter = () => { btn.style.boxShadow = '0 6px 20px rgba(255,107,107,0.65)'; };
    btn.onmouseleave = () => { btn.style.boxShadow = '0 4px 14px rgba(255,107,107,0.45)'; btn.style.transform = 'translateX(-50%) scale(1)'; };
    btn.onmousedown = () => { btn.style.transform = 'translateX(-50%) scale(0.94)'; };
    btn.onmouseup = () => { btn.style.transform = 'translateX(-50%) scale(1.04)'; };
    btn.ontouchstart = () => { btn.style.transform = 'translateX(-50%) scale(0.94)'; };
    btn.ontouchend = () => { btn.style.transform = 'translateX(-50%) scale(1.04)'; };
    btn.onclick = dropFood;
    container.appendChild(btn);

    // ── Helpers ────────────────────────────────────────────────────────────
    function sw() {
      const width = container.offsetWidth || window.innerWidth || 600;
      return width > 0 ? width : 600;
    }

    function dropFood() {
      console.log('dropFood called');
      const f = randFood();
      console.log('Selected food:', f);
      const pad = 90;
      const width = sw();
      console.log('Container width:', width);
      const x = pad + Math.random() * (width - 2 * pad);
      console.log('Food position x:', x);
      const foodId = uid();
      fallingFoods.push({ id: foodId, x, y: -50, type: f, rotation: Math.random() * 360 });
      console.log('Added to fallingFoods, total:', fallingFoods.length);
      // Visual feedback
      const originalText = btn.textContent;
      btn.textContent = '🎁 Dropped!';
      btn.style.background = 'linear-gradient(135deg,#56ff9a,#6bff6b)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = 'linear-gradient(135deg,#ff9a56,#ff6b6b)';
      }, 500);
    }

    function spawnParticle(x, y, emoji, vx, vy, life, big = false) {
      const id = uid();
      const el = document.createElement('div');
      el.textContent = emoji;
      el.style.cssText = `position:absolute;pointer-events:none;font-size:${big ? '2rem' : '1.3rem'};opacity:1;`;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      pLayer.appendChild(el);
      particles.push({ id, el, x, y, vx, vy, life, maxLife: life });
    }

    function eatFood(food) {
      dog.eating = true;
      dog.walking = false;
      dog.target = null;

      foods = foods.filter(f => f.id !== food.id);
      if (foodEls[food.id]) { foodEls[food.id].remove(); delete foodEls[food.id]; }

      fedCount++;
      scoreEl.textContent = `🍖 Fed: ${fedCount}`;

      const mx = dog.facingRight ? dog.x + 82 : dog.x + 18;
      const my = dog.y + 28;
      for (let i = 0; i < 6; i++)
        spawnParticle(mx + (Math.random() - .5) * 30, my + (Math.random() - .5) * 15,
          '✨', (Math.random() - .5) * 4, -2 - Math.random() * 3, 40);
      spawnParticle(mx, my - 20, food.type.emoji, 0, -3, 30, true);

      setTimeout(() => {
        dog.eating = false;
        dog.happy = true;
        const hEmoji = food.type.name === 'choc' ? '😋' : food.type.name === 'grape' ? '🥰' : '❤️';
        for (let i = 0; i < 5; i++)
          spawnParticle(dog.x + 25 + Math.random() * 55, dog.y - 25, hEmoji,
            (Math.random() - .5) * 2.5, -1.5 - Math.random(), 55);
        setTimeout(() => { dog.happy = false; dog.walking = true; }, 2000);
      }, 800);
    }

    // ── Dog DOM update ─────────────────────────────────────────────────────
    function updateDogDOM() {
      dogEl.style.left = dog.x + 'px';
      dogEl.style.top = dog.y + 'px';
      dogEl.style.transform = `scaleX(${dog.facingRight ? 1 : -1})`;

      const walking = dog.walking && !dog.eating;

      dlegs.forEach(l => {
        l.style.animationPlayState = walking ? 'running' : 'paused';
      });
      dbodywrap.style.animationPlayState = walking ? 'running' : 'paused';
      dheadwrap.style.animationPlayState = walking ? 'running' : 'paused';

      // Tail wag speed
      dtail.style.animationDuration = dog.happy ? '0.18s' : '0.4s';
      dtail.style.animationPlayState = (dog.happy || walking) ? 'running' : 'paused';

      // Happy bounce on body
      dtorso.className = dog.happy ? 'd-happy' : '';
      dhead.className = dog.eating ? 'd-eating' : '';

      // Mouth open when eating
      if (dog.eating) {
        dmouth.style.height = '13px';
        dmouth.style.background = '#ff6b6b';
      } else {
        dmouth.style.height = '6px';
        dmouth.style.background = 'transparent';
      }

      // Button tracks dog — always above the dog's head
      btn.style.left = (dog.x + DOG_W / 2) + 'px';
      btn.style.top = (dog.y - 58) + 'px';
    }

    // ── Main Loop ──────────────────────────────────────────────────────────
    let raf;
    const SPEED = 2.5;
    const PAD = 80;
    const EAT_RANGE = 58;

    function loop() {
      const W = sw();

      // 1. Falling food physics
      for (let i = fallingFoods.length - 1; i >= 0; i--) {
        const f = fallingFoods[i];
        f.y += 8;
        f.rotation += 5;

        if (f.y >= GROUND_Y + 14) {
          // Land
          foods.push({ id: f.id, x: f.x, y: GROUND_Y + 10, type: f.type });
          if (fallingEls[f.id]) { fallingEls[f.id].remove(); delete fallingEls[f.id]; }
          fallingFoods.splice(i, 1);

          // Create landed food element
          const el = document.createElement('div');
          el.textContent = f.type.emoji;
          el.style.cssText = `position:absolute;font-size:2.2rem;pointer-events:none;z-index:55;
            transform:translateX(-50%);filter:drop-shadow(0 4px 6px ${f.type.color}70);`;
          el.className = 'd-food-item';
          el.style.left = f.x + 'px';
          el.style.top = (GROUND_Y + 10) + 'px';
          container.appendChild(el);
          foodEls[f.id] = el;
        } else {
          // Still falling
          if (!fallingEls[f.id]) {
            const el = document.createElement('div');
            el.textContent = f.type.emoji;
            el.style.cssText = `position:absolute;font-size:2.2rem;pointer-events:none;z-index:55;`;
            container.appendChild(el);
            fallingEls[f.id] = el;
          }
          const el = fallingEls[f.id];
          el.style.left = f.x + 'px';
          el.style.top = f.y + 'px';
          el.style.transform = `rotate(${f.rotation}deg)`;
        }
      }

      // 2. Dog AI
      if (!dog.eating && dog.walking) {
        let targetX = null;

        // Find nearest food
        if (!dog.target && foods.length > 0) {
          let nearest = null, dist = Infinity;
          foods.forEach(f => {
            const d = Math.abs(f.x - (dog.x + DOG_W / 2));
            if (d < dist) { dist = d; nearest = f; }
          });
          if (nearest) dog.target = nearest.id;
        }

        if (dog.target) {
          const tf = foods.find(f => f.id === dog.target);
          if (!tf) { dog.target = null; }
          else { targetX = tf.x - DOG_W / 2; }
        }

        // Patrol if no food
        if (targetX === null) {
          if (walkDir === 1) {
            targetX = W - DOG_W - PAD;
            if (dog.x >= targetX - 4) walkDir = -1;
          } else {
            targetX = PAD;
            if (dog.x <= targetX + 4) walkDir = 1;
          }
        }

        const dx = targetX - dog.x;
        if (Math.abs(dx) > 4) {
          dog.x += Math.sign(dx) * SPEED;
          dog.facingRight = dx > 0;
        } else if (dog.target) {
          const tf = foods.find(f => f.id === dog.target);
          if (tf && Math.abs(tf.x - (dog.x + DOG_W / 2)) < EAT_RANGE) {
            eatFood(tf);
          }
        }
      }

      // 3. Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life--;
        p.opacity = p.life / p.maxLife;
        if (p.life <= 0) {
          p.el.remove();
          particles.splice(i, 1);
        } else {
          p.el.style.left = p.x + 'px';
          p.el.style.top = p.y + 'px';
          p.el.style.opacity = p.opacity;
        }
      }

      // 4. Update dog visuals
      updateDogDOM();

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
    gameRef.current = { dropFood };

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      styleTag.remove();
      container.innerHTML = '';
    };
  }, []);

  return createPortal(<div ref={containerRef} />, document.body);
}
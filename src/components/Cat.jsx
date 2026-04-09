import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const CAT_W = 100;
const GROUND_Y = 90;
const FISH_EMOJI = '🐟';

export default function FishCat(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for mobile and hide if screen is small
    const isMobile = window.innerWidth <= 900;
    const catScale = isMobile ? 0.45 : 0.6;

    container.innerHTML = '';
    if (props.inline) {
      container.style.position = 'absolute';
      container.style.bottom = '0';
      container.style.left = '50%';
      container.style.transform = `translateX(-50%) scale(${catScale})`;
      container.style.width = '200px';
      container.style.height = '150px';
    } else {
      container.style.position = 'fixed';
      container.style.bottom = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = isMobile ? '120px' : '180px';
      if (isMobile) {
        container.style.transform = 'scale(0.85)';
        container.style.transformOrigin = 'bottom center';
      }
    }
    container.style.pointerEvents = props.inline ? 'none' : 'auto';
    container.style.zIndex = props.inline ? '90' : '99999';
    container.style.overflow = 'visible';

    let idN = 0;
    const uid = () => ++idN;

    const cat = { x: 200, y: GROUND_Y, facingRight: true, walking: true, eating: false, happy: false, target: null };
    let walkDir = -1;
    let foods = [];
    let fallingFoods = [];
    let particles = [];
    const fallingEls = {};
    const foodEls = {};

    let fedCount = 0;
    const scoreEl = document.createElement('div');
    scoreEl.style.cssText = `position:absolute;top:12px;right:16px;background:rgba(255,255,255,0.85);
      border-radius:20px;padding:6px 16px;font-size:0.85rem;font-weight:600;color:#333;z-index:200;pointer-events:auto;`;
    scoreEl.textContent = '🐟 Fed: 0';
    container.appendChild(scoreEl);

    const hint = document.createElement('div');
    hint.style.cssText = `position:absolute;bottom:12px;right:50%;transform:translateX(50%);
      background:rgba(0,0,0,0.35);color:white;border-radius:20px;padding:5px 14px;
      font-size:0.75rem;z-index:200;pointer-events:none;`;
    container.appendChild(hint);

    const pLayer = document.createElement('div');
    pLayer.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:90;';
    container.appendChild(pLayer);

    // ── Cat animations ──
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      @keyframes cl-walk  { 0%,100%{transform:rotate(-20deg) translateY(0)} 50%{transform:rotate(20deg) translateY(-5px)} }
      @keyframes cl-walko { 0%,100%{transform:rotate(20deg) translateY(-5px)} 50%{transform:rotate(-20deg) translateY(0)} }
      @keyframes ct-wag   { 0%{transform:rotate(-25deg)} 25%{transform:rotate(15deg)} 50%{transform:rotate(-15deg)} 75%{transform:rotate(20deg)} 100%{transform:rotate(-25deg)} }
      @keyframes cb-bob   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
      @keyframes ch-bob   { 0%,100%{transform:rotate(-1deg)} 50%{transform:rotate(1deg)} }
      @keyframes c-blink  { 0%,92%,100%{transform:scaleY(1)} 96%{transform:scaleY(0.1)} }
      @keyframes c-purr   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      @keyframes c-eatm   { 0%,100%{transform:translateY(0) rotate(0)} 25%,75%{transform:translateY(-3px) rotate(-2deg)} }
      @keyframes c-ear    { 0%,88%,100%{transform:rotate(0deg)} 92%{transform:rotate(10deg)} }
      @keyframes fbounce  { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-5px)} }
      .cl-leg  { width:13px;height:28px;background:linear-gradient(180deg,#888,#aaa);border-radius:7px;
                 position:absolute;transform-origin:top center;animation:cl-walk 0.48s linear infinite; }
      .cl-lego { animation:cl-walko 0.48s linear infinite; }
      .cl-body-wrap { animation:cb-bob 0.48s ease-in-out infinite; }
      .cl-head-wrap { animation:ch-bob 0.48s ease-in-out infinite; }
      .c-food-item { animation:fbounce 1s ease-in-out infinite; }
    `;
    document.head.appendChild(styleTag);

    // ── Build Cat — side-facing like the dog ──
    const catEl = document.createElement('div');
    catEl.style.cssText = `position:absolute;width:${CAT_W}px;height:85px;pointer-events:auto;z-index:70;`;
    catEl.innerHTML = `
      <!-- Tail (curvy, left side) -->
      <div id="ctail" style="position:absolute;left:-2px;top:10px;transform-origin:right center;animation:ct-wag 1s ease-in-out infinite;z-index:1;">
        <svg viewBox="0 0 38 22" width="38" height="22" style="overflow:visible;">
          <path d="M35,16 Q22,-2 12,8 Q4,16 2,6" fill="none" stroke="#f5f5f5ff" stroke-width="5" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- Back legs -->
      <div class="cl-leg cl-lego" style="left:16px;bottom:0;z-index:1;"></div>
      <div class="cl-leg" style="right:36px;bottom:0;z-index:1;opacity:0.85;"></div>

      <!-- Body -->
      <div class="cl-body-wrap" id="cbodywrap" style="position:absolute;inset:0;">
        <div id="ctorso" style="position:absolute;left:10px;top:16px;width:72px;height:40px;
          background:linear-gradient(180deg,#999 0%,#aaa 40%,#ccc 100%);
          border-radius:20px 22px 16px 14px;box-shadow:inset -3px -3px 8px rgba(0,0,0,0.08);z-index:2;">
          <!-- Belly -->
          <div style="position:absolute;left:50%;top:55%;transform:translate(-50%,-50%);width:30px;height:22px;
            background:rgba(235, 219, 219, 0.5);border-radius:50%;"></div>
          <!-- Stripe -->
          <div style="position:absolute;left:20px;top:5px;width:14px;height:3px;background:#888;border-radius:2px;transform:rotate(-8deg);opacity:0.3;"></div>
          <div style="position:absolute;left:34px;top:3px;width:10px;height:3px;background:#888;border-radius:2px;transform:rotate(5deg);opacity:0.25;"></div>
        </div>
      </div>

      <!-- Front legs -->
      <div class="cl-leg cl-lego" style="left:28px;bottom:0;z-index:3;opacity:0.9;"></div>
      <div class="cl-leg" style="right:20px;bottom:0;z-index:3;"></div>

      <!-- Head group — SIDE-FACING (like the dog) -->
      <div class="cl-head-wrap" id="cheadwrap" style="position:absolute;inset:0;">
        <div id="chead" style="position:absolute;right:-10px;top:-2px;width:42px;height:38px;
          background:linear-gradient(145deg,#999,#aaa);border-radius:50%;
          box-shadow:inset -2px -2px 6px rgba(0,0,0,0.1);z-index:4;">

          <!-- Ear (back, only one visible in profile) -->
          <div style="position:absolute;left:2px;top:-6px;z-index:5;animation:c-ear 3s infinite;">
            <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;
              border-bottom:14px solid #ceababff;transform:rotate(-12deg);"></div>
            <div style="position:absolute;left:3px;top:4px;width:0;height:0;border-left:3px solid transparent;
              border-right:3px solid transparent;border-bottom:8px solid #ffb6c1;"></div>
          </div>

          <!-- Front ear -->
          <div style="position:absolute;right:6px;top:-8px;z-index:6;animation:c-ear 3.4s infinite;">
            <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;
              border-bottom:16px solid #aaa;transform:rotate(8deg);"></div>
            <div style="position:absolute;left:4px;top:4px;width:0;height:0;border-left:4px solid transparent;
              border-right:4px solid transparent;border-bottom:9px solid #ffb6c1;"></div>
          </div>

          <!-- Eye (one visible in profile view) -->
          <div style="position:absolute;right:10px;top:10px;width:10px;height:12px;
            background:#1a1a2e;border-radius:50%;animation:c-blink 3.5s infinite;z-index:6;">
            <div style="position:absolute;right:2px;top:2px;width:4px;height:4px;background:white;border-radius:50%;"></div>
            <div style="position:absolute;right:5px;top:7px;width:2px;height:2px;background:rgba(255,255,255,0.4);border-radius:50%;"></div>
          </div>

          <!-- Muzzle (side profile) -->
          <div style="position:absolute;right:-5px;top:16px;width:20px;height:16px;
            background:#ccc;border-radius:10px;z-index:7;">
            <!-- Nose -->
            <div style="position:absolute;right:2px;top:2px;width:6px;height:5px;
              background:#ff8fa0;border-radius:50%;"></div>
          </div>

          <!-- Mouth -->
          <div id="cmouth" style="position:absolute;right:-2px;top:28px;z-index:7;">
            <svg width="12" height="6" viewBox="0 0 12 6">
              <path d="M1,1 Q6,5 11,1" fill="none" stroke="#000000ff" stroke-width="1"/>
            </svg>
          </div>

          <!-- Whiskers (one side visible in profile) -->
          <div style="position:absolute;right:-14px;top:18px;z-index:5;">
            <div style="width:16px;height:1px;background:#555;opacity:0.25;transform:rotate(-8deg);margin-bottom:3px;"></div>
            <div style="width:18px;height:1px;background:#555;opacity:0.25;transform:rotate(0deg);margin-bottom:3px;"></div>
            
            <div style="width:16px;height:1px;background:#555;opacity:0.25;transform:rotate(8deg);"></div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(catEl);

    const ctail = catEl.querySelector('#ctail');
    const cbodywrap = catEl.querySelector('#cbodywrap');
    const cheadwrap = catEl.querySelector('#cheadwrap');
    const ctorso = catEl.querySelector('#ctorso');
    const cmouth = catEl.querySelector('#cmouth');
    const clegs = catEl.querySelectorAll('.cl-leg');

    // ── Button ──
    const btn = document.createElement('button');
    btn.textContent = '🐟 Drop Fish!';
    btn.style.cssText = `
      position:absolute;padding:10px 22px;font-size:0.88rem;cursor:pointer;
      background:linear-gradient(135deg,#1e90ff,#104e8b);border:none;border-radius:25px;
      color:white;font-weight:700;z-index:200;pointer-events:auto;
      transform:translateX(-50%);white-space:nowrap;
      box-shadow:0 4px 14px rgba(30,144,255,0.45);transition:box-shadow 0.15s,transform 0.1s;
    `;
    btn.onmouseenter = () => { btn.style.boxShadow = '0 6px 20px rgba(30,144,255,0.65)'; };
    btn.onmouseleave = () => { btn.style.boxShadow = '0 4px 14px rgba(30,144,255,0.45)'; btn.style.transform = 'translateX(-50%) scale(1)'; };
    btn.onmousedown = () => { btn.style.transform = 'translateX(-50%) scale(0.94)'; };
    btn.onmouseup = () => { btn.style.transform = 'translateX(-50%) scale(1.04)'; };
    btn.onclick = dropFood;
    container.appendChild(btn);

    function sw() {
      const w = container.offsetWidth || window.innerWidth || 600;
      return w > 0 ? w : 600;
    }

    function dropFood() {
      const pad = 90;
      const w = sw();
      const x = pad + Math.random() * (w - 2 * pad);
      fallingFoods.push({ id: uid(), x, y: -50, rotation: Math.random() * 360 });
      const orig = btn.textContent;
      btn.textContent = '🐟 Dropped!';
      btn.style.background = 'linear-gradient(135deg,#56ff9a,#6bff6b)';
      setTimeout(() => { btn.textContent = orig; btn.style.background = 'linear-gradient(135deg,#1e90ff,#104e8b)'; }, 500);
    }

    function spawnParticle(x, y, emoji, vx, vy, life, big = false) {
      const el = document.createElement('div');
      el.textContent = emoji;
      el.style.cssText = `position:absolute;pointer-events:none;font-size:${big ? '2rem' : '1.3rem'};opacity:1;`;
      el.style.left = x + 'px'; el.style.top = y + 'px';
      pLayer.appendChild(el);
      particles.push({ id: uid(), el, x, y, vx, vy, life, maxLife: life });
    }

    function eatFood(food) {
      cat.eating = true; cat.walking = false; cat.target = null;
      foods = foods.filter(f => f.id !== food.id);
      if (foodEls[food.id]) { foodEls[food.id].remove(); delete foodEls[food.id]; }
      fedCount++; scoreEl.textContent = `🐟 Fed: ${fedCount}`;
      const mx = cat.facingRight ? cat.x + 72 : cat.x + 18;
      const my = cat.y + 20;
      for (let i = 0; i < 6; i++)
        spawnParticle(mx + (Math.random() - .5) * 30, my + (Math.random() - .5) * 15, '✨', (Math.random() - .5) * 4, -2 - Math.random() * 3, 40);
      spawnParticle(mx, my - 20, FISH_EMOJI, 0, -3, 30, true);
      setTimeout(() => {
        cat.eating = false; cat.happy = true;
        for (let i = 0; i < 5; i++)
          spawnParticle(cat.x + 20 + Math.random() * 50, cat.y - 20, '💕', (Math.random() - .5) * 2.5, -1.5 - Math.random(), 55);
        setTimeout(() => { cat.happy = false; cat.walking = true; }, 2000);
      }, 800);
    }

    function updateCatDOM() {
      catEl.style.left = cat.x + 'px';
      catEl.style.top = cat.y + 'px';
      catEl.style.transform = `scaleX(${cat.facingRight ? 1 : -1})`;
      const walking = cat.walking && !cat.eating;
      clegs.forEach(l => { l.style.animationPlayState = walking ? 'running' : 'paused'; });
      cbodywrap.style.animationPlayState = walking ? 'running' : 'paused';
      cheadwrap.style.animationPlayState = walking ? 'running' : 'paused';
      ctail.style.animationDuration = cat.happy ? '0.35s' : '1s';
      ctail.style.animationPlayState = (cat.happy || walking) ? 'running' : 'paused';
      ctorso.style.animation = cat.happy ? 'c-purr 0.4s ease-in-out infinite' : 'none';
      if (cat.eating) {
        cheadwrap.style.animation = 'c-eatm 0.25s ease-in-out infinite';
        cmouth.innerHTML = `<svg width="12" height="8" viewBox="0 0 12 8"><ellipse cx="6" cy="4" rx="4" ry="4" fill="#ff6b6b"/></svg>`;
      } else {
        cheadwrap.style.animation = walking ? 'ch-bob 0.48s ease-in-out infinite' : 'none';
        cmouth.innerHTML = `<svg width="12" height="6" viewBox="0 0 12 6"><path d="M1,1 Q6,5 11,1" fill="none" stroke="#555" stroke-width="1"/></svg>`;
      }
      btn.style.left = (cat.x + CAT_W / 2) + 'px';
      btn.style.top = (cat.y - 50) + 'px';
    }

    let raf;
    const SPEED = 1.8;
    const PAD = 80;
    const EAT_RANGE = 50;

    function loop() {
      const W = sw();
      for (let i = fallingFoods.length - 1; i >= 0; i--) {
        const f = fallingFoods[i];
        f.y += 7; f.rotation += 5;
        if (f.y >= GROUND_Y + 10) {
          foods.push({ id: f.id, x: f.x, y: GROUND_Y + 6 });
          if (fallingEls[f.id]) { fallingEls[f.id].remove(); delete fallingEls[f.id]; }
          fallingFoods.splice(i, 1);
          const el = document.createElement('div');
          el.textContent = FISH_EMOJI;
          el.style.cssText = `position:absolute;font-size:2.2rem;pointer-events:none;z-index:55;transform:translateX(-50%);filter:drop-shadow(0 4px 6px rgba(30,144,255,0.5));`;
          el.className = 'c-food-item';
          el.style.left = f.x + 'px'; el.style.top = (GROUND_Y + 6) + 'px';
          container.appendChild(el);
          foodEls[f.id] = el;
        } else {
          if (!fallingEls[f.id]) {
            const el = document.createElement('div');
            el.textContent = FISH_EMOJI;
            el.style.cssText = 'position:absolute;font-size:2.2rem;pointer-events:none;z-index:55;';
            container.appendChild(el); fallingEls[f.id] = el;
          }
          const el = fallingEls[f.id];
          el.style.left = f.x + 'px'; el.style.top = f.y + 'px';
          el.style.transform = `rotate(${f.rotation}deg)`;
        }
      }

      if (!cat.eating && cat.walking) {
        let targetX = null;
        if (!cat.target && foods.length > 0) {
          let nearest = null, dist = Infinity;
          foods.forEach(f => { const d = Math.abs(f.x - (cat.x + CAT_W / 2)); if (d < dist) { dist = d; nearest = f; } });
          if (nearest) cat.target = nearest.id;
        }
        if (cat.target) {
          const tf = foods.find(f => f.id === cat.target);
          if (!tf) cat.target = null;
          else targetX = tf.x - CAT_W / 2;
        }
        if (targetX === null) {
          if (walkDir === 1) { targetX = W - CAT_W - PAD; if (cat.x >= targetX - 4) walkDir = -1; }
          else { targetX = PAD; if (cat.x <= targetX + 4) walkDir = 1; }
        }
        const dx = targetX - cat.x;
        if (Math.abs(dx) > 4) { cat.x += Math.sign(dx) * SPEED; cat.facingRight = dx > 0; }
        else if (cat.target) {
          const tf = foods.find(f => f.id === cat.target);
          if (tf && Math.abs(tf.x - (cat.x + CAT_W / 2)) < EAT_RANGE) eatFood(tf);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life--;
        if (p.life <= 0) { p.el.remove(); particles.splice(i, 1); }
        else { p.el.style.left = p.x + 'px'; p.el.style.top = p.y + 'px'; p.el.style.opacity = p.life / p.maxLife; }
      }

      updateCatDOM();
      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); styleTag.remove(); container.innerHTML = ''; };
  }, []);

  if (props.inline) {
    return <div ref={containerRef} className="cat-inline-container" style={{ position: 'relative', width: '100%', height: '100%' }} />;
  }
  return createPortal(<div ref={containerRef}></div>, document.body);
}
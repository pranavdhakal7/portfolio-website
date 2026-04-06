import { useEffect, useRef } from 'react';

const CAT_WIDTH = 120;
const GROUND_Y = 300;
const FISH_EMOJI = '🐟';

export default function FishCat() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = '';
        container.style.position = 'fixed';
        container.style.bottom = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '400px';
        container.style.pointerEvents = 'auto';
        container.style.zIndex = '9999';

        let idCounter = 0;
        const uid = () => ++idCounter;

        // Cat state
        const cat = { x: 150, y: GROUND_Y, facingRight: true, drinking: false };

        let fallingItems = [];
        let particles = [];
        const particleLayer = document.createElement('div');
        particleLayer.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:90;';
        container.appendChild(particleLayer);

        // Style tag for animations - enhanced to match pet food style
        const styleTag = document.createElement('style');
        styleTag.textContent = `
            @keyframes fpulse {
                0%,100%{filter:drop-shadow(0 4px 6px rgba(30,144,255,0.5)) brightness(1) scale(1);}
                50%{filter:drop-shadow(0 6px 10px rgba(30,144,255,0.8)) brightness(1.2) scale(1.05);}
            }
            @keyframes fbounce {
                0%,100%{transform:translateX(-50%) translateY(0) rotate(var(--rot));}
                50%{transform:translateX(-50%) translateY(-5px) rotate(var(--rot));}
            }
            .fish-item {
                animation:fpulse 1.5s ease-in-out infinite, fbounce 1s ease-in-out infinite;
                transform-origin: center;
            }
        `;
        document.head.appendChild(styleTag);

        // Score
        let fedCount = 0;
        const scoreEl = document.createElement('div');
        scoreEl.style.cssText = `
      position:absolute;top:12px;left:16px;
      background:rgba(255,255,255,0.85);border-radius:20px;
      padding:6px 16px;font-size:0.85rem;font-weight:600;color:#333;z-index:200;
    `;
        scoreEl.textContent = `🐟 Fed: ${fedCount}`;
        container.appendChild(scoreEl);

        // Cat GIF
        const catEl = document.createElement('img');
        catEl.src = 'https://media.baamboozle.com/uploads/images/1340366/c9395bfe-ac89-47ee-a250-178d930c916e.gif';
        catEl.style.cssText = `position:absolute;width:${CAT_WIDTH}px;height:auto;pointer-events:none;z-index:70;`;
        container.appendChild(catEl);

        // Drop Fish Button
        const btn = document.createElement('button');
        btn.textContent = '🐟 Drop Fish!';
        btn.style.cssText = `
      position:absolute;padding:10px 22px;font-size:0.88rem;cursor:pointer;
      background:linear-gradient(135deg,#1e90ff,#104e8b);border:none;border-radius:25px;
      color:white;font-weight:700;z-index:200;transform:translateX(-50%);
      box-shadow:0 4px 14px rgba(30,144,255,0.45);transition:0.1s;
    `;
        container.appendChild(btn);

        btn.onclick = () => {
            console.log('Cat drop fish button clicked');
            const width = container.offsetWidth || window.innerWidth || 600;
            console.log('Container width:', width);
            const x = 50 + Math.random() * (width - 100);
            console.log('Fish position x:', x);
            const fishId = uid();
            fallingItems.push({ id: fishId, x, y: -50, rotation: Math.random() * 360 });
            console.log('Added to fallingItems, total:', fallingItems.length);
            // Visual feedback
            const originalText = btn.textContent;
            btn.textContent = '🐟 Dropped!';
            btn.style.background = 'linear-gradient(135deg,#56ff9a,#6bff6b)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = 'linear-gradient(135deg,#1e90ff,#104e8b)';
            }, 500);
        };
        btn.ontouchstart = (e) => {
            e.preventDefault();
            btn.style.transform = 'translateX(-50%) scale(0.94)';
        };
        btn.ontouchend = (e) => {
            e.preventDefault();
            btn.style.transform = 'translateX(-50%) scale(1.04)';
        };

        // Particle spawn
        const spawnParticle = (x, y, emoji) => {
            const id = uid();
            const el = document.createElement('div');
            el.textContent = emoji;
            el.style.cssText = 'position:absolute;font-size:1.5rem;pointer-events:none;opacity:1;';
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            particleLayer.appendChild(el);
            particles.push({ id, el, x, y, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 2, life: 30 });
        };

        // Animation loop
        let raf;
        const SPEED = 2;

        const loop = () => {
            const width = container.offsetWidth || window.innerWidth || 600;

            // Cat walking
            if (!cat.drinking) {
                cat.x += SPEED * (cat.facingRight ? 1 : -1);
                if (cat.x < 0) cat.facingRight = true;
                if (cat.x > width - CAT_WIDTH) cat.facingRight = false;

                // Walking GIF
                catEl.src = 'https://media.baamboozle.com/uploads/images/1340366/c9395bfe-ac89-47ee-a250-178d930c916e.gif';
            }

            catEl.style.left = cat.x + 'px';
            catEl.style.top = cat.y + 'px';
            catEl.style.transform = `scaleX(${cat.facingRight ? 1 : -1})`;

            // Button above cat
            btn.style.left = cat.x + CAT_WIDTH / 2 + 'px';
            btn.style.top = cat.y - 50 + 'px';

            // Update falling fish
            for (let i = fallingItems.length - 1; i >= 0; i--) {
                const f = fallingItems[i];
                f.y += 4;
                f.rotation += 5;

                // Create element if missing
                if (!f.el) {
                    const el = document.createElement('div');
                    el.textContent = FISH_EMOJI;
                    el.style.cssText = 'position:absolute;font-size:2.2rem;pointer-events:none;z-index:55;';
                    el.classList.add('fish-item');
                    container.appendChild(el);
                    f.el = el;
                }
                f.el.style.left = f.x + 'px';
                f.el.style.top = f.y + 'px';
                // Use CSS custom property for rotation to work with bounce animation
                f.el.style.setProperty('--rot', `${f.rotation}deg`);

                // Collision with cat
                if (f.y > cat.y && f.x > cat.x && f.x < cat.x + CAT_WIDTH) {
                    cat.drinking = true;
                    fedCount++;
                    scoreEl.textContent = `🐟 Fed: ${fedCount}`;

                    // Eating GIF with transparent background
                    catEl.src = 'https://www.sigstick.com/pack/KvVUoOpOBZ6y2A4ZYg8o-pusheen';
                    for (let p = 0; p < 6; p++) spawnParticle(cat.x + 40, cat.y + 10, '✨');
                    container.removeChild(f.el);
                    fallingItems.splice(i, 1);

                    // Smooth timing: revert to walking after 1.2s
                    setTimeout(() => {
                        cat.drinking = false;
                    }, 1200);
                    continue;
                }

                // Remove if offscreen
                if (f.y > 400) {
                    container.removeChild(f.el);
                    fallingItems.splice(i, 1);
                }
            }

            // Update particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                p.el.style.left = p.x + 'px';
                p.el.style.top = p.y + 'px';
                p.el.style.opacity = p.life / 30;
                if (p.life <= 0) {
                    particleLayer.removeChild(p.el);
                    particles.splice(i, 1);
                }
            }

            raf = requestAnimationFrame(loop);
        };

        loop();
        return () => cancelAnimationFrame(raf);
    }, []);

    return <div ref={containerRef}></div>;
}
import React, { useEffect, useRef } from 'react';

const Abstract3DShapes = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let animationId;
        let t = 0;

        // Mouse tracking
        const mouse = { x: -9999, y: -9999 };
        const REPEL_RADIUS = 120;
        const REPEL_STRENGTH = 6;

        const onMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        const onMouseLeave = () => {
            mouse.x = -9999;
            mouse.y = -9999;
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseleave', onMouseLeave);

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);

        // ── Torus Knot wireframe ──────────────────────────────────────────────
        const p = 2, q = 3;
        const steps = 220;
        const tubeSegs = 18;
        const R = 210, r = 70;  // bigger knot

        const project = (x, y, z, fov = 680) => {
            const scale = fov / (fov + z);
            return [x * scale, y * scale, scale];
        };

        const rotateYX = (x, y, z, ry, rx) => {
            let x1 = x * Math.cos(ry) + z * Math.sin(ry);
            let z1 = -x * Math.sin(ry) + z * Math.cos(ry);
            let y1 = y * Math.cos(rx) - z1 * Math.sin(rx);
            let z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
            return [x1, y1, z2];
        };

        const getTKPoint = (u) => {
            const r1 = Math.cos(q * u) * R + r * 1.8;
            const x = r1 * Math.cos(p * u);
            const y = r1 * Math.sin(p * u);
            const z = -r * Math.sin(q * u) * 2.6;
            return [x, y, z];
        };

        // Tube radius for the wireframe mesh
        const tubeR = r * 0.8;

        // ── Particles ─────────────────────────────────────────────────────────
        // Each particle has: screen position (x,y), 3D z for depth, velocity (vx,vy),
        // plus base position for soft return
        const NUM_PARTICLES = 500;

        const particles = Array.from({ length: NUM_PARTICLES }, () => {
            const bx = (Math.random() - 0.5) * width * 1.6;
            const by = (Math.random() - 0.5) * height * 1.6;
            return {
                bx,           // base X (3D space)
                by,           // base Y (3D space)
                z: (Math.random() - 0.5) * 800,
                vx: 0,
                vy: 0,
                speed: 0.15 + Math.random() * 0.35,
                size: 0.8 + Math.random() * 2.2,
                alpha: 0.4 + Math.random() * 0.6,
                hue: Math.random() > 0.55 ? 190 : 270,
                // screen position (updated every frame)
                sx: 0,
                sy: 0,
                // offset from base due to repulsion
                ox: 0,
                oy: 0,
            };
        });

        const draw = () => {
            t += 0.004;

            // Background
            const bg = ctx.createRadialGradient(
                width / 2, height / 2, 0,
                width / 2, height / 2, Math.max(width, height) * 0.8
            );
            bg.addColorStop(0, 'rgba(10, 10, 26, 1)');
            bg.addColorStop(1, 'rgba(0, 0, 0, 1)');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);

            // Shift center: slightly right of center (15% of width) and vertically centered
            const cx = width / 2 + width * 0.15;
            const cy = height / 2;
            const ry = t * 0.5;
            const rx = t * 0.25;

            // Glowing circle at center
            const pulse = 0.5 + 0.5 * Math.sin(t * 3); // pulse speed
            const glowRadius = 80 + 20 * pulse;
            const glowGradient = ctx.createRadialGradient(
                cx, cy, 0,
                cx, cy, glowRadius
            );
            glowGradient.addColorStop(0, 'hsla(190, 100%, 75%, 0.8)');
            glowGradient.addColorStop(0.5, 'hsla(190, 100%, 60%, 0.3)');
            glowGradient.addColorStop(1, 'hsla(190, 100%, 50%, 0)');
            ctx.beginPath();
            ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
            ctx.fillStyle = glowGradient;
            ctx.fill();

            // ── Torus knot ──
            for (let i = 0; i < steps; i++) {
                const u0 = (i / steps) * Math.PI * 2;
                const u1 = ((i + 1) / steps) * Math.PI * 2;

                for (let j = 0; j < tubeSegs; j++) {
                    const v0 = (j / tubeSegs) * Math.PI * 2;
                    const v1 = ((j + 1) / tubeSegs) * Math.PI * 2;

                    const spine0 = getTKPoint(u0);
                    const spine1 = getTKPoint(u1);

                    const T = [spine1[0] - spine0[0], spine1[1] - spine0[1], spine1[2] - spine0[2]];
                    const len = Math.hypot(...T);
                    const tn = T.map(v => v / len);

                    const up = [0, 1, 0];
                    const B = [
                        tn[1] * up[2] - tn[2] * up[1],
                        tn[2] * up[0] - tn[0] * up[2],
                        tn[0] * up[1] - tn[1] * up[0],
                    ];
                    const bLen = Math.hypot(...B) || 1;
                    const bn = B.map(v => v / bLen);
                    const N = [
                        tn[1] * bn[2] - tn[2] * bn[1],
                        tn[2] * bn[0] - tn[0] * bn[2],
                        tn[0] * bn[1] - tn[1] * bn[0],
                    ];

                    if (i % 3 !== 0 && j % 2 !== 0) continue;

                    const buildPt = (spine, ang) => {
                        const x = spine[0] + tubeR * (N[0] * Math.cos(ang) + bn[0] * Math.sin(ang));
                        const y = spine[1] + tubeR * (N[1] * Math.cos(ang) + bn[1] * Math.sin(ang));
                        const z = spine[2] + tubeR * (N[2] * Math.cos(ang) + bn[2] * Math.sin(ang));
                        return rotateYX(x, y, z, ry, rx);
                    };

                    const a = buildPt(spine0, v0);
                    const b = buildPt(spine0, v1);

                    const [ax, ay] = project(a[0], a[1], a[2]);
                    const [bx2, by2] = project(b[0], b[1], b[2]);

                    const depth01 = Math.max(0, Math.min(1, (a[2] + 400) / 800));
                    const alpha = 0.15 + depth01 * 0.55;
                    const hue = 180 + depth01 * 100;
                    const lightness = 55 + depth01 * 25;

                    // Deterministic glow selection — every ~15th line glows (same lines every frame, no flicker)
                    const isGlowing = (i * 7 + j * 13) % 17 === 0;

                    ctx.beginPath();
                    ctx.moveTo(cx + ax, cy + ay);
                    ctx.lineTo(cx + bx2, cy + by2);

                    if (isGlowing) {
                        // Each glow segment has a unique phase so they blink independently
                        const phase = (i * 3.7 + j * 2.1) % (Math.PI * 2);
                        const blink = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 4 + phase));
                        // Hard off when blink value is very low → sharp strobe feel
                        const glowAlpha = blink < 0.12 ? 0 : blink;

                        if (glowAlpha > 0) {
                            ctx.save();
                            ctx.shadowBlur = 10 + 16 * blink;
                            ctx.shadowColor = `hsla(${hue}, 100%, 75%, ${glowAlpha})`;
                            ctx.strokeStyle = `hsla(${hue}, 100%, 90%, ${Math.min(1, alpha * 2.5 * glowAlpha)})`;
                            ctx.lineWidth = 0.8 + 1.4 * blink;
                            ctx.stroke();
                            ctx.restore();
                        }
                    } else {
                        // Normal dim wireframe line
                        ctx.strokeStyle = `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            // ── Particles + mouse repulsion ──────────────────────────────────
            for (const p of particles) {
                // Advance z (fly toward viewer)
                p.z -= p.speed * 1.5;
                if (p.z < -400) { p.z = 400; }

                // Project base 3D position to screen
                const [projX, projY, ps] = project(p.bx, p.by, p.z);
                const baseScreenX = cx + projX;
                const baseScreenY = cy + projY;

                // Repulsion from mouse
                const dx = baseScreenX + p.ox - mouse.x;
                const dy = baseScreenY + p.oy - mouse.y;
                const dist = Math.hypot(dx, dy);

                if (dist < REPEL_RADIUS && dist > 0) {
                    // Force falls off with distance
                    const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
                    p.vx += (dx / dist) * force * REPEL_STRENGTH;
                    p.vy += (dy / dist) * force * REPEL_STRENGTH;
                }

                // Apply velocity to offset, then gradually return to base
                p.ox += p.vx;
                p.oy += p.vy;
                p.vx *= 0.88; // damping
                p.vy *= 0.88;
                p.ox *= 0.95; // return spring
                p.oy *= 0.95;

                const screenX = baseScreenX + p.ox;
                const screenY = baseScreenY + p.oy;

                if (screenX < -50 || screenX > width + 50 || screenY < -50 || screenY > height + 50) continue;

                const sz = p.size * ps * 1.4;

                // Glow effect – draw a larger, faint circle first
                const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, sz * 3);
                gradient.addColorStop(0, `hsla(${p.hue}, 100%, 75%, ${p.alpha * ps * 0.6})`);
                gradient.addColorStop(1, `hsla(${p.hue}, 100%, 75%, 0)`);
                ctx.beginPath();
                ctx.arc(screenX, screenY, sz * 3 > 0 ? sz * 3 : 0.5, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Solid core dot
                ctx.beginPath();
                ctx.arc(screenX, screenY, sz > 0 ? sz : 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, 88%, ${p.alpha * ps})`;
                ctx.fill();
            }

            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseleave', onMouseLeave);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                display: 'block',
            }}
        />
    );
};

export default Abstract3DShapes;

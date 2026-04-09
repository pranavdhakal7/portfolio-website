import React, { useRef, useEffect } from 'react';

const TurtleField = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear with dark night background
        ctx.fillStyle = 'rgb(5, 5, 15)';
        ctx.fillRect(0, 0, width, height);

        // Coordinate mapping: original turtle screen width=1000, height=700
        // We'll map to canvas dimensions while preserving aspect ratio
        const scaleX = width / 1000;
        const scaleY = height / 700;
        const scale = Math.min(scaleX, scaleY);

        // Helper to convert turtle coordinates to canvas
        const tx = (x) => (x + 500) * scale; // turtle x range -500..500
        const ty = (y) => (350 - y) * scale; // turtle y range -350..350 (inverted)

        // Draw glow (filled circle)
        const drawGlow = (x, y, radius, color) => {
            ctx.beginPath();
            ctx.arc(tx(x), ty(y - radius / 2), radius * scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            ctx.fill();
        };

        // Draw stem
        const drawStem = (x, y, stemHeight, color) => {
            ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            ctx.lineWidth = 3 * scale;
            ctx.beginPath();
            let currentX = tx(x);
            let currentY = ty(y);
            ctx.moveTo(currentX, currentY);
            let angle = 90; // pointing up
            for (let i = 0; i < 3; i++) {
                const segment = stemHeight / 3;
                const rad = angle * Math.PI / 180;
                currentX += Math.cos(rad) * segment * scale;
                currentY -= Math.sin(rad) * segment * scale; // y inverted
                ctx.lineTo(currentX, currentY);
                angle += (Math.random() * 40 - 20); // random -20..20
            }
            ctx.stroke();
        };

        // Draw spider lily
        const drawSpiderLily = (x, y, size, petalColor, centerColor) => {
            // Glow
            drawGlow(x, y - size * 0.2, size * 0.8, [20, 0, 0]);

            // Stamen
            ctx.strokeStyle = `rgb(${centerColor[0]}, ${centerColor[1]}, ${centerColor[2]})`;
            ctx.lineWidth = 2 * scale;
            const stamenLength = size * 1.2;
            for (let i = 0; i < 24; i++) {
                const angle = (i * 360 / 24) * Math.PI / 180;
                const startX = tx(x);
                const startY = ty(y);
                const endX = startX + Math.cos(angle) * stamenLength * scale;
                const endY = startY - Math.sin(angle) * stamenLength * scale;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                // dot at end
                ctx.fillStyle = `rgb(${centerColor[0]}, ${centerColor[1]}, ${centerColor[2]})`;
                ctx.beginPath();
                ctx.arc(endX, endY, size * 0.15 * scale, 0, Math.PI * 2);
                ctx.fill();
            }

            // Curled petals
            ctx.strokeStyle = `rgb(${petalColor[0]}, ${petalColor[1]}, ${petalColor[2]})`;
            ctx.lineWidth = 2 * scale;
            for (let i = 0; i < 12; i++) {
                let angle = (i * 360 / 12) + (Math.random() * 10 - 5);
                let curX = tx(x);
                let curY = ty(y);
                ctx.beginPath();
                ctx.moveTo(curX, curY);
                const steps = 30;
                for (let step = 0; step < steps; step++) {
                    const rad = angle * Math.PI / 180;
                    curX += Math.cos(rad) * (size / steps) * scale;
                    curY -= Math.sin(rad) * (size / steps) * scale;
                    ctx.lineTo(curX, curY);
                    angle += 3; // curl
                }
                ctx.stroke();
            }
        };

        // Draw ground gradient
        const groundY = ty(-250); // bottom of ground
        for (let i = 0; i < 80; i++) {
            const shade = 10 + i * 2;
            ctx.fillStyle = `rgb(0, ${Math.floor(shade / 2)}, 0)`;
            const y = groundY + i * 5 * scale;
            ctx.fillRect(tx(-520), y, (1040) * scale, 5 * scale);
        }

        // Random lilies
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * 900 - 450;
            const y = Math.random() * 350 - 200;
            const size = Math.random() * 14 + 18;

            // Stem
            drawStem(x, y - size * 0.4, Math.random() * 80 + 60, [0, 120, 40]);

            // Flower
            const petalColor = [230, Math.floor(Math.random() * 41), Math.floor(Math.random() * 61)];
            const centerColor = [255, 220, 220];
            drawSpiderLily(x, y, size, petalColor, centerColor);
        }

        // Tiny background dots (fireflies/stars)
        ctx.fillStyle = 'rgb(255, 255, 200)';
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * 1000 - 500;
            const y = Math.random() * 600 - 300;
            const radius = Math.random() * 2 + 1;
            ctx.beginPath();
            ctx.arc(tx(x), ty(y), radius * scale, 0, Math.PI * 2);
            ctx.fill();
        }
    }, []);

    return (
        <div className="turtle-field-container">
            <canvas
                ref={canvasRef}
                width={1000}
                height={300}
                style={{ width: '100%', height: 'auto', display: 'block' }}
            />
        </div>
    );
};

export default TurtleField;
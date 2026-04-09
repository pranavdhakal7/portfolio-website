import React, { useEffect, useRef } from 'react';
import '../styles/GlowLily.css';

const GlowLily = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Constants similar to the Python script in the video
        const CANVAS_WIDTH = canvas.width = 800;
        const CANVAS_HEIGHT = canvas.height = 800;
        const CANVAS_CENTER_X = CANVAS_WIDTH / 2;
        const CANVAS_CENTER_Y = CANVAS_HEIGHT / 2;
        const IMAGE_ENLARGE = 14;
        const COLOR = "#f7d794"; 
        const NUM_POINTS = 3000;
        const SCATTER_BETA = 0.12;

        // Parametric function for Red Spider Lily (Higanbana) filaments
        const flowerFunction = (t, shrinkRatio = IMAGE_ENLARGE) => {
            // Very sharp lobes for 6 petals
            let r = 0.8 + 0.4 * Math.pow(Math.abs(Math.sin(3 * t)), 0.1);
            
            // Add long filaments (the "spider" look)
            // We use a high-order sin power to create thin spikes at the peaks of sin(3t)
            const spike = Math.pow(Math.abs(Math.sin(3 * t)), 20) * 1.5;
            r += spike;
            
            // Add delicate ripples for the "curly" ends
            r += 0.08 * Math.sin(40 * t) * Math.pow(Math.abs(Math.sin(3 * t)), 2);
            
            let x = r * Math.cos(t);
            let y = r * Math.sin(t);
            
            x *= shrinkRatio * 15;
            y *= shrinkRatio * 15;
            
            return {
                x: x + CANVAS_CENTER_X,
                y: y + CANVAS_CENTER_Y
            };
        };


        const scatterPoints = (x, y, beta = SCATTER_BETA) => {
            const ratioX = -beta * Math.log(Math.random());
            const ratioY = -beta * Math.log(Math.random());
            const dx = ratioX * (x - CANVAS_CENTER_X);
            const dy = ratioY * (y - CANVAS_CENTER_Y);
            return { x: x - dx, y: y - dy };
        }

        const shrinkPoints = (x, y, ratio) => {
            const distSq = Math.pow(x - CANVAS_CENTER_X, 2) + Math.pow(y - CANVAS_CENTER_Y, 2);
            const force = -1 / Math.pow(distSq + 100, 0.6);
            const dx = ratio * force * (x - CANVAS_CENTER_X);
            const dy = ratio * force * (y - CANVAS_CENTER_Y);
            return { x: x - dx, y: y - dy };
        };

        const points = [];
        const edgePoints = [];
        const centerPoints = [];

        // Generate points with layered density
        for (let i = 0; i < NUM_POINTS; i++) {
            const t = Math.random() * 2 * Math.PI;
            let { x, y } = flowerFunction(t);
            ({ x, y } = scatterPoints(x, y, 0.03));
            ({ x, y } = shrinkPoints(x, y, 18));
            points.push({ x, y, x0: x, y0: y });
        }

        for (let i = 0; i < 500; i++) {
            const t = Math.random() * 2 * Math.PI;
            let { x, y } = flowerFunction(t);
            ({ x, y } = scatterPoints(x, y, 0.1));
            ({ x, y } = shrinkPoints(x, y, 12));
            edgePoints.push({ x, y, x0: x, y0: y });
        }

        for (let i = 0; i < 1500; i++) {
            const t = Math.random() * 2 * Math.PI;
            let { x, y } = flowerFunction(t);
            ({ x, y } = scatterPoints(x, y, 0.25));
            ({ x, y } = shrinkPoints(x, y, 25));
            centerPoints.push({ x, y, x0: x, y0: y });
        }

        const render = (time) => {
            // Use clearRect for transparency, then a "ghosting" rect for trails if desired
            // To keep it transparent, we don't fill with opaque color
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            const pulse = 1 + 0.12 * Math.sin(time / 250);
            
            // Bloom glow effect using shadow
            ctx.shadowBlur = 15;
            ctx.shadowColor = COLOR;
            ctx.fillStyle = COLOR;
            
            const allSets = [
                { data: points, size: 1.2, alpha: 0.9 },
                { data: edgePoints, size: 0.8, alpha: 0.6 },
                { data: centerPoints, size: 0.6, alpha: 0.4 }
            ];

            allSets.forEach(set => {
                ctx.globalAlpha = set.alpha;
                set.data.forEach(p => {
                    const dx = (p.x - CANVAS_CENTER_X) * pulse;
                    const dy = (p.y - CANVAS_CENTER_Y) * pulse;
                    
                    const driftX = (Math.random() - 0.5) * 1.2;
                    const driftY = (Math.random() - 0.5) * 1.2;

                    ctx.beginPath();
                    ctx.arc(CANVAS_CENTER_X + dx + driftX, CANVAS_CENTER_Y + dy + driftY, set.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            });

            animationFrameId = requestAnimationFrame(render);
        };


        animationFrameId = requestAnimationFrame(render);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="glow-lily-container">
            <canvas ref={canvasRef} className="glow-lily-canvas" />
        </div>
    );
};

export default GlowLily;

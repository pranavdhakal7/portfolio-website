import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const MatrixBackground = ({
    fontSize = 16,
    columns = null, // Will calculate based on screen width
    drops = [],
    baseSpeed = 3,
    trailOpacity = 0.08,
    repelRadius = 80,
    characters = '01',
    color = '#22c55e',
    backgroundColor = '#000000',
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const mousePosition = useRef({ x: -1000, y: -1000 });
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const initialDrops = useRef([]);
    const particles = useRef([]);

    // Handle window resize
    const handleResize = useCallback(() => {
        if (canvasRef.current) {
            const { width, height } = canvasRef.current.getBoundingClientRect();
            setDimensions({ width, height });
            
            // Re-calculate drops based on new width if we want full coverage
            const cols = Math.floor(width / fontSize);
            initialDrops.current = Array.from({ length: cols }, () => Math.random() * -height);
        }
    }, [fontSize]);

    // Handle mouse movement
    const handleMouseMove = useCallback((event) => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            mousePosition.current = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        mousePosition.current = { x: -1000, y: -1000 };
    }, []);

    // Set up canvas and event listeners
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [handleResize, handleMouseMove, handleMouseLeave]);

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

        const ctx = canvas.getContext('2d');
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        
        ctx.font = `bold ${fontSize}px monospace`;

        const draw = () => {
            // Draw semi-transparent black rectangle to create trail effect
            ctx.fillStyle = backgroundColor;
            ctx.globalAlpha = trailOpacity;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;

            const cols = initialDrops.current.length;
            const mouse = mousePosition.current;

            // Draw falling columns
            for (let i = 0; i < cols; i++) {
                const char = characters[Math.floor(Math.random() * characters.length)];
                const x = i * fontSize;
                let dropY = initialDrops.current[i];

                // Check distance to mouse
                const distance = Math.hypot(mouse.x - x, mouse.y - dropY);

                if (distance < repelRadius) {
                    // Create dispersion explosion (particles)
                    for (let p = 0; p < 5; p++) {
                        particles.current.push({
                            x: x,
                            y: dropY,
                            vx: (Math.random() - 0.5) * 15,
                            vy: (Math.random() - 0.5) * 15,
                            life: 1,
                            char: characters[Math.floor(Math.random() * characters.length)]
                        });
                    }
                    // Reset the drop to the top
                    dropY = Math.random() * -100;
                } else {
                    // Normal falling behavior
                    dropY += baseSpeed + Math.random() * 2;
                }

                if (dropY > canvas.height) {
                    dropY = Math.random() * -100;
                }

                initialDrops.current[i] = dropY;

                // Draw the head of the drop (brightest)
                ctx.fillStyle = '#fff';
                ctx.fillText(char, x, dropY);

                // Draw trail behind it
                ctx.fillStyle = color;
                for (let j = 1; j < 6; j++) {
                    const trailY = dropY - j * fontSize;
                    if (trailY > 0) {
                        const trailChar = characters[Math.floor(Math.random() * characters.length)];
                        ctx.globalAlpha = Math.max(0, 1 - j * 0.15);
                        ctx.fillText(trailChar, x, trailY);
                    }
                }
                ctx.globalAlpha = 1;
            }

            // Draw and update active particles (dispersed digits)
            ctx.fillStyle = color;
            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2; // slight gravity
                p.life -= 0.03;

                if (p.life <= 0) {
                    particles.current.splice(i, 1);
                } else {
                    ctx.globalAlpha = p.life;
                    ctx.fillText(p.char, p.x, p.y);
                }
            }
            ctx.globalAlpha = 1;

            animationRef.current = requestAnimationFrame(draw);
        };

        animationRef.current = requestAnimationFrame(draw);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [
        dimensions,
        fontSize,
        baseSpeed,
        trailOpacity,
        repelRadius,
        characters,
        color,
        backgroundColor,
    ]);

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
                pointerEvents: 'none', // Let mouse pass through to sections, we listener on window
            }}
        />
    );
};

MatrixBackground.propTypes = {
    fontSize: PropTypes.number,
    columns: PropTypes.number,
    drops: PropTypes.array,
    baseSpeed: PropTypes.number,
    trailOpacity: PropTypes.number,
    repelRadius: PropTypes.number,
    characters: PropTypes.string,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
};

export default MatrixBackground;
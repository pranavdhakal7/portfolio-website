import React, { useRef } from 'react';

/**
 * TiltCard – a zero-dependency 3D tilt wrapper.
 * Uses CSS perspective + rotateX/Y driven by mouse position.
 */
const TiltCard = ({ children, className, style, maxTilt = 10 }) => {
    const ref = useRef(null);

    const handleMouseMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPct = (x / rect.width - 0.5) * 2;   // -1 → 1
        const yPct = (y / rect.height - 0.5) * 2;  // -1 → 1
        const rotateY = xPct * maxTilt;
        const rotateX = -yPct * maxTilt;
        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;

        // Glare overlay position
        const glare = el.querySelector('.tilt-glare');
        if (glare) {
            glare.style.opacity = '1';
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,238,255,0.15) 0%, transparent 70%)`;
        }
    };

    const handleMouseLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        const glare = el.querySelector('.tilt-glare');
        if (glare) glare.style.opacity = '0';
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                ...style,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                transformStyle: 'preserve-3d',
                position: 'relative',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Glare overlay */}
            <div
                className="tilt-glare"
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'inherit',
                    opacity: 0,
                    pointerEvents: 'none',
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                }}
            />
            {children}
        </div>
    );
};

export default TiltCard;

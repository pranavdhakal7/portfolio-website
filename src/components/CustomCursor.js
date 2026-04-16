import React, { useEffect, useRef } from 'react';

/**
 * CustomCursor — magnetic dot + ring cursor.
 * The dot follows the mouse instantly.
 * The ring lags behind for an organic, physical feel.
 * On hover over interactive elements, the ring expands and blends.
 */
const CustomCursor = () => {
    const dotRef  = useRef(null);
    const ringRef = useRef(null);

    useEffect(() => {
        const isMobile = window.innerWidth <= 900;
        if (isMobile) return;

        const dot  = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        let mx = window.innerWidth  / 2;
        let my = window.innerHeight / 2;
        let rx = mx;
        let ry = my;
        let raf;

        const onMove = (e) => {
            mx = e.clientX;
            my = e.clientY;
        };

        const onEnter = (e) => {
            const t = e.target;
            const isInteractive = t.matches('a, button, [data-cursor], input, textarea, .project-card, .skill-card, .timeline-item');
            if (isInteractive) {
                dot.classList.add('cursor-hover');
                ring.classList.add('cursor-hover');
            }
        };

        const onLeave = (e) => {
            const t = e.target;
            const isInteractive = t.matches('a, button, [data-cursor], input, textarea, .project-card, .skill-card, .timeline-item');
            if (isInteractive) {
                dot.classList.remove('cursor-hover');
                ring.classList.remove('cursor-hover');
            }
        };

        const tick = () => {
            // Dot snaps instantly
            dot.style.transform  = `translate(${mx - 4}px, ${my - 4}px)`;

            // Ring lags with lerp
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;

            raf = requestAnimationFrame(tick);
        };

        window.addEventListener('mousemove', onMove);
        document.addEventListener('mouseover',  onEnter, true);
        document.addEventListener('mouseout',   onLeave, true);
        raf = requestAnimationFrame(tick);

        // Hide cursor when outside window
        const hide = () => { dot.style.opacity = '0'; ring.style.opacity = '0'; };
        const show = () => { dot.style.opacity = '1'; ring.style.opacity = '1'; };
        document.addEventListener('mouseleave', hide);
        document.addEventListener('mouseenter', show);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseover',  onEnter, true);
            document.removeEventListener('mouseout',   onLeave, true);
            document.removeEventListener('mouseleave', hide);
            document.removeEventListener('mouseenter', show);
        };
    }, []);

    return (
        <>
            {/* Core dot */}
            <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
            {/* Trailing ring */}
            <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
        </>
    );
};

export default CustomCursor;

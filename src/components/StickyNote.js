import React, { useState, useEffect, useRef } from 'react';
import '../styles/StickyNote.css';

const StickyNote = () => {
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);
    
    const [position, setPosition] = useState(() => {
        if (typeof window === 'undefined') return { x: 100, y: 150 };
        const x = window.innerWidth - 280 - 20; // 280 width, 20 margin
        const y = 20;
        return { x, y };
    });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const noteRef = useRef(null);

    const handleMouseDown = (e) => {
        if (!noteRef.current) return;
        const rect = noteRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
        setIsDragging(true);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;

            // Use scroll positions so it doesn't jump
            const newX = e.clientX - dragOffset.x + window.scrollX;
            const newY = e.clientY - dragOffset.y + window.scrollY;

            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    if (isMobile) {
        return null;
    }

    return (
        <div
            ref={noteRef}
            className="sticky-note-container"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="sticky-pin"></div>
            <div className="sticky-content">
                <h3>Things to do today</h3>
                <ul>
                    <li>Apply to jobs</li>
                    <li style={{ textDecoration: 'line-through' }}>Being nonchalant</li>
                    <li>Check inbox (immediately)</li>
                    <li>Look for a Client</li>
                    <li>Trying to Crack a SWE job</li>
                    <li>Become Rich</li>
                </ul>
            </div>
        </div>
    );
};

export default StickyNote;

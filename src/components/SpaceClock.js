import React, { useState, useEffect, useRef } from 'react';
import '../styles/SpaceClock.css';

const SpaceClock = () => {
    const timeRef = useRef(null);
    const ampmRef = useRef(null);

    const [dateState, setDateState] = useState(new Date());

    useEffect(() => {
        // Update date state every minute for the static parts
        const interval = setInterval(() => {
            setDateState(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let frameId;
        const updateClock = () => {
            const now = new Date();
            
            if (timeRef.current) {
                const timeString = now.toLocaleTimeString('en-US', {
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                const parts = timeString.split(' ');
                timeRef.current.textContent = parts[0];
                if (ampmRef.current && parts[1]) {
                    ampmRef.current.textContent = ' ' + parts[1];
                }
            }
            
            frameId = requestAnimationFrame(updateClock);
        };
        
        frameId = requestAnimationFrame(updateClock);
        return () => cancelAnimationFrame(frameId);
    }, []);

    const formatDayOnly = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    const formatMonthDay = (date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    };

    return (
        <div className="space-clock-container">
            <div className="space-clock">
                {/* Space-themed elements */}
                <div className="space-stars"></div>
                <div className="space-planet"></div>
                
                {/* Single line clock content */}
                <div className="clock-content single-line">
                    <div className="time-group">
                        <span className="time-digits" ref={timeRef}></span>
                        <span className="ampm" ref={ampmRef}></span>
                    </div>
                    <span className="separator">•</span>
                    <span className="day-text">{formatDayOnly(dateState)}</span>
                    <span className="separator">•</span>
                    <span className="date-text">{formatMonthDay(dateState)}</span>
                </div>
                
                {/* Glow effects */}
                <div className="clock-glow"></div>
                <div className="pulse-effect"></div>
            </div>
        </div>
    );
};

export default SpaceClock;
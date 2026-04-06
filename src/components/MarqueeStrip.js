import React from 'react';

/**
 * MarqueeStrip — horizontal infinitely scrolling text ticker.
 * Seen on every Godly.website-featured portfolio.
 */
const ITEMS = [
    '✦ Full-Stack Developer',
    '✦ UI / UX Enthusiast',
    '✦ React.js Expert',
    '✦ Open to Work',
    '✦ Building Beautiful Experiences',
    '✦ Turning Ideas Into Code',
];

const MarqueeStrip = ({ reverse = false }) => {
    // Duplicate for seamless loop
    const items = [...ITEMS, ...ITEMS];

    return (
        <div className={`marquee-wrapper ${reverse ? 'marquee-reverse' : ''}`}>
            <div className="marquee-track">
                {items.map((item, i) => (
                    <span className="marquee-item" key={i}>{item}</span>
                ))}
            </div>
        </div>
    );
};

export default MarqueeStrip;

import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import StickyNote from './StickyNote';
import MarqueeStrip from './MarqueeStrip';
import '../styles/Home.css';
import '../styles/Marquee.css';
import Rabbit3DModel from './Rabbit3DModel';
import GlowLily from './GlowLily';

const Home = () => {
    const typedRef = useRef(null);

    useEffect(() => {
        const typed = new Typed(typedRef.current, {
            strings: ['Software Engineering', 'System Architecture', 'UI/UX Design', 'Machine Learning', 'Cyber Security'],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true
        });

        return () => {
            typed.destroy();
        };
    }, []);

    return (
        <section className="home matrix-home" id="home">
            <GlowLily />
            <StickyNote />
            <div className="hero-container">
                <div className="hero-content">
                    <div className="hero-model-wrapper">
                        <Rabbit3DModel />
                    </div>
                    {/* Eyebrow */}
                    <div className="matrix-intro stagger-item stagger-delay-1">
                        <span className="matrix-wave">👋</span>
                        <span>Hey, I'm a Developer</span>
                    </div>
                    {/* Mega headline */}
                    <h1 className="matrix-title">
                        <span className="title-line stagger-item stagger-delay-2">Pranav</span>
                        <span className="title-line highlight stagger-item stagger-delay-3">Dhakal</span>
                    </h1>
                    {/* Typed subtitle */}
                    <div className="matrix-subtitle stagger-item stagger-delay-4">
                        Specialized in <span ref={typedRef}></span>
                    </div>
                    <p className="matrix-description stagger-item stagger-delay-5">
                        Building high-performance applications through strategic architecture and clean, maintainable code.
                    </p>
                    <div className="matrix-actions stagger-item stagger-delay-6">
                        <a href="#projects" className="btn-primary">Explore Projects</a>
                        <a href="#contact" className="btn-secondary">Get in Touch</a>
                    </div>
                </div>
            </div>
            <MarqueeStrip />
        </section>
    );
};

export default Home;

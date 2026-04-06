import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import StickyNote from './StickyNote';
import MarqueeStrip from './MarqueeStrip';
import '../styles/Home.css';
import '../styles/Marquee.css';

const Home = () => {
    const typedRef = useRef(null);

    useEffect(() => {
        const typed = new Typed(typedRef.current, {
            strings: ['Software Engineering', 'System Architecture', 'UI/UX Design', 'Machine Learning', 'Cyber Security', 'Open Source'],
            typeSpeed: 48,
            backSpeed: 28,
            backDelay: 2200,
            loop: true,
            showCursor: true,
            cursorChar: '_'
        });
        return () => typed.destroy();
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="home matrix-home" id="home">
            <StickyNote />

            <div className="hero-container">
                <div className="hero-content">
                    {/* Eyebrow */}
                    <div className="matrix-intro stagger-item stagger-delay-1">
                        <span className="matrix-wave">👋</span>
                        Hey, I'm a Developer
                    </div>

                    {/* Mega headline */}
                    <h1 className="matrix-title">
                        <span className="title-line stagger-item stagger-delay-2">Pranav</span>
                        <span className="title-line highlight stagger-item stagger-delay-3">Dhakal</span>
                    </h1>

                    {/* Typed subtitle */}
                    <div className="matrix-subtitle stagger-item stagger-delay-4">
                        Specializing in&nbsp;<span className="typed-text" ref={typedRef}></span>
                    </div>

                    {/* Description */}
                    <p className="matrix-description stagger-item stagger-delay-5">
                        I build resilient, intelligent systems and craft bleeding-edge digital experiences As a full-stack developer and lifelong learner, I’m constantly evolving with automation tools. My passion lies in merging innovation with robust architecture, turning complex data and models into seamless, human-centered experiences.
                    </p>

                    {/* Stats */}
                    <div className="matrix-stats stagger-item stagger-delay-6">
                        <div className="stat">
                            <span className="stat-number glow-text">25+</span>
                            <span className="stat-label">Projects</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-number glow-text">3+</span>
                            <span className="stat-label">Years XP</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-number glow-text">∞</span>
                            <span className="stat-label">Curiosity</span>
                        </div>
                    </div>

                    {/* CTA row */}
                    <div className="matrix-actions stagger-item stagger-delay-7">
                        <button className="matrix-btn primary" onClick={() => scrollTo('work')}>
                            View My Work
                            <span className="btn-arrow">→</span>
                        </button>
                        <button className="matrix-btn secondary" onClick={() => scrollTo('contact')}>
                            Let's Talk
                        </button>
                    </div>

                    {/* Scroll hint */}
                    <div className="matrix-scroll stagger-item stagger-delay-8">
                        <span>Scroll</span>
                        <div className="scroll-arrow animate-bounce">↓</div>
                    </div>
                </div>

                {/* Hero GIF on the right side */}
                <div className="hero-image-container">
                    <div className="hero-circle-glow">
                        <div className="hero-circle-inner">
                            <img
                                src="/assets/images/hero.gif"
                                alt="Hero Animation"
                                className="hero-gif"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Marquee at bottom of hero */}
            <div className="hero-marquee">
                <MarqueeStrip />
                <MarqueeStrip reverse />
            </div>
        </section>
    );
};

export default Home;
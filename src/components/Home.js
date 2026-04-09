import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import StickyNote from './StickyNote';
import MarqueeStrip from './MarqueeStrip';
import Educat3DModel from './Educat3DModel';

import Rabbit3DModel from './Rabbit3DModel';

import '../styles/Home.css';

import '../styles/Marquee.css';

const Home = () => {
    const typedRef = useRef(null);

    const heroImgRef = useRef(null);

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

    const handleMouseMove = (e) => {
        if (!heroImgRef.current) return;
        const { left, top, width, height } = heroImgRef.current.getBoundingClientRect();
        
        // Calculate mouse position relative to the center of the image (-1 to 1)
        const x = (e.clientX - left - width / 2) / (width / 2);
        const y = (e.clientY - top - height / 2) / (height / 2);
        
        // Limit the effect so it doesn't flip over (e.g. max 15 degrees)
        const tiltX = -y * 15; 
        const tiltY = x * 15;

        // Apply transform
        heroImgRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
        if (!heroImgRef.current) return;
        heroImgRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    return (
        <section className="home matrix-home" id="home">
            <StickyNote />

            <div className="hero-container">
                <div className="hero-content">
                    <div className="hero-header-row">
                        <div className="hero-header-text">
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
                        </div>

                        <div className="hero-header-3d stagger-item stagger-delay-3">
                            <Educat3DModel />
                        </div>


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

                {/* 3D Model on the right side */}
                <div
                    className="hero-image-container"
                    ref={heroImgRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ transition: 'transform 0.1s ease-out', transformStyle: 'preserve-3d' }}
                >
                    <div className="hero-circle-glow" style={{ transform: 'translateZ(20px)' }}>
                        <div className="hero-circle-middle" style={{ transform: 'translateZ(30px)' }}>
                            <div className="hero-circle-inner" style={{ transform: 'translateZ(40px)' }}>
                                <Rabbit3DModel
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        overflow: 'hidden'
                                    }}
                                />
                            </div>
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
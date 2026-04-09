import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import StickyNote from './StickyNote';
import MarqueeStrip from './MarqueeStrip';
import '../styles/Home.css';
import '../styles/Marquee.css';
import Rabbit3DModel from './Rabbit3DModel';
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
                        <StickyNote />
            <div className="hero-container">
                <div className="hero-content">
                    <div className="hero-model-wrapper">
                        <Rabbit3DModel />
                    </div>
                    {/* Eyebrow */}
                    <div className="matrix-intro stagger-item stagger-delay-1">

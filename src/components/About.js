import React from 'react';
import '../styles/About.css';

const facts = [
    { icon: '📍', label: 'Based in', value: 'Harrisburg, PA, USA' },
    { icon: '🎓', label: 'Degree', value: 'Bachelor of Science in Computer Science' },
    { icon: '💼', label: 'Status', value: 'Open to Work' },
    { icon: '🌐', label: 'Languages', value: 'English · Nepali · Hindi' },
    { icon: '✉️', label: 'Email', value: 'pranav.dhakal7@gmail.com' },
    { icon: '📱', label: 'Phone', value: '+1 (859) 786-5828' },
    { icon: '🎂', label: 'Age', value: '25 years old' },
    { icon: '🚀', label: 'Freelance', value: 'Available' },
];

const stats = [
];

const expertise = [
    { icon: '⚡', title: 'Full-Stack Dev', desc: 'React, Node.js, Next.js, REST APIs' },
    { icon: '🤖', title: 'AI / ML', desc: 'PyTorch, Transformers, Scikit-learn' },
    { icon: '📱', title: 'Mobile', desc: 'Android, Kotlin, Firebase' },
    { icon: '⛓️', title: 'Blockchain', desc: 'Solidity, Web3.js, Ethereum' },
];

// stack variable removed as it's unused

const About = () => (
    <section className="about" id="about">

        {/* ── LEFT: all text content ── */}
        <div className="about-left stagger-item stagger-delay-1">
            <p className="section-eyebrow">About Me</p>

            <h2 className="about-headline">
                I turn <em>complex ideas</em><br />
                into elegant code.
            </h2>

            <p className="about-bio stagger-item stagger-delay-2">
                Hello! I'm <strong>Pranav Dhakal</strong>, a Computer Science &amp; Mathematics
                graduate from Northern Kentucky University with a 3.6 GPA and $77K in
                scholarships. I specialize in building fast, scalable, and beautifully crafted
                digital products — from React frontends to ML-powered backends and blockchain
                protocols. I'm passionate about using technology to solve real-world problems
                and am always excited to learn new things.
            </p>

            {/* Expertise areas */}
            <div className="about-expertise stagger-item stagger-delay-3">
                <p className="stack-label">What I Do</p>
                <div className="expertise-grid">
                    {expertise.map((e, i) => (
                        <div className="expertise-card" key={i}>
                            <span className="expertise-icon">{e.icon}</span>
                            <div>
                                <h4 className="expertise-title">{e.title}</h4>
                                <p className="expertise-desc">{e.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stat strip */}
            <div className="about-stats stagger-item stagger-delay-4">
                {stats.map((s, i) => (
                    <div className="about-stat" key={i}>
                        <span className="about-stat-num">{s.num}</span>
                        <span className="about-stat-label">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* ── RIGHT: photo + facts ── */}
        <div className="about-right stagger-item stagger-delay-2">

            {/* Photo */}
            <div className="about-photo-wrap">
                <img
                    src="/assets/images/profile2.jpg"
                    alt="Pranav Dhakal"
                    className="about-photo"
                    draggable="false"
                />
                <div className="photo-badge">
                    <span className="badge-dot" />
                    Available for work
                </div>
            </div>

            {/* Facts grid — 2 columns below photo */}
            <div className="about-facts">
                {facts.map((f, i) => (
                    <div className="fact-item" key={i}>
                        <span className="fact-icon">{f.icon}</span>
                        <div className="fact-text">
                            <span className="fact-label">{f.label}</span>
                            <span className="fact-value" title={f.value}>{f.value}</span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    </section>
);

export default About;
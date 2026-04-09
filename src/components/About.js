import React from 'react';
import '../styles/About.css';

const expertise = [
    { icon: '⚡', title: 'Full-Stack Dev', desc: 'React, Node.js, Next.js' },
    { icon: '🤖', title: 'AI / ML', desc: 'PyTorch, Transformers' },
    { icon: '📱', title: 'Mobile', desc: 'Android, Kotlin' },
    { icon: '⛓️', title: 'Blockchain', desc: 'Solidity, Web3.js' },
];

const typeMap = {
    research:     { emoji: '🔬', label: 'Research' },
    teaching:     { emoji: '🎓', label: 'Teaching' },
    professional: { emoji: '💼', label: 'Professional' },
};

const experiences = [
    {
        role: 'Research Assistant',
        detail: 'LLM Scalability — Mamba SSM',
        company: 'NKU',
        period: 'Jun 2025 – Present',
        type: 'research',
        tech: ['PyTorch', 'Mamba', 'A100'],
        wins: ['+25% efficiency'],
    },
    {
        role: 'Plus Tutor',
        detail: 'Java Programming',
        company: 'NKU',
        period: 'Aug 2023 – May 2024',
        type: 'teaching',
        tech: ['Java', 'Mentoring'],
        wins: ['+30% pass rate'],
    },
    {
        role: 'Research Assistant',
        detail: 'Secure IoT Edge Framework',
        company: 'College of Informatics',
        period: 'Aug 2023 – Dec 2023',
        type: 'research',
        tech: ['IoT', 'Blockchain', 'Edge-X'],
        wins: ['Secure prototype'],
    },
    {
        role: 'Programming Intern',
        detail: 'Full Stack & SMS Integration',
        company: 'Aarati Co-op, Nepal',
        period: 'Oct 2019 – Jun 2020',
        type: 'professional',
        tech: ['PHP', 'MySQL'],
        wins: ['−25% processing time'],
    },
];

const cardInfo = [
    { icon: '📍', label: 'Location', value: 'Harrisburg, PA' },
    { icon: '🎓', label: 'Degree', value: 'B.Sc. CS & Math' },
    { icon: '💼', label: 'Status', value: 'Open to Work' },
    { icon: '🌐', label: 'Languages', value: 'EN · NP · HI' },
    { icon: '✉️', label: 'Email', value: 'pranav.dhakal7@gmail.com' },
    { icon: '📱', label: 'Phone', value: '+1 (859) 786-5828' },
    { icon: '🎂', label: 'Age', value: '25 years old' },
    { icon: '🚀', label: 'Freelance', value: 'Available' },
];

const ProfileCard = () => (
    <div className="alien-device">
        <div className="alien-device-inner">
            <div className="alien-topbar">
                <div className="alien-topbar-dots">
                    <span className="alien-dot alien-dot--red" />
                    <span className="alien-dot alien-dot--yellow" />
                    <span className="alien-dot alien-dot--green" />
                </div>
                <span className="alien-topbar-title">PROFILE.SYS</span>
                <span className="alien-topbar-status">● ONLINE</span>
            </div>

            <div className="alien-photo-box">
                <img
                    src="/assets/images/profile2.jpg"
                    alt="Pranav Dhakal"
                    className="alien-photo"
                    draggable="false"
                />
                <div className="alien-corner alien-corner--tl" />
                <div className="alien-corner alien-corner--tr" />
                <div className="alien-corner alien-corner--bl" />
                <div className="alien-corner alien-corner--br" />
                <div className="alien-photo-name">
                    <span className="badge-dot" />
                    Pranav Dhakal
                </div>
            </div>

            <div className="alien-subtitle">
                <span className="alien-type-badge">⚡ Full-Stack Developer</span>
                <span className="alien-hp">HP ∞</span>
            </div>

            <div className="alien-info-grid">
                {cardInfo.map((item, i) => (
                    <div className="alien-info-cell" key={i}>
                        <span className="alien-info-icon">{item.icon}</span>
                        <div className="alien-info-text">
                            <span className="alien-info-label">{item.label}</span>
                            <span className="alien-info-value">{item.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="alien-holo" />
    </div>
);

const About = () => (
    <section className="about" id="about">
        {/* ── LEFT: Bio + Expertise + Experience ── */}
        <div className="about-left stagger-item stagger-delay-1">
            <p className="section-eyebrow">About Me</p>

            <h2 className="about-headline">
                I turn <em>complex ideas</em><br />
                into elegant code.
            </h2>

            {/* Mobile-only Profile Card */}
            <div className="mobile-profile-container">
                <ProfileCard />
            </div>

            <p className="about-bio stagger-item stagger-delay-2">
                Hello! I'm <strong>Pranav Dhakal</strong>, a Computer Science &amp; Mathematics
                graduate from Northern Kentucky University with a 3.6 GPA and $77K in
                scholarships. I specialize in building fast, scalable, and beautifully crafted
                digital products — from React frontends to ML-powered backends and blockchain
                protocols.
            </p>

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

            <div className="about-exp-grid stagger-item stagger-delay-4">
                {experiences.map((exp, i) => {
                    const meta = typeMap[exp.type];
                    return (
                        <div className="about-exp-card" key={i}>
                            <div className="about-exp-header">
                                <span className="about-exp-num">0{i + 1}</span>
                                <div className="about-exp-emoji">{meta.emoji}</div>
                            </div>
                            <span className="about-exp-type">{meta.label}</span>
                            <h3 className="about-exp-role">{exp.role}</h3>
                            <p className="about-exp-detail">{exp.detail}</p>
                            <p className="about-exp-meta">{exp.company} · {exp.period}</p>
                            <div className="about-exp-tags">
                                {exp.tech.map((t, j) => (
                                    <span className="about-exp-tag" key={j}>{t}</span>
                                ))}
                            </div>
                            {exp.wins.map((w, j) => (
                                <span className="about-exp-win" key={j}>
                                    <i className="fas fa-check" /> {w}
                                </span>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* ── RIGHT: Alien Tech Display ── */}
        <div className="about-right stagger-item stagger-delay-2">
            <ProfileCard />
        </div>
    </section>
);

export default About;
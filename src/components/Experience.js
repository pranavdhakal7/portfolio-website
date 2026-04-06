import React from 'react';
import '../styles/Experience.css';

const typeMap = {
    research:     { emoji: '🔬', label: 'Research'    },
    teaching:     { emoji: '🎓', label: 'Teaching'    },
    professional: { emoji: '💼', label: 'Professional' },
};

const experiences = [
    {
        period:  'Jun 2025 – Present',
        role:    'Research Assistant',
        detail:  'LLM Scalability — Mamba SSM',
        company: 'NKU',
        type:    'research',
        tech:    ['PyTorch', 'Mamba', 'A100'],
        wins:    ['+25% efficiency'],
    },
    {
        period:  'Aug 2023 – May 2024',
        role:    'Plus Tutor',
        detail:  'Java Programming',
        company: 'NKU',
        type:    'teaching',
        tech:    ['Java', 'Mentoring'],
        wins:    ['+30% pass rate'],
    },
    {
        period:  'Aug 2023 – Dec 2023',
        role:    'Research Assistant',
        detail:  'Secure IoT Edge Framework',
        company: 'College of Informatics',
        type:    'research',
        tech:    ['IoT', 'Blockchain', 'Edge-X'],
        wins:    ['Secure prototype'],
    },
    {
        period:  'Oct 2019 – Jun 2020',
        role:    'Programming Intern',
        detail:  'Full Stack & SMS Integration',
        company: 'Aarati Co-op, Nepal',
        type:    'professional',
        tech:    ['PHP', 'MySQL'],
        wins:    ['−25% processing time'],
    },
];

const Experience = () => (
    <section className="experience" id="experience">
        <p className="section-eyebrow stagger-item stagger-delay-1">Career</p>
        <h2 className="exp-headline stagger-item stagger-delay-2">
            Where I've <span>worked.</span>
        </h2>

        <div className="exp-row">
            {experiences.map((exp, i) => {
                const meta = typeMap[exp.type];
                return (
                    <div
                        key={i}
                        className={`exp-card stagger-item stagger-delay-${i + 3}`}
                    >
                        {/* Index */}
                        <span className="exp-num">0{i + 1}</span>

                        {/* Emoji */}
                        <div className="exp-emoji">{meta.emoji}</div>

                        {/* Body */}
                        <div className="exp-body">
                            <span className="exp-type-tag">{meta.label}</span>
                            <h3 className="exp-role">{exp.role}</h3>
                            <p className="exp-detail">{exp.detail}</p>
                            <p className="exp-meta">{exp.company} · {exp.period}</p>

                            {/* Tech */}
                            <div className="exp-tags">
                                {exp.tech.map((t, j) => (
                                    <span className="exp-tag" key={j}>{t}</span>
                                ))}
                            </div>

                            {/* Win */}
                            {exp.wins.map((w, j) => (
                                <span className="exp-win" key={j}>
                                    <i className="fas fa-check" /> {w}
                                </span>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    </section>
);

export default Experience;
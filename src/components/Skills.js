import React, { useState, useEffect } from 'react';
import skillsData from '../data/skills.json';
import '../styles/Skills.css';

const categoryMap = {
    'ReactJS': 'Frontend',
    'ExpressJS': 'Backend',
    'NodeJS': 'Backend',
    'Firebase': 'Mobile',
    'Android': 'Mobile',
    'TailwindCSS': 'Web',
    'Bootstrap': 'Web',
    'HTML5': 'Web',
    'CSS3': 'Web',
    'JavaScript': 'Frontend',
    'Java': 'Backend',
    'PHP': 'Backend',
    'Python': 'AI / ML',
    'C++': 'Backend',
    'MongoDB': 'Tools',
    'MySQL': 'Tools',
    'PostgreSQL': 'Tools',
    'jQuery': 'Frontend',
    'Git VCS': 'Tools',
    'GitHub': 'Tools',
    'WordPress': 'Tools',
    'C#': 'Backend',
    'Kotlin': 'Mobile',
    'Dart': 'Mobile',
    'Flutter': 'Mobile',
    'PyTorch': 'AI / ML',
    'Docker': 'Tools',
    'Solidity': 'Tools',
};

const CATS = ['All', 'Frontend', 'Backend', 'AI / ML', 'Mobile', 'Web', 'Tools'];

const Skills = () => {
    const [active, setActive] = useState('All');

    const skills = skillsData.map(s => ({
        ...s,
        cat: categoryMap[s.name] || 'Other',
        image: s.icon || s.image, // ensure image property exists
    }));

    const filtered = active === 'All' ? skills : skills.filter(s => s.cat === active);
    console.log('Skills active:', active, 'filtered count:', filtered.length, 'categories:', skills.map(s => s.cat));

    // Ensure newly filtered items become visible
    useEffect(() => {
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            const staggerItems = skillsSection.querySelectorAll('.stagger-item');
            staggerItems.forEach((el) => {
                el.classList.add('stagger-visible');
            });
        }
    }, [filtered]);

    return (
        <section className="skills" id="skills">
            {/* Header */}
            <p className="section-eyebrow stagger-item stagger-delay-1">Tech Stack</p>
            <h2 className="skills-headline stagger-item stagger-delay-2">
                Tools I <span>master.</span>
            </h2>

            {/* Category pills */}
            <div className="skill-cats stagger-item stagger-delay-3">
                {CATS.map(c => (
                    <button
                        key={c}
                        className={`skill-cat ${active === c ? 'active' : ''}`}
                        onClick={() => setActive(c)}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* Icon grid */}
            <div className="skills-icon-grid">
                {filtered.map((skill, i) => (
                    <div
                        className={`skill-bubble stagger-item stagger-delay-${(i % 12) + 4}`}
                        key={skill.name}
                        data-cursor
                    >
                        <div className="bubble-icon">
                            {skill.image ? (
                                <img src={skill.image} alt={skill.name} />
                            ) : (
                                <span className="bubble-fallback">{skill.name.slice(0, 2)}</span>
                            )}
                        </div>
                        <span className="bubble-name">{skill.name}</span>
                        <span className="bubble-cat">{skill.cat}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Skills;
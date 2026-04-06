import React from 'react';
import '../styles/Awards.css';

const Awards = () => {
    const awards = [
        { emoji: '🏆', title: "Dean's List", year: '2023 – 2025', tag: 'Academic', institution: 'Northern Kentucky University' },
        { emoji: '⭐', title: 'Outstanding Academic Achievement', year: '2024', tag: 'Excellence', institution: 'College of Informatics' },
        { emoji: '🌍', title: 'International Diversity Scholarship', year: '2022', tag: 'Scholarship', institution: 'Northern Kentucky University' },
        { emoji: '🎖️', title: 'Merit Award & Scholarship', year: '2021', tag: 'Merit', institution: 'Northern Kentucky University' },
        { emoji: '🔬', title: 'EDGE Award', year: '2023', tag: 'Research', institution: 'Northern Kentucky University' },
    ];

    return (
        <section className="awards" id="awards">
            <p className="section-eyebrow stagger-item stagger-delay-1">Recognition</p>
            <h2 className="awards-headline stagger-item stagger-delay-2">
                Honors &amp; <span>Awards</span>
            </h2>

            <div className="awards-grid">
                {awards.map((a, i) => (
                    <div
                        className={`award-item stagger-item stagger-delay-${i + 3}`}
                        key={i}
                    >
                        {/* Number */}
                        <span className="award-num">0{i + 1}</span>

                        {/* Emoji icon */}
                        <div className="award-emoji">{a.emoji}</div>

                        {/* Content */}
                        <div className="award-body">
                            <span className="award-tag">{a.tag}</span>
                            <h3 className="award-title">{a.title}</h3>
                            <p className="award-meta">{a.institution} · {a.year}</p>
                        </div>

                        {/* Hover arrow */}
                        <span className="award-arrow">↗</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Awards;
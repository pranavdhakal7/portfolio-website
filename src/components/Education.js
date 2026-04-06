import React from 'react';
import '../styles/Education.css';

const Education = () => {
    const educationData = [
        {
            period: 'Feb 2022 – Dec 2025',
            degree: 'B.Sc. Computer Science & Mathematics',
            institution: 'Northern Kentucky University',
            location: 'Highland Heights, KY, USA',
            gpa: '3.6',
            scholarship: '$77K',
            ranking: 'Top 15% of Class',
            description: 'Specialized in Artificial Intelligence, Machine Learning, and Full‑Stack Development. Completed advanced coursework in Data Structures, Algorithms, Blockchain, and Android Development.',
            tags: ['AI', 'Data Structures', 'Web Dev', 'Blockchain', 'Android', 'ML'],
            badges: ["Dean's List", "Research Assistant", "Int'l Scholarship"],
            emoji: '🎓',
            image: '/assets/images/educat/college.jpg',
            active: true,
        },
        {
            period: '2018 – 2020',
            degree: 'High School Diploma — Civil Engineering',
            institution: 'Shree Padma Secondary School',
            location: 'Bhaktapur, Nepal',
            gpa: '3.2',
            ranking: 'Ranked #1 in Technical Stream',
            description: 'Focused on Civil Engineering fundamentals including Structural Analysis, Hydraulics, and Project Management. Achieved excellence in technical projects and engineering drawings.',
            tags: ['Structural Analysis', 'Hydraulics', 'Project Mgmt', 'Engineering Drawing'],
            badges: ['Technical Graduate', 'Project Excellence'],
            emoji: '🏫',
            image: '/assets/images/educat/school.jpg',
            active: false,
        },
    ];

    return (
        <section className="education" id="education">
            <p className="section-eyebrow stagger-item stagger-delay-1">Academic Journey</p>
            <h2 className="edu-headline stagger-item stagger-delay-2">
                Where I <span>learned.</span>
            </h2>

            <div className="edu-timeline">
                {educationData.map((edu, i) => (
                    <div
                        className={`edu-entry stagger-item stagger-delay-${i + 3} ${edu.active ? 'edu-entry--active' : ''}`}
                        key={i}
                    >
                        {/* Period at top */}
                        <div className="edu-side">
                            <span className="edu-period">{edu.period}</span>
                        </div>

                        {/* Node dot */}
                        <div className="edu-dot">
                            <span className="edu-dot-inner">{edu.emoji}</span>
                        </div>

                        {/* Card content (now integrated) */}
                        <div className="edu-card">
                            {/* Top row */}
                            <div className="edu-card-top">
                                <div>
                                    <h3 className="edu-degree">{edu.degree}</h3>
                                    <div className="edu-institution-with-image">
                                        <div className="edu-institution-image">
                                            <img src={edu.image} alt={edu.institution} />
                                        </div>
                                        <div className="edu-institution-details">
                                            <p className="edu-institution">
                                                <i className="fas fa-building" /> {edu.institution}
                                                &ensp;·&ensp;
                                                <i className="fas fa-map-marker-alt" /> {edu.location}
                                            </p>
                                            {edu.ranking && (
                                                <div className="edu-ranking">
                                                    <i className="fas fa-trophy" /> {edu.ranking}
                                                </div>
                                            )}
                                            {edu.description && (
                                                <p className="edu-description">
                                                    {edu.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats cluster */}
                                <div className="edu-stats">
                                    <div className="edu-stat">
                                        <span className="edu-stat-val">{edu.gpa}</span>
                                        <span className="edu-stat-lbl">GPA</span>
                                    </div>
                                    {edu.scholarship && (
                                        <div className="edu-stat">
                                            <span className="edu-stat-val">{edu.scholarship}</span>
                                            <span className="edu-stat-lbl">Scholarship</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Course tags */}
                            <div className="edu-tags">
                                {edu.tags.map((t, j) => (
                                    <span className="edu-tag" key={j}>{t}</span>
                                ))}
                            </div>

                            {/* Achievement badges */}
                            <div className="edu-badges">
                                {edu.badges.map((b, j) => (
                                    <span className="edu-badge" key={j}>
                                        <i className="fas fa-star" /> {b}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Education;

import React from 'react';
import '../styles/Education.css';

const Education = () => {
    const educationData = [
        {
            period: '2018 – Present',
            degree: 'Where I Learned from YouTube',
            institution: 'YouTube',
            location: 'Online',
            gpa: 'Self‑Taught',
            scholarship: 'N/A',
            description: 'Self-taught developer through online content, focusing on practical skills and real-world projects.',
            tags: ['Artificial Intelligence & Machine Learning', 'Data Structures & Algorithms', 'Web Development', 'Mobile App Development', 'Blockchain Basics'],
            badges: ['Self-Taught', 'Project-Based Learning', 'Continuous Learning', 'Online Certification'],
            emoji: '🎓',
            image: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png',
            active: true,
        },
        {
            period: 'Feb 2022 – Dec 2025',
            degree: 'B.Sc. Computer Science & Mathematics',
            institution: 'Northern Kentucky University',
            location: 'Highland Heights, KY, USA',
            gpa: '3.6',
            scholarship: '$77K',
            ranking: '62nd out of nearly 600 universities around the country',
            description: 'Specialized in Artificial Intelligence, Machine Learning, and Full‑Stack Development. Completed advanced coursework in Data Structures, Algorithms, Blockchain, and Android Development.',
            tags: ['AI', 'Data Structures', 'Web Dev', 'Blockchain', 'Android', 'ML'],
            badges: ["Dean's List", "Research Assistant", "Int'l Scholarship"],
            emoji: '🎓',
            image: '/assets/images/educat/nku.jpg',
            active: false,
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
            image: '/assets/images/educat/sphss.png',
            active: false,
        },
    ];

    return (
        <section className="education-modern" id="education">
            <div className="education-header">
                <p className="section-eyebrow">Academic Journey</p>
                <h2 className="education-title">
                    Where I <span>learned.</span>
                </h2>
                <p className="education-subtitle">
                    A timeline of my educational background and self‑taught journey.
                </p>
            </div>

            <div className="education-grid">
                {educationData.map((edu, i) => (
                    <div
                        className={`education-card ${edu.active ? 'education-card--active' : ''} animate-fade-up`}
                        key={i}
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        {/* Card header with period and emoji */}
                        <div className="card-header">
                            <div className="card-period">
                                <span className="card-emoji">{edu.emoji}</span>
                                <span className="card-period-text">{edu.period}</span>
                            </div>
                            {edu.active && (
                                <span className="card-badge">Current</span>
                            )}
                        </div>

                        {/* Card content */}
                        <div className="card-content">
                            {/* Institution name highlighted at top */}
                            <div className="card-institution-highlighted">
                                <div className="institution-header">
                                    <h3 className="institution-name-highlight">
                                        <i className="fas fa-university"></i> {edu.institution}
                                    </h3>
                                    <div className="institution-image">
                                        <img src={edu.image} alt={edu.institution} />
                                    </div>
                                </div>
                                <div className="institution-details">
                                    <span className="institution-location">
                                        <i className="fas fa-map-marker-alt"></i> {edu.location}
                                    </span>
                                    {edu.ranking && (
                                        <span className="institution-ranking">
                                            <i className="fas fa-trophy"></i> {edu.ranking}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Degree/Major */}
                            <h4 className="card-degree">{edu.degree}</h4>

                            {edu.description && (
                                <p className="card-description">{edu.description}</p>
                            )}

                            {/* Stats row */}
                            <div className="card-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{edu.gpa}</span>
                                    <span className="stat-label">GPA</span>
                                </div>
                                {edu.scholarship && edu.scholarship !== 'N/A' && (
                                    <div className="stat-item">
                                        <span className="stat-value">{edu.scholarship}</span>
                                        <span className="stat-label">Scholarship</span>
                                    </div>
                                )}
                                {edu.ranking && (
                                    <div className="stat-item">
                                        <span className="stat-value">
                                            <i className="fas fa-trophy"></i>
                                        </span>
                                        <span className="stat-label">Ranking</span>
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            {edu.tags && edu.tags.length > 0 && (
                                <div className="card-tags">
                                    <div className="tags-title">
                                        <i className="fas fa-tags"></i> Focus Areas
                                    </div>
                                    <div className="tags-list">
                                        {edu.tags.map((tag, j) => (
                                            <span className="tag" key={j}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Badges */}
                            {edu.badges && edu.badges.length > 0 && (
                                <div className="card-badges">
                                    <div className="badges-title">
                                        <i className="fas fa-award"></i> Achievements
                                    </div>
                                    <div className="badges-list">
                                        {edu.badges.map((badge, j) => (
                                            <span className="badge" key={j}>
                                                <i className="fas fa-star"></i> {badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Card footer with subtle gradient */}
                        <div className="card-footer"></div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Education;

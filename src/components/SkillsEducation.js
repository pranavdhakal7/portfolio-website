import React from 'react';
import skillsData from '../data/skills.json';
import '../styles/SkillsEducation.css';

const SkillsEducation = () => {
    const educationData = {
        year: "Feb 2022 - Dec 2025",
        title: "Bachelor of Science in Computer Science & Mathematics",
        institution: "Northern Kentucky University",
        gpa: "3.6",
        scholarship: "$77,000",
        coursework: [
            "Artificial Intelligence",
            "Data Structures & Algorithms",
            "Web Development",
            "Blockchain",
            "Android App Development",
            "Database Programming",
            "Operating Systems"
        ]
    };

    return (
        <section className="skills-education" id="skills-education">
            <h2 className="heading">
                <i className="fas fa-laptop-graduate"></i> Skills & <span>Education</span>
            </h2>

            <div className="combined-container">
                {/* Skills Section */}
                <div className="skills-box">
                    <div className="section-header">
                        <i className="fas fa-laptop-code"></i>
                        <h3>Skills & Abilities</h3>
                    </div>
                    <div className="skills-grid">
                        {skillsData.map((skill, index) => (
                            <div className="skill-item" key={index}>
                                <div className="skill-icon">
                                    <img src={skill.icon} alt={skill.name} />
                                </div>
                                <span className="skill-name">{skill.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education Section */}
                <div className="education-box">
                    <div className="section-header">
                        <i className="fas fa-graduation-cap"></i>
                        <h3>Education</h3>
                    </div>

                    <div className="education-content">
                        <div className="university-info">
                            <h4>{educationData.institution}</h4>
                            <p className="degree">{educationData.title}</p>
                            <p className="duration">{educationData.year}</p>
                        </div>

                        <div className="highlight-stats">
                            <div className="stat-card gpa">
                                <div className="stat-icon">
                                    <i className="fas fa-chart-line"></i>
                                </div>
                                <div className="stat-content">
                                    <div className="stat-label">GPA</div>
                                    <div className="stat-value">{educationData.gpa}</div>
                                    <div className="stat-sub">Cumulative</div>
                                </div>
                            </div>

                            <div className="stat-card scholarship">
                                <div className="stat-icon">
                                    <i className="fas fa-award"></i>
                                </div>
                                <div className="stat-content">
                                    <div className="stat-label">Scholarship</div>
                                    <div className="stat-value">{educationData.scholarship}</div>
                                    <div className="stat-sub">Over 4 Years</div>
                                </div>
                            </div>
                        </div>

                        <div className="coursework-section">
                            <h5>Relevant Coursework</h5>
                            <div className="coursework-tags">
                                {educationData.coursework.map((course, index) => (
                                    <span className="course-tag" key={index}>{course}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SkillsEducation;
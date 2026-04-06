import React, { useState, useEffect } from 'react';
import '../styles/Work.css';

const projects = [
    {
        name: 'ML Predictive Model',
        slug: 'AI · Python',
        image: 'reactprojects.png',
        link: 'https://github.com/pranavdhakal7',
        category: 'ai-ml',
        tech: ['Python', 'TensorFlow', 'Scikit-learn'],
        stars: 42,
    },
    {
        name: 'Blockchain dApp',
        slug: 'Web3 · Solidity',
        image: 'cryptotracker.png',
        link: 'https://github.com/pranavdhakal7',
        category: 'blockchain',
        tech: ['Solidity', 'React', 'Web3.js'],
        stars: 36,
    },
    {
        name: 'Stock Insights AI',
        slug: 'Mobile · Android',
        image: 'weatherlyandroid.png',
        link: 'https://github.com/pranavdhakal7',
        category: 'mobile',
        tech: ['Android', 'Django', 'TensorFlow'],
        stars: 28,
    },
    {
        name: 'Dorm Deal Marketplace',
        slug: 'Web · Fullstack',
        image: 'flipkartmern.png',
        link: 'https://github.com/pranavdhakal7',
        category: 'web',
        tech: ['Next.js', 'TypeScript', 'MongoDB'],
        stars: 45,
    },
    {
        name: 'AI Text Detector',
        slug: 'NLP · Flask',
        image: 'jspro.PNG',
        link: 'https://github.com/pranavdhakal7',
        category: 'ai-ml',
        tech: ['Flask', 'Transformers', 'React'],
        stars: 39,
    },
    {
        name: 'Laser Tripwire Security',
        slug: 'IoT · Raspberry Pi',
        image: 'webviewapp.PNG',
        link: 'https://github.com/pranavdhakal7',
        category: 'iot',
        tech: ['Raspberry Pi', 'Python', 'OpenCV'],
        stars: 31,
    },
    {
        name: 'Algorithm Visualiser',
        slug: 'Desktop · Java',
        image: 'saas.PNG',
        link: 'https://github.com/pranavdhakal7',
        category: 'desktop',
        tech: ['Java', 'JavaFX', 'DSA'],
        stars: 27,
    },
    {
        name: 'Data Viz Dashboard',
        slug: 'Data · Python',
        image: 'tsfbank.png',
        link: 'https://github.com/pranavdhakal7',
        category: 'data',
        tech: ['Python', 'Plotly', 'Dash'],
        stars: 33,
    },
];

const CATS = [
    { id: 'all', label: 'All' },
    { id: 'web', label: 'Web' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'ai-ml', label: 'AI / ML' },
    { id: 'blockchain', label: 'Blockchain' },
    { id: 'iot', label: 'IoT' },
    { id: 'data', label: 'Data' },
    { id: 'desktop', label: 'Desktop' },
];

const Work = () => {
    const [active, setActive] = useState('all');
    const filtered = active === 'all' ? projects : projects.filter(p => p.category === active);
    console.log('Active:', active, 'Filtered count:', filtered.length, 'Filtered projects:', filtered.map(p => p.name), 'All categories:', projects.map(p => p.category));

    // Ensure newly filtered items become visible
    useEffect(() => {
        // The section is already visible, so we need to add stagger-visible to its child stagger-items
        const workSection = document.getElementById('work');
        if (workSection) {
            const staggerItems = workSection.querySelectorAll('.stagger-item');
            staggerItems.forEach((el) => {
                el.classList.add('stagger-visible');
            });
        }
    }, [filtered]);

    return (
        <section className="work" id="work">
            <p className="section-eyebrow stagger-item stagger-delay-1">Portfolio</p>
            <h2 className="work-headline stagger-item stagger-delay-2">
                Things I've <span>built.</span>
            </h2>

            {/* Filters */}
            <div className="work-cats stagger-item stagger-delay-3">
                {CATS.map(c => (
                    <button
                        key={c.id}
                        className={`work-cat ${active === c.id ? 'active' : ''}`}
                        onClick={() => setActive(c.id)}
                    >
                        {c.label}
                    </button>
                ))}
            </div>

            {/* Compact card grid */}
            <div className="work-grid">
                {filtered.length > 0 ? (
                    filtered.map((p, i) => (
                        <a
                            key={p.name}
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`proj-card stagger-item stagger-delay-${(i % 8) + 4}`}
                        >
                            {/* Thumbnail */}
                            <div className="proj-thumb">
                                <img
                                    src={`/assets/images/projects/${p.image}`}
                                    alt={p.name}
                                    draggable="false"
                                />
                                {/* Quick overlay */}
                                <div className="proj-overlay">
                                    <span className="proj-open">Open ↗</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="proj-info">
                                <div className="proj-top">
                                    <h3 className="proj-name">{p.name}</h3>
                                    <span className="proj-stars">⭐ {p.stars}</span>
                                </div>
                                <span className="proj-slug">{p.slug}</span>
                                <div className="proj-tags">
                                    {p.tech.map((t, j) => (
                                        <span className="proj-tag" key={j}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        </a>
                    ))
                ) : (
                    <div className="no-projects-message">
                        <p>No projects found for <strong>{active}</strong>.</p>
                        <p>Try another category or check back later.</p>
                    </div>
                )}
            </div>

            {/* GitHub CTA */}
            <div className="work-cta stagger-item">
                <a
                    href="https://github.com/pranavdhakal7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="work-cta-btn"
                >
                    View all on GitHub <span>↗</span>
                </a>
            </div>
        </section>
    );
};

export default Work;
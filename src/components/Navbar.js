import React, { useState, useEffect } from 'react';
import SpaceClock from './SpaceClock';
import '../styles/Navbar.css';
import '../styles/SpaceClock.css';

const NAV_ITEMS = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'work', label: 'Projects' },
    { id: 'awards', label: 'Awards' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
];

const SECTIONS = NAV_ITEMS.map(n => n.id);

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [scrollY, setScrollY] = useState(0);

    const goTo = (id) => {
        setActiveSection(id);
        setMenuOpen(false);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        document.body.classList.add('dark-mode');

        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                const viewportHeight = window.innerHeight;
                const scrollPosition = currentScrollY + (viewportHeight / 3); // More accurate detection

                let newActiveSection = 'home';
                let minDistance = Infinity;

                // Find the section closest to the current scroll position
                for (const id of SECTIONS) {
                    const el = document.getElementById(id);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        const elementTop = rect.top + currentScrollY;
                        const elementBottom = elementTop + rect.height;

                        // Check if scroll position is within this section
                        if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
                            newActiveSection = id;
                            break;
                        }

                        // Calculate distance to section for fallback
                        const distanceToTop = Math.abs(scrollPosition - elementTop);
                        const distanceToCenter = Math.abs(scrollPosition - (elementTop + rect.height / 2));
                        const distance = Math.min(distanceToTop, distanceToCenter);

                        if (distance < minDistance) {
                            minDistance = distance;
                            newActiveSection = id;
                        }
                    }
                }

                setActiveSection(newActiveSection);
                setScrollY(currentScrollY);
                ticking = false;
            });
        };

        // Initial call to set active section
        onScroll();

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrolled = scrollY > 40;
    const scrollProgress = Math.min(scrollY / 300, 1); // progress from 0 to 1 over 300px scroll
    const navbarStyle = {
        '--scroll-progress': scrollProgress,
        '--scroll-y': `${scrollY}px`,
    };

    return (
        <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} style={navbarStyle}>
            <div className="navbar-inner">

                {/* Logo */}
                <a
                    href="#home"
                    className="navbar-logo"
                    onClick={e => { e.preventDefault(); goTo('home'); }}
                >
                    Enjoy Browsing  <span className="logo-exclamation">!</span>
                </a>

                {/* Space-themed clock placed right after logo */}
                <SpaceClock />

                {/* Desktop nav pill */}
                <nav className="navbar-links">
                    {NAV_ITEMS.map(item => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            className={`nav-link ${activeSection === item.id ? 'nav-link--active' : ''}`}
                            onClick={e => { e.preventDefault(); goTo(item.id); }}
                        >
                            {activeSection === item.id && <span className="nav-dot" />}
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Right actions */}
                <div className="navbar-actions">
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resume-btn"
                    >
                        My Resume ↗
                    </a>
                    <button
                        className={`burger ${menuOpen ? 'burger--open' : ''}`}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            <div className={`mobile-drawer ${menuOpen ? 'mobile-drawer--open' : ''}`}>
                {NAV_ITEMS.map(item => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`mobile-link ${activeSection === item.id ? 'mobile-link--active' : ''}`}
                        onClick={e => { e.preventDefault(); goTo(item.id); }}
                    >
                        {item.label}
                    </a>
                ))}
                <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-resume"
                >
                    Download Resume ↗
                </a>
            </div>
        </header>
    );
};

export default Navbar;
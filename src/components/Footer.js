import React from 'react';
import '../styles/Footer.css';

const SOCIALS = [
    { icon: 'fab fa-github',      href: 'https://github.com/pranavdhakal7',      label: 'GitHub' },
    { icon: 'fab fa-linkedin-in', href: 'https://linkedin.com/in/pranavdhakal7', label: 'LinkedIn' },
    { icon: 'fab fa-twitter',     href: 'https://twitter.com/pranavdhakal7',     label: 'Twitter' },
    { icon: 'fab fa-instagram',   href: 'https://instagram.com/pranavdhakal7',   label: 'Instagram' },
];

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="footer">
            {/* Top row: status + nav */}
            <div className="footer-top">
                <div className="footer-status">
                    <span className="status-dot" />
                    <span className="status-text">Available for work</span>
                </div>
                <a href="#home" className="footer-back-top" aria-label="Back to top">
                    <span className="top-arrow">↑</span>
                    <span>Back to top</span>
                </a>
            </div>

            {/* Center: Name + tagline */}
            <div className="footer-center">
                <a href="#home" className="footer-name" tabIndex={-1}>
                    PRANAV<span className="footer-name-accent">.</span>
                </a>
                <p className="footer-tagline">
                    Crafting digital experiences with code & creativity
                </p>
            </div>

            {/* Social icons */}
            <div className="footer-social-row">
                {SOCIALS.map(s => (
                    <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-social-icon"
                        title={s.label}
                    >
                        <i className={s.icon} />
                    </a>
                ))}
            </div>

            {/* Bottom divider + copyright */}
            <div className="footer-bottom">
                <div className="footer-line" />
                <p className="footer-copy">
                    © {year} Pranav Dhakal — Built with passion
                </p>
            </div>
        </footer>
    );
};

export default Footer;
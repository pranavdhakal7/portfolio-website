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

            {/* Availability pill */}
            <div className="footer-avail">
                <span className="avail-dot" />
                Available for opportunities
            </div>

            {/* Giant full-width name — the signature Godly.website footer element */}
            <div className="footer-bigname" aria-hidden="true">
                <a href="#home" className="bigname-link" tabIndex={-1}>
                    PRANAV
                </a>
            </div>

            {/* Thin divider */}
            <div className="footer-divider" />

            {/* Bottom bar */}
            <div className="footer-bar">
                <p className="footer-copy">
                    © {year} Pranav Dhakal
                </p>

                {/* Socials */}
                <div className="footer-socials">
                    {SOCIALS.map(s => (
                        <a
                            key={s.label}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-soc"
                            title={s.label}
                        >
                            <i className={s.icon} />
                            <span>{s.label}</span>
                        </a>
                    ))}
                </div>

                {/* Scroll to top */}
                <a href="#home" className="footer-up" aria-label="Back to top">
                    ↑ Top
                </a>
            </div>

        </footer>
    );
};

export default Footer;
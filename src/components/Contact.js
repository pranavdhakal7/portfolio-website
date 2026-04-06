import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import '../styles/Contact.css';

const SOCIALS = [
    { icon: 'fab fa-github', href: 'https://github.com/pranavdhakal7', label: 'GitHub' },
    { icon: 'fab fa-linkedin-in', href: 'https://linkedin.com/in/pranavdhakal7', label: 'LinkedIn' },
    { icon: 'fab fa-twitter', href: 'https://twitter.com/pranavdhakal7', label: 'Twitter' },
    { icon: 'fab fa-instagram', href: 'https://instagram.com/pranavdhakal7', label: 'Instagram' },
    { icon: 'fab fa-discord', href: 'https://discord.com/users/pranavdhakal7', label: 'Discord' },
];

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState(null); // 'ok' | 'err'

    useEffect(() => { emailjs.init('ZGRtNRXRno-fLsQEs'); }, []);

    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onSubmit = e => {
        e.preventDefault();
        setSending(true);
        setStatus(null);

        emailjs.send('service_bzsytzo', 'template_07o0w6s', {
            from_name: form.name,
            name: form.name,
            email: form.email,
            subject: form.subject || 'Contact Form',
            message: form.message,
            to_email: 'pranav.dhakal7@gmail.com',
        })
            .then(() => {
                setStatus('ok');
                setForm({ name: '', email: '', subject: '', message: '' });
            })
            .catch(() => setStatus('err'))
            .finally(() => setSending(false));
    };

    return (
        <section className="contact" id="contact">
            <div className="contact-inner">

                {/* ── LEFT: form ── */}
                <div className="contact-right stagger-item stagger-delay-1">
                    <form className="cform" onSubmit={onSubmit} id="contact-form">
                        <div className="cform-grid">
                            <div className="cform-group">
                                <label className="cform-label">Name</label>
                                <input name="name" className="cform-input" type="text"
                                    placeholder="Your name" required
                                    value={form.name} onChange={onChange} />
                            </div>
                            <div className="cform-group">
                                <label className="cform-label">Email</label>
                                <input name="email" className="cform-input" type="email"
                                    placeholder="your@email.com" required
                                    value={form.email} onChange={onChange} />
                            </div>
                            <div className="cform-group cform-full">
                                <label className="cform-label">Subject</label>
                                <input name="subject" className="cform-input" type="text"
                                    placeholder="What's this about?" required
                                    value={form.subject} onChange={onChange} />
                            </div>
                            <div className="cform-group cform-full">
                                <label className="cform-label">Message</label>
                                <textarea name="message" className="cform-input cform-textarea"
                                    placeholder="Tell me about your project or idea…" required
                                    rows={5} value={form.message} onChange={onChange} />
                            </div>
                        </div>

                        <button className="cform-submit" type="submit" disabled={sending}>
                            {sending ? (
                                <><i className="fas fa-spinner fa-spin" /> Sending…</>
                            ) : (
                                <>Send Message <span>↗</span></>
                            )}
                        </button>

                        {status === 'ok' && <p className="cform-msg cform-msg--ok">✓ Sent! I'll reply soon.</p>}
                        {status === 'err' && <p className="cform-msg cform-msg--err">Something went wrong — email me directly.</p>}
                    </form>
                </div>

                {/* ── RIGHT: statement + info ── */}
                <div className="contact-left stagger-item stagger-delay-2">
                    <p className="section-eyebrow">Contact</p>
                    <h2 className="contact-headline">
                        Let's build<br />something <span>great.</span>
                    </h2>
                    <p className="contact-blurb">
                        Open to full-time roles, freelance projects, and research collaborations.
                        Drop a message and I'll reply within 24 hours.
                    </p>

                    {/* Quick links */}
                    <div className="contact-links">
                        <a href="mailto:pranav.dhakal7@gmail.com" className="clink">
                            <span className="clink-icon"><i className="fas fa-envelope" /></span>
                            <span className="clink-text">pranav.dhakal7@gmail.com</span>
                            <span className="clink-arrow">↗</span>
                        </a>
                        <a href="tel:+18597865828" className="clink">
                            <span className="clink-icon"><i className="fas fa-phone" /></span>
                            <span className="clink-text">+1 (859) 786-5828</span>
                            <span className="clink-arrow">↗</span>
                        </a>
                        <div className="clink clink--no-link">
                            <span className="clink-icon"><i className="fas fa-map-marker-alt" /></span>
                            <span className="clink-text">Harrisburg, PA · Open to Remote</span>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="contact-socials">
                        {SOCIALS.map(s => (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                                className="soc-btn" title={s.label}>
                                <i className={s.icon} />
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Contact;
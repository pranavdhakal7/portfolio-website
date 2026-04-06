import React, { useEffect, useRef } from 'react';
import '../styles/ScrollObserver.css';

const ScrollObserver = ({ children }) => {
    const observerRef = useRef(null);
    const sectionRefs = useRef([]);
    const progressRef = useRef(null);
    const lastScrollTime = useRef(Date.now());

    useEffect(() => {
        // Scroll progress indicator with throttling
        const handleScroll = () => {
            const now = Date.now();
            if (now - lastScrollTime.current < 16) return; // ~60fps throttle

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

            if (progressRef.current) {
                progressRef.current.style.width = `${scrollPercent}%`;
            }
            lastScrollTime.current = now;
        };

        // Debounced scroll handler for better performance
        const debouncedScroll = () => {
            requestAnimationFrame(handleScroll);
        };

        window.addEventListener('scroll', debouncedScroll, { passive: true });

        // Create Intersection Observer with SecretLevel.co style settings
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Add animation class with delay for SecretLevel.co effect
                        setTimeout(() => {
                            entry.target.classList.add('section-visible');

                            // Stagger child animations with varying delays
                            const childElements = entry.target.querySelectorAll('.stagger-item');
                            childElements.forEach((el, index) => {
                                setTimeout(() => {
                                    el.classList.add('stagger-visible');
                                }, 150 + (index * 80)); // SecretLevel.co style staggered timing
                            });

                            // Add content-reveal effect to images
                            const images = entry.target.querySelectorAll('img');
                            images.forEach((img, index) => {
                                img.classList.add('scroll-image');
                                setTimeout(() => {
                                    img.classList.add('section-visible');
                                }, 300 + (index * 100));
                            });
                        }, 100); // Small delay for section entrance
                    }
                });
            },
            {
                threshold: 0.15, // SecretLevel.co triggers slightly earlier
                rootMargin: '-80px 0px -120px 0px' // More aggressive trigger for smoother flow
            }
        );

        // Observe all valid section refs directly
        sectionRefs.current.forEach((section) => {
            if (section) {
                observerRef.current.observe(section);
            }
        });

        // Initial check for sections already in view
        setTimeout(() => {
            sectionRefs.current.forEach((section) => {
                if (!section) return;
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    section.classList.add('section-visible');

                    const childElements = section.querySelectorAll('.stagger-item');
                    childElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('stagger-visible');
                        }, index * 100);
                    });
                }
            });
        }, 500);

        return () => {
            window.removeEventListener('scroll', debouncedScroll);
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    // Wrap children in a div that handles the refs and classes instead of cloning directly
    // This allows custom functional components to be animated without needing forwardRef
    const childrenWithRefs = React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
            return (
                <div 
                    ref={(el) => { sectionRefs.current[index] = el; }}
                    className="scroll-section"
                    style={{ width: '100%' }}
                >
                    {child}
                </div>
            );
        }
        return child;
    });

    return (
        <>
            {/* SecretLevel.co style scroll progress indicator */}
            <div className="scroll-progress" ref={progressRef} style={{ width: '0%' }}>
                <div className="progress-glow"></div>
            </div>

            {/* SecretLevel.co style scroll hint for first visit */}
            <div className="scroll-hint-container">
                <div className="scroll-hint">
                    <span>Scroll to explore</span>
                    <div className="hint-arrow">↓</div>
                </div>
            </div>

            {childrenWithRefs}
        </>
    );
};

export default ScrollObserver;
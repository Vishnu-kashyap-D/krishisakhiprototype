// Enhanced Animations for Krishi Sakhi
class KrishiSakhiAnimations {
    constructor() {
        this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.observers = [];
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupScrollRevealAnimations();
            this.setupMicroInteractions();
            this.setupLoadingAnimations();
            this.setupParallaxEffects();
            this.setupHoverEffects();
            console.log('✨ Enhanced animations initialized');
        });
    }

    // Advanced scroll reveal animations
    setupScrollRevealAnimations() {
        if (this.isReduced) return;

        const revealOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, revealOptions);

        // Elements to animate on scroll
        const elementsToReveal = document.querySelectorAll(`
            .feature-card,
            .app-card,
            .testimonial-card,
            .stat-card,
            .tech-item,
            .problem-statement,
            .solution-statement,
            .contact-item
        `);

        elementsToReveal.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.transitionDelay = `${index * 0.1}s`;
            
            revealObserver.observe(el);
        });

        this.observers.push(revealObserver);
    }

    // Animate individual elements
    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        // Add specific animations based on element type
        if (element.classList.contains('feature-card')) {
            this.animateFeatureCard(element);
        } else if (element.classList.contains('stat-card')) {
            this.animateStatCard(element);
        } else if (element.classList.contains('testimonial-card')) {
            this.animateTestimonialCard(element);
        }
    }

    // Feature card specific animations
    animateFeatureCard(card) {
        const icon = card.querySelector('.feature-icon');
        if (icon) {
            setTimeout(() => {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }, 300);
            }, 400);
        }
    }

    // Stat card animations with number counting
    animateStatCard(card) {
        const numberEl = card.querySelector('.stat-number');
        if (numberEl && !numberEl.dataset.animated) {
            this.animateNumber(numberEl);
        }
    }

    // Testimonial card animations
    animateTestimonialCard(card) {
        const stars = card.querySelectorAll('.testimonial-rating i');
        stars.forEach((star, index) => {
            setTimeout(() => {
                star.style.transform = 'scale(1.2)';
                star.style.color = 'var(--accent-500)';
                setTimeout(() => {
                    star.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
        });
    }

    // Number counting animation
    animateNumber(element) {
        const finalValue = element.textContent;
        const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
        const suffix = finalValue.replace(/[\d]/g, '');
        
        element.dataset.animated = 'true';
        
        let currentValue = 0;
        const increment = numericValue / 30;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentValue) + suffix;
        }, 50);
    }

    // Micro-interactions and hover effects
    setupMicroInteractions() {
        // Button ripple effects (enhanced)
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.btn');
            if (button && !this.isReduced) {
                this.createRippleEffect(button, e);
            }
        });

        // Card hover effects
        this.setupCardHovers();
        
        // Navigation link animations
        this.setupNavAnimations();
        
        // Form field animations
        this.setupFormAnimations();
    }

    // Enhanced ripple effect
    createRippleEffect(button, event) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            z-index: 1;
        `;

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    // Card hover effects
    setupCardHovers() {
        const cards = document.querySelectorAll('.feature-card, .app-card, .testimonial-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.isReduced) {
                    card.style.transform = 'translateY(-8px) scale(1.02)';
                    card.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
                    
                    // Animate card icon
                    const icon = card.querySelector('.feature-icon, .app-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1.1) rotate(5deg)';
                    }
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
                
                const icon = card.querySelector('.feature-icon, .app-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }

    // Navigation animations
    setupNavAnimations() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (!this.isReduced) {
                    link.style.transform = 'translateY(-2px)';
                    
                    // Add glow effect
                    link.style.boxShadow = '0 4px 15px rgba(46, 139, 87, 0.2)';
                }
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0)';
                link.style.boxShadow = '';
            });
        });
    }

    // Form field animations
    setupFormAnimations() {
        const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
        
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (!this.isReduced) {
                    input.style.transform = 'translateY(-2px)';
                    input.parentElement.style.transform = 'scale(1.02)';
                }
            });

            input.addEventListener('blur', () => {
                input.style.transform = 'translateY(0)';
                input.parentElement.style.transform = 'scale(1)';
            });
        });
    }

    // Loading animations
    setupLoadingAnimations() {
        // Logo animation on load
        const logo = document.querySelector('.nav-logo');
        if (logo && !this.isReduced) {
            logo.style.opacity = '0';
            logo.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                logo.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                logo.style.opacity = '1';
                logo.style.transform = 'translateY(0)';
            }, 500);
        }

        // Hero title animation
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && !this.isReduced) {
            const titleSpans = heroTitle.querySelectorAll('span');
            titleSpans.forEach((span, index) => {
                span.style.opacity = '0';
                span.style.transform = 'translateY(50px)';
                
                setTimeout(() => {
                    span.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    span.style.opacity = '1';
                    span.style.transform = 'translateY(0)';
                }, 800 + (index * 200));
            });
        }

        // Floating card entrance
        const floatingCard = document.querySelector('.floating-card');
        if (floatingCard && !this.isReduced) {
            floatingCard.style.opacity = '0';
            floatingCard.style.transform = 'translateX(100px) scale(0.8)';
            
            setTimeout(() => {
                floatingCard.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                floatingCard.style.opacity = '1';
                floatingCard.style.transform = 'translateX(0) scale(1)';
            }, 1500);
        }
    }

    // Parallax effects
    setupParallaxEffects() {
        if (this.isReduced) return;

        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            // Hero background parallax
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground) {
                const rate = scrolled * 0.5;
                heroBackground.style.transform = `translateY(${rate}px)`;
            }

            // Section backgrounds parallax
            const sections = document.querySelectorAll('.section:nth-child(even)');
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                    const rate = scrolled * 0.1 * (index + 1);
                    section.style.backgroundPosition = `center ${50 + rate}px`;
                }
            });
            
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Hover effects for interactive elements
    setupHoverEffects() {
        // Technology category hover
        const techCategories = document.querySelectorAll('.tech-category');
        techCategories.forEach(category => {
            category.addEventListener('mouseenter', () => {
                if (!this.isReduced) {
                    category.style.transform = 'translateX(10px)';
                    category.style.borderLeft = '4px solid var(--accent-500)';
                }
            });

            category.addEventListener('mouseleave', () => {
                if (!category.classList.contains('active')) {
                    category.style.transform = 'translateX(0)';
                    category.style.borderLeft = '';
                }
            });
        });

        // Social links animation
        const socialLinks = document.querySelectorAll('.social-links a');
        socialLinks.forEach((link, index) => {
            link.addEventListener('mouseenter', () => {
                if (!this.isReduced) {
                    link.style.transform = 'translateY(-5px) rotate(10deg)';
                    link.style.background = 'var(--gradient-primary)';
                }
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) rotate(0deg)';
                link.style.background = '';
            });
        });

        // Map marker pulse animation
        this.setupMapMarkerAnimations();
    }

    // Map marker animations
    setupMapMarkerAnimations() {
        // This will be called after map is loaded
        const checkForMarkers = () => {
            const markers = document.querySelectorAll('.custom-marker');
            if (markers.length > 0) {
                markers.forEach(marker => {
                    marker.addEventListener('mouseenter', () => {
                        if (!this.isReduced) {
                            marker.style.transform = 'scale(1.2)';
                            marker.style.zIndex = '1000';
                        }
                    });

                    marker.addEventListener('mouseleave', () => {
                        marker.style.transform = 'scale(1)';
                        marker.style.zIndex = '';
                    });
                });
            } else {
                // Retry after map loads
                setTimeout(checkForMarkers, 1000);
            }
        };

        setTimeout(checkForMarkers, 2000);
    }

    // Page transition effects
    setupPageTransitions() {
        // Smooth page load
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease-in-out';
                document.body.style.opacity = '1';
            }, 100);
        });
    }

    // Cleanup animations
    cleanup() {
        this.observers.forEach(observer => {
            if (observer.disconnect) {
                observer.disconnect();
            }
        });
    }
}

// Advanced CSS animations
const advancedAnimationsCSS = `
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }

    @keyframes float-gentle {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
        }
        33% {
            transform: translateY(-5px) rotate(1deg);
        }
        66% {
            transform: translateY(3px) rotate(-1deg);
        }
    }

    @keyframes glow-pulse {
        0%, 100% {
            box-shadow: 0 0 5px rgba(46, 139, 87, 0.3);
        }
        50% {
            box-shadow: 0 0 20px rgba(46, 139, 87, 0.6), 
                        0 0 30px rgba(46, 139, 87, 0.4);
        }
    }

    @keyframes slide-in-up {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slide-in-left {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slide-in-right {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes scale-in {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    /* Enhanced hover states */
    .btn {
        position: relative;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .btn:active {
        transform: translateY(0);
        transition-duration: 0.1s;
    }

    /* Card animations */
    .feature-card,
    .app-card,
    .testimonial-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .feature-card:hover,
    .app-card:hover,
    .testimonial-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    }

    /* Icon animations */
    .feature-icon,
    .app-icon {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Form animations */
    .form-group {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        transform: translateY(-1px);
    }

    /* Navigation animations */
    .nav-link {
        position: relative;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-link::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        width: 0;
        height: 2px;
        background: var(--gradient-primary);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateX(-50%);
    }

    .nav-link:hover::after,
    .nav-link.active::after {
        width: 100%;
    }

    /* Loading animation for images */
    img {
        transition: opacity 0.3s ease-in-out;
    }

    img[loading="lazy"] {
        opacity: 0;
    }

    img.loaded {
        opacity: 1;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
        .btn,
        .feature-card,
        .app-card {
            border: 2px solid;
        }
    }
`;

// Add CSS to document
const styleSheet = document.createElement('style');
styleSheet.textContent = advancedAnimationsCSS;
document.head.appendChild(styleSheet);

// Initialize animations
const krishiSakhiAnimations = new KrishiSakhiAnimations();

// Export for external use
window.KrishiSakhiAnimations = krishiSakhiAnimations;

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    krishiSakhiAnimations.cleanup();
});

console.log('🎭 Advanced Animations Module Loaded');
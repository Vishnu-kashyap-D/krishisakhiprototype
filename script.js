// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initTechnologyTabs();
    initFormHandling();
    initHeroAnimations();
    initScrollIndicator();
    initMobileMenu();
    initMicroInteractions();
    initTheme();
    initTabSwitching();
    console.log('🌾 Krishi Sakhi Landing Page Loaded Successfully!');
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 120; // Account for floating navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(this);
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
    
    // Update active nav link based on scroll position
    window.addEventListener('scroll', updateNavOnScroll);
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function updateNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
}

// Tab switching functionality for Interactive Module
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    // Remove active class from all buttons and content
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to clicked button and corresponding content
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    const activeContent = document.querySelector(`#${tabName}Tab`);
    
    if (activeButton) activeButton.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
    
    // Initialize map if map tab is selected and not already initialized
    if (tabName === 'map' && typeof initializeMap === 'function') {
        setTimeout(() => {
            initializeMap();
        }, 300);
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special handling for stats counter animation
                if (entry.target.classList.contains('stat-card')) {
                    animateCounter(entry.target);
                }
                
                // Special handling for feature cards stagger animation
                if (entry.target.classList.contains('features-grid')) {
                    staggerFeatureCards(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const elementsToObserve = document.querySelectorAll(`
        .section-header,
        .feature-card,
        .app-card,
        .stat-card,
        .about-content,
        .tech-content,
        .contact-content,
        .problem-statement,
        .solution-statement,
        .testimonial-card
    `);
    
    elementsToObserve.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Counter animation for statistics
function animateCounter(statCard) {
    const numberElement = statCard.querySelector('.stat-number');
    if (!numberElement || numberElement.dataset.animated === 'true') return;
    
    const finalNumber = numberElement.textContent;
    const isPercentage = finalNumber.includes('%');
    const hasPlus = finalNumber.includes('+');
    const numericValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
    
    numberElement.dataset.animated = 'true';
    
    let currentNumber = 0;
    const increment = numericValue / 60; // Animate over ~1 second at 60fps
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= numericValue) {
            currentNumber = numericValue;
            clearInterval(timer);
        }
        
        let displayNumber = Math.floor(currentNumber);
        if (isPercentage) {
            displayNumber += '%';
        } else if (hasPlus) {
            displayNumber += '+';
        } else if (finalNumber.includes('/')) {
            displayNumber += '/7';
        }
        
        numberElement.textContent = displayNumber;
    }, 16); // ~60fps
}

// Stagger animation for feature cards
function staggerFeatureCards(container) {
    const cards = container.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Technology tabs functionality
function initTechnologyTabs() {
    const techCategories = document.querySelectorAll('.tech-category');
    const techPanels = document.querySelectorAll('.tech-panel');
    
    techCategories.forEach(category => {
        category.addEventListener('click', function() {
            const targetCategory = this.dataset.category;
            
            // Remove active class from all categories
            techCategories.forEach(cat => cat.classList.remove('active'));
            // Add active class to clicked category
            this.classList.add('active');
            
            // Hide all panels
            techPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Show target panel
            const targetPanel = document.getElementById(targetCategory);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// Form handling
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        // Handle form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
        
        // Handle input focus/blur for floating labels
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Check if input has value on load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }
}

function handleFormSubmission(form) {
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Remove focused class from form groups
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('focused');
        });
        
        console.log('Form submitted:', formObject);
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-500)' : 'var(--accent-500)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Handle close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Hero animations
function initHeroAnimations() {
    // Floating card animation
    const floatingCard = document.querySelector('.floating-card');
    if (floatingCard) {
        // Add subtle mouse movement effect (reduced intensity)
        document.addEventListener('mousemove', function(e) {
            const x = (e.clientX / window.innerWidth - 0.5) * 10;
            const y = (e.clientY / window.innerHeight - 0.5) * 10;
            
            floatingCard.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    }
    
    // Initialize default tab
    switchTab('map');
}

// Scroll indicator
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
        
        // Hide scroll indicator when user scrolls past hero
        window.addEventListener('scroll', function() {
            const heroHeight = document.querySelector('.hero').offsetHeight;
            if (window.scrollY > heroHeight * 0.5) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
}

// Theme functionality
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('#themeIcon');
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icon based on theme
    updateThemeIcon(currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
    
    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

function toggleTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.click();
    }
}

// Button click effects
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
        const btn = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
        
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        btn.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add ripple animation and additional styles
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 0.8rem;
        opacity: 0.8;
        margin-left: auto;
        padding: 0.2rem;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    /* Mobile menu styles */
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 80px;
            right: -100%;
            width: calc(100% - 40px);
            margin: 0 20px;
            border-radius: 24px;
            height: auto;
            max-height: calc(100vh - 120px);
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(32px) saturate(200%) brightness(1.1);
            -webkit-backdrop-filter: blur(32px) saturate(200%) brightness(1.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding: 2rem 1rem;
            transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15),
                        0 2px 0 rgba(255, 255, 255, 0.4) inset,
                        0 -1px 0 rgba(0, 0, 0, 0.05) inset;
        }
        
        .nav-menu.active {
            right: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
    }
`;

document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        const rate = scrolled * -0.3;
        heroBackground.style.transform = `translateY(${rate}px)`;
    }
});

// Performance optimization - throttle scroll events
function throttle(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(function() {
    updateNavOnScroll();
}, 10);

window.addEventListener('scroll', throttledScrollHandler);

// Smooth scrolling fallback for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    function smoothScrollTo(target, duration = 1000) {
        const targetPosition = target.offsetTop - 120;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuart(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeInOutQuart(t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t*t*t + b;
            t -= 2;
            return -c/2 * (t*t*t*t - 2) + b;
        }

        requestAnimationFrame(animation);
    }
    
    // Override smooth scrolling for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                smoothScrollTo(target);
            }
        });
    });
}

// Micro-interactions for enhanced UX
function initMicroInteractions() {
    // Add magnetic effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Add glow effect to logo on hover
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.querySelector('.logo-icon').style.filter = 'drop-shadow(0 0 20px rgba(46, 139, 87, 0.6))';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.querySelector('.logo-icon').style.filter = '';
        });
    }
    
    // Add subtle tilt to feature icons
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach(icon => {
        icon.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `perspective(1000px) rotateX(${y * 0.1}deg) rotateY(${x * 0.1}deg)`;
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Advanced Lazy Loading Implementation
function initAdvancedLazyLoading() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add loading placeholder
                    img.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
                    img.style.backgroundSize = '200% 100%';
                    img.style.animation = 'shimmer 1.5s infinite';
                    
                    // Load the image
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        img.src = tempImg.src;
                        img.style.background = 'none';
                        img.style.animation = 'none';
                        img.classList.add('loaded');
                    };
                    tempImg.src = img.dataset.src || img.src;
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Observe all images with loading="lazy"
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize lazy loading
initAdvancedLazyLoading();

// Accessibility improvements
function enhanceAccessibility() {
    // Add focus indicators for keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.setAttribute('data-keyboard-focused', 'true');
        });
        
        element.addEventListener('blur', function() {
            this.removeAttribute('data-keyboard-focused');
        });
        
        element.addEventListener('mousedown', function() {
            this.setAttribute('data-mouse-focused', 'true');
        });
        
        element.addEventListener('mouseup', function() {
            this.removeAttribute('data-mouse-focused');
        });
    });
    
    // Enhance screen reader support for interactive elements
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
            // Add appropriate aria-label for icon-only buttons
            const icon = button.querySelector('i');
            if (icon && icon.classList.contains('fa-moon')) {
                button.setAttribute('aria-label', 'Switch to dark mode');
            } else if (icon && icon.classList.contains('fa-sun')) {
                button.setAttribute('aria-label', 'Switch to light mode');
            }
        }
    });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Error handling for missing elements
function safeQuerySelector(selector, context = document) {
    try {
        return context.querySelector(selector);
    } catch (e) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

function safeQuerySelectorAll(selector, context = document) {
    try {
        return context.querySelectorAll(selector);
    } catch (e) {
        console.warn(`Elements not found: ${selector}`);
        return [];
    }
}

// Global error handler
window.addEventListener('error', function(e) {
    console.warn('Krishi Sakhi: An error occurred:', e.error);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.warn('Krishi Sakhi: Unhandled promise rejection:', e.reason);
});

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log(`${entry.name}: ${entry.value}`);
            }
        });
        
        try {
            observer.observe({entryTypes: ['measure', 'largest-contentful-paint', 'first-input', 'cumulative-layout-shift']});
        } catch (e) {
            // Fallback for browsers that don't support all metrics
            observer.observe({entryTypes: ['measure']});
        }
    }
}

// Initialize performance monitoring in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    initPerformanceMonitoring();
}
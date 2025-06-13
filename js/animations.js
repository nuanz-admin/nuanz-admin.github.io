// Animations JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
});

function initAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Disable animations for users who prefer reduced motion
        disableAnimations();
        return;
    }
    
    // Initialize scroll-based animations
    initScrollAnimations();
    
    // Initialize hover animations
    initHoverAnimations();
    
    // Initialize page transition animations
    initPageTransitions();
    
    // Initialize loading animations
    initLoadingAnimations();
}

// Scroll-based animations
function initScrollAnimations() {
    // Use Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateElement(entry.target);
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.animate-fade-up, .service-card, .case-card, [data-animate]'
        );
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            animationObserver.observe(element);
        });
    } else {
        // Fallback for browsers without Intersection Observer
        initScrollAnimationsFallback();
    }
}

function animateElement(element) {
    // Add animation class to trigger CSS animations
    element.classList.add('animated');
    
    // Use CSS transitions for smooth animation
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    
    // Handle different animation types
    const animationType = element.dataset.animate;
    
    switch (animationType) {
        case 'fade-in':
            animateFadeIn(element);
            break;
        case 'slide-up':
            animateSlideUp(element);
            break;
        case 'scale':
            animateScale(element);
            break;
        case 'rotate':
            animateRotate(element);
            break;
        default:
            // Default fade up animation
            break;
    }
    
    // Announce to screen readers if needed
    if (element.dataset.announceOnAnimate) {
        setTimeout(() => {
            if (window.NuanzApp) {
                window.NuanzApp.announceToScreenReader(element.dataset.announceOnAnimate);
            }
        }, 400);
    }
}

function animateFadeIn(element) {
    element.style.opacity = '0';
    element.style.transition = 'opacity 1s ease';
    
    requestAnimationFrame(() => {
        element.style.opacity = '1';
    });
}

function animateSlideUp(element) {
    element.style.transform = 'translateY(50px)';
    element.style.opacity = '0';
    element.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
    
    requestAnimationFrame(() => {
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
    });
}

function animateScale(element) {
    element.style.transform = 'scale(0.8)';
    element.style.opacity = '0';
    element.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
    
    requestAnimationFrame(() => {
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
    });
}

function animateRotate(element) {
    element.style.transform = 'rotate(-10deg) scale(0.8)';
    element.style.opacity = '0';
    element.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
    
    requestAnimationFrame(() => {
        element.style.transform = 'rotate(0deg) scale(1)';
        element.style.opacity = '1';
    });
}

// Fallback for browsers without Intersection Observer
function initScrollAnimationsFallback() {
    const handleScroll = window.NuanzApp ? 
        window.NuanzApp.throttle(checkElementsInView, 100) : 
        checkElementsInView;
    
    window.addEventListener('scroll', handleScroll);
    
    // Check on load
    checkElementsInView();
    
    function checkElementsInView() {
        const animatedElements = document.querySelectorAll('.animate-fade-up:not(.animated)');
        
        animatedElements.forEach(element => {
            if (isElementInView(element)) {
                animateElement(element);
            }
        });
    }
    
    function isElementInView(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        return rect.top <= windowHeight * 0.8 && rect.bottom >= 0;
    }
}

// Hover animations
function initHoverAnimations() {
    // Service cards hover effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0px 20px 30px rgba(36, 88, 236, 0.25)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Case cards hover effect
    const caseCards = document.querySelectorAll('.case-card');
    caseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px)';
            this.style.boxShadow = '0px 15px 25px rgba(36, 88, 236, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('no-hover')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Page transition animations
function initPageTransitions() {
    // Add loading state to links
    const pageLinks = document.querySelectorAll('a[href^="./"], a[href^="/"]');
    
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't animate if it's a hash link or external
            if (this.getAttribute('href').startsWith('#') || 
                this.getAttribute('target') === '_blank') {
                return;
            }
            
            // Add loading state
            this.classList.add('loading');
            
            // Create page transition overlay
            createPageTransitionOverlay();
        });
    });
}

function createPageTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--primary-color);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    `;
    
    document.body.appendChild(overlay);
    
    // Animate in
    requestAnimationFrame(() => {
        overlay.style.opacity = '0.9';
    });
    
    // Remove after a delay (fallback)
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
        }
    }, 2000);
}

// Loading animations
function initLoadingAnimations() {
    // Animate hero section on page load
    const hero = document.querySelector('.hero');
    if (hero) {
        animateHeroOnLoad();
    }
    
    // Stagger animation for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
        staggerAnimation(serviceCards, 100);
    }
    
    // Stagger animation for case cards
    const caseCards = document.querySelectorAll('.case-card');
    if (caseCards.length > 0) {
        staggerAnimation(caseCards, 150);
    }
}

function animateHeroOnLoad() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroTagline = document.querySelector('.hero-tagline');
    const heroButton = document.querySelector('.hero .btn');
    
    const elements = [heroTitle, heroSubtitle, heroTagline, heroButton].filter(Boolean);
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
    });
}

function staggerAnimation(elements, delay) {
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay * index);
    });
}

// Disable animations for reduced motion
function disableAnimations() {
    // Remove all animation classes
    const animatedElements = document.querySelectorAll('.animate-fade-up, [data-animate]');
    
    animatedElements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'none';
        element.style.transition = 'none';
    });
    
    // Disable hover effects
    const style = document.createElement('style');
    style.textContent = `
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

// Parallax effect (optional)
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    const handleScroll = window.NuanzApp ? 
        window.NuanzApp.throttle(updateParallax, 16) : 
        updateParallax;
    
    window.addEventListener('scroll', handleScroll);
    
    function updateParallax() {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Performance monitoring for animations
function monitorAnimationPerformance() {
    if (!('PerformanceObserver' in window)) return;
    
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.duration > 16) {
                console.warn(`Long animation frame detected: ${entry.duration}ms`);
            }
        });
    });
    
    observer.observe({ entryTypes: ['measure'] });
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', function() {
    monitorAnimationPerformance();
    
    // Optional parallax effect (uncomment if needed)
    // initParallaxEffect();
});
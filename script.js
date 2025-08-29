// Advanced Portfolio JavaScript
class PortfolioSite {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupLoadingScreen();
    }

    init() {
        // Initialize site components
        this.navbar = document.getElementById('navbar');
        this.loading = document.getElementById('loading');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.querySelector('.nav-menu');
        
        // Scroll position tracking
        this.lastScrollY = 0;
        this.ticking = false;
    }

    setupEventListeners() {
        // Scroll events
        window.addEventListener('scroll', () => {
            this.lastScrollY = window.scrollY;
            this.requestTick();
        });

        // Navigation toggle (mobile)
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                this.smoothScrollTo(anchor.getAttribute('href'));
            });
        });

        // Interactive elements
        this.setupInteractiveElements();
        
        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupLoadingScreen() {
        // Advanced loading sequence
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 2500);
        });
    }

    hideLoadingScreen() {
        if (this.loading) {
            this.loading.style.opacity = '0';
            this.loading.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                this.loading.style.display = 'none';
                this.revealPageContent();
            }, 800);
        }
    }

    revealPageContent() {
        // Stagger reveal of main content
        const elements = [
            '.hero-text',
            '.hero-visual',
            '.hero-scroll-indicator'
        ];

        elements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                setTimeout(() => {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                    element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    });
                }, index * 200);
            }
        });
    }

    requestTick() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updateNavbar();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    updateNavbar() {
        if (this.lastScrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Hide navbar on scroll down, show on scroll up
        if (this.lastScrollY > this.previousScrollY && this.lastScrollY > 200) {
            this.navbar.style.transform = 'translateY(-100%)';
        } else {
            this.navbar.style.transform = 'translateY(0)';
        }
        
        this.previousScrollY = this.lastScrollY;
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            this.navMenu.classList.remove('active');
            this.navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }

    setupScrollAnimations() {
        // Advanced intersection observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const animatableElements = document.querySelectorAll(`
            .about-section,
            .work-section,
            .experience-section,
            .contact-section,
            .timeline-item,
            .work-item,
            .highlight-item,
            .skill-category
        `);

        animatableElements.forEach(el => {
            observer.observe(el);
        });

        // Parallax effect for background shapes
        this.setupParallax();
    }

    animateElement(element) {
        element.classList.add('animate-in');
        
        // Special animations for different element types
        if (element.classList.contains('timeline-item')) {
            this.animateTimelineItem(element);
        } else if (element.classList.contains('work-item')) {
            this.animateWorkItem(element);
        } else if (element.classList.contains('highlight-item')) {
            this.animateHighlightItem(element);
        }
    }

    animateTimelineItem(item) {
        const marker = item.querySelector('.timeline-marker');
        const content = item.querySelector('.timeline-content');
        
        if (marker) {
            setTimeout(() => {
                marker.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    marker.style.transform = 'scale(1)';
                }, 200);
            }, 100);
        }
        
        if (content) {
            setTimeout(() => {
                content.style.transform = 'translateX(0)';
                content.style.opacity = '1';
            }, 300);
        }
    }

    animateWorkItem(item) {
        const elements = item.querySelectorAll('.work-category, .work-title, .work-description, .work-stats');
        
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    animateHighlightItem(item) {
        const number = item.querySelector('.highlight-number');
        if (number) {
            this.countUpAnimation(number, parseInt(number.textContent));
        }
    }

    countUpAnimation(element, target) {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (target - start) * this.easeOutCubic(progress));
            element.textContent = current.toLocaleString() + (target >= 1000 ? 'K+' : '+');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    setupParallax() {
        const shapes = document.querySelectorAll('.bg-shape, .graphic-element');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                const yPos = -(scrolled * speed);
                shape.style.transform += ` translateY(${yPos}px)`;
            });
        });
    }

    setupInteractiveElements() {
        // Enhanced hover effects for grid items
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.highlightGridItem(item);
            });
            
            item.addEventListener('mouseleave', () => {
                this.resetGridItem(item);
            });
        });

        // Work items enhanced interactions
        const workItems = document.querySelectorAll('.work-item');
        workItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.enhanceWorkItem(item);
            });
            
            item.addEventListener('mouseleave', () => {
                this.resetWorkItem(item);
            });
        });

        // Timeline content interactions
        const timelineContents = document.querySelectorAll('.timeline-content');
        timelineContents.forEach(content => {
            content.addEventListener('mouseenter', () => {
                content.style.transform = 'translateX(15px) scale(1.02)';
            });
            
            content.addEventListener('mouseleave', () => {
                content.style.transform = 'translateX(0) scale(1)';
            });
        });
    }

    highlightGridItem(item) {
        // Add glow effect
        item.style.boxShadow = '0 20px 60px rgba(255, 27, 141, 0.4)';
        item.style.transform = 'scale(1.05) rotate(-2deg)';
        
        // Enhance text
        const itemText = item.querySelector('.item-text');
        if (itemText) {
            itemText.style.transform = 'scale(1.1)';
        }
    }

    resetGridItem(item) {
        item.style.boxShadow = '';
        item.style.transform = '';
        
        const itemText = item.querySelector('.item-text');
        if (itemText) {
            itemText.style.transform = '';
        }
    }

    enhanceWorkItem(item) {
        const visual = item.querySelector('.work-visual');
        if (visual) {
            visual.style.transform = 'scale(1.05) rotate(2deg)';
        }
    }

    resetWorkItem(item) {
        const visual = item.querySelector('.work-visual');
        if (visual) {
            visual.style.transform = '';
        }
    }

    handleResize() {
        // Recalculate animations on resize
        this.setupScrollAnimations();
    }

    // Utility function for element visibility
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Advanced cursor effects
    setupCursorEffects() {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);

        const cursorDot = document.createElement('div');
        cursorDot.classList.add('cursor-dot');
        document.body.appendChild(cursorDot);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let dotX = 0, dotY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            dotX += (mouseX - dotX) * 0.3;
            dotY += (mouseY - dotY) * 0.3;

            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;

            requestAnimationFrame(animateCursor);
        };

        animateCursor();

        // Cursor interactions with elements
        const interactiveElements = document.querySelectorAll('a, .btn, .grid-item, .work-item, .timeline-content');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorDot.classList.add('cursor-hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorDot.classList.remove('cursor-hover');
            });
        });
    }

    // Enhanced scroll-triggered animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.triggerElementAnimation(entry.target);
                }
            });
        }, observerOptions);

        // Add animation classes to elements
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
            item.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`;
            observer.observe(item);
        });

        document.querySelectorAll('.work-item').forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(50px)';
            item.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.3}s`;
            observer.observe(item);
        });

        document.querySelectorAll('.highlight-item').forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px) scale(0.9)';
            item.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            observer.observe(item);
        });
    }

    triggerElementAnimation(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateX(0) translateY(0) scale(1)';

        // Special animations for different elements
        if (element.classList.contains('timeline-item')) {
            this.animateTimelineItem(element);
        } else if (element.classList.contains('highlight-item')) {
            this.animateCountUp(element);
        }
    }

    animateTimelineItem(item) {
        const marker = item.querySelector('.timeline-marker');
        if (marker) {
            setTimeout(() => {
                marker.style.animation = 'pulse 0.6s ease-in-out';
            }, 500);
        }
    }

    animateCountUp(item) {
        const number = item.querySelector('.highlight-number');
        if (number) {
            const target = parseInt(number.textContent.replace(/[^0-9]/g, ''));
            this.countUpAnimation(number, target);
        }
    }

    countUpAnimation(element, target) {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (target - start) * this.easeOutQuart(progress));
            const suffix = target >= 1000 ? 'K+' : target >= 100 ? '+' : '';
            element.textContent = current.toLocaleString() + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    setupInteractiveElements() {
        // Enhanced grid item interactions
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                // Create ripple effect
                this.createRippleEffect(item);
                
                // Enhance other items
                gridItems.forEach((otherItem, otherIndex) => {
                    if (otherIndex !== index) {
                        otherItem.style.opacity = '0.7';
                        otherItem.style.transform = 'scale(0.95)';
                    }
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gridItems.forEach(otherItem => {
                    otherItem.style.opacity = '1';
                    otherItem.style.transform = 'scale(1)';
                });
            });
        });

        // Work item hover effects
        const workItems = document.querySelectorAll('.work-item');
        workItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const visual = item.querySelector('.work-visual');
                if (visual) {
                    visual.style.transform = 'scale(1.1) rotate(3deg)';
                    visual.style.filter = 'brightness(1.1)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const visual = item.querySelector('.work-visual');
                if (visual) {
                    visual.style.transform = 'scale(1) rotate(0deg)';
                    visual.style.filter = 'brightness(1)';
                }
            });
        });

        // Button enhancement
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.enhanceButton(btn);
            });
        });
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    enhanceButton(btn) {
        // Add magnetic effect
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    }

    // Mobile menu toggle
    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        
        // Animate hamburger
        const spans = this.navToggle.querySelectorAll('span');
        if (this.navToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    handleResize() {
        // Recalculate positions and animations on resize
        if (window.innerWidth > 768) {
            this.navMenu.classList.remove('active');
            this.navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
}

// Additional CSS animations (injected via JavaScript)
const additionalStyles = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateX(0) translateY(0) scale(1) !important;
    }
    
    .custom-cursor {
        width: 40px;
        height: 40px;
        border: 2px solid var(--hot-pink);
        border-radius: 50%;
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: all 0.1s ease;
    }
    
    .cursor-dot {
        width: 8px;
        height: 8px;
        background: var(--hot-pink);
        border-radius: 50%;
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9999;
    }
    
    .cursor-hover {
        transform: scale(1.5) !important;
    }
    
    .nav-menu.active {
        display: flex !important;
        position: fixed;
        top: 100%;
        left: 0;
        width: 100%;
        height: calc(100vh - 100%);
        background: var(--charcoal);
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 40px;
    }
    
    .nav-menu.active .nav-link {
        color: var(--white);
        font-size: 2rem;
    }
    
    .nav-toggle.active span {
        transition: all 0.3s ease;
    }
    
    body.menu-open {
        overflow: hidden;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the portfolio site when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioSite();
});

// Add some extra interactive magic
document.addEventListener('DOMContentLoaded', () => {
    // Typing effect for hero subtitle
    const heroDesc = document.querySelector('.hero-description p');
    if (heroDesc) {
        const text = heroDesc.textContent;
        heroDesc.textContent = '';
        
        setTimeout(() => {
            let index = 0;
            const typeWriter = () => {
                if (index < text.length) {
                    heroDesc.textContent += text.charAt(index);
                    index++;
                    setTimeout(typeWriter, 50);
                }
            };
            typeWriter();
        }, 3000);
    }

    // Add glitch effect to title on scroll
    let glitchTimeout;
    window.addEventListener('scroll', () => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && window.scrollY > 50) {
            clearTimeout(glitchTimeout);
            heroTitle.style.textShadow = '2px 0 var(--hot-pink), -2px 0 var(--sage-green)';
            
            glitchTimeout = setTimeout(() => {
                heroTitle.style.textShadow = 'none';
            }, 100);
        }
    });

    // Dynamic background color based on scroll position
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                document.body.setAttribute('data-section', sectionId);
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => {
        observer.observe(section);
    });
});

// Editorial Portfolio JavaScript
class EditorialPortfolio {
    constructor() {
        this.isLoaded = false;
        this.scrollPosition = 0;
        this.init();
    }

    init() {
        this.setupLoadingSequence();
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupInteractions();
        this.setupParallax();
    }

    setupLoadingSequence() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 3000);
        });
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            // Fade out loading screen
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.revealContent();
                this.isLoaded = true;
            }, 800);
        }
    }

    revealContent() {
        // Staggered reveal of hero elements
        const heroElements = [
            '.hero-header',
            '.hero-main',
            '.hero-footer',
            '.scroll-indicator'
        ];

        heroElements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200 + 500);
            }
        });
    }

    setupNavigation() {
        const navbar = document.getElementById('navigation');
        const navToggle = document.getElementById('navToggle');
        const navList = document.querySelector('.nav-list');
        
        // Scroll-based navbar behavior
        let lastScrollY = 0;
        let ticking = false;

        const updateNavbar = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });

        // Mobile menu toggle
        if (navToggle && navList) {
            navToggle.addEventListener('click', () => {
                navList.classList.toggle('active');
                navToggle.classList.toggle('active');
                document.body.classList.toggle('menu-open');
                
                // Animate hamburger lines
                const spans = navToggle.querySelectorAll('span');
                if (navToggle.classList.contains('active')) {
                    spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                    spans[1].style.transform = 'rotate(-45deg) translate(6px, -6px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.transform = 'none';
                }
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu
                    navList?.classList.remove('active');
                    navToggle?.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.triggerSpecialAnimations(entry.target);
                }
            });
        }, observerOptions);

        // Observe sections and key elements
        document.querySelectorAll(`
            .about-section,
            .portfolio-section,
            .experience-section,
            .contact-section,
            .timeline-item,
            .portfolio-item,
            .metric
        `).forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });

        // Stagger timeline items
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.2}s`;
        });

        // Stagger portfolio items
        document.querySelectorAll('.portfolio-item').forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.3}s`;
        });
    }

    triggerSpecialAnimations(element) {
        // Counter animations for metrics
        if (element.classList.contains('metric')) {
            const number = element.querySelector('.metric-number');
            if (number && !number.dataset.animated) {
                this.animateNumber(number);
                number.dataset.animated = 'true';
            }
        }

        // Timeline item special effects
        if (element.classList.contains('timeline-item')) {
            const marker = element.querySelector('.timeline-marker');
            if (marker) {
                setTimeout(() => {
                    marker.style.animation = 'pulse-editorial 0.8s ease-out';
                }, 300);
            }
        }

        // Portfolio item hover setup
        if (element.classList.contains('portfolio-item')) {
            this.setupPortfolioHover(element);
        }
    }

    animateNumber(element) {
        const text = element.textContent;
        const target = parseInt(text.replace(/[^0-9]/g, ''));
        const suffix = text.replace(/[0-9]/g, '');
        
        let current = 0;
        const increment = target / 60; // 60 frames for 1 second at 60fps
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    setupPortfolioHover(item) {
        const image = item.querySelector('.portfolio-image');
        const content = item.querySelector('.portfolio-content');
        
        item.addEventListener('mouseenter', () => {
            if (image) {
                image.style.transform = 'scale(1.05)';
                image.style.filter = 'brightness(1.1) saturate(1.2)';
            }
            
            // Subtle content shift
            if (content) {
                content.style.transform = 'translateX(10px)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (image) {
                image.style.transform = 'scale(1)';
                image.style.filter = 'brightness(1) saturate(1)';
            }
            
            if (content) {
                content.style.transform = 'translateX(0)';
            }
        });
    }

    setupInteractions() {
        // Enhanced timeline interactions
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                const marker = item.querySelector('.marker-date');
                const content = item.querySelector('.timeline-content');
                
                if (marker) {
                    marker.style.transform = 'scale(1.1) rotate(5deg)';
                    marker.style.boxShadow = '0 0 40px rgba(255, 107, 107, 0.6)';
                }
                
                if (content) {
                    content.style.background = 'rgba(255, 255, 255, 0.1)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const marker = item.querySelector('.marker-date');
                const content = item.querySelector('.timeline-content');
                
                if (marker) {
                    marker.style.transform = 'scale(1) rotate(0deg)';
                    marker.style.boxShadow = '';
                }
                
                if (content) {
                    content.style.background = 'rgba(255, 255, 255, 0.05)';
                }
            });
        });

        // Contact visual interactions
        const compositionElements = document.querySelectorAll('.composition-element');
        compositionElements.forEach((element, index) => {
            element.addEventListener('mouseenter', () => {
                element.style.transform += ' scale(1.1)';
                element.style.zIndex = '10';
                
                // Dim other elements
                compositionElements.forEach((other, otherIndex) => {
                    if (otherIndex !== index) {
                        other.style.opacity = '0.6';
                    }
                });
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = element.style.transform.replace(' scale(1.1)', '');
                element.style.zIndex = '1';
                
                compositionElements.forEach(other => {
                    other.style.opacity = '1';
                });
            });
        });

        // Add magnetic effect to contact links
        document.querySelectorAll('.contact-link').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(8px)';
                this.style.letterSpacing = '0.02em';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
                this.style.letterSpacing = '0';
            });
        });
    }

    setupParallax() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Parallax for background elements
            const bgTexture = document.querySelector('.bg-texture');
            if (bgTexture) {
                bgTexture.style.transform = `translate3d(0, ${rate}px, 0)`;
            }

            // Parallax for composition elements
            document.querySelectorAll('.composition-element').forEach((element, index) => {
                const speed = 0.2 + (index * 0.1);
                const yPos = scrolled * speed;
                element.style.transform += ` translateY(${yPos}px)`;
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // Text reveal animation for hero
    setupTextReveal() {
        const titleElements = document.querySelectorAll('.hero-title span');
        
        titleElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 300 + 1000);
        });
    }

    // Portfolio item click interactions
    setupPortfolioClicks() {
        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.addEventListener('click', () => {
                // Could expand to show detailed project view
                this.expandPortfolioItem(item);
            });
        });
    }

    expandPortfolioItem(item) {
        // Add a subtle pulse effect on click
        item.style.animation = 'pulse-click 0.4s ease-out';
        
        setTimeout(() => {
            item.style.animation = '';
        }, 400);
    }

    // Smooth scrolling utility
    scrollToElement(targetId, offset = 100) {
        const target = document.querySelector(targetId);
        if (target) {
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Resize handler
    handleResize() {
        // Recalculate animations on resize
        if (window.innerWidth <= 768) {
            this.setupMobileAnimations();
        } else {
            this.setupDesktopAnimations();
        }
    }

    setupMobileAnimations() {
        // Simplified animations for mobile
        document.querySelectorAll('.composition-element').forEach(element => {
            element.style.transform = 'none';
        });
    }

    setupDesktopAnimations() {
        // Full animations for desktop
        this.setupParallax();
    }
}

// Additional CSS animations via JavaScript
const injectAnimationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse-editorial {
            0% { transform: scale(1); }
            50% { transform: scale(1.08); }
            100% { transform: scale(1); }
        }
        
        @keyframes pulse-click {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        @keyframes text-glow {
            0%, 100% { text-shadow: none; }
            50% { text-shadow: 0 0 20px rgba(255, 107, 107, 0.5); }
        }

        /* Mobile Menu Styles */
        @media (max-width: 768px) {
            .nav-list.active {
                display: flex;
                position: fixed;
                top: 100px;
                left: 0;
                width: 100%;
                height: calc(100vh - 100px);
                background: var(--soft-black);
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 40px;
                z-index: 999;
            }
            
            .nav-list.active .nav-item {
                color: var(--warm-white);
                font-size: 1.5rem;
                font-weight: 300;
            }
            
            .nav-list.active .nav-item:hover {
                color: var(--coral-red);
            }
            
            .nav-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(6px, 6px);
            }
            
            .nav-toggle.active span:nth-child(2) {
                transform: rotate(-45deg) translate(6px, -6px);
            }
            
            body.menu-open {
                overflow: hidden;
            }
        }

        /* Advanced hover states */
        .portfolio-item:hover .overlay-text {
            transform: scale(1.1);
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
        }
        
        .timeline-content:hover {
            transform: translateX(20px) !important;
        }
        
        /* Subtle animation delays */
        .fade-in:nth-child(1) { transition-delay: 0.1s; }
        .fade-in:nth-child(2) { transition-delay: 0.2s; }
        .fade-in:nth-child(3) { transition-delay: 0.3s; }
        .fade-in:nth-child(4) { transition-delay: 0.4s; }
        .fade-in:nth-child(5) { transition-delay: 0.5s; }
    `;
    
    document.head.appendChild(style);
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    injectAnimationStyles();
    const portfolio = new EditorialPortfolio();
    
    // Setup text reveal after loading
    setTimeout(() => {
        portfolio.setupTextReveal();
    }, 4000);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        portfolio.handleResize();
    });
    
    // Add some extra editorial flair
    const addEditorialEffects = () => {
        // Add hover effect to section numbers
        document.querySelectorAll('.section-number').forEach(number => {
            number.addEventListener('mouseenter', () => {
                number.style.color = 'var(--coral-red)';
                number.style.transform = 'scale(1.05)';
            });
            
            number.addEventListener('mouseleave', () => {
                number.style.color = 'var(--sage-green)';
                number.style.transform = 'scale(1)';
            });
        });

        // Add typewriter effect to hero tagline
        const heroTagline = document.querySelector('.hero-tagline');
        if (heroTagline) {
            const text = heroTagline.textContent;
            heroTagline.textContent = '';
            
            setTimeout(() => {
                let index = 0;
                const typeInterval = setInterval(() => {
                    if (index < text.length) {
                        heroTagline.textContent += text.charAt(index);
                        index++;
                    } else {
                        clearInterval(typeInterval);
                    }
                }, 50);
            }, 5000);
        }
    };
    
    setTimeout(addEditorialEffects, 2000);
});

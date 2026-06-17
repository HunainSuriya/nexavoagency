/* ============================================
   NEXAVO AGENCY - MAIN JS (FIXED & CLEANED)
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== LOADER ==========
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hide');
            // Remove loader from DOM after animation
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 600);
        }, 1500);
    }
    
    // ========== NAVBAR SCROLL EFFECT ==========
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Check initial scroll position
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        }
    }
    
    // ========== MOBILE MENU TOGGLE (FIXED) ==========
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = menuToggle.querySelectorAll('span');
            if (menuToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                body.style.overflow = 'hidden';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                body.style.overflow = '';
            }
        });
        
        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                body.style.overflow = '';
            });
        });
    }
    
    // ========== PARTICLES BACKGROUND ==========
    function createParticles() {
        const container = document.getElementById('hero-particles');
        if (!container) return;
        
        const particleCount = window.innerWidth < 768 ? 40 : 80;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = `linear-gradient(135deg, #4F46E5, #A855F7)`;
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = Math.random() * 10 + 5 + 's';
            particle.style.opacity = Math.random() * 0.4;
            particle.style.pointerEvents = 'none';
            
            const styleSheet = document.createElement("style");
            styleSheet.textContent = `
                @keyframes floatParticle${i} {
                    0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
                    25% { transform: translateY(-80px) translateX(40px); opacity: 0.5; }
                    50% { transform: translateY(-150px) translateX(-30px); opacity: 0.3; }
                    75% { transform: translateY(-80px) translateX(-60px); opacity: 0.6; }
                }
            `;
            document.head.appendChild(styleSheet);
            particle.style.animation = `floatParticle${i} ${Math.random() * 10 + 8}s ease infinite`;
            
            container.appendChild(particle);
        }
    }
    
    createParticles();
    
    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========== ACTIVE NAVIGATION LINK ==========
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinksAll = document.querySelectorAll('.nav-link');
        
        // Remove active from all
        navLinksAll.forEach(link => link.classList.remove('active'));
        
        navLinksAll.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            // Check if current page matches the link
            if (currentPath.endsWith(linkPath) || 
                (currentPath === '/' && linkPath === 'index.html') ||
                (currentPath.endsWith('/') && linkPath === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveNavLink();
    
    // ========== SCROLL REVEAL OBSERVER ==========
    const revealElements = document.querySelectorAll('.service-card, .partner-card, .stat, .value-card, .step, .team-card');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            revealObserver.observe(el);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        revealElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }
    
    // ========== RIPPLE EFFECT FOR BUTTONS ==========
    function createRipple(event, element) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
        ripple.style.pointerEvents = 'none';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = event.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = event.clientY - rect.top - size / 2 + 'px';
        ripple.style.animation = 'rippleEffect 0.6s linear';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add ripple keyframes
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            from {
                transform: scale(0);
                opacity: 1;
            }
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // Attach ripple to buttons
    document.querySelectorAll('.btn-primary, .btn-outline, .btn-glow, .btn-pricing').forEach(btn => {
        btn.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
    
    // ========== iOS VIEWPORT HEIGHT FIX ==========
    function setMobileHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setMobileHeight();
    window.addEventListener('resize', setMobileHeight);
    window.addEventListener('orientationchange', setMobileHeight);
    
    // ========== WHATSAPP BUTTON (Auto-add if not present) ==========
    if (!document.querySelector('.whatsapp-float')) {
        const whatsappDiv = document.createElement('div');
        whatsappDiv.className = 'whatsapp-float';
        whatsappDiv.innerHTML = `
            <a href="https://wa.me/923253001794?text=Hello%20Nexavo%20Agency%2C%20I%20would%20like%20to%20discuss%20a%20project" 
               target="_blank" 
               rel="noopener noreferrer"
               aria-label="Chat on WhatsApp">
                <i class="fab fa-whatsapp"></i>
            </a>
            <span class="whatsapp-tooltip">Chat with us on WhatsApp</span>
        `;
        document.body.appendChild(whatsappDiv);
    }
});

// ========== REMOVE ANY CUSTOM CURSOR ELEMENTS (SAFETY CHECK) ==========
// This runs immediately to ensure no cursor elements remain
(function removeCustomCursor() {
    const cursors = document.querySelectorAll('.custom-cursor, .custom-cursor-follower');
    cursors.forEach(cursor => cursor.remove());
    
    // Also observe for dynamically added cursor elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.classList && 
                    (node.classList.contains('custom-cursor') || 
                     node.classList.contains('custom-cursor-follower'))) {
                    node.remove();
                }
            });
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
})();
menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    
    // Animate hamburger
    const spans = menuToggle.querySelectorAll('span');
    if (menuToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        document.body.style.overflow = 'hidden';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        document.body.style.overflow = '';
    }
});
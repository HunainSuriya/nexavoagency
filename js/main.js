/* ============================================
   NEXAVO AGENCY - MAIN JS WITH ENHANCED CURSOR
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== LOADER ==========
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hide');
        }, 1500);
    }
    
    // ========== ENHANCED CURSOR ANIMATION ==========
    const cursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.custom-cursor-follower');
    
    if (cursor && cursorFollower && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Main cursor follows instantly
            cursor.style.left = mouseX - 6 + 'px';
            cursor.style.top = mouseY - 6 + 'px';
        });
        
        // Smooth follower animation
        function animateFollower() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            
            cursorFollower.style.left = followerX - 22 + 'px';
            cursorFollower.style.top = followerY - 22 + 'px';
            
            requestAnimationFrame(animateFollower);
        }
        animateFollower();
        
        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .service-card, .partner-card, .portfolio-card, .floating-card, .nav-link, .btn-glow, .btn-primary, .btn-outline');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
        
        // Click effect
        document.addEventListener('mousedown', () => {
            cursor.classList.add('click');
            cursorFollower.classList.add('click');
            setTimeout(() => {
                cursor.classList.remove('click');
                cursorFollower.classList.remove('click');
            }, 150);
        });
        
        // Text hover effect
        const textElements = document.querySelectorAll('h1, h2, h3, p, span, .gradient-text');
        textElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('text-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('text-hover');
            });
        });
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
    }
    
    // ========== MOBILE MENU TOGGLE ==========
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            const spans = menuToggle.querySelectorAll('span');
            if (menuToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    
    // ========== PARTICLES BACKGROUND ==========
    function createParticles() {
        const container = document.getElementById('hero-particles');
        if (!container) return;
        
        for (let i = 0; i < 80; i++) {
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
            
            const keyframes = `
                @keyframes floatParticle${i} {
                    0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
                    25% { transform: translateY(-80px) translateX(40px); opacity: 0.5; }
                    50% { transform: translateY(-150px) translateX(-30px); opacity: 0.3; }
                    75% { transform: translateY(-80px) translateX(-60px); opacity: 0.6; }
                }
            `;
            const styleSheet = document.createElement("style");
            styleSheet.textContent = keyframes;
            document.head.appendChild(styleSheet);
            particle.style.animation = `floatParticle${i} ${Math.random() * 10 + 8}s ease infinite`;
            
            container.appendChild(particle);
        }
    }
    
    createParticles();
    
    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ========== PARALLAX EFFECT ==========
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-visual');
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // ========== ACTIVE NAVIGATION LINK ==========
    const currentPath = window.location.pathname;
    const navLinksAll = document.querySelectorAll('.nav-link');
    
    navLinksAll.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        } else if (currentPath === '/' || currentPath === '/index.html') {
            if (linkPath === 'index.html') {
                link.classList.add('active');
            }
        }
    });
    
    // ========== SCROLL REVEAL OBSERVER ==========
    const revealElements = document.querySelectorAll('.service-card, .partner-card, .stat');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        revealObserver.observe(el);
    });
    
    // ========== GLOW EFFECT ON SCROLL ==========
    const glowElements = document.querySelectorAll('.gradient-text');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        glowElements.forEach(el => {
            const intensity = Math.min(scrollPosition / 500, 1);
            el.style.textShadow = `0 0 ${5 + intensity * 15}px rgba(79, 70, 229, ${0.3 + intensity * 0.5})`;
        });
    });
});

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
    ripple.style.animation = 'ripple 0.6s linear';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
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
document.head.appendChild(style);

document.querySelectorAll('.btn-primary, .btn-outline, .btn-glow').forEach(btn => {
    btn.addEventListener('click', (e) => {
        createRipple(e, btn);
    });
});
// ========== WHATSAPP BUTTON (Auto-add to all pages) ==========
function addWhatsAppButton() {
    // Check if button already exists
    if (document.querySelector('.whatsapp-float')) return;
    
    // Create WhatsApp button element
    const whatsappDiv = document.createElement('div');
    whatsappDiv.className = 'whatsapp-float';
    whatsappDiv.innerHTML = `
        <a href="https://wa.me/923253001794?text=Hello%20Nexavo%20Agency%2C%20I%20would%20like%20to%20discuss%20a%20project" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-whatsapp"></i>
        </a>
        <span class="whatsapp-tooltip">Chat with us on WhatsApp</span>
    `;
    document.body.appendChild(whatsappDiv);
}

// Add WhatsApp button when DOM is ready
document.addEventListener('DOMContentLoaded', addWhatsAppButton);
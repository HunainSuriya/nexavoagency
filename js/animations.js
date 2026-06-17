/* ============================================
   NEXAVO AGENCY - ADVANCED ANIMATIONS
   Scroll triggers, hover effects, timeline animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== STAGGER CHILDREN ANIMATION ==========
    const staggerElements = document.querySelectorAll('.stagger-children');
    
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    
    staggerElements.forEach(el => staggerObserver.observe(el));
    
    // ========== COUNTER ANIMATION ==========
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.innerText);
                let current = 0;
                const increment = target / 50;
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.innerText = Math.ceil(current) + (counter.innerText.includes('+') ? '+' : '');
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.innerText = target + (counter.innerText.includes('+') ? '+' : '');
                    }
                };
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    // ========== HOVER PARALLAX FOR CARDS ==========
    const cards = document.querySelectorAll('.service-card, .partner-card, .portfolio-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // ========== TEXT REVEAL ON SCROLL ==========
    const textReveals = document.querySelectorAll('.hero-title, .section-title');
    
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target;
                text.style.animation = 'textReveal 1s ease forwards';
                textObserver.unobserve(text);
            }
        });
    }, { threshold: 0.3 });
    
    textReveals.forEach(text => textObserver.observe(text));
    
    // ========== GRADIENT BORDER FOLLOW MOUSE ==========
    const gradientCards = document.querySelectorAll('.gradient-border');
    
    gradientCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        });
    });
    
    // ========== TYPING EFFECT ==========
    function typeEffect(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Apply typing effect to elements with class 'typewriter'
    const typeElements = document.querySelectorAll('.typewriter');
    typeElements.forEach(el => {
        const text = el.getAttribute('data-text') || el.innerText;
        typeEffect(el, text, 80);
    });
    
    // ========== SCROLL PROGRESS BAR ==========
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary), var(--accent));
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
    
    // ========== MAGNETIC BUTTON EFFECT ==========
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-outline, .btn-glow');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
    
    // ========== GLOW TEXT ON HOVER ==========
    const glowTexts = document.querySelectorAll('.gradient-text');
    
    glowTexts.forEach(text => {
        text.addEventListener('mouseenter', () => {
            text.style.filter = 'drop-shadow(0 0 10px var(--primary))';
        });
        
        text.addEventListener('mouseleave', () => {
            text.style.filter = 'none';
        });
    });
    
    // ========== BACKGROUND VIDEO / CANVAS EFFECT ==========
    const heroBg = document.querySelector('.hero-bg-animation');
    if (heroBg) {
        let hue = 0;
        setInterval(() => {
            hue = (hue + 1) % 360;
            heroBg.style.background = `radial-gradient(circle at 50% 50%, hsla(${hue}, 80%, 60%, 0.15) 0%, transparent 70%)`;
        }, 100);
    }
    
    // ========== SMOOTH ENTRY FOR PORTFOLIO ITEMS ==========
    const portfolioItems = document.querySelectorAll('.portfolio-card');
    
    const portfolioObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                portfolioObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    portfolioItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        portfolioObserver.observe(item);
    });
});
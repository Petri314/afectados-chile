/* ============================================
   AFECTADOS CHILE - SCRIPTS v5
   Rediseño campaña · stagger real · tema en <html>
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── NAVBAR SCROLL ───
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // ─── MOBILE MENU ───
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // ─── ACTIVE NAV LINK ───
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const { offsetTop, offsetHeight, id } = section;
            if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { passive: true });

    // ─── SCROLL TO TOP ───
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ─── DARK MODE (clase en <html>: el CSS usa :root.dark) ───
    const themeToggle = document.getElementById('themeToggle');
    if (localStorage.getItem('afectados-theme') === 'dark') {
        document.documentElement.classList.add('dark');
    }
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('afectados-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });

    // ─── COUNTER ANIMATION ───
    const animateCounters = () => {
        document.querySelectorAll('.counter-num').forEach(counter => {
            if (counter.dataset.animated) return;
            const text = counter.textContent;
            const match = text.match(/(\d+)/);
            if (!match) return;
            const target = parseInt(match[1]);
            const suffix = text.replace(match[1], '');
            const duration = 1500;
            const start = performance.now();
            counter.dataset.animated = 'true';

            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        });
    };

    // ─── SEARCH ENLACES ───
    const searchInput = document.getElementById('searchEnlaces');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            document.querySelectorAll('.enlace-group').forEach(group => {
                const items = group.querySelectorAll('.enlace-item');
                let visibleCount = 0;
                items.forEach(item => {
                    const name = item.querySelector('.enlace-name').textContent.toLowerCase();
                    const url = item.querySelector('.enlace-url').textContent.toLowerCase();
                    const match = !query || name.includes(query) || url.includes(query);
                    item.classList.toggle('hidden', !match);
                    if (match) visibleCount++;
                });
                group.classList.toggle('hidden', visibleCount === 0);
            });
        });
    }

    // ─── SMOOTH SCROLL ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 84, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // ANIMACIONES DE SCROLL MEJORADAS
    // ============================================

    // --- Configuración de animaciones por sección ---
    const scrollAnimations = [
        // Hero: texto entra desde la izquierda, imagen desde la derecha
        {
            selector: '.hero-content',
            animation: 'slideFromLeft',
            delay: 0
        },
        {
            selector: '.hero-image',
            animation: 'slideFromRight',
            delay: 200
        },
        // Contadores: entran desde abajo con escala
        {
            selector: '.counters .container > div',
            animation: 'scaleUp',
            stagger: 100,
            delay: 0
        },
        // About: columnas entran desde lados opuestos
        {
            selector: '.about-grid > div:first-child',
            animation: 'slideFromLeft',
            delay: 0
        },
        {
            selector: '.about-grid > div:last-child',
            animation: 'slideFromRight',
            delay: 150
        },
        // Causas cards: entran con stagger
        {
            selector: '.causa-card',
            animation: 'fadeUp',
            stagger: 80,
            delay: 0
        },
        // CTA: zoom suave
        {
            selector: '.cta-content',
            animation: 'zoomIn',
            delay: 0
        },
        // Enlace groups
        {
            selector: '.enlace-group',
            animation: 'fadeUp',
            stagger: 100,
            delay: 0
        },
        // Contacto cards
        {
            selector: '.contacto-card',
            animation: 'fadeUp',
            stagger: 120,
            delay: 0
        },
        // Section headers
        {
            selector: '.section-header',
            animation: 'fadeUp',
            delay: 0
        },
        // Footer
        {
            selector: '.footer-top',
            animation: 'fadeUp',
            delay: 0
        }
    ];

    // --- Aplicar estados iniciales (guardando delay y stagger reales) ---
    const initialState = {
        slideFromLeft: 'translateX(-60px)',
        slideFromRight: 'translateX(60px)',
        fadeUp: 'translateY(40px)',
        scaleUp: 'translateY(30px) scale(0.95)',
        zoomIn: 'scale(0.9)',
    };

    scrollAnimations.forEach(({ selector, animation, delay = 0, stagger = 0 }) => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '0';
            el.style.transform = initialState[animation];
            el.style.transition = 'none';
            el.dataset.scrollAnim = animation;
            el.dataset.scrollDelay = String(delay);
            el.dataset.scrollStagger = String(stagger);
        });
    });

    // --- Observer para activar animaciones con stagger real por posición DOM ---
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const anim = el.dataset.scrollAnim;
            const baseDelay = parseInt(el.dataset.scrollDelay || 0);
            const stagger = parseInt(el.dataset.scrollStagger || 0);

            let d = baseDelay;
            if (stagger > 0 && el.parentElement) {
                const group = Array.from(el.parentElement.children).filter(
                    c => c.dataset.scrollAnim === anim
                );
                d = baseDelay + group.indexOf(el) * stagger;
            }

            setTimeout(() => {
                el.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
                el.style.opacity = '1';
                el.style.transform = 'none';
            }, d);

            // Limpia la transición inline para no interferir con el parallax posterior
            setTimeout(() => { el.style.transition = ''; }, d + 750);

            animObserver.unobserve(el);

            // Counter animation para .counters
            if (el.closest && el.closest('.counters')) {
                setTimeout(animateCounters, d);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    scrollAnimations.forEach(({ selector }) => {
        document.querySelectorAll(selector).forEach(el => {
            animObserver.observe(el);
        });
    });

    // --- Parallax sutil en hero (sin transición para no arrastrarse) ---
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        let parallaxInit = false;
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < 600) {
                if (!parallaxInit) {
                    parallaxInit = true;
                    heroImage.style.transition = 'none';
                }
                heroImage.style.transform = `translateY(${scrolled * 0.05}px)`;
            }
        }, { passive: true });
    }

    // --- Efecto de hover magnético en las cards ---
    document.querySelectorAll('.causa-card, .contacto-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            card.style.transform = `translateY(-4px) perspective(600px) rotateX(${-y * 0.015}deg) rotateY(${x * 0.015}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
        });
    });

    // --- Barra de progreso de scroll ---
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;
        background: linear-gradient(90deg, var(--primary), var(--accent));
        transition: width 0.1s linear; width: 0%;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = progress + '%';
    }, { passive: true });

});

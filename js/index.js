    'use strict';
  
    const header        = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks      = document.querySelector('.nav-links');

    if (!mobileMenuBtn || !navLinks) {
        console.warn('Nav elements not found – skipping nav init.');
    }

    // ─── Mobile menu ─────────────────────────────────────────────────────────────
    function initMobileMenu() {
        const ICON_OPEN  = '<i class="fas fa-bars"></i>';
        const ICON_CLOSE = '<i class="fas fa-times"></i>';

        mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = isOpen ? ICON_CLOSE : ICON_OPEN;
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        });
    }

    // ─── Smooth-scroll (event delegation – one listener instead of N) ────────────
    function initSmoothScroll() {
        document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        // Close mobile menu if open
        navLinks?.classList.remove('active');
        if (mobileMenuBtn) {
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }

        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        });
    }

    // ─── Sticky header (rAF-throttled) ───────────────────────────────────────────
    function initStickyHeader() {
        if (!header) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
        if (ticking) return;
        requestAnimationFrame(() => {
            header.classList.toggle('active_nav', window.scrollY >= 100);
            ticking = false;
        });
        ticking = true;
        }, { passive: true });
    }

     // ─── FAQ accordion ───────────────────────────────────────────────────────────
    function initFaq() {
        const faqContainer = document.querySelector('.faq') ?? document;

        faqContainer.addEventListener('click', (e) => {
        const question = e.target.closest('.faq-question');
        if (!question) return;
        question.parentElement.classList.toggle('active');
        });
    }
   
     // ─── Background slider ───────────────────────────────────────────────────────
    function initBgSlider() {
        const bgSlides = document.querySelectorAll('.bg-slide');
        if (!bgSlides.length) return;

        let current = 0;
        const INTERVAL_MS = 5000;

        // Use CSS transitions for the visual swap – JS only manages the class.
        const advance = () => {
            bgSlides[current].classList.remove('active');
            current = (current + 1) % bgSlides.length;
            bgSlides[current].classList.add('active');
        };

        // Pause when the tab is hidden to avoid wasted work
        let timer = setInterval(advance, INTERVAL_MS);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(timer);
            } else {
                timer = setInterval(advance, INTERVAL_MS);
            }
        });
    }


      // ─── Boot ────────────────────────────────────────────────────────────────────
    function init() {
        if (mobileMenuBtn && navLinks) initMobileMenu();
        initSmoothScroll();
        initStickyHeader();
        initFaq();
        initBgSlider();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

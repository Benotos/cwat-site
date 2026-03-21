// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================================================
       1. LENIS: STUDIO-GRADE SMOOTH SCROLLING
       ========================================================================== */
    const lenis = new Lenis({
        duration: 1.5, // Buttery smooth and slightly heavy, like moving through water
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
    });

    // Tie Lenis and GSAP ScrollTrigger together
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    /* ==========================================================================
       2. THE WISP: CUSTOM MAGNETIC CURSOR
       ========================================================================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const cursorText = document.querySelector('.cursor-text');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    // Track Mouse
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant snap for the tiny center dot
        gsap.set(cursorDot, { x: mouseX, y: mouseY });
    });

    // Smooth trailing animation for the outline
    gsap.ticker.add(() => {
        outlineX += (mouseX - outlineX) * 0.15; // The ease factor
        outlineY += (mouseY - outlineY) * 0.15;
        gsap.set(cursorOutline, { x: outlineX, y: outlineY });
    });

    // Magnetic Links & Custom States
    const interactiveElements = document.querySelectorAll('a, button, .magnetic-link, [data-cursor]');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            const cursorMode = el.getAttribute('data-cursor');
            
            if (cursorMode === '-hidden') {
                gsap.to([cursorDot, cursorOutline], { opacity: 0, duration: 0.2 });
            } else if (cursorMode === '-text') {
                const text = el.getAttribute('data-cursor-text') || 'Explore';
                cursorText.innerText = text;
                cursorOutline.classList.add('hover-text');
                gsap.to(cursorDot, { opacity: 0, duration: 0.2 });
            } else {
                cursorOutline.classList.add('hover-pointer');
            }
        });

        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hover-pointer', 'hover-text');
            cursorText.innerText = '';
            gsap.to([cursorDot, cursorOutline], { opacity: 1, duration: 0.2 });
            
            // Reset Magnetic Transform
            if(el.classList.contains('magnetic-link')) {
                gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            }
        });

        // Magnetic Physics Calculation
        if(el.classList.contains('magnetic-link')) {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const relX = e.clientX - rect.left;
                const relY = e.clientY - rect.top;
                
                // Calculate pull based on center of element
                const moveX = (relX - rect.width / 2) * 0.3; // 0.3 is magnetic strength
                const moveY = (relY - rect.height / 2) * 0.3;
                
                gsap.to(el, { x: moveX, y: moveY, duration: 0.2, ease: "power2.out" });
            });
        }
    });

    /* ==========================================================================
       3. THE AWAKENING: PREMIUM BOOT SEQUENCE
       ========================================================================== */
    const progressText = document.querySelector('.loader-percentage');
    const progressBar = document.querySelector('.loader-progress-bar');
    const loadingPhrase = document.getElementById('loading-phrase');
    const loaderWrapper = document.querySelector('.loader-wrapper');

    // Only run if the loader is actually on the page
    if (loaderWrapper && progressText && progressBar && loadingPhrase) {
        const phrases = [
            "> Traversing the Solana woods...",
            "> Gathering spirit energy...",
            "> Locking liquidity pool...",
            "> Revoking mint authority...",
            "> Summoning the anomaly..."
        ];

        let progress = 0;
        let phraseIndex = 0;

        const loaderInterval = setInterval(() => {
            // Random jump between 1 and 4 for an organic loading feel
            progress += Math.floor(Math.random() * 4) + 1; 
            
            if (progress > 20 && phraseIndex === 0) { phraseIndex++; loadingPhrase.innerText = phrases[phraseIndex]; }
            if (progress > 40 && phraseIndex === 1) { phraseIndex++; loadingPhrase.innerText = phrases[phraseIndex]; }
            if (progress > 60 && phraseIndex === 2) { phraseIndex++; loadingPhrase.innerText = phrases[phraseIndex]; }
            if (progress > 80 && phraseIndex === 3) { phraseIndex++; loadingPhrase.innerText = phrases[phraseIndex]; }
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(loaderInterval);
                loadingPhrase.innerText = "> Connection Established.";
                loadingPhrase.style.color = "var(--spirit-blue)";
                
                // Wait briefly at 100% then trigger the animation
                setTimeout(triggerIntroSequence, 800); 
            }
            
            progressText.innerText = String(progress).padStart(3, '0') + '%';
            gsap.to(progressBar, { width: progress + '%', duration: 0.2 });
        }, 80); // Fast but cinematic speed
    } else {
        // Failsafe if anything is missing
        document.body.classList.remove('loading');
        triggerIntroSequence();
    }

    function triggerIntroSequence() {
        const tl = gsap.timeline({ onComplete: () => document.body.classList.remove('loading') });

        // Animate the loader away elegantly (slide up and fade)
        tl.to('.loader-wrapper', { 
            yPercent: -100,
            opacity: 0, 
            duration: 1.2, 
            ease: "power4.inOut" 
        })
        // Fade in the hero section parts
        .from('.bg-forest', { scale: 1.15, filter: "blur(10px)", duration: 2, ease: "power2.out" }, "-=0.8")
        .from('.hero-cat', { y: 150, opacity: 0, duration: 1.5, ease: "back.out(1.5)" }, "-=1.5");

        const splitTarget = document.querySelector('.split-text');
        if (splitTarget) {
            const heroTitle = new SplitType('.split-text', { types: 'chars' });
            tl.from(heroTitle.chars, { y: 50, opacity: 0, stagger: 0.02, duration: 1, ease: "power4.out" }, "-=1.2");
        }

        tl.from('.ca-wrapper', { y: 30, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.8");

        initScrollAnimations();
    }

    /* ==========================================================================
       4. THE 2.5D PARALLAX ENGINE
       ========================================================================== */
    function initScrollAnimations() {
        
        // 1. Dynamic Parallax Layers (Reads data-speed from HTML)
        const parallaxElements = document.querySelectorAll('[data-speed]');
        
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed'));
            // Calculate movement: speed < 1 moves slower (background), speed > 1 moves faster (foreground)
            const yMovement = (1 - speed) * 150; 
            
            gsap.to(el, {
                yPercent: yMovement,
                ease: "none",
                scrollTrigger: {
                    trigger: el.closest('section') || el,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // 2. Navbar Frosted Glass Effect
        ScrollTrigger.create({
            start: "top -50",
            end: 99999,
            toggleClass: { className: 'scrolled', targets: '.site-header' }
        });

        // 3. Reveal Text on Scroll (Lore Section)
        const revealTypes = document.querySelectorAll('.reveal-type');
        revealTypes.forEach(text => {
            const split = new SplitType(text, { types: 'words' });
            gsap.from(split.words, {
                opacity: 0.2,
                stagger: 0.05,
                scrollTrigger: {
                    trigger: text,
                    start: "top 80%",
                    end: "top 20%",
                    scrub: true
                }
            });
        });

        // 4. Bento Box Grid Stagger Reveal
        gsap.from('.bento-box', {
            y: 100,
            opacity: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.section-ecosystem',
                start: "top 70%",
            }
        });
    }

});

// Global Function: Copy CA
function copyCA() {
    const caText = "CWAT_MAGIC_SOLANA_ADDRESS_COMING_SOON";
    navigator.clipboard.writeText(caText).then(() => {
        const copyBtn = document.querySelector('.copy-icon');
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "COPIED!";
        copyBtn.style.color = "var(--spirit-blue)";
        
        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.style.color = "inherit";
        }, 2000);
    });
}
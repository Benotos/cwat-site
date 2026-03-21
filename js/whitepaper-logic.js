document.addEventListener("DOMContentLoaded", () => {
    // 1. Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    /* ==========================================================================
       1. THE READING PROGRESS BAR
       ========================================================================== */
    const progressBar = document.getElementById('reading-bar');
    
    if (progressBar) {
        // As the user scrolls down the body, the bar fills up from 0% to 100%
        gsap.to(progressBar, {
            width: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.2 // A slight delay makes it feel buttery smooth
            }
        });
    }

    /* ==========================================================================
       2. SCROLL-SPY (Table of Contents Auto-Highlighter)
       ========================================================================== */
    const sections = gsap.utils.toArray('.scroll-spy-target');
    const tocLinks = gsap.utils.toArray('.toc-link');

    if (sections.length > 0 && tocLinks.length > 0) {
        sections.forEach((section, index) => {
            ScrollTrigger.create({
                trigger: section,
                // Triggers when the top of the section reaches 40% down the screen
                start: "top 40%", 
                end: "bottom 40%",
                onToggle: (self) => {
                    if (self.isActive) {
                        // 1. Remove the 'active' class from all links in the sidebar
                        tocLinks.forEach(link => link.classList.remove('active'));
                        // 2. Add the 'active' class only to the link we are currently reading
                        tocLinks[index].classList.add('active');
                    }
                }
            });
        });

        /* ==========================================================================
           3. SMOOTH SCROLLING FOR SIDEBAR CLICKS
           ========================================================================== */
        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Stop the jarring instant jump
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Smoothly glide down to the section, offset slightly for the sticky header
                    const offsetTop = targetSection.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
});
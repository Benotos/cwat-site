document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const pinSection = document.querySelector('.horizontal-scroll-section');
    const slider = document.querySelector('#horizontal-slider');
    const panels = gsap.utils.toArray('.journey-panel');
    const progressBar = document.querySelector('.timeline-progress-bar');

    if (pinSection && slider && panels.length > 0) {
        
        // MatchMedia ensures this ONLY runs on screens wider than 768px (Desktop/Tablet)
        let mm = gsap.matchMedia();

        mm.add("(min-width: 769px)", () => {
            
            function getScrollAmount() {
                let sliderWidth = slider.scrollWidth;
                return -(sliderWidth - window.innerWidth);
            }

            const tween = gsap.to(slider, {
                x: getScrollAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: pinSection,
                    pin: true,
                    start: "top top",
                    end: () => `+=${getScrollAmount() * -1}`,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        gsap.to(progressBar, { width: `${self.progress * 100}%`, duration: 0.1, ease: "none" });
                    }
                }
            });

            panels.forEach((panel) => {
                const content = panel.querySelector('.panel-content');
                const art = panel.querySelector('.panel-art');
                
                if (content) {
                    gsap.from(content, {
                        x: 150, opacity: 0, ease: "power2.out",
                        scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left center", toggleActions: "play none none reverse" }
                    });
                }
                if (art) {
                    gsap.to(art, {
                        x: -100, ease: "none",
                        scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "right left", scrub: true }
                    });
                }
            });
        });

        // Optional: Mobile progress bar logic (vertical scroll)
        mm.add("(max-width: 768px)", () => {
            gsap.to(progressBar, {
                width: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: pinSection,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true
                }
            });
        });
    }
});
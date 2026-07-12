document.addEventListener('DOMContentLoaded', () => {
    const els = Array.from(document.querySelectorAll('[data-anim]'));

    // Options
    const root = null;
    const rootMargin = '0px 0px -10% 0px'; // trigger a bit before fully inside
    const threshold = 0.15; // when 15% of element visible

    // Set to true if you want the animation to run only once
    const runOnce = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;

            if (entry.isIntersecting) {
                // add class to start animation
                // to reliably restart an animation that was removed before,
                // force reflow then add class (not strictly necessary here because we remove when not intersecting)
                el.classList.add('in-view');

                if (runOnce) {
                    observer.unobserve(el); // stop observing if only once
                }
            } else {
                // remove so animation can run again next time it enters viewport
                // comment this out if you want it to animate only the first time
                el.classList.remove('in-view');
            }
        });
    }, { root, rootMargin, threshold });

    // Observe each animated element
    els.forEach(el => observer.observe(el));
});
let scrollObserver;

function observeAnimatedEls() {
  if (!scrollObserver) {
    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
  }
  document.querySelectorAll('[data-anim]').forEach(el => scrollObserver.observe(el));
}
window.observeAnimatedEls = observeAnimatedEls;

document.addEventListener('DOMContentLoaded', observeAnimatedEls);

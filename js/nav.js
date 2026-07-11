document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });

  const mobileMenu = document.querySelector('[data-mobile-menu]');
  document.querySelector('[data-mobile-open]')?.addEventListener('click', () => {
    mobileMenu?.setAttribute('data-open', 'true');
    document.body.style.overflow = 'hidden';
  });
  function closeMobile() {
    mobileMenu?.setAttribute('data-open', 'false');
    document.body.style.overflow = '';
  }
  document.querySelector('[data-mobile-close]')?.addEventListener('click', closeMobile);
  document.querySelector('[data-mobile-overlay]')?.addEventListener('click', closeMobile);
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));

  const newsletterForm = document.querySelector('[data-newsletter-form]');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input[type="email"]');
    const msg = newsletterForm.querySelector('[data-newsletter-msg]');
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    if (!isValid) {
      msg.textContent = 'Enter a valid email address.';
      return;
    }
    msg.textContent = `You're on the list, ${input.value.trim()}!`;
    newsletterForm.reset();
  });
});

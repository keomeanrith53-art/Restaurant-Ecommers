document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('[data-auth-modal]');
  if (!modal) return;

  const tabs = modal.querySelectorAll('.auth-tab');
  const panels = modal.querySelectorAll('.auth-panel');

  function openAuth(tab = 'signin') {
    modal.setAttribute('data-open', 'true');
    document.body.style.overflow = 'hidden';
    switchTab(tab);
  }
  function closeAuth() {
    modal.setAttribute('data-open', 'false');
    document.body.style.overflow = '';
  }
  function switchTab(name) {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.tab === name)));
    panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === name));
  }

  document.querySelectorAll('[data-auth-open]').forEach(btn => {
    btn.addEventListener('click', () => openAuth(btn.dataset.authOpen));
  });
  modal.querySelector('[data-auth-close]')?.addEventListener('click', closeAuth);
  modal.querySelector('[data-auth-overlay]')?.addEventListener('click', closeAuth);
  tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
  modal.querySelectorAll('[data-switch-to]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.switchTo));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAuth();
  });

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function attachValidation(form, { needsName }) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      if (needsName) {
        const nameField = form.querySelector('[name="name"]');
        const nameErr = nameField.closest('.field').querySelector('.field-error');
        if (nameField.value.trim().length < 2) {
          nameErr.textContent = 'Enter your full name.';
          valid = false;
        } else {
          nameErr.textContent = '';
        }
      }

      const emailField = form.querySelector('[name="email"]');
      const emailErr = emailField.closest('.field').querySelector('.field-error');
      if (!validateEmail(emailField.value.trim())) {
        emailErr.textContent = 'Enter a valid email address.';
        valid = false;
      } else {
        emailErr.textContent = '';
      }

      const passField = form.querySelector('[name="password"]');
      const passErr = passField.closest('.field').querySelector('.field-error');
      if (passField.value.length < 6) {
        passErr.textContent = 'Use at least 6 characters.';
        valid = false;
      } else {
        passErr.textContent = '';
      }

      if (!valid) return;

      showToast(needsName ? `Welcome, ${form.querySelector('[name="name"]').value.split(' ')[0]}!` : 'Signed in successfully', 'success');
      form.reset();
      closeAuth();
    });
  }

  const signinForm = modal.querySelector('[data-panel="signin"] form');
  const signupForm = modal.querySelector('[data-panel="signup"] form');
  if (signinForm) attachValidation(signinForm, { needsName: false });
  if (signupForm) attachValidation(signupForm, { needsName: true });
});

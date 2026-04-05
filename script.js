(document.querySelectorAll('a[href^="#"]') || []).forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href !== '#' && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

document.querySelectorAll('.navbar .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const nav = document.getElementById('siteNav');
    if (nav && nav.classList.contains('show')) {
      const collapse = bootstrap.Collapse.getInstance(nav) || new bootstrap.Collapse(nav);
      collapse.hide();
    }
  });
});

// enable Bootstrap tooltips globally
const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));

// intersection observer for reveal animations
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach(el => io.observe(el));
} else {
  // fallback
  revealEls.forEach(el => el.classList.add('show'));
}

// back-to-top button
const scrollTopBtn = document.getElementById('scrolltop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const form = document.getElementById('contact-form');
if (form) {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const statusEl = document.getElementById('form-status');

  const errors = {
    name: document.getElementById('name-error'),
    email: document.getElementById('email-error'),
    subject: document.getElementById('subject-error'),
    message: document.getElementById('message-error'),
  };

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Please enter your full name (at least 2 characters).',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address.',
    subject: (v) => v.trim().length >= 3 || 'Subject should be at least 3 characters.',
    message: (v) => v.trim().length >= 10 || 'Message should be at least 10 characters.',
  };

  function validateField(input, key) {
    const rule = validators[key];
    const result = rule(input.value);
    if (result !== true) {
      errors[key].textContent = result;
      input.setAttribute('aria-invalid', 'true');
      input.classList.add('is-invalid');
      return false;
    } else {
      errors[key].textContent = '';
      input.removeAttribute('aria-invalid');
      input.classList.remove('is-invalid');
      return true;
    }
  }

  nameInput?.addEventListener('input', () => validateField(nameInput, 'name'));
  emailInput?.addEventListener('input', () => validateField(emailInput, 'email'));
  subjectInput?.addEventListener('input', () => validateField(subjectInput, 'subject'));
  messageInput?.addEventListener('input', () => validateField(messageInput, 'message'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const valid = [
      validateField(nameInput, 'name'),
      validateField(emailInput, 'email'),
      validateField(subjectInput, 'subject'),
      validateField(messageInput, 'message'),
    ].every(Boolean);

    if (!valid) {
      statusEl.textContent = 'Please fix the errors above and try again.';
      statusEl.className = 'form-status alert alert-danger mt-3';
      return;
    }

    statusEl.textContent = '✓ Thank you! Your message has been sent successfully.';
    statusEl.className = 'form-status alert alert-success mt-3';
    form.reset();

    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
      }
    });
    Object.values(errors).forEach(errorEl => { if (errorEl) errorEl.textContent = ''; });
  });
}

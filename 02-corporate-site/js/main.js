/* ===== ГК Меридиан — интерактивность ===== */
(function () {
  'use strict';

  /* ---- Мобильное меню ---- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }));

  /* ---- Тень шапки ---- */
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 16);
  }, { passive: true });

  /* ---- Появление при скролле ---- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---- Счётчики ---- */
  const animateCounter = el => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    const dur = 1300;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-counter]').forEach(el => counterIO.observe(el));

  /* ---- Раскрытие карточек услуг ---- */
  document.querySelectorAll('.service-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.service');
      const open = card.classList.toggle('open');
      btn.childNodes[0].textContent = open ? 'Свернуть' : 'Состав работ';
    });
  });

  /* ---- Фильтры проектов ---- */
  const projectFilters = document.getElementById('projectFilters');
  projectFilters.addEventListener('click', e => {
    const btn = e.target.closest('.pfilter');
    if (!btn) return;
    projectFilters.querySelectorAll('.pfilter').forEach(f => f.classList.remove('active'));
    btn.classList.add('active');
    const type = btn.dataset.type;
    document.querySelectorAll('.project').forEach(p => {
      const show = type === 'all' || p.dataset.type === type;
      p.classList.toggle('hide', !show);
      if (show) {
        p.style.animation = 'none';
        void p.offsetWidth;
        p.style.animation = '';
      }
    });
  });

  /* ---- Слайдер бюджета ---- */
  const budget = document.getElementById('fBudget');
  const budgetOut = document.getElementById('budgetOut');
  const fmtBudget = v => v >= 100 ? '100 млн+ ₽' : v + ' млн ₽';
  const paintRange = () => {
    budgetOut.textContent = fmtBudget(+budget.value);
    const pct = ((budget.value - budget.min) / (budget.max - budget.min)) * 100;
    budget.style.setProperty('--fill', pct + '%');
  };
  budget.addEventListener('input', paintRange);
  paintRange();

  /* ---- Маска телефона (лёгкая) ---- */
  const phone = document.getElementById('fPhone');
  phone.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '');
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (d && !d.startsWith('7')) d = '7' + d;
    d = d.slice(0, 11);
    let out = '';
    if (d.length > 0) out = '+7';
    if (d.length > 1) out += ' ' + d.slice(1, 4);
    if (d.length > 4) out += ' ' + d.slice(4, 7);
    if (d.length > 7) out += '-' + d.slice(7, 9);
    if (d.length > 9) out += '-' + d.slice(9, 11);
    phone.value = out;
  });

  /* ---- Валидация формы заявки ---- */
  const form = document.getElementById('requestForm');
  const nameInput = document.getElementById('fName');
  const consent = document.getElementById('fConsent');
  const consentErr = document.getElementById('consentErr');
  const success = document.getElementById('formSuccess');

  const setInvalid = (input, bad) => input.closest('.field').classList.toggle('invalid', bad);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const badName = nameInput.value.trim().length < 2;
    const badPhone = phone.value.replace(/\D/g, '').length !== 11;
    const badConsent = !consent.checked;

    setInvalid(nameInput, badName);
    setInvalid(phone, badPhone);
    consentErr.classList.toggle('show', badConsent);

    if (badName || badPhone || badConsent) return;

    form.querySelectorAll('.field, .consent, .btn-wide, #consentErr').forEach(el => el.style.display = 'none');
    success.hidden = false;
  });

  [nameInput, phone].forEach(i => i.addEventListener('input', () => setInvalid(i, false)));
  consent.addEventListener('change', () => consentErr.classList.remove('show'));
})();

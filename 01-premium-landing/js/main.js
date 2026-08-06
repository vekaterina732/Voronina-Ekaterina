/* ===== Люмен — интерактивность ===== */
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

  /* ---- Тень шапки при скролле ---- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Появление блоков при скролле ---- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---- Анимированные счётчики ---- */
  const animateCounter = el => {
    const target = parseFloat(el.dataset.counter);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = 1400;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
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

  /* ---- Табы продукта ---- */
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(tab.dataset.tab).classList.add('active');
  }));

  /* ---- Слайдер отзывов ---- */
  const slides = document.querySelectorAll('.slide');
  const dotsWrap = document.getElementById('dots');
  let current = 0;
  slides.forEach((_, i) => {
    const dot = document.createElement('i');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('i');
  function goTo(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === current));
    dots.forEach((d, k) => d.classList.toggle('active', k === current));
  }
  document.getElementById('prevSlide').addEventListener('click', () => goTo(current - 1));
  document.getElementById('nextSlide').addEventListener('click', () => goTo(current + 1));
  let auto = setInterval(() => goTo(current + 1), 7000);
  document.getElementById('slider').addEventListener('pointerenter', () => clearInterval(auto));

  /* ---- Отрисовка SVG-графика с пульсирующей точкой ---- */
  const hero = document.querySelector('.hero');
  const linePath = document.getElementById('linePath');
  const lineDot = document.getElementById('lineDot');
  if (linePath) {
    const len = linePath.getTotalLength();
    linePath.style.setProperty('--len', len);
    const end = linePath.getPointAtLength(len);
    lineDot.setAttribute('cx', end.x);
    lineDot.setAttribute('cy', end.y);
    requestAnimationFrame(() => hero.classList.add('drawn'));
    linePath.addEventListener('animationend', () => {
      lineDot.setAttribute('opacity', '1');
      lineDot.classList.add('pulse');
    });
  }

  /* ---- Параллакс дашборда за курсором ---- */
  const heroVisual = document.getElementById('heroVisual');
  const dashMain = heroVisual.querySelector('.dash-main');
  const dashNote = heroVisual.querySelector('.dash-note');
  const fine = window.matchMedia('(pointer: fine)').matches;
  if (fine) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      dashMain.style.transform = `rotate(-1.2deg) translate(${x * 14}px, ${y * 10}px)`;
      dashNote.style.transform = `rotate(1.4deg) translate(${x * -20}px, ${y * -14}px)`;
    });
    hero.addEventListener('mouseleave', () => {
      dashMain.style.transform = '';
      dashNote.style.transform = '';
    });
  }

  /* ---- Переключатель тарифов месяц/год ---- */
  const billingSwitch = document.getElementById('billingSwitch');
  billingSwitch.addEventListener('click', () => {
    const yearly = billingSwitch.classList.toggle('on');
    billingSwitch.setAttribute('aria-checked', yearly);
    document.querySelectorAll('.plan-price .price[data-month]').forEach(el => {
      const target = +(yearly ? el.dataset.year : el.dataset.month);
      const from = parseInt(el.textContent.replace(/\D/g, ''), 10);
      const start = performance.now();
      el.style.opacity = '.3';
      const tick = now => {
        const p = Math.min((now - start) / 350, 1);
        el.textContent = Math.round(from + (target - from) * p).toLocaleString('ru-RU');
        if (p < 1) requestAnimationFrame(tick);
        else el.style.opacity = '1';
      };
      requestAnimationFrame(tick);
    });
  });

  /* ---- Форма демо (валидация на клиенте) ---- */
  const form = document.getElementById('demoForm');
  const email = document.getElementById('demoEmail');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const value = email.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    if (!valid) {
      email.classList.add('error');
      note.textContent = 'Проверьте адрес почты — кажется, в нём опечатка.';
      return;
    }
    email.classList.remove('error');
    note.textContent = 'Спасибо! Мы напишем на ' + value + ' в течение рабочего дня.';
    form.reset();
  });
  email.addEventListener('input', () => email.classList.remove('error'));
})();

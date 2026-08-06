/* ===== Casa Solana — carta interactiva y reservas ===== */
(function () {
  'use strict';

  /* ---------- Datos de la carta ---------- */
  const MENU = {
    tapas: [
      { name: 'Jamón ibérico de bellota', desc: 'Dehesa de Extremadura, corte a cuchillo', price: '18,00 €', tag: 'Clásico' },
      { name: 'Croquetas de la abuela', desc: 'De jamón, cremosas por dentro (4 uds.)', price: '8,50 €' },
      { name: 'Gambas al ajillo', desc: 'Al pil-pil, con guindilla y pan de pueblo', price: '13,50 €', tag: 'Picante' },
      { name: 'Ensaladilla con ventresca', desc: 'Bonito del norte, mayonesa de la casa', price: '9,00 €' },
      { name: 'Pimientos del padrón', desc: 'Unos pican y otros no', price: '7,50 €' },
      { name: 'Pulpo a la brasa', desc: 'Con parmentier ahumada y pimentón de la Vera', price: '16,50 €' },
      { name: 'Tomate del Perelló con atún', desc: 'Aceite de oliva virgen extra y sal escama', price: '10,50 €' },
      { name: 'Esgarraet valenciano', desc: 'Pimiento rojo asado, bacalao y aceitunas', price: '8,00 €' }
    ],
    arroces: [
      { name: 'Paella valenciana', desc: 'Pollo, conejo, garrofó y judía verde. Precio por persona, mín. 2', price: '19,50 €', tag: 'La de siempre' },
      { name: 'Arroz negro', desc: 'Con sepia, chipirones y alioli. Por persona, mín. 2', price: '21,00 €' },
      { name: 'Arroz del senyoret', desc: 'Marisco pelado, sin trabajo para el comensal. Por persona, mín. 2', price: '24,00 €' },
      { name: 'Arroz a banda', desc: 'De pescado de roca, con suquet aparte. Por persona, mín. 2', price: '22,00 €' },
      { name: 'Arroz de verduras de la huerta', desc: 'Lo que traiga el mercado esa mañana. Por persona, mín. 2', price: '16,50 €', tag: 'Vegano' },
      { name: 'Fideuà de Gandía', desc: 'Con caldo de galera y alioli. Por persona, mín. 2', price: '20,00 €' }
    ],
    brasa: [
      { name: 'Entrecot de vaca vieja', desc: 'Maduración 45 días, con pimientos asados (≈400 g)', price: '28,00 €' },
      { name: 'Chuletas de cordero lechal', desc: 'A la leña, con ajo y romero (6 uds.)', price: '22,50 €' },
      { name: 'Lubina salvaje a la espalda', desc: 'Con ajada y patata panadera. Precio según lonja', price: '26,00 €', tag: 'De lonja' },
      { name: 'Secreto ibérico', desc: 'Con salsa de manzana asada y piñones', price: '19,00 €' },
      { name: 'Pularda de corral asada', desc: 'Media pularda, limón y tomillo. Para dos personas', price: '34,00 €' }
    ],
    postres: [
      { name: 'Tiramisú de turrón', desc: 'De Jijona, con café de la casa', price: '7,00 €', tag: 'Famoso' },
      { name: 'Cremaet de la abuela', desc: 'Crema catalana quemada con ron', price: '6,00 €' },
      { name: 'Naranja caramelizada', desc: 'Con helado de turrón y aceite de oliva', price: '6,50 €' },
      { name: 'Flan de huevo con almendra', desc: 'Receta de 1987, sin tocar ni una coma', price: '5,50 €' },
      { name: 'Mistela y fartons', desc: 'Para terminar como manda la tradición', price: '5,00 €' }
    ],
    vinos: [
      { name: 'Utiel-Requena «El Terrerazo»', desc: 'Bobal, crianza 18 meses. Copa 4,50 €', price: '24,00 €' },
      { name: 'Rioja «Viña Albina» Reserva', desc: 'Tempranillo clásico. Copa 4,80 €', price: '26,00 €' },
      { name: 'Ribera del Duero «Cepa Gavilán»', desc: 'Crianza joven y frutal. Copa 4,20 €', price: '23,00 €' },
      { name: 'Albariño «Pazo das Bruxas»', desc: 'Rías Baixas, para los arroces. Copa 4,60 €', price: '25,00 €' },
      { name: 'Cava «Gramona» Imperial', desc: 'Corpinnat, larga crianza', price: '32,00 €' },
      { name: 'Vermut de la casa', desc: 'De grifo, con aceituna y naranja. Solo por copas', price: '3,50 €', tag: 'De grifo' }
    ]
  };

  const menuList = document.getElementById('menuList');
  const tabs = document.getElementById('menuTabs');

  /* Plato del día: rota según el día real de la semana */
  const DAILY = {
    1: 'Arroz negro', 2: 'Pulpo a la brasa', 3: 'Paella valenciana',
    4: 'Fideuà de Gandía', 5: 'Lubina salvaje a la espalda',
    6: 'Entrecot de vaca vieja', 0: 'Arroz del senyoret'
  };
  const todayDish = DAILY[new Date().getDay()];

  function renderMenu(cat) {
    menuList.innerHTML = MENU[cat].map(d => {
      const isDaily = d.name === todayDish;
      const tags = (d.tag ? `<span class="dish-tag">${d.tag}</span>` : '') +
        (isDaily ? '<span class="dish-tag tag-dia">Plato del día</span>' : '');
      return `
      <div class="dish">
        <div class="dish-info">
          <b>${d.name}${tags}</b>
          <span>${d.desc}</span>
        </div>
        <span class="dish-price">${d.price}</span>
      </div>`;
    }).join('');
  }

  tabs.addEventListener('click', e => {
    const btn = e.target.closest('.mtab');
    if (!btn) return;
    tabs.querySelectorAll('.mtab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    renderMenu(btn.dataset.cat);
  });
  renderMenu('tapas');

  /* ---------- Menú móvil ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); burger.classList.remove('open');
    document.body.style.overflow = '';
  }));

  /* ---------- Header al hacer scroll + parallax del hero ---------- */
  const header = document.getElementById('siteHeader');
  const heroBg = document.getElementById('heroBg');
  let ticking = false;
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
    const y = window.scrollY;
    if (y < window.innerHeight) heroBg.style.transform = `translateY(${y * 0.28}px)`;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  /* ---------- Galería: flechas y arrastrar ---------- */
  const galTrack = document.getElementById('galTrack');
  const galStep = 360;
  document.getElementById('galPrev').addEventListener('click', () => galTrack.scrollBy({ left: -galStep, behavior: 'smooth' }));
  document.getElementById('galNext').addEventListener('click', () => galTrack.scrollBy({ left: galStep, behavior: 'smooth' }));

  let galDown = false, galStartX = 0, galStartScroll = 0, galMoved = false;
  galTrack.addEventListener('pointerdown', e => {
    galDown = true; galMoved = false;
    galStartX = e.clientX; galStartScroll = galTrack.scrollLeft;
    galTrack.classList.add('dragging');
  });
  galTrack.addEventListener('pointermove', e => {
    if (!galDown) return;
    const dx = e.clientX - galStartX;
    if (Math.abs(dx) > 4) galMoved = true;
    galTrack.scrollLeft = galStartScroll - dx;
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev =>
    galTrack.addEventListener(ev, () => { galDown = false; galTrack.classList.remove('dragging'); })
  );
  galTrack.addEventListener('click', e => { if (galMoved) e.preventDefault(); }, true);

  /* ---------- Reveal ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Contadores ---------- */
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.counter, start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / 1200, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-counter]').forEach(el => counterIO.observe(el));

  /* ---------- Slider de opiniones ---------- */
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
  setInterval(() => goTo(current + 1), 8000);

  /* ---------- Reserva ---------- */
  const form = document.getElementById('resForm');
  const rName = document.getElementById('rName');
  const rPhone = document.getElementById('rPhone');
  const rDate = document.getElementById('rDate');
  const rTime = document.getElementById('rTime');
  const success = document.getElementById('resSuccess');
  const summary = document.getElementById('resSummary');

  // Fecha mínima: hoy
  const today = new Date().toISOString().split('T')[0];
  rDate.min = today;

  const setInvalid = (input, bad) => input.closest('.field').classList.toggle('invalid', bad);

  /* Stepper de comensales */
  let guests = 2;
  const gCount = document.getElementById('gCount');
  const guestsErr = document.getElementById('guestsErr');
  document.getElementById('gMinus').addEventListener('click', () => {
    guests = Math.max(1, guests - 1);
    gCount.textContent = guests;
    guestsErr.classList.remove('show');
    updateLive();
  });
  document.getElementById('gPlus').addEventListener('click', () => {
    guests = Math.min(12, guests + 1);
    gCount.textContent = guests;
    guestsErr.classList.toggle('show', guests > 8);
    updateLive();
  });

  /* ---------- Resumen en vivo de la reserva ---------- */
  const rZone = document.getElementById('rZone');
  const resLiveText = document.getElementById('resLiveText');
  function updateLive() {
    const parts = [];
    const name = rName.value.trim();
    if (name) parts.push(`<strong>${name}</strong>`);
    if (rDate.value) {
      const d = new Date(rDate.value + 'T00:00:00');
      parts.push(d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }));
    }
    if (rTime.value) parts.push(`a las <strong>${rTime.value}</strong>`);
    parts.push(`${guests} ${guests === 1 ? 'persona' : 'personas'}`);
    if (rZone.value && rZone.value !== 'Sin preferencia') parts.push(rZone.value.toLowerCase());
    resLiveText.innerHTML = (rDate.value && rTime.value)
      ? parts.join(' · ')
      : (parts.length > 1 ? parts.join(' · ') : 'Rellena el formulario y aquí verás el resumen al momento.');
  }
  [rName, rDate, rTime, rZone].forEach(i => i.addEventListener('input', updateLive));
  updateLive();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const badName = rName.value.trim().length < 2;
    const badPhone = rPhone.value.replace(/\D/g, '').length < 9;
    const badTime = !rTime.value;

    // Los lunes cerramos
    const dateObj = rDate.value ? new Date(rDate.value + 'T00:00:00') : null;
    const isMonday = dateObj && dateObj.getDay() === 1;
    const badDate = !rDate.value;
    const dateField = rDate.closest('.field');
    const dateErr = dateField.querySelector('.err');

    setInvalid(rName, badName);
    setInvalid(rPhone, badPhone);
    setInvalid(rTime, badTime);
    setInvalid(rDate, badDate || isMonday);
    dateErr.textContent = badDate ? 'Elige una fecha'
      : isMonday ? 'Los lunes cerramos — elige otro día' : '';
    if (badName || badPhone || badDate || badTime || isMonday) return;

    const dateFmt = dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    const ref = 'CS-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    summary.innerHTML = `<b>${ref}</b> · ${rName.value.trim()}, te esperamos el ${dateFmt} a las ${rTime.value} (${guests} ${guests === 1 ? 'persona' : 'personas'}). Confirmaremos por SMS al ${rPhone.value}.`;
    form.querySelectorAll('.field, .btn-wide, .field-row, .res-live').forEach(el => el.style.display = 'none');
    success.hidden = false;
  });
  [rName, rPhone, rDate, rTime].forEach(i => i.addEventListener('input', () => setInvalid(i, false)));
})();

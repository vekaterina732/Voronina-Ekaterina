/* Northwind Analytics — app logic: hash router, charts, tables, settings. */
'use strict';

/* ============================== helpers ============================== */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const EUR_RATE = 0.92;

const state = {
  route: 'overview',
  settings: { theme: 'light', compact: false, currency: 'USD' },
  cust: { sortKey: 'name', sortDir: 1, status: 'all', query: '', page: 1 },
  orders: { status: 'all' }
};

const SETTINGS_KEY = 'nw-settings';
const PAGE_SIZE = 8;

function fmtMoney(usd) {
  const cur = state.settings.currency;
  const value = cur === 'EUR' ? usd * EUR_RATE : usd;
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: cur, maximumFractionDigits: 0
  }).format(value);
}

const fmtInt = (n) => new Intl.NumberFormat('en-US').format(n);

function fmtDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

function toast(message) {
  const box = $('#toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="toast-dot"></span>${message}`;
  box.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

/* ============================== settings ============================== */

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (saved && typeof saved === 'object') Object.assign(state.settings, saved);
  } catch (_) { /* corrupted storage — keep defaults */ }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function applySettings({ announce = false } = {}) {
  const s = state.settings;
  document.documentElement.classList.toggle('dark', s.theme === 'dark');
  document.body.classList.toggle('compact', s.compact);

  $('#setTheme').classList.toggle('on', s.theme === 'dark');
  $('#setTheme').setAttribute('aria-checked', String(s.theme === 'dark'));
  $('#setCompact').classList.toggle('on', s.compact);
  $('#setCompact').setAttribute('aria-checked', String(s.compact));
  $$('#setCurrency button').forEach(b =>
    b.classList.toggle('active', b.dataset.cur === s.currency));

  /* re-render everything that shows money */
  setKpiValues();
  buildLineChart();
  renderCustomers();
  renderOrders();
}

function changeSetting(patch, message) {
  Object.assign(state.settings, patch);
  saveSettings();
  applySettings();
  if (message) toast(message);
}

function initSettingsUI() {
  $('#themeToggle').addEventListener('click', () => {
    const dark = state.settings.theme !== 'dark';
    changeSetting({ theme: dark ? 'dark' : 'light' }, dark ? 'Dark theme enabled' : 'Light theme enabled');
  });
  $('#setTheme').addEventListener('click', () => {
    const dark = state.settings.theme !== 'dark';
    changeSetting({ theme: dark ? 'dark' : 'light' }, dark ? 'Dark theme enabled' : 'Light theme enabled');
  });
  $('#setCompact').addEventListener('click', () => {
    const on = !state.settings.compact;
    changeSetting({ compact: on }, on ? 'Compact tables enabled' : 'Comfortable tables enabled');
  });
  $$('#setCurrency button').forEach(btn => btn.addEventListener('click', () => {
    if (btn.dataset.cur === state.settings.currency) return;
    changeSetting({ currency: btn.dataset.cur }, `Currency set to ${btn.dataset.cur}`);
  }));
  $('#resetSettings').addEventListener('click', () => {
    localStorage.removeItem(SETTINGS_KEY);
    state.settings = { theme: 'light', compact: false, currency: 'USD' };
    applySettings();
    toast('Settings reset to defaults');
  });
}

/* ============================== router ============================== */

const ROUTES = ['overview', 'customers', 'orders', 'settings'];

function navigate() {
  const hash = location.hash.replace(/^#\//, '');
  if (!ROUTES.includes(hash)) {
    location.replace('#/overview');
    return;
  }
  state.route = hash;

  $$('.side-nav a').forEach(a =>
    a.classList.toggle('active', a.dataset.route === hash));
  $$('.view').forEach(v =>
    v.classList.toggle('active', v.id === `view-${hash}`));

  closeSidebar();
  hideTooltip();
  if (hash === 'overview') animateKpis();
  $('#content').scrollTop = 0;
  window.scrollTo(0, 0);
}

/* ============================== sidebar (mobile) ============================== */

function closeSidebar() {
  $('#sidebar').classList.remove('open');
  $('#sidebarBackdrop').classList.remove('show');
  $('#burger').setAttribute('aria-expanded', 'false');
}

function initSidebar() {
  $('#burger').addEventListener('click', () => {
    const open = $('#sidebar').classList.toggle('open');
    $('#sidebarBackdrop').classList.toggle('show', open);
    $('#burger').setAttribute('aria-expanded', String(open));
  });
  $('#sidebarBackdrop').addEventListener('click', closeSidebar);
}

/* ============================== KPI counters ============================== */

let kpiRun = 0;

function formatKpi(kpi, value) {
  if (kpi.type === 'money') return fmtMoney(value);
  if (kpi.type === 'percent') return value.toFixed(kpi.value % 1 ? 2 : 0) + '%';
  return fmtInt(Math.round(value));
}

function setKpiValues() {
  kpiRun++; /* cancel any running animation */
  $$('.kpi-value').forEach(el => {
    const kpi = NW_DATA.kpis[el.dataset.kpi];
    el.textContent = formatKpi(kpi, kpi.value);
  });
}

function animateKpis() {
  const run = ++kpiRun;
  const duration = 900;
  const start = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  $$('.kpi-value').forEach(el => {
    const kpi = NW_DATA.kpis[el.dataset.kpi];
    const tick = (now) => {
      if (run !== kpiRun) return;
      const t = Math.min(1, (now - start) / duration);
      el.textContent = formatKpi(kpi, kpi.value * ease(t));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ============================== line chart (revenue) ============================== */

const LC = { w: 720, h: 260, padL: 56, padR: 16, padT: 18, padB: 30 };

function lcPoints(data) {
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const lo = Math.floor((min * 0.95) / 500) * 500;
  const hi = Math.ceil((max * 1.05) / 500) * 500;
  const iw = LC.w - LC.padL - LC.padR;
  const ih = LC.h - LC.padT - LC.padB;
  const stepX = iw / (data.length - 1);
  const pts = data.map((d, i) => ({
    x: LC.padL + i * stepX,
    y: LC.padT + ih * (1 - (d.value - lo) / (hi - lo)),
    ...d
  }));
  return { pts, lo, hi, stepX };
}

function buildLineChart() {
  const box = $('#lineChart');
  const { pts, lo, hi, stepX } = lcPoints(NW_DATA.revenue);
  const ns = 'http://www.w3.org/2000/svg';

  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${LC.w} ${LC.h}`);
  svg.setAttribute('class', 'line-svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Line chart of daily revenue for the last 30 days');

  /* gradient for area fill */
  const defs = document.createElementNS(ns, 'defs');
  defs.innerHTML = `<linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#6366f1" stop-opacity=".28"/>
    <stop offset="1" stop-color="#6366f1" stop-opacity="0"/>
  </linearGradient>`;
  svg.appendChild(defs);

  /* horizontal gridlines + y labels */
  const rows = 4;
  for (let i = 0; i <= rows; i++) {
    const v = lo + (hi - lo) * (i / rows);
    const y = LC.padT + (LC.h - LC.padT - LC.padB) * (1 - i / rows);
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', LC.padL); line.setAttribute('x2', LC.w - LC.padR);
    line.setAttribute('y1', y); line.setAttribute('y2', y);
    line.setAttribute('class', 'grid-line');
    svg.appendChild(line);
    const t = document.createElementNS(ns, 'text');
    t.setAttribute('x', LC.padL - 10); t.setAttribute('y', y + 4);
    t.setAttribute('class', 'axis-label y');
    t.textContent = fmtMoney(v).replace(/\.00$/, '');
    svg.appendChild(t);
  }

  /* x labels — every 6th day */
  pts.forEach((p, i) => {
    if (i % 6 !== 0 && i !== pts.length - 1) return;
    const t = document.createElementNS(ns, 'text');
    t.setAttribute('x', p.x); t.setAttribute('y', LC.h - 8);
    t.setAttribute('class', 'axis-label x');
    t.textContent = new Date(p.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    svg.appendChild(t);
  });

  /* area + line */
  const dLine = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = document.createElementNS(ns, 'path');
  area.setAttribute('d', `${dLine} L${pts[pts.length - 1].x},${LC.h - LC.padB} L${pts[0].x},${LC.h - LC.padB} Z`);
  area.setAttribute('fill', 'url(#revGrad)');
  svg.appendChild(area);

  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', dLine);
  path.setAttribute('class', 'rev-line');
  svg.appendChild(path);

  /* hover guide + dot */
  const guide = document.createElementNS(ns, 'line');
  guide.setAttribute('class', 'guide-line');
  guide.setAttribute('y1', LC.padT); guide.setAttribute('y2', LC.h - LC.padB);
  guide.setAttribute('visibility', 'hidden');
  svg.appendChild(guide);

  const dot = document.createElementNS(ns, 'circle');
  dot.setAttribute('r', 5);
  dot.setAttribute('class', 'hover-dot');
  dot.setAttribute('visibility', 'hidden');
  svg.appendChild(dot);

  /* hover capture */
  const hit = document.createElementNS(ns, 'rect');
  hit.setAttribute('x', LC.padL); hit.setAttribute('y', 0);
  hit.setAttribute('width', LC.w - LC.padL - LC.padR);
  hit.setAttribute('height', LC.h);
  hit.setAttribute('fill', 'transparent');
  svg.appendChild(hit);

  hit.addEventListener('mousemove', (e) => {
    const rect = svg.getBoundingClientRect();
    const scaleX = LC.w / rect.width;
    const mx = (e.clientX - rect.left) * scaleX;
    const idx = Math.max(0, Math.min(pts.length - 1, Math.round((mx - LC.padL) / stepX)));
    const p = pts[idx];

    guide.setAttribute('x1', p.x); guide.setAttribute('x2', p.x);
    guide.setAttribute('visibility', 'visible');
    dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
    dot.setAttribute('visibility', 'visible');

    const tip = $('#chartTooltip');
    tip.innerHTML = `<b>${fmtMoney(p.value)}</b><span>${fmtDate(p.date)}</span>`;
    tip.hidden = false;
    const boxRect = box.getBoundingClientRect();
    const px = (rect.left - boxRect.left) + p.x / scaleX;
    const py = (rect.top - boxRect.top) + p.y * (rect.height / LC.h);
    tip.style.left = Math.min(Math.max(px, 60), boxRect.width - 60) + 'px';
    tip.style.top = py + 'px';
  });
  hit.addEventListener('mouseleave', () => {
    guide.setAttribute('visibility', 'hidden');
    dot.setAttribute('visibility', 'hidden');
    hideTooltip();
  });

  box.replaceChildren(svg);
}

function hideTooltip() {
  const tip = $('#chartTooltip');
  if (tip) tip.hidden = true;
  $$('.guide-line, .hover-dot').forEach(el => el.setAttribute('visibility', 'hidden'));
}

/* ============================== bar chart (signups) ============================== */

function buildBarChart() {
  const box = $('#barChart');
  const max = Math.max(...NW_DATA.signups.map(s => s.value));
  box.replaceChildren(...NW_DATA.signups.map(s => {
    const col = document.createElement('div');
    col.className = 'bar-col';
    col.innerHTML = `
      <span class="bar-val">${s.value}</span>
      <div class="bar" style="height:${Math.round((s.value / max) * 100)}%"></div>
      <span class="bar-label">${s.label}</span>`;
    return col;
  }));
}

/* ============================== donut chart (traffic) ============================== */

function buildDonut() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 42 42');
  svg.setAttribute('class', 'donut-svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Donut chart of traffic sources');

  const base = document.createElementNS(ns, 'circle');
  base.setAttribute('cx', 21); base.setAttribute('cy', 21); base.setAttribute('r', 15.9155);
  base.setAttribute('class', 'donut-base');
  svg.appendChild(base);

  let offset = 25; /* start at 12 o'clock */
  NW_DATA.traffic.forEach(t => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', 21); c.setAttribute('cy', 21); c.setAttribute('r', 15.9155);
    c.setAttribute('class', 'donut-seg');
    c.setAttribute('stroke', t.color);
    c.setAttribute('stroke-dasharray', `${t.value} ${100 - t.value}`);
    c.setAttribute('stroke-dashoffset', offset);
    svg.appendChild(c);
    offset -= t.value;
  });

  const label = document.createElementNS(ns, 'text');
  label.setAttribute('x', 21); label.setAttribute('y', 20);
  label.setAttribute('class', 'donut-num');
  label.textContent = '24.8k';
  svg.appendChild(label);
  const sub = document.createElementNS(ns, 'text');
  sub.setAttribute('x', 21); sub.setAttribute('y', 26);
  sub.setAttribute('class', 'donut-sub');
  sub.textContent = 'sessions';
  svg.appendChild(sub);

  $('#donutChart').replaceChildren(svg);

  $('#donutLegend').replaceChildren(...NW_DATA.traffic.map(t => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="dot" style="background:${t.color}"></span>
      <span class="legend-label">${t.label}</span><b>${t.value}%</b>`;
    return li;
  }));
}

/* ============================== customers table ============================== */

const initials = (name) => name.split(' ').map(w => w[0]).slice(0, 2).join('');

function statusBadge(status) {
  return `<span class="badge st-${status}">${status[0].toUpperCase() + status.slice(1)}</span>`;
}

function filteredCustomers() {
  const { status, query, sortKey, sortDir } = state.cust;
  const q = query.trim().toLowerCase();
  let rows = NW_DATA.customers.filter(c =>
    (status === 'all' || c.status === status) &&
    (!q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)));

  rows = [...rows].sort((a, b) => {
    const va = a[sortKey], vb = b[sortKey];
    const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
    return cmp * sortDir;
  });
  return rows;
}

function renderCustomers() {
  const rows = filteredCustomers();
  const totalMrr = NW_DATA.customers.reduce((s, c) => s + c.mrr, 0);
  $('#custSummary').textContent =
    `${NW_DATA.customers.length} companies · ${fmtMoney(totalMrr)} total MRR`;

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  state.cust.page = Math.min(state.cust.page, pages);
  const start = (state.cust.page - 1) * PAGE_SIZE;
  const slice = rows.slice(start, start + PAGE_SIZE);

  const body = $('#custBody');
  if (!slice.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="6">No customers match your filters.</td></tr>`;
  } else {
    body.innerHTML = slice.map(c => `
      <tr>
        <td><div class="cell-person"><span class="avatar sm">${initials(c.name)}</span>${c.name}</div></td>
        <td>${c.company}</td>
        <td><span class="badge plan-${c.plan.toLowerCase()}">${c.plan}</span></td>
        <td class="num">${fmtMoney(c.mrr)}</td>
        <td>${statusBadge(c.status)}</td>
        <td>${fmtDate(c.joined)}</td>
      </tr>`).join('');
  }

  $('#custInfo').textContent = rows.length
    ? `Showing ${start + 1}–${start + slice.length} of ${rows.length} customers`
    : '0 customers';

  /* pager */
  const pager = $('#custPager');
  const mkBtn = (label, page, opts = {}) => {
    const b = document.createElement('button');
    b.className = 'page-btn' + (opts.active ? ' active' : '');
    b.textContent = label;
    b.disabled = !!opts.disabled;
    b.addEventListener('click', () => { state.cust.page = page; renderCustomers(); });
    return b;
  };
  pager.replaceChildren(
    mkBtn('‹', state.cust.page - 1, { disabled: state.cust.page === 1 }),
    ...Array.from({ length: pages }, (_, i) =>
      mkBtn(String(i + 1), i + 1, { active: i + 1 === state.cust.page })),
    mkBtn('›', state.cust.page + 1, { disabled: state.cust.page === pages })
  );

  /* sort indicators */
  $$('#custTable th.sortable').forEach(th => {
    th.classList.remove('asc', 'desc');
    if (th.dataset.sort === state.cust.sortKey)
      th.classList.add(state.cust.sortDir === 1 ? 'asc' : 'desc');
  });
}

function initCustomers() {
  $$('#custTable th.sortable').forEach(th => th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (state.cust.sortKey === key) state.cust.sortDir *= -1;
    else { state.cust.sortKey = key; state.cust.sortDir = 1; }
    renderCustomers();
  }));

  $$('#custChips .chip').forEach(chip => chip.addEventListener('click', () => {
    $$('#custChips .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.cust.status = chip.dataset.status;
    state.cust.page = 1;
    renderCustomers();
  }));

  $('#custSearch').addEventListener('input', (e) => {
    state.cust.query = e.target.value;
    state.cust.page = 1;
    $('#globalSearch').value = e.target.value;
    renderCustomers();
  });
}

/* ============================== orders table ============================== */

function renderOrders() {
  const { status } = state.orders;
  const rows = NW_DATA.orders.filter(o => status === 'all' || o.status === status);

  const body = $('#orderBody');
  if (!rows.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="5">No orders with this status.</td></tr>`;
  } else {
    body.innerHTML = rows.map(o => `
      <tr>
        <td><span class="order-id">${o.id}</span></td>
        <td>${o.customer}</td>
        <td class="num">${fmtMoney(o.amount)}</td>
        <td>${statusBadge(o.status)}</td>
        <td>${fmtDate(o.date)}</td>
      </tr>`).join('');
  }

  const total = rows.reduce((s, o) => s + o.amount, 0);
  $('#orderCount').textContent = `${rows.length} order${rows.length === 1 ? '' : 's'}`;
  $('#orderTotal').textContent = `Total ${fmtMoney(total)}`;
}

function initOrders() {
  $$('#orderChips .chip').forEach(chip => chip.addEventListener('click', () => {
    $$('#orderChips .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.orders.status = chip.dataset.status;
    renderOrders();
  }));
}

/* ============================== global search & keys ============================== */

function initSearch() {
  $('#globalSearch').addEventListener('input', (e) => {
    const v = e.target.value;
    if (state.route !== 'customers') location.hash = '#/customers';
    $('#custSearch').value = v;
    state.cust.query = v;
    state.cust.page = 1;
    renderCustomers();
  });
}

function initKeys() {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    hideTooltip();
    closeSidebar();
  });
}

/* ============================== init ============================== */

loadSettings();
initSettingsUI();
initSidebar();
initCustomers();
initOrders();
initSearch();
initKeys();
applySettings();       /* also renders tables, KPI values and the line chart */
buildBarChart();
buildDonut();
window.addEventListener('hashchange', navigate);
navigate();

/* Northwind Analytics — demo dataset.
   Deterministic pseudo-random generator so the data looks organic
   but stays identical between page loads. */

const NW_DATA = (() => {
  let seed = 20260807;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const int = (min, max) => Math.floor(min + rnd() * (max - min + 1));

  const FIRST = ['Ava','Liam','Sofia','Noah','Mia','Ethan','Isla','Lucas','Amelia','Mason',
    'Harper','Elijah','Evelyn','James','Charlotte','Benjamin','Ella','Henry','Grace','Oliver',
    'Chloe','Daniel','Nora','Owen','Lily','Gabriel','Zoe','Ryan','Hazel','Adam'];
  const LAST = ['Carter','Nguyen','Brooks','Ali','Fischer','Mendez','Okafor','Lindqvist','Moreau','Kim',
    'Petrov','Silva','Hauptmann','Rossi','Kowalski','Tanaka','Dubois','Larsen','Weber','Costa',
    'Novak','Reyes','Bergstrom','Ito','Marsh','Vega','Haddad','Peters','Nilsen','Frost'];
  const COMPANIES = ['Vantage Labs','Brightline','Coreloop','Heliosoft','Dataforge','Nimbus Works',
    'Kite & Anchor','Quantia','Ferrous','Loopwell','Arclight','Modulr','Beacon Hill','Softbriar',
    'Trailmix','North Pier','Cobalt Systems','Plainfield','Orbitline','Hexagonal','Driftmark',
    'Silverthread','Cairn Tech','Flexport Labs','Juniper Ops','Redwood Stack','Lowlight','Fieldset',
    'Operata','Monocle','Windward','Stackline','Pinecone IO','Gatelock','Tidemark','Axiom Grid'];
  const PLANS = [
    { name: 'Starter', min: 29, max: 99 },
    { name: 'Growth', min: 199, max: 499 },
    { name: 'Enterprise', min: 999, max: 2400 }
  ];
  const STATUSES = ['active', 'active', 'active', 'active', 'trial', 'trial', 'churned'];

  const DAY = 86400000;
  const now = new Date('2026-08-06T12:00:00');
  const iso = (d) => d.toISOString().slice(0, 10);

  /* ---- Customers (40) ---- */
  const usedCompanies = [...COMPANIES];
  const customers = [];
  for (let i = 0; i < 40; i++) {
    const plan = PLANS[rnd() < 0.45 ? 0 : rnd() < 0.65 ? 1 : 2];
    const company = usedCompanies.length
      ? usedCompanies.splice(Math.floor(rnd() * usedCompanies.length), 1)[0]
      : pick(COMPANIES);
    customers.push({
      id: i + 1,
      name: `${FIRST[i % FIRST.length]} ${pick(LAST)}`,
      company,
      plan: plan.name,
      mrr: int(plan.min, plan.max),
      status: pick(STATUSES),
      joined: iso(new Date(now - int(20, 540) * DAY))
    });
  }

  /* ---- Orders (24) ---- */
  const ORDER_STATUSES = ['paid', 'paid', 'paid', 'paid', 'paid', 'pending', 'pending', 'refunded'];
  const orders = [];
  for (let i = 0; i < 24; i++) {
    const c = pick(customers);
    orders.push({
      id: `NW-${1042 + i}`,
      customer: c.name,
      amount: Math.max(29, Math.round(c.mrr * (rnd() < 0.25 ? int(2, 6) : 1))),
      status: pick(ORDER_STATUSES),
      date: iso(new Date(now - int(0, 45) * DAY))
    });
  }
  orders.sort((a, b) => b.date.localeCompare(a.date));

  /* ---- Revenue, 30 days (USD) ---- */
  const revenue = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * DAY);
    const trend = 3200 + (29 - i) * 34;
    const weekend = [0, 6].includes(d.getDay()) ? 0.82 : 1;
    const noise = 1 + (rnd() - 0.5) * 0.18;
    revenue.push({ date: iso(d), value: Math.round(trend * weekend * noise) });
  }

  /* ---- Signups, 8 weeks ---- */
  const signups = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now - i * 7 * DAY);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    signups.push({ label, value: int(38, 112) + (7 - i) * 4 });
  }

  /* ---- Traffic sources ---- */
  const traffic = [
    { label: 'Organic search', value: 38, color: '#6366f1' },
    { label: 'Direct', value: 27, color: '#8b5cf6' },
    { label: 'Referral', value: 19, color: '#22d3ee' },
    { label: 'Social', value: 16, color: '#f59e0b' }
  ];

  /* ---- KPI targets ---- */
  const kpis = {
    revenue: { value: 128400, type: 'money' },
    users: { value: 8942, type: 'int' },
    conversion: { value: 3.42, type: 'percent' },
    churn: { value: 1.9, type: 'percent' }
  };

  return { customers, orders, revenue, signups, traffic, kpis };
})();

/* ===== Maison Élise — boutique : catalogue, panier persistant, favoris, quick view ===== */
(function () {
  'use strict';

  /* ---------- Données catalogue ---------- */
  const ICONS = {
    robe: '<svg viewBox="0 0 48 48"><path d="M24 6 C19 6 16 9 16 13 L12 20 C10 30 11 38 14 44 L34 44 C37 38 38 30 36 20 L32 13 C32 9 29 6 24 6 Z"/><path d="M24 6 C22 8 22 11 24 13 C26 11 26 8 24 6"/></svg>',
    veste: '<svg viewBox="0 0 48 48"><path d="M14 10 L24 6 L34 10 L40 16 L36 22 L34 18 L34 44 L14 44 L14 18 L12 22 L8 16 Z"/><path d="M24 6 L24 30"/></svg>',
    pull: '<svg viewBox="0 0 48 48"><path d="M16 8 L24 10 L32 8 L40 14 L36 22 L33 19 L33 44 L15 44 L15 19 L12 22 L8 14 Z"/><path d="M16 8 C16 12 20 14 24 14 C28 14 32 12 32 8"/></svg>',
    jupe: '<svg viewBox="0 0 48 48"><path d="M16 10 L32 10 L38 42 L10 42 Z"/><path d="M16 14 L32 14"/></svg>',
    pantalon: '<svg viewBox="0 0 48 48"><path d="M14 8 L34 8 L36 44 L27 44 L24 22 L21 44 L12 44 Z"/><path d="M14 12 L34 12"/></svg>'
  };
  const HEART_SVG = '<svg viewBox="0 0 24 24"><path d="M12 21 C5 15 2 11 2 7.5 C2 4.5 4.5 2.5 7 2.5 C9 2.5 11 4 12 5.5 C13 4 15 2.5 17 2.5 C19.5 2.5 22 4.5 22 7.5 C22 11 19 15 12 21 Z"/></svg>';

  const PRODUCTS = [
    { id: 1, name: 'Robe Camille', cat: 'robes', catLabel: 'Robes', price: 340, desc: 'Crêpe de soie, coupe biais, édition nº 07', icon: 'robe', badge: 'Nouveau', img: 'img/robe-camille.jpg', sw: 'linear-gradient(135deg,#e8dcc6,#cbb692)', sw2: 'linear-gradient(135deg,#cbb692,#a8916b)' },
    { id: 2, name: 'Veste Apolline', cat: 'vestes', catLabel: 'Vestes', price: 420, desc: 'Laine froide de Biella, doublure en cupro', icon: 'veste', img: 'img/veste-apolline.jpg', sw: 'linear-gradient(135deg,#8a8178,#5d564c)', sw2: 'linear-gradient(135deg,#5d564c,#403a33)' },
    { id: 3, name: 'Pull Héloïse', cat: 'maille', catLabel: 'Maille', price: 185, desc: 'Mérinos extra-fin, maille perlée', icon: 'pull', img: 'img/pull-heloise.jpg', sw: 'linear-gradient(135deg,#d9c7ae,#b89f7d)', sw2: 'linear-gradient(135deg,#b89f7d,#937c55)' },
    { id: 4, name: 'Jupe Sidonie', cat: 'jupes', catLabel: 'Jupes & Pantalons', price: 210, desc: 'Gabardine de laine, plis creux', icon: 'jupe', badge: 'Dernières pièces', img: 'img/jupe-sidonie.jpg', sw: 'linear-gradient(135deg,#a85a3a,#8f3f20)', sw2: 'linear-gradient(135deg,#8f3f20,#6e2f16)' },
    { id: 5, name: 'Robe Garance', cat: 'robes', catLabel: 'Robes', price: 295, desc: 'Lin lavé de Normandie, dos nu croisé', icon: 'robe', img: 'img/robe-garance.jpg', sw: 'linear-gradient(135deg,#b4552d,#93401f)', sw2: 'linear-gradient(135deg,#93401f,#6f2e14)' },
    { id: 6, name: 'Pantalon Victoire', cat: 'jupes', catLabel: 'Jupes & Pantalons', price: 230, desc: 'Toile de laine, coupe droite allongée', icon: 'pantalon', img: 'img/pantalon-victoire.jpg', sw: 'linear-gradient(135deg,#3e3a34,#26221d)', sw2: 'linear-gradient(135deg,#26221d,#141210)' },
    { id: 7, name: 'Cardigan Léonore', cat: 'maille', catLabel: 'Maille', price: 240, desc: 'Cachemire et soie, boutons de corozo', icon: 'pull', img: 'img/cardigan-leonore.jpg', sw: 'linear-gradient(135deg,#c2b49b,#a08b68)', sw2: 'linear-gradient(135deg,#a08b68,#7d6b4c)' },
    { id: 8, name: 'Manteau Séverin', cat: 'vestes', catLabel: 'Vestes', price: 580, desc: 'Drap de laine double face, col châle', icon: 'veste', badge: 'Nouveau', img: 'img/manteau-severin.jpg', sw: 'linear-gradient(135deg,#6e5b41,#4a3d2a)', sw2: 'linear-gradient(135deg,#4a3d2a,#322819)' },
    { id: 9, name: 'Robe Odile', cat: 'robes', catLabel: 'Robes', price: 265, desc: 'Popeline de coton bio, ceinture nouée', icon: 'robe', img: 'img/robe-odile.jpg', sw: 'linear-gradient(135deg,#efe7d8,#d8c9ab)', sw2: 'linear-gradient(135deg,#d8c9ab,#bfa97f)' },
    { id: 10, name: 'Blazer Mathilde', cat: 'vestes', catLabel: 'Vestes', price: 390, desc: 'Flanelle Prince-de-Galles, épaule souple', icon: 'veste', img: 'img/blazer-mathilde.jpg', sw: 'linear-gradient(135deg,#7d7468,#57503f)', sw2: 'linear-gradient(135deg,#57503f,#3d382c)' },
    { id: 11, name: 'Pull Marine', cat: 'maille', catLabel: 'Maille', price: 165, desc: 'Coton bouclé, rayures tricotées', icon: 'pull', img: 'img/pull-marine.jpg', sw: 'linear-gradient(135deg,#7a8a99,#4e5d6c)', sw2: 'linear-gradient(135deg,#4e5d6c,#35434f)' },
    { id: 12, name: 'Jupe Capucine', cat: 'jupes', catLabel: 'Jupes & Pantalons', price: 195, desc: 'Velours côtelé, longueur midi', icon: 'jupe', img: 'img/jupe-capucine.jpg', sw: 'linear-gradient(135deg,#96684e,#6e4a34)', sw2: 'linear-gradient(135deg,#6e4a34,#4d3222)' }
  ];

  const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  const FREE_SHIP = 150;
  const fmt = n => n.toLocaleString('fr-FR') + ' €';

  /* ---------- État (с сохранением в localStorage) ---------- */
  const store = {
    load(key, fallback) {
      try { return JSON.parse(localStorage.getItem('maisonElise.' + key)) || fallback; }
      catch (e) { return fallback; }
    },
    save(key, val) {
      try { localStorage.setItem('maisonElise.' + key, JSON.stringify(val)); } catch (e) { /* режим инкогнито */ }
    }
  };
  let cart = store.load('cart', []);
  let wishlist = store.load('wishlist', []);
  let activeCat = 'all';
  let activeSort = 'featured';
  let pendingProduct = null;
  let pendingSize = null;
  let pendingQty = 1;

  /* ---------- Éléments ---------- */
  const grid = document.getElementById('productGrid');
  const emptyNote = document.getElementById('emptyNote');
  const cartCount = document.getElementById('cartCount');
  const wishCount = document.getElementById('wishCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartShip = document.getElementById('cartShip');
  const cartFoot = document.getElementById('cartFoot');
  const toast = document.getElementById('toast');

  /* ---------- Rendu catalogue ---------- */
  function renderProducts() {
    let list = PRODUCTS.filter(p => activeCat === 'all' || p.cat === activeCat);
    if (activeSort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (activeSort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);

    emptyNote.hidden = list.length > 0;
    grid.innerHTML = list.map(p => `
      <article class="product" data-id="${p.id}" style="--sw2:${p.sw2}">
        <div class="product-visual" data-qv="${p.id}" title="Aperçu rapide">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          <button class="heart ${wishlist.includes(p.id) ? 'active' : ''}" data-heart="${p.id}" aria-label="Ajouter aux favoris">${HEART_SVG}</button>
          <img src="${p.img}" alt="${p.name}" loading="lazy">
        </div>
        <div class="product-info">
          <span class="product-cat">${p.catLabel}</span>
          <h3 class="product-name" data-qv="${p.id}">${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-foot">
            <span class="product-price">${fmt(p.price)}</span>
            <button class="add-btn" data-id="${p.id}">Ajouter</button>
          </div>
        </div>
      </article>`).join('');
  }

  /* ---------- Filtres & tri ---------- */
  document.getElementById('filters').addEventListener('click', e => {
    const btn = e.target.closest('.filter');
    if (!btn) return;
    document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
    btn.classList.add('active');
    activeCat = btn.dataset.cat;
    renderProducts();
  });
  document.getElementById('sort').addEventListener('change', e => {
    activeSort = e.target.value;
    renderProducts();
  });

  /* ---------- Fly-to-cart ---------- */
  const cartBtn = document.getElementById('cartBtn');
  function flyToCart(fromEl) {
    const from = fromEl.getBoundingClientRect();
    const to = cartBtn.getBoundingClientRect();
    const dot = document.createElement('div');
    dot.className = 'fly-dot';
    dot.style.left = (from.left + from.width / 2 - 8) + 'px';
    dot.style.top = (from.top + from.height / 2 - 8) + 'px';
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.transform = `translate(${to.left + to.width / 2 - (from.left + from.width / 2)}px, ${to.top + to.height / 2 - (from.top + from.height / 2)}px) scale(.3)`;
      dot.style.opacity = '0';
    });
    setTimeout(() => {
      dot.remove();
      cartBtn.classList.add('bump');
      setTimeout(() => cartBtn.classList.remove('bump'), 450);
    }, 720);
  }

  /* ---------- Modale tailles (bouton "Ajouter") ---------- */
  const sizeOverlay = document.getElementById('sizeOverlay');
  const sizeOptions = document.getElementById('sizeOptions');
  const addBtn = document.getElementById('addToCartBtn');

  function openSizePicker(product, fromEl) {
    pendingProduct = product;
    pendingSize = null;
    pendingQty = 1;
    document.getElementById('sizeCat').textContent = product.catLabel;
    document.getElementById('sizeName').textContent = product.name;
    document.getElementById('sizePrice').textContent = fmt(product.price);
    sizeOptions.innerHTML = SIZES.map(s => `<button class="size-opt" data-size="${s}">${s}</button>`).join('');
    addBtn.disabled = true;
    addBtn.dataset.from = '';
    addBtn._fromEl = fromEl;
    sizeOverlay.classList.add('open');
  }

  function selectSize(container, btn) {
    container.querySelectorAll('.size-opt').forEach(o => o.classList.remove('active'));
    btn.classList.add('active');
    pendingSize = btn.dataset.size;
  }

  sizeOptions.addEventListener('click', e => {
    const btn = e.target.closest('.size-opt');
    if (!btn) return;
    selectSize(sizeOptions, btn);
    addBtn.disabled = false;
  });

  document.getElementById('sizeClose').addEventListener('click', () => sizeOverlay.classList.remove('open'));
  sizeOverlay.addEventListener('click', e => { if (e.target === sizeOverlay) sizeOverlay.classList.remove('open'); });

  addBtn.addEventListener('click', () => {
    pushToCart(addBtn._fromEl || addBtn);
    sizeOverlay.classList.remove('open');
  });

  function pushToCart(fromEl) {
    const key = pendingProduct.id + '-' + pendingSize;
    const found = cart.find(i => i.key === key);
    if (found) found.qty += pendingQty;
    else cart.push({ key, id: pendingProduct.id, name: pendingProduct.name, price: pendingProduct.price, size: pendingSize, sw: pendingProduct.sw, icon: pendingProduct.icon, img: pendingProduct.img, qty: pendingQty });
    store.save('cart', cart);
    renderCart();
    flyToCart(fromEl);
    showToast(pendingProduct.name + ' (' + pendingSize + ') ajouté au panier');
  }

  /* ---------- Quick view ---------- */
  const qvOverlay = document.getElementById('qvOverlay');
  const qvSizes = document.getElementById('qvSizes');
  const qvAdd = document.getElementById('qvAdd');
  const qvQty = document.getElementById('qvQty');

  function openQuickView(product) {
    pendingProduct = product;
    pendingSize = null;
    pendingQty = 1;
    qvQty.textContent = '1';
    document.getElementById('qvCat').textContent = product.catLabel + ' · Édition limitée';
    document.getElementById('qvName').textContent = product.name;
    document.getElementById('qvPrice').textContent = fmt(product.price);
    document.getElementById('qvDesc').textContent = product.desc + '. Coupée sur mannequin, montée et finie à la main — boutonnières comprises.';
    const vis = document.getElementById('qvVisual');
    vis.innerHTML = `<img src="${product.img}" alt="${product.name}">`;
    qvSizes.innerHTML = SIZES.map(s => `<button class="size-opt" data-size="${s}">${s}</button>`).join('');
    qvAdd.disabled = true;
    qvOverlay.classList.add('open');
  }
  qvSizes.addEventListener('click', e => {
    const btn = e.target.closest('.size-opt');
    if (!btn) return;
    selectSize(qvSizes, btn);
    qvAdd.disabled = false;
  });
  document.getElementById('qvMinus').addEventListener('click', () => {
    pendingQty = Math.max(1, pendingQty - 1);
    qvQty.textContent = pendingQty;
  });
  document.getElementById('qvPlus').addEventListener('click', () => {
    pendingQty = Math.min(9, pendingQty + 1);
    qvQty.textContent = pendingQty;
  });
  qvAdd.addEventListener('click', () => {
    pushToCart(qvAdd);
    qvOverlay.classList.remove('open');
  });
  document.getElementById('qvClose').addEventListener('click', () => qvOverlay.classList.remove('open'));
  qvOverlay.addEventListener('click', e => { if (e.target === qvOverlay) qvOverlay.classList.remove('open'); });

  /* ---------- Clics dans le catalogue ---------- */
  grid.addEventListener('click', e => {
    const heart = e.target.closest('[data-heart]');
    if (heart) {
      const id = +heart.dataset.heart;
      const on = heart.classList.toggle('active');
      wishlist = on ? [...wishlist, id] : wishlist.filter(w => w !== id);
      store.save('wishlist', wishlist);
      renderWishCount();
      showToast(on ? 'Ajouté à vos favoris' : 'Retiré de vos favoris');
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      openQuickView(PRODUCTS.find(p => p.id === +qv.dataset.qv));
      return;
    }
    const btn = e.target.closest('.add-btn');
    if (btn) openSizePicker(PRODUCTS.find(p => p.id === +btn.dataset.id), btn);
  });

  /* ---------- Favoris (compteur) ---------- */
  function renderWishCount() {
    wishCount.textContent = wishlist.length;
    wishCount.style.display = wishlist.length ? '' : 'none';
  }
  document.getElementById('wishBtn').addEventListener('click', () => {
    if (!wishlist.length) { showToast('Pas encore de favoris — touchez le cœur sur une pièce'); return; }
    const names = wishlist.map(id => PRODUCTS.find(p => p.id === id).name).join(', ');
    showToast('Vos favoris : ' + names);
  });

  /* ---------- Panier ---------- */
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const openCart = () => { drawer.classList.add('open'); overlay.classList.add('open'); };
  const closeCart = () => { drawer.classList.remove('open'); overlay.classList.remove('open'); };
  cartBtn.addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);

  function renderCart() {
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
    cartCount.textContent = totalQty;

    if (!cart.length) {
      cartItems.innerHTML = '<p class="cart-empty">Votre panier est encore vide.</p>';
      cartFoot.style.display = 'none';
      return;
    }
    cartFoot.style.display = '';
    cartItems.innerHTML = cart.map(i => `
      <div class="cart-item" data-key="${i.key}">
        <div class="cart-item-visual" ${i.img ? `style="background-image:url('${i.img}')"` : `style="background:${i.sw}"`}>${i.img ? '' : ICONS[i.icon]}</div>
        <div>
          <div class="cart-item-name">${i.name}</div>
          <div class="cart-item-meta">Taille ${i.size} · ${fmt(i.price)}</div>
          <div class="qty">
            <button data-act="dec" aria-label="Moins">−</button><span>${i.qty}</span><button data-act="inc" aria-label="Plus">+</button>
          </div>
        </div>
        <div>
          <div class="cart-item-price">${fmt(i.price * i.qty)}</div>
          <button class="cart-remove" data-act="del">Retirer</button>
        </div>
      </div>`).join('');

    cartTotal.textContent = fmt(total);
    cartShip.textContent = total >= FREE_SHIP
      ? 'Livraison offerte — votre commande part sous 48h.'
      : 'Plus que ' + fmt(FREE_SHIP - total) + ' pour la livraison offerte.';
  }

  cartItems.addEventListener('click', e => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const key = btn.closest('.cart-item').dataset.key;
    const item = cart.find(i => i.key === key);
    if (btn.dataset.act === 'inc') item.qty++;
    if (btn.dataset.act === 'dec') item.qty = Math.max(0, item.qty - 1);
    if (btn.dataset.act === 'del') item.qty = 0;
    cart = cart.filter(i => i.qty > 0);
    store.save('cart', cart);
    renderCart();
  });

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    showToast('Merci ! Ceci est une démonstration — aucune commande réelle.');
  });

  /* ---------- Toast ---------- */
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  /* ---------- Newsletter ---------- */
  const newsForm = document.getElementById('newsForm');
  const newsEmail = document.getElementById('newsEmail');
  const newsNote = document.getElementById('newsNote');
  newsForm.addEventListener('submit', e => {
    e.preventDefault();
    const v = newsEmail.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      newsEmail.classList.add('error');
      newsNote.textContent = 'Merci de vérifier votre adresse e-mail.';
      return;
    }
    newsEmail.classList.remove('error');
    newsNote.textContent = 'Bienvenue dans la maison — à très vite dans votre boîte.';
    newsForm.reset();
  });
  newsEmail.addEventListener('input', () => newsEmail.classList.remove('error'));

  /* ---------- Menu mobile, header, reveal, compteurs ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); burger.classList.remove('open');
  }));

  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 16), { passive: true });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

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

  /* ---------- Echap ferme les modales ---------- */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      sizeOverlay.classList.remove('open');
      qvOverlay.classList.remove('open');
      closeCart();
    }
  });

  /* ---------- Init ---------- */
  renderProducts();
  renderCart();
  renderWishCount();
})();

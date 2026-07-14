/* =========================================================
   FOODTOLIO — script.js  (shared across every page)
   1) scroll-reveal animations
   2) mobile nav toggle
   3) cart system (localStorage) + drawer + toast
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 1) scroll-reveal ---------- */
    const els = Array.from(document.querySelectorAll('[data-anim]'));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                el.classList.add('in-view');
            } else {
                el.classList.remove('in-view');
            }
        });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    els.forEach(el => observer.observe(el));

    /* ---------- 2) mobile nav toggle ---------- */
    const navToggle = document.getElementById('navToggle');
    const siteNav = document.getElementById('siteNav');
    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => siteNav.classList.toggle('open'));
    }

    /* ---------- 2b) menu category filter ---------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length) {
        const groups = document.querySelectorAll('[data-cat]');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const target = btn.dataset.filter;
                groups.forEach(group => {
                    const show = target === 'all' || group.dataset.cat === target;
                    group.closest('section, div').style.display = '';
                    group.style.display = show ? 'grid' : 'none';
                    const heading = group.previousElementSibling;
                    if (heading && heading.classList.contains('menu-cat-title')) {
                        heading.style.display = show ? '' : 'none';
                    }
                    const div = group.nextElementSibling;
                    if (div && div.classList.contains('divider')) {
                        div.style.display = show ? '' : 'none';
                    }
                });
            });
        });
    }

    /* ---------- 3) cart system ---------- */
    const CART_KEY = 'foodtolio_cart';

    const getCart = () => {
        try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
        catch (e) { return {}; }
    };
    const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

    const cartBtn = document.getElementById('cartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCountEl = document.getElementById('cartCount');
    const toastEl = document.getElementById('toast');

    function openDrawer() {
        cartDrawer && cartDrawer.classList.add('open');
        cartOverlay && cartOverlay.classList.add('open');
    }
    function closeDrawer() {
        cartDrawer && cartDrawer.classList.remove('open');
        cartOverlay && cartOverlay.classList.remove('open');
    }
    cartBtn && cartBtn.addEventListener('click', () => { renderCart(); openDrawer(); });
    cartClose && cartClose.addEventListener('click', closeDrawer);
    cartOverlay && cartOverlay.addEventListener('click', closeDrawer);

    function showToast(msg) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => toastEl.classList.remove('show'), 1800);
    }

    function updateCount() {
        if (!cartCountEl) return;
        const cart = getCart();
        const count = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
        cartCountEl.textContent = count;
    }

    function renderCart() {
        if (!cartItemsEl) return;
        const cart = getCart();
        const ids = Object.keys(cart);

        if (ids.length === 0) {
            cartItemsEl.innerHTML = '<p class="cart-empty">Your bag is empty — add something tasty.</p>';
            cartTotalEl.textContent = '$0.00';
            return;
        }

        let total = 0;
        cartItemsEl.innerHTML = ids.map(id => {
            const item = cart[id];
            const lineTotal = item.price * item.qty;
            total += lineTotal;
            return `
        <div class="cart-item" data-id="${id}">
          <img src="${item.img}" alt="${item.name}">
          <div class="cart-item-info">
            <h5>${item.name}</h5>
            <span>$${item.price.toFixed(2)} each</span>
          </div>
          <div class="cart-item-qty">
            <button class="qty-minus" aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button class="qty-plus" aria-label="Increase quantity">+</button>
          </div>
        </div>`;
        }).join('');

        cartTotalEl.textContent = '$' + total.toFixed(2);

        cartItemsEl.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', () => changeQty(btn.closest('.cart-item').dataset.id, 1));
        });
        cartItemsEl.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', () => changeQty(btn.closest('.cart-item').dataset.id, -1));
        });
    }

    function changeQty(id, delta) {
        const cart = getCart();
        if (!cart[id]) return;
        cart[id].qty += delta;
        if (cart[id].qty <= 0) delete cart[id];
        saveCart(cart);
        renderCart();
        updateCount();
    }

    function addToCart(btn) {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        const img = btn.dataset.img;
        const cart = getCart();
        if (cart[id]) {
            cart[id].qty += 1;
        } else {
            cart[id] = { name, price, img, qty: 1 };
        }
        saveCart(cart);
        updateCount();
        showToast(name + ' added to your bag');
    }

    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', () => addToCart(btn));
    });

    updateCount();

    /* ---------- 4) contact form (demo only, no backend) ---------- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast("Thanks! We'll get back to you soon.");
            contactForm.reset();
        });
    }
});
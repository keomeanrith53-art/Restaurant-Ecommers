const CART_STORAGE_KEY = 'foodtolio-cart';

let cart = loadCart();

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCart() {
  try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); } catch {}
}

function getItem(id) {
  return MENU_ITEMS.find(i => i.id === id);
}

function cartCount() {
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

function cartSubtotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = getItem(id);
    return item ? sum + item.price * qty : sum;
  }, 0);
}

function setQty(id, qty) {
  if (qty <= 0) {
    delete cart[id];
  } else {
    cart[id] = qty;
  }
  saveCart();
  renderCart();
  refreshCartControls();
}

function addToCart(id) {
  setQty(id, (cart[id] || 0) + 1);
  const item = getItem(id);
  if (item) showToast(`${item.name} added to your tray`, 'success');
}

/* Sync the +/stepper controls on each visible card with cart state */
function refreshCartControls() {
  document.querySelectorAll('[data-item-id]').forEach(control => {
    const id = control.dataset.itemId;
    const qty = cart[id] || 0;
    const addBtn = control.querySelector('.add-btn');
    const stepper = control.querySelector('.qty-stepper');
    const qtyLabel = control.querySelector('[data-qty]');
    if (qty > 0) {
      addBtn.classList.add('is-hidden');
      stepper.classList.add('is-visible');
      qtyLabel.textContent = qty;
    } else {
      addBtn.classList.remove('is-hidden');
      stepper.classList.remove('is-visible');
    }
  });

  const countEl = document.querySelector('[data-cart-count]');
  if (countEl) {
    const count = cartCount();
    countEl.textContent = count;
    countEl.setAttribute('data-empty', count === 0 ? 'true' : 'false');
  }
}
window.refreshCartControls = refreshCartControls;

function renderCart() {
  const itemsWrap = document.querySelector('[data-cart-items]');
  const subtotalEl = document.querySelector('[data-cart-subtotal]');
  const totalEl = document.querySelector('[data-cart-total]');
  const deliveryEl = document.querySelector('[data-cart-delivery]');
  if (!itemsWrap) return;

  const ids = Object.keys(cart);

  if (ids.length === 0) {
    itemsWrap.innerHTML = `
      <div class="cart-empty">
        <span><i class="ri-shopping-basket-2-line"></i></span>
        Your tray is empty.<br />Add a dish from the menu to get started.
      </div>`;
  } else {
    itemsWrap.innerHTML = ids.map(id => {
      const item = getItem(id);
      if (!item) return '';
      const qty = cart[id];
      return `
        <div class="cart-line">
          <img src="${item.img}" alt="${item.name}" />
          <div>
            <div class="cart-line-name">${item.name}</div>
            <div class="cart-line-meta">
              <button type="button" data-cart-action="decrease" data-id="${id}" aria-label="Remove one ${item.name}"><i class="ri-subtract-line"></i></button>
              <span>${qty}</span>
              <button type="button" data-cart-action="increase" data-id="${id}" aria-label="Add one more ${item.name}"><i class="ri-add-line"></i></button>
            </div>
            <button type="button" class="cart-line-remove" data-cart-action="remove" data-id="${id}">Remove</button>
          </div>
          <div class="cart-line-price">$${(item.price * qty).toFixed(2)}</div>
        </div>`;
    }).join('');
  }

  const subtotal = cartSubtotal();
  const delivery = subtotal === 0 ? 0 : 2.99;
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (deliveryEl) deliveryEl.textContent = `$${delivery.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${(subtotal + delivery).toFixed(2)}`;
}

function openCart() {
  document.querySelector('[data-cart-drawer]')?.setAttribute('data-open', 'true');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.querySelector('[data-cart-drawer]')?.setAttribute('data-open', 'false');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  refreshCartControls();

  document.querySelector('[data-cart-open]')?.addEventListener('click', openCart);
  document.querySelector('[data-cart-close]')?.addEventListener('click', closeCart);
  document.querySelector('[data-cart-overlay]')?.addEventListener('click', closeCart);

  // Add-to-cart / stepper clicks (event delegation, works for re-rendered cards)
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-btn');
    if (addBtn) {
      const id = addBtn.closest('[data-item-id]').dataset.itemId;
      addToCart(id);
      return;
    }
    const stepBtn = e.target.closest('.qty-stepper button');
    if (stepBtn) {
      const id = stepBtn.closest('[data-item-id]').dataset.itemId;
      const delta = stepBtn.dataset.action === 'increase' ? 1 : -1;
      setQty(id, (cart[id] || 0) + delta);
      return;
    }
    const cartBtn = e.target.closest('[data-cart-action]');
    if (cartBtn) {
      const id = cartBtn.dataset.id;
      if (cartBtn.dataset.cartAction === 'increase') setQty(id, (cart[id] || 0) + 1);
      if (cartBtn.dataset.cartAction === 'decrease') setQty(id, (cart[id] || 0) - 1);
      if (cartBtn.dataset.cartAction === 'remove') setQty(id, 0);
    }
  });

  document.querySelector('[data-cart-checkout]')?.addEventListener('click', () => {
    if (cartCount() === 0) {
      showToast('Add a dish to your tray first', 'info');
      return;
    }
    cart = {};
    saveCart();
    renderCart();
    refreshCartControls();
    closeCart();
    showToast('Order placed \u2014 your food is on the way!', 'success');
  });

  // Escape key closes the drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });
});

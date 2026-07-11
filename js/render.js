function renderMenu() {
  const grid = document.querySelector('[data-menu-grid]');
  const pillsWrap = document.querySelector('[data-filter-pills]');
  if (!grid || !pillsWrap) return;

  const categories = ['All', ...new Set(MENU_ITEMS.map(i => i.category))];

  pillsWrap.innerHTML = categories.map((cat, i) => `
    <button class="filter-pill" type="button" data-cat="${cat}" aria-pressed="${i === 0}">${cat}</button>
  `).join('');

  function cardTemplate(item) {
    return `
      <article class="card" data-anim="fade-up" data-category="${item.category}">
        <span class="card-tag">${item.category}</span>
        <span class="card-rating"><i class="ri-star-fill"></i> ${item.rating}</span>
        <img src="${item.img}" alt="${item.name}" class="card-img" />
        <div class="food-title"><h1>${item.name}</h1></div>
        <div class="desc-food"><p>${item.desc}</p></div>
        <div class="price">
          <span class="price-value">$${item.price.toFixed(2)}</span>
          <div class="add-control" data-item-id="${item.id}">
            <button type="button" class="add-btn" aria-label="Add ${item.name} to cart">
              <i class="ri-add-line"></i>
            </button>
            <div class="qty-stepper">
              <button type="button" data-action="decrease" aria-label="Remove one ${item.name}">
                <i class="ri-subtract-line"></i>
              </button>
              <span data-qty>0</span>
              <button type="button" data-action="increase" aria-label="Add one more ${item.name}">
                <i class="ri-add-line"></i>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function draw(filter) {
    const items = filter === 'All' ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === filter);
    grid.innerHTML = items.map(cardTemplate).join('');
    if (window.refreshCartControls) window.refreshCartControls();
    if (window.observeAnimatedEls) window.observeAnimatedEls();
  }

  pillsWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    pillsWrap.querySelectorAll('.filter-pill').forEach(p => p.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    draw(btn.dataset.cat);
  });

  draw('All');
}

document.addEventListener('DOMContentLoaded', renderMenu);

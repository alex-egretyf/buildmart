import { products } from '../data/products.js';

document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');
  if (!main) return;

  main.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-10">
      <div class="mb-10">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900">Строительные материалы</h1>
        <p class="mt-3 text-xl text-gray-600">
          Высококачественные строительные материалы
        </p>
      </div>

      <div class="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center justify-between">
        <button id="toggle-filters" class="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
          <span id="filters-text">Показать фильтры</span>
          <svg id="filters-icon" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3">
            <select id="sort" class="border border-gray-300 rounded-md px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
              <option value="name-asc">По имени (А–Я)</option>
              <option value="name-desc">По имени (Я–А)</option>
              <option value="price-asc">По цене (возр.)</option>
              <option value="price-desc">По цене (убыв.)</option>
            </select>
          </div>
          <span class="text-gray-600">Показано <span id="products-count">${products.length}</span> товаров</span>
        </div>
      </div>

      <div id="filters-panel" class="hidden bg-white rounded-xl shadow-lg p-5 md:p-6 mb-10">
        <div class="flex flex-col md:flex-row gap-6 md:gap-8">
          <div class="flex-1">
            <h4 class="font-semibold mb-3 text-base md:text-lg">Минимальный рейтинг</h4>
            <div class="flex flex-col gap-3 text-sm md:text-base">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" value="5" class="rating-filter w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary">
                <span>5+ звёзд</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" value="4" class="rating-filter w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary">
                <span>4+ звёзд</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" value="3" class="rating-filter w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary">
                <span>3+ звёзд</span>
              </label>
            </div>
          </div>

          <div class="flex-1">
            <h4 class="font-semibold mb-3 text-base md:text-lg">Диапазон цены</h4>
            <div class="relative h-12 md:h-14">
              <div class="absolute inset-x-0 top-5 md:top-6 h-2 bg-gray-200 rounded-full"></div>
              <div id="range-fill" class="absolute top-5 md:top-6 h-2 bg-primary rounded-full pointer-events-none"></div>
              <input type="range" id="sliderMin" min="0" max="400" value="0" class="absolute w-full h-12 md:h-14 opacity-0 pointer-events-auto cursor-pointer appearance-none">
              <input type="range" id="sliderMax" min="0" max="400" value="400" class="absolute w-full h-12 md:h-14 opacity-0 pointer-events-auto cursor-pointer appearance-none">
            </div>
            
            <div class="flex justify-between text-sm text-gray-600 mt-3">
              <span id="minDisplay">$0</span>
              <span id="maxDisplay">$400</span>
            </div>
          </div>
        </div>

        <button id="clear-filters" class="mt-6 w-full bg-gray-100 text-gray-700 py-3.5 rounded-xl hover:bg-gray-200 transition font-medium text-base">
          Очистить фильтры
        </button>
      </div>

      <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"></div>
    </div>
  `;

  const grid = document.getElementById('products-grid');
  const sortSelect = document.getElementById('sort');
  const toggleBtn = document.getElementById('toggle-filters');
  const filtersText = document.getElementById('filters-text');
  const filtersIcon = document.getElementById('filters-icon');
  const filtersPanel = document.getElementById('filters-panel');
  const productsCount = document.getElementById('products-count');
  const clearFiltersBtn = document.getElementById('clear-filters');

  const ratingFilters = document.querySelectorAll('.rating-filter');
  const sliderMin = document.getElementById('sliderMin');
  const sliderMax = document.getElementById('sliderMax');
  const minDisplay = document.getElementById('minDisplay');
  const maxDisplay = document.getElementById('maxDisplay');
  const rangeFill = document.getElementById('range-fill');

  let minRating = 0;
  let minPrice = 0;
  let maxPrice = 400;

  function updateRangeDisplay() {
    minPrice = parseInt(sliderMin.value);
    maxPrice = parseInt(sliderMax.value);

    if (minPrice > maxPrice) {
      sliderMin.value = maxPrice;
      minPrice = maxPrice;
    }
    if (maxPrice < minPrice) {
      sliderMax.value = minPrice;
      maxPrice = minPrice;
    }

    minDisplay.textContent = `$${minPrice}`;
    maxDisplay.textContent = `$${maxPrice}`;

    const percentMin = (minPrice / 400) * 100;
    const percentMax = (maxPrice / 400) * 100;
    rangeFill.style.left = percentMin + '%';
    rangeFill.style.width = (percentMax - percentMin) + '%';
  }

  function applyFilters() {
    let filtered = [...products];

    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating);
    }

    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

    productsCount.textContent = filtered.length;

    const value = sortSelect.value;
    let sorted = [...filtered];

    if (value === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    } else if (value === 'name-desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name, 'ru'));
    } else if (value === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (value === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    }

    renderProducts(sorted);
  }

  function renderProducts(sortedProducts) {
    grid.innerHTML = '';

    sortedProducts.forEach(product => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full';

      card.innerHTML = `
        <a href="product.html?id=${product.id}" class="block relative overflow-hidden">
          <img
            src="${product.mainImage}"
            alt="${product.name}"
            class="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
          >
        </a>
        <div class="p-5 flex flex-col flex-grow space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[2.75rem]">
            <a href="product.html?id=${product.id}" class="hover:text-primary transition-colors">
              ${product.name}
            </a>
          </h3>

          <div class="flex items-center">
            <div class="flex text-yellow-400 text-xl">
              ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span class="ml-2 text-sm text-gray-600">(${product.rating})</span>
          </div>

          <div class="text-2xl font-bold text-primary mt-1">
            $${product.price.toFixed(2)}
          </div>

          <p class="text-sm text-gray-500">${product.category}</p>

          <button
            data-id="${product.id}"
            class="mt-auto bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition-colors add-to-cart"
          >
            В корзину
          </button>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  function sortAndRender(value) {
    let sorted = [...products];

    if (value === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    } else if (value === 'name-desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name, 'ru'));
    } else if (value === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (value === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    }

    renderProducts(sorted);
  }

  sortAndRender('name-asc');

  sortSelect.addEventListener('change', e => {
    sortAndRender(e.target.value);
  });

  toggleBtn.addEventListener('click', () => {
    filtersPanel.classList.toggle('hidden');
    const isHidden = filtersPanel.classList.contains('hidden');
    filtersText.textContent = isHidden ? 'Показать фильтры' : 'Скрыть фильтры';
    filtersIcon.classList.toggle('rotate-180', !isHidden);
  });

  sliderMin.addEventListener('input', () => {
    updateRangeDisplay();
    applyFilters();
  });

  sliderMax.addEventListener('input', () => {
    updateRangeDisplay();
    applyFilters();
  });

  ratingFilters.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        minRating = Math.max(minRating, parseInt(checkbox.value));
        ratingFilters.forEach(c => {
          if (parseInt(c.value) < minRating) c.checked = false;
        });
      } else {
        minRating = Math.max(...Array.from(ratingFilters)
          .filter(c => c.checked)
          .map(c => parseInt(c.value)) || [0]);
      }
      applyFilters();
    });
  });

  clearFiltersBtn.addEventListener('click', () => {
    minRating = 0;
    minPrice = 0;
    maxPrice = 400;
    sliderMin.value = 0;
    sliderMax.value = 400;
    minDisplay.textContent = '$0';
    maxDisplay.textContent = '$400';
    rangeFill.style.left = '0%';
    rangeFill.style.width = '100%';
    ratingFilters.forEach(c => c.checked = false);
    applyFilters();
  });

  function updateRangeDisplay() {
    minPrice = parseInt(sliderMin.value);
    maxPrice = parseInt(sliderMax.value);

    if (minPrice > maxPrice) {
      sliderMin.value = maxPrice;
      minPrice = maxPrice;
    }
    if (maxPrice < minPrice) {
      sliderMax.value = minPrice;
      maxPrice = minPrice;
    }

    minDisplay.textContent = `$${minPrice}`;
    maxDisplay.textContent = `$${maxPrice}`;

    const percentMin = (minPrice / 400) * 100;
    const percentMax = (maxPrice / 400) * 100;
    rangeFill.style.left = percentMin + '%';
    rangeFill.style.width = (percentMax - percentMin) + '%';
  }

  function applyFilters() {
    let filtered = [...products];

    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating);
    }

    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

    productsCount.textContent = filtered.length;

    const value = sortSelect.value;
    let sorted = [...filtered];

    if (value === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    } else if (value === 'name-desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name, 'ru'));
    } else if (value === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (value === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    }

    renderProducts(sorted);
  }

  grid.addEventListener('click', function (e) {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;

    const id = parseInt(btn.dataset.id);
    if (!id) return;

    let cart = window.cartUtils.getCart();
    const existing = cart.find(i => i.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, quantity: 1 });
    }

    window.cartUtils.saveCart(cart);

    const originalText = btn.textContent;
    btn.textContent = 'Добавлено!';
    btn.classList.add('bg-green-600', 'hover:bg-green-700');
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('bg-green-600', 'hover:bg-green-700');
      btn.disabled = false;
    }, 1400);
  });

  updateRangeDisplay();
});
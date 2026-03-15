import { products } from '../data/products.js';

document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');
  if (!main) return;

  main.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-10">
      <div class="mb-10">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900">Строительные материалы</h1>
        <p class="mt-3 text-xl text-gray-600">
          Premium construction supplies for all your projects
        </p>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div class="text-lg font-medium text-gray-700">
          Показано ${products.length} товаров
        </div>
        <div class="flex items-center gap-4">
          <label for="sort" class="text-gray-700 font-medium whitespace-nowrap">Сортировка:</label>
          <select id="sort" class="border border-gray-300 rounded-md px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
            <option value="name-asc">По имени (А–Я)</option>
            <option value="name-desc">По имени (Я–А)</option>
            <option value="price-asc">По цене (возр.)</option>
            <option value="price-desc">По цене (убыв.)</option>
          </select>
        </div>
      </div>

      <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"></div>
    </div>
  `;

  const grid = document.getElementById('products-grid');
  const sortSelect = document.getElementById('sort');

  function renderProducts(sortedProducts) {
    grid.innerHTML = '';

    sortedProducts.forEach(product => {
      const card = document.createElement('div');
      card.className =
        'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full';

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

  sortSelect.addEventListener('change', (e) => {
    sortAndRender(e.target.value);
  });
});
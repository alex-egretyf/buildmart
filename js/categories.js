import { products } from '../data/products.js';

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;

  const categoriesMap = new Map();

  products.forEach(product => {
    const cat = product.category;
    if (!categoriesMap.has(cat)) {
      categoriesMap.set(cat, { image: product.mainImage, count: 1 });
    } else {
      categoriesMap.get(cat).count += 1;
    }
  });

  categoriesMap.forEach(({ image, count }, category) => {
    const card = document.createElement('a');
    card.href = 'index.html';
    card.className = 'group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col';

    card.innerHTML = `
      <img src="${image}" alt="${category}" class="w-full h-48 object-cover">
      <div class="p-6 flex flex-col flex-grow">
        <h3 class="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">${category}</h3>
        <p class="mt-2 text-gray-600 flex-grow">${count} товаров</p>
        <span class="mt-4 text-primary font-medium">Перейти →</span>
      </div>
    `;

    grid.appendChild(card);
  });
});
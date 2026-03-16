import { products } from '../data/products.js';

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));


  const product = products.find(p => p.id === id);

  if (!product) {
    document.querySelector('main').innerHTML = `
      <div class="text-center py-20">
        <h2 class="text-3xl font-bold text-gray-800">Товар не найден</h2>
        <a href="index.html" class="mt-6 inline-block bg-primary text-white px-8 py-4 rounded-xl font-medium hover:bg-primary-dark transition">
          Вернуться в каталог
        </a>
      </div>
    `;
    return;
  }

  document.getElementById('breadcrumb-name').textContent = product.name;

  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;

  const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
  document.getElementById('rating-stars').innerHTML = stars;
  document.getElementById('rating-text').textContent = `(${product.rating})`;

  document.getElementById('product-description').textContent = product.description || 'Описание отсутствует';

  const mainImg = document.getElementById('main-image');
  mainImg.src = product.mainImage;
  mainImg.alt = product.name;

  const thumbsContainer = document.getElementById('thumbnails');
  thumbsContainer.innerHTML = '';

  const images = [product.mainImage, ...(product.thumbnails || [])].slice(0, 4); // до 4 фото

  images.forEach((src, index) => {
    const thumb = document.createElement('div');
    thumb.className = `w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${index === 0 ? 'border-primary' : 'border-transparent hover:border-primary/50'}`;
    thumb.innerHTML = `<img src="${src}" alt="${product.name} thumbnail" class="w-full h-full object-cover">`;

    thumb.addEventListener('click', () => {
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
      }, 150);

      thumbsContainer.querySelectorAll('div').forEach(el => el.classList.remove('border-primary'));
      thumb.classList.add('border-primary');
    });

    thumbsContainer.appendChild(thumb);
  });

  const specsGrid = document.getElementById('specs-grid');
  specsGrid.innerHTML = '';

  if (product.specs && Object.keys(product.specs).length > 0) {
    Object.entries(product.specs).forEach(([key, value]) => {
      const item = document.createElement('div');
      item.className = 'flex flex-col';
      item.innerHTML = `
        <dt class="text-sm text-gray-500 uppercase tracking-wide font-medium">${key}</dt>
        <dd class="text-base font-semibold text-gray-900 mt-1">${value}</dd>
      `;
      specsGrid.appendChild(item);
    });
  } else {
    specsGrid.innerHTML = '<p class="text-gray-500">Характеристики отсутствуют</p>';
  }

  let quantity = 1;
  const qtyInput = document.getElementById('qty-input');
  document.getElementById('qty-minus').addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      qtyInput.value = quantity;
    }
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    quantity++;
    qtyInput.value = quantity;
  });
  qtyInput.addEventListener('input', () => {
    quantity = parseInt(qtyInput.value) || 1;
    if (quantity < 1) quantity = 1;
    qtyInput.value = quantity;
  });
});
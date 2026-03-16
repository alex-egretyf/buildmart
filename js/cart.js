import { products } from '../data/products.js';

document.addEventListener('DOMContentLoaded', () => {
  const cartContent = document.getElementById('cart-content');
  const emptyCart = document.getElementById('empty-cart');
  const cartItems = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('subtotal');
  const taxEl = document.getElementById('tax');
  const discountEl = document.getElementById('discount');
  const totalEl = document.getElementById('total');

  let promoDiscount = 0;

  function renderCart() {
    const cart = window.cartUtils.getCart();

    if (cart.length === 0) {
      cartContent.classList.add('hidden');
      emptyCart.classList.remove('hidden');
      updateTotals(0);
      return;
    }

    cartContent.classList.remove('hidden');
    emptyCart.classList.add('hidden');

    cartItems.innerHTML = '';

    let subtotal = 0;

    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return;

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

            const desktopRow = document.createElement('div');
      desktopRow.className = 'hidden md:grid grid-cols-[80px_2fr_100px_140px_100px_60px] gap-4 px-6 py-6 items-center border-b last:border-b-0 hover:bg-gray-50 transition';
      desktopRow.innerHTML = `
        <div class="flex justify-center">
          <img src="${product.mainImage}" alt="${product.name}" class="w-16 h-16 object-cover rounded-lg">
        </div>
        <div class="min-w-0">
          <h3 class="font-medium text-base max-w-[180px] truncate">${product.name}</h3>
          <p class="text-gray-500 text-xs truncate">${product.category}</p>
        </div>
        <div class="text-center font-medium text-gray-700">${product.price.toFixed(2)} $</div>
        <div class="flex justify-center">
          <div class="flex items-center border border-gray-200 rounded">
            <button class="qty-minus px-3 py-1.5 text-base hover:bg-gray-100 rounded-l" data-id="${item.id}">−</button>
            <span class="w-10 text-center font-medium">${item.quantity}</span>
            <button class="qty-plus px-3 py-1.5 text-base hover:bg-gray-100 rounded-r" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="text-center font-bold text-primary">${itemTotal.toFixed(2)} $</div>
        <div class="flex justify-center items-end">
          <button class="remove-item w-8 h-8 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 transition text-lg font-bold rounded" data-id="${item.id}">
            ×
          </button>
        </div>
      `;

      const mobileRow = document.createElement('div');
      mobileRow.className = 'md:hidden p-4 border-b last:border-b-0';
      mobileRow.innerHTML = `
        <div class="flex gap-4">
          <img src="${product.mainImage}" alt="${product.name}" class="w-24 h-24 object-cover rounded-lg">
          <div class="flex-1">
            <h3 class="font-medium text-base">${product.name}</h3>
            <p class="text-gray-600 text-sm">${product.category}</p>
            <div class="mt-2 flex items-center justify-between">
              <span class="font-bold text-primary">$${itemTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <div class="flex items-center border border-gray-200 rounded-lg">
            <button class="qty-minus px-4 py-2 text-lg hover:bg-gray-100 transition rounded-l-lg" data-id="${item.id}">−</button>
            <span class="w-12 text-center font-medium">${item.quantity}</span>
            <button class="qty-plus px-4 py-2 text-lg hover:bg-gray-100 transition rounded-r-lg" data-id="${item.id}">+</button>
          </div>
          <button class="remove-item w-10 h-10 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-700 transition text-xl font-bold rounded-md" data-id="${item.id}">
            ×
          </button>
        </div>
      `;

      cartItems.appendChild(desktopRow);
      cartItems.appendChild(mobileRow);
    });

    updateTotals(subtotal);
  }

  function updateTotals(subtotal) {
    const tax = subtotal * 0.08;
    const discount = subtotal * promoDiscount;
    const total = subtotal + tax - discount;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    discountEl.textContent = promoDiscount > 0 ? `-$${discount.toFixed(2)}` : '-$0.00';
    totalEl.textContent = `$${total.toFixed(2)}`;
  }

  cartItems.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;

    const id = parseInt(button.dataset.id);
    if (!id) return;

    let cart = window.cartUtils.getCart();

    if (button.classList.contains('remove-item')) {
      cart = cart.filter(i => i.id !== id);
    } else if (button.classList.contains('qty-minus')) {
      const item = cart.find(i => i.id === id);
      if (item && item.quantity > 1) item.quantity--;
    } else if (button.classList.contains('qty-plus')) {
      const item = cart.find(i => i.id === id);
      if (item) item.quantity++;
    }

    window.cartUtils.saveCart(cart);
    window.cartUtils.updateCartBadge();
    renderCart();
  });

  renderCart();
  window.addEventListener('cart-changed', renderCart);
});
import { products } from '../data/products.js';

document.addEventListener('DOMContentLoaded', () => {
  const cartContent = document.getElementById('cart-content');
  const emptyCart = document.getElementById('empty-cart');
  const cartItems = document.getElementById('cart-items');

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

      const row = document.createElement('div');
      row.className = 'flex flex-col sm:flex-row items-start sm:items-center gap-4 py-6 border-b last:border-b-0 px-4 sm:px-6 hover:bg-gray-50 transition';

      row.innerHTML = `
        <img src="${product.mainImage}" alt="${product.name}" class="w-20 h-20 object-cover rounded-lg sm:w-24 sm:h-24">
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-lg truncate">${product.name}</h3>
          <p class="text-sm text-gray-600 mt-1">${product.category}</p>
        </div>
        <div class="text-center font-medium sm:w-24">$${product.price.toFixed(2)}</div>
        <div class="flex items-center border border-gray-200 rounded-lg w-fit">
          <button class="qty-minus px-4 py-2 text-lg hover:bg-gray-100 transition" data-id="${item.id}">−</button>
          <span class="w-12 text-center font-medium">${item.quantity}</span>
          <button class="qty-plus px-4 py-2 text-lg hover:bg-gray-100 transition" data-id="${item.id}">+</button>
        </div>
        <div class="font-bold text-primary sm:w-32 text-center">$${itemTotal.toFixed(2)}</div>
        <button class="remove-item text-red-500 hover:text-red-700 transition text-xl" data-id="${item.id}">
          ×
        </button>
      `;

      cartItems.appendChild(row);
    });

    updateTotals(subtotal);
  }

  function updateTotals(subtotal) {
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('discount').textContent = '-$0.00';
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
  }

  cartItems.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const id = parseInt(btn.dataset.id);
    if (!id) return;

    let cart = window.cartUtils.getCart();

    if (btn.classList.contains('remove-item')) {
      cart = cart.filter(i => i.id !== id);
    } else if (btn.classList.contains('qty-minus')) {
      const item = cart.find(i => i.id === id);
      if (item && item.quantity > 1) item.quantity--;
    } else if (btn.classList.contains('qty-plus')) {
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
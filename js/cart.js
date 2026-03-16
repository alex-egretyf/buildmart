import { products } from '../data/products.js';

document.addEventListener('DOMContentLoaded', () => {
  const cartContent = document.getElementById('cart-content');
  const emptyCart = document.getElementById('empty-cart');

  function renderCart() {
    const cart = window.cartUtils.getCart();

    if (cart.length === 0) {
      cartContent.classList.add('hidden');
      emptyCart.classList.remove('hidden');
      return;
    }

    cartContent.classList.remove('hidden');
    emptyCart.classList.add('hidden');

    document.getElementById('cart-items').innerHTML = `
      <div class="p-6 text-center text-gray-500">
      </div>
    `;
  }

  renderCart();

  window.addEventListener('cart-changed', renderCart);
});
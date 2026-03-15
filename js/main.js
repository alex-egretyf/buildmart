document.addEventListener('DOMContentLoaded', () => {
  const CART_KEY = 'buildmart-cart';

  function getCart() {
    try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-changed'));
  }

  function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  updateCartBadge();

  window.cartUtils = {
    getCart,
    saveCart,
    updateCartBadge
  };

  window.addEventListener('cart-changed', updateCartBadge);
});
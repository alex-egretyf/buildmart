const CART_KEY = 'buildmart-cart';

export async function initComponents(activePage = '') {
  await Promise.all([
    loadComponent('header-root', './components/header.html'),
    loadComponent('footer-root', './components/footer.html'),
  ]);

  highlightNav(activePage);
  initCartBadge();
  initSearch();
}

async function loadComponent(rootId, url) {
  const root = document.getElementById(rootId);
  if (!root) return;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    const html = await res.text();
    root.outerHTML = html;
  } catch (err) {
    console.error(`[components] ${err.message}`);
  }
}

function highlightNav(activePage) {
  if (!activePage) return;
  const link = document.querySelector(`[data-nav="${activePage}"]`);
  if (!link) return;
  link.classList.remove('text-gray-700', 'hover:text-primary', 'transition-colors');
  link.classList.add('text-primary', 'font-medium');
}

function getCart() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

function initCartBadge() {
  updateCartBadge();
  window.addEventListener('cart-changed', updateCartBadge);
}

function initSearch() {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) {
      window.location.href = `index.html?search=${encodeURIComponent(query)}`;
    }
  });
}

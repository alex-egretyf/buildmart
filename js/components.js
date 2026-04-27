import { getCart } from './cart-utils.js';

const NAV_LINKS = [
  { href: 'index.html',      label: 'Каталог',   key: 'catalog'    },
  { href: 'categories.html', label: 'Категории', key: 'categories' },
  { href: 'deals.html',      label: 'Акции',     key: 'deals'      },
  { href: 'about.html',      label: 'О нас',     key: 'about'      },
];

export function initComponents(activePage = '') {
  renderHeader(activePage);
  renderFooter();
  initCartBadge();
  initSearch();
  initMobileMenu();
}

function renderHeader(activePage) {
  const root = document.getElementById('header-root');
  if (!root) return;

  const navLinks = NAV_LINKS.map(({ href, label, key }) => {
    const isActive = key === activePage;
    const cls = isActive
      ? 'text-primary font-medium'
      : 'text-gray-700 hover:text-primary transition-colors';
    return `<a href="${href}" data-nav="${key}" class="${cls}">${label}</a>`;
  }).join('');

  root.outerHTML = `
<header class="bg-white shadow-sm sticky top-0 z-50">
  <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
    <a href="index.html" class="flex items-center gap-2">
      <span class="text-3xl font-bold text-primary">BM</span>
      <span class="text-xl font-semibold text-gray-800">BuildMart</span>
    </a>
    <nav class="hidden md:flex items-center gap-8">${navLinks}</nav>
    <div class="flex items-center gap-4">
      <div class="relative hidden md:block">
        <form id="search-form">
          <input type="text" id="search-input" placeholder="Поиск товаров..."
            class="pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition">
          <svg class="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </form>
      </div>
      <a href="cart.html" class="relative">
        <svg class="w-7 h-7 text-gray-700 hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <span id="cart-count" class="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">0</span>
      </a>
      <button id="mobile-menu-btn" class="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8 bg-transparent border-0 cursor-pointer p-1">
        <span class="block w-5 h-0.5 bg-gray-700 rounded"></span>
        <span class="block w-5 h-0.5 bg-gray-700 rounded"></span>
        <span class="block w-5 h-0.5 bg-gray-700 rounded"></span>
      </button>
    </div>
  </div>
  <div id="mobile-menu" class="hidden border-t border-gray-100 bg-white">
    <nav class="flex flex-col py-2">
      ${NAV_LINKS.map(({ href, label, key }) => {
        const isActive = key === activePage;
        const cls = isActive ? 'text-primary font-semibold' : 'text-gray-700';
        return `<a href="${href}" class="px-6 py-3 text-base font-medium ${cls} hover:text-primary hover:bg-gray-50">${label}</a>`;
      }).join('')}
    </nav>
  </div>
</header>`;
}

function renderFooter() {
  const root = document.getElementById('footer-root');
  if (!root) return;

  root.outerHTML = `
<footer class="bg-gray-800 text-gray-300 py-12 mt-auto">
  <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
    <div>
      <h3 class="text-white text-lg font-semibold mb-4">BuildMart</h3>
      <p class="text-sm">Строительные материалы</p>
    </div>
    <div>
      <h4 class="text-white font-medium mb-3">Навигация</h4>
      <ul class="space-y-2 text-sm">
        <li><a href="index.html" class="hover:text-primary transition">Каталог</a></li>
        <li><a href="categories.html" class="hover:text-primary transition">Категории</a></li>
        <li><a href="deals.html" class="hover:text-primary transition">Акции</a></li>
      </ul>
    </div>
    <div>
      <h4 class="text-white font-medium mb-3">Контакты</h4>
      <ul class="space-y-2 text-sm">
        <li>+375 (29) 123-45-67</li>
        <li>support@buildmart.by</li>
        <li>г. Гродно</li>
      </ul>
    </div>
    <div>
      <h4 class="text-white font-medium mb-3">Мы в соцсетях</h4>
      <div class="flex gap-4">
        <a href="#" class="hover:text-primary transition">VK</a>
        <a href="#" class="hover:text-primary transition">Telegram</a>
      </div>
    </div>
  </div>
  <div class="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
    © 2025 BuildMart. Все права защищены.
  </div>
</footer>`;
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
    if (query) window.location.href = `index.html?search=${encodeURIComponent(query)}`;
  });
}

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });
}

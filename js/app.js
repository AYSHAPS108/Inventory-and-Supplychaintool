/**
 * ZENORA INVENTORY & SUPPLY CHAIN
 * Main Application Orchestrator & Router
 * work, simplified.
 */
import { store } from './store.js';
import { renderDashboardView }  from './components/dashboard.js';
import { renderProductsView }   from './components/products.js';
import { renderStockView }      from './components/stock.js';
import { renderWarehousesView } from './components/warehouses.js';
import { renderPurchasingView } from './components/purchasing.js';
import { renderTransfersView }  from './components/transfers.js';
import { renderCostingView }    from './components/costing.js';
import { renderReportsView }    from './components/reports.js';
import { renderSettingsView }   from './components/settings.js';

let currentRoute = 'dashboard';

// ─── Apply saved theme ASAP (before DOMContentLoaded if possible) ───
(function initThemeEarly() {
  try {
    const saved = localStorage.getItem('zenora-theme');
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    // Also migrate old localStorage key
    const oldSaved = localStorage.getItem('supplychain-theme');
    if (!saved && oldSaved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('zenora-theme', 'light');
    }
  } catch (e) {
    // localStorage not available — silent fail
  }
})();

document.addEventListener('DOMContentLoaded', async () => {
  await initApp();
});

async function initApp() {
  bindNavigation();
  bindGlobalEvents();
  bindThemeToggle();
  bindMobileSidebar();

  // Attempt to sync with backend — gracefully degrades to localStorage if backend is unavailable
  try {
    await store.syncWithBackend();
  } catch (err) {
    // Backend not available — running in offline/localStorage mode
    console.info('[Zenora] Backend not reachable — running in local mode:', err.message);
  }

  // Set default selected role in selector
  const role = store.getCurrentRole();
  const roleSwitcher = document.querySelector('#global-role-switcher');
  if (roleSwitcher) {
    roleSwitcher.value = role;
  }

  navigateTo('dashboard');
}

// ─── Navigation ───
function bindNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const route = item.dataset.route;
      if (route) {
        navigateTo(route);
        closeMobileSidebar();
      }
    });
    // Keyboard support
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const route = item.dataset.route;
        if (route) {
          navigateTo(route);
          closeMobileSidebar();
        }
      }
    });
  });
}

// ─── Mobile Sidebar ───
function bindMobileSidebar() {
  const hamburger = document.querySelector('#hamburger-btn');
  const sidebar   = document.querySelector('#main-sidebar');
  const overlay   = document.querySelector('#sidebar-overlay');

  if (!hamburger || !sidebar || !overlay) return;

  hamburger.addEventListener('click', () => {
    const isOpen = sidebar.classList.contains('mobile-open');
    if (isOpen) {
      closeMobileSidebar();
    } else {
      openMobileSidebar();
    }
  });

  overlay.addEventListener('click', () => {
    closeMobileSidebar();
  });
}

function openMobileSidebar() {
  const sidebar  = document.querySelector('#main-sidebar');
  const overlay  = document.querySelector('#sidebar-overlay');
  const hamburger = document.querySelector('#hamburger-btn');
  if (!sidebar || !overlay) return;
  sidebar.classList.add('mobile-open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (hamburger) {
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
  }
}

function closeMobileSidebar() {
  const sidebar  = document.querySelector('#main-sidebar');
  const overlay  = document.querySelector('#sidebar-overlay');
  const hamburger = document.querySelector('#hamburger-btn');
  if (!sidebar || !overlay) return;
  sidebar.classList.remove('mobile-open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  if (hamburger) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  }
}

// ─── Theme Toggle ───
function bindThemeToggle() {
  const toggleBtn = document.querySelector('#theme-toggle');
  const themeIcon = document.querySelector('#theme-icon');
  if (!toggleBtn || !themeIcon) return;

  // Set correct icon on load
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'light') {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
  } else {
    toggleBtn.setAttribute('aria-label', 'Switch to light mode');
  }

  toggleBtn.addEventListener('click', () => {
    const isCurrentlyDark = document.documentElement.getAttribute('data-theme') !== 'light';

    if (isCurrentlyDark) {
      document.documentElement.setAttribute('data-theme', 'light');
      try { localStorage.setItem('zenora-theme', 'light'); } catch (e) {}
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
      showToast('Switched to Light Mode ☀️', 'info');
    } else {
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('zenora-theme', 'dark'); } catch (e) {}
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      toggleBtn.setAttribute('aria-label', 'Switch to light mode');
      showToast('Switched to Dark Mode 🌙', 'info');
    }

    // Animate icon
    themeIcon.classList.remove('spin-in');
    void themeIcon.offsetWidth;
    themeIcon.classList.add('spin-in');
  });
}

// ─── Route Navigation ───
export function navigateTo(route, options = {}) {
  currentRoute = route;

  // Highlight navigation item
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.route === route) {
      item.classList.add('active');
      item.setAttribute('aria-current', 'page');
    } else {
      item.classList.remove('active');
      item.removeAttribute('aria-current');
    }
  });

  const PAGE_META = {
    'dashboard':  { title: 'Inventory Dashboard',           sub: 'Real-time stock levels, alerts & supply chain overview' },
    'products':   { title: 'Product Master Catalog',        sub: 'Full SKU directory with search, filters, categories & variants' },
    'stock':      { title: 'Stock Levels & Movements',      sub: 'Real-time stock on hand, warehouse locations, batches & serial registry' },
    'warehouses': { title: 'Warehouses & Storage Bins',     sub: 'Manage warehouse profiles, capacities, racks, shelves & bin locations' },
    'purchasing': { title: 'Procurement & Suppliers',       sub: 'Purchase orders, goods receiving, supplier management & procurement history' },
    'transfers':  { title: 'Stock Transfers & Adjustments', sub: 'Inter-warehouse transfers, stock adjustments & physical cycle counts' },
    'costing':    { title: 'Costing & Valuation',           sub: 'Inventory valuation (FIFO / Average Cost), cost history & margin analysis' },
    'reports':    { title: 'Reports Hub',                   sub: 'Generate, filter & export inventory, purchase, stock & supplier reports' },
    'settings':   { title: 'Settings',                      sub: 'System configuration, roles & permissions, integrations & preferences' },
  };

  const meta = PAGE_META[route];
  if (meta) {
    const headerTitle = document.querySelector('#header-page-title');
    const headerSub   = document.querySelector('#header-page-sub');
    if (headerTitle) headerTitle.textContent = meta.title;
    if (headerSub)   headerSub.textContent   = meta.sub;
    // Update browser tab title
    document.title = `${meta.title} — Zenora Inventory & Supply Chain`;
  }

  // Hide all view sections
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));

  // Show & render target view
  const container = document.querySelector(`#view-${route}`);
  if (!container) return;
  container.classList.add('active');

  switch (route) {
    case 'dashboard':  renderDashboardView(container, navigateTo, showToast);  break;
    case 'products':   renderProductsView(container, navigateTo, showToast, options); break;
    case 'stock':      renderStockView(container, navigateTo, showToast);      break;
    case 'warehouses': renderWarehousesView(container, navigateTo, showToast); break;
    case 'purchasing': renderPurchasingView(container, navigateTo, showToast); break;
    case 'transfers':  renderTransfersView(container, navigateTo, showToast);  break;
    case 'costing':    renderCostingView(container, navigateTo, showToast);    break;
    case 'reports':    renderReportsView(container, navigateTo, showToast);    break;
    case 'settings':   renderSettingsView(container, navigateTo, showToast);   break;
  }
}

// ─── Global Events ───
function bindGlobalEvents() {
  // Global search
  const globalSearch = document.querySelector('#global-quick-search');
  globalSearch?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = e.target.value.trim();
      if (val) {
        navigateTo('products', { searchQuery: val });
      }
    }
  });

  // Role Switcher
  document.querySelector('#global-role-switcher')?.addEventListener('change', (e) => {
    const selectedRole = e.target.value;
    store.setCurrentRole(selectedRole);
    showToast(`Role switched to: ${selectedRole}`, 'info');
    navigateTo(currentRoute);
  });

  // Reset Data
  document.querySelector('#btn-reset-data')?.addEventListener('click', () => {
    if (confirm('Reset all inventory data to default sample items?\n\nAll custom data will be lost.')) {
      store.resetToDefault();
      showToast('Data reset to factory defaults.', 'info');

      const roleSwitcher = document.querySelector('#global-role-switcher');
      if (roleSwitcher) roleSwitcher.value = 'Admin';

      navigateTo('dashboard');
    }
  });
}

// ─── Toast Notification System ───
export function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('role', 'status');
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: 'fa-circle-check',
    danger:  'fa-circle-exclamation',
    warning: 'fa-triangle-exclamation',
    info:    'fa-circle-info',
  };
  const icon = iconMap[type] || 'fa-circle-info';

  const iconColor = {
    success: 'var(--status-success)',
    danger:  'var(--status-danger)',
    warning: 'var(--status-warning)',
    info:    'var(--accent-primary)',
  };

  toast.innerHTML = `
    <i class="fa-solid ${icon}" style="color: ${iconColor[type] || 'var(--accent-primary)'}; flex-shrink: 0;" aria-hidden="true"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Max 5 toasts visible
  const toasts = toastContainer.querySelectorAll('.toast');
  if (toasts.length > 5) {
    toasts[0].remove();
  }

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 300);
  }, 3500);
}

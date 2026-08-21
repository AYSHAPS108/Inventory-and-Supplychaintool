/**
 * Main Application Orchestrator & Router
 */
import { store } from './store.js';
import { renderDashboardView } from './components/dashboard.js';
import { renderProductsView } from './components/products.js';
import { renderStockView } from './components/stock.js';
import { renderWarehousesView } from './components/warehouses.js';
import { renderPurchasingView } from './components/purchasing.js';
import { renderTransfersView } from './components/transfers.js';
import { renderCostingView } from './components/costing.js';
import { renderReportsView } from './components/reports.js';
import { renderSettingsView } from './components/settings.js';

let currentRoute = 'dashboard';

// ─── Theme: apply saved preference immediately to prevent flash ───
(function initThemeEarly() {
  try {
    const saved = localStorage.getItem('supplychain-theme');
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {
    console.warn('localStorage is not available for theme preference:', e);
  }
})();

document.addEventListener('DOMContentLoaded', async () => {
  await initApp();
});

async function initApp() {
  bindNavigation();
  bindGlobalEvents();
  bindThemeToggle();
  
  // Synchronize local state with live backend database
  await store.syncWithBackend();
  
  // Set default selected role in selector
  const role = store.getCurrentRole();
  const roleSwitcher = document.querySelector('#global-role-switcher');
  if (roleSwitcher) {
    roleSwitcher.value = role;
  }

  navigateTo('dashboard');
}

function bindNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const route = item.dataset.route;
      if (route) {
        navigateTo(route);
      }
    });
  });
}

// ─── Theme Toggle ───
function bindThemeToggle() {
  const toggleBtn = document.querySelector('#theme-toggle');
  const themeIcon = document.querySelector('#theme-icon');
  if (!toggleBtn || !themeIcon) return;

  // Set correct icon on load based on current theme
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'light') {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }

  toggleBtn.addEventListener('click', () => {
    const isCurrentlyDark = document.documentElement.getAttribute('data-theme') !== 'light';

    if (isCurrentlyDark) {
      // Switch to light
      document.documentElement.setAttribute('data-theme', 'light');
      try {
        localStorage.setItem('supplychain-theme', 'light');
      } catch (e) {
        console.warn('Unable to persist theme choice:', e);
      }
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      showToast('Switched to Light Mode ☀️', 'info');
    } else {
      // Switch to dark
      document.documentElement.removeAttribute('data-theme');
      try {
        localStorage.setItem('supplychain-theme', 'dark');
      } catch (e) {
        console.warn('Unable to persist theme choice:', e);
      }
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      showToast('Switched to Dark Mode 🌙', 'info');
    }

    // Animate the icon
    themeIcon.classList.remove('spin-in');
    void themeIcon.offsetWidth; // force reflow
    themeIcon.classList.add('spin-in');
  });
}

export function navigateTo(route, options = {}) {
  currentRoute = route;

  // Highlight navigation item
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.route === route) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Header Title Update
  const headerTitle = document.querySelector('#header-page-title');
  const headerSub = document.querySelector('#header-page-sub');

  const titles = {
    'dashboard': { title: 'Executive Inventory Dashboard', sub: 'Executive supply chain analytics, stock alerts, & valuation summary' },
    'products': { title: 'Product Catalog Master', sub: 'Comprehensive SKU directory with multi-filter, search, & variants' },
    'stock': { title: 'Stock Levels & Movements Ledger', sub: 'Real-time stock on hand, warehouse locations, batches, & serial registry' },
    'warehouses': { title: 'Warehouse & Storage Bins', sub: 'Manage warehouse profiles, capacities, racks, shelves, and location search' },
    'purchasing': { title: 'Procurement & Supplier Logistics', sub: 'Generate purchase orders, receive inventory against PO, & track suppliers' },
    'transfers': { title: 'Stock Transfers & Reconciliation', sub: 'Request warehouse transfers, log adjustments, and execute cycle counts' },
    'costing': { title: 'Financial Valuation & Costing', sub: 'Inventory valuation models (FIFO / Average Cost), cost history, & POS sync' },
    'reports': { title: 'Supply Chain Reports Hub', sub: 'Generate, filter, and export pre-built reports for audit logs and valuation' },
    'settings': { title: 'ERP Settings & Integrations', sub: 'Configure reorder thresholds, tax settings, barcode types, and mock integrations' }
  };

  if (titles[route]) {
    if (headerTitle) headerTitle.textContent = titles[route].title;
    if (headerSub) headerSub.textContent = titles[route].sub;
  }

  // Hide all sections
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));

  // Render view into target container
  const container = document.querySelector(`#view-${route}`);
  if (container) {
    container.classList.add('active');

    switch (route) {
      case 'dashboard':
        renderDashboardView(container, navigateTo, showToast);
        break;
      case 'products':
        renderProductsView(container, navigateTo, showToast, options);
        break;
      case 'stock':
        renderStockView(container, navigateTo, showToast);
        break;
      case 'warehouses':
        renderWarehousesView(container, navigateTo, showToast);
        break;
      case 'purchasing':
        renderPurchasingView(container, navigateTo, showToast);
        break;
      case 'transfers':
        renderTransfersView(container, navigateTo, showToast);
        break;
      case 'costing':
        renderCostingView(container, navigateTo, showToast);
        break;
      case 'reports':
        renderReportsView(container, navigateTo, showToast);
        break;
      case 'settings':
        renderSettingsView(container, navigateTo, showToast);
        break;
    }
  }
}

function bindGlobalEvents() {
  // Global search input in top bar
  const globalSearch = document.querySelector('#global-quick-search');
  globalSearch?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = e.target.value;
      navigateTo('products', { searchQuery: val });
    }
  });

  // Global Role Switcher Event
  document.querySelector('#global-role-switcher')?.addEventListener('change', (e) => {
    const selectedRole = e.target.value;
    store.setCurrentRole(selectedRole);
    showToast(`Session switched to Role: ${selectedRole}`, 'info');
    navigateTo(currentRoute); // Refresh current view under new role permissions
  });

  // Reset to default sample data button
  document.querySelector('#btn-reset-data')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all inventory data to default sample items? Custom changes will be overwritten.')) {
      store.resetToDefault();
      showToast('Database reset to factory default sample data.', 'info');
      
      // Update role switcher selector to default
      const roleSwitcher = document.querySelector('#global-role-switcher');
      if (roleSwitcher) {
        roleSwitcher.value = 'Admin';
      }

      navigateTo('dashboard');
    }
  });
}

// Toast notification helper
export function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? 'fa-circle-check' : type === 'danger' ? 'fa-circle-exclamation' : 'fa-circle-info';
  
  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

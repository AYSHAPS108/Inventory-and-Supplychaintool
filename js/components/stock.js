/**
 * Stock Management & Inventory Planning Component
 */
import { store } from '../store.js';

export function renderStockView(container, navigateTo, showToast) {
  let activeTab = 'overview';
  let searchQuery = '';
  let warehouseFilter = 'all';

  function updateUI() {
    const products = store.getProducts();
    const warehouses = store.getWarehouses();
    const movements = store.getMovements();
    const batches = store.getBatches();
    const serials = store.getSerials();
    const suppliers = store.getSuppliers();

    // Filters for Overview
    const filteredProducts = products.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchQ = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchWH = warehouseFilter === 'all' || p.warehouseId === warehouseFilter;
      return matchQ && matchWH;
    });

    container.innerHTML = `
      <!-- Toolbar Tabs -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); margin-bottom: 20px; padding-bottom: 10px; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; gap: 8px;">
          <button class="btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="overview">Stock Overview</button>
          <button class="btn ${activeTab === 'ledger' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="ledger">Stock Ledger</button>
          <button class="btn ${activeTab === 'batches' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="batches">Batches & Expiry</button>
          <button class="btn ${activeTab === 'serials' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="serials">Serial Registry</button>
          <button class="btn ${activeTab === 'reorder' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="reorder">Reorder Planning</button>
        </div>

        <div style="display: flex; gap: 10px;">
          <div class="search-input-box" style="min-width: 200px;">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="stock-search" placeholder="Search stock data..." value="${escapeHtml(searchQuery)}">
          </div>
          <select class="select-control btn-sm" id="stock-wh-filter">
            <option value="all">All Warehouses</option>
            ${warehouses.map(w => `<option value="${w.id}" ${warehouseFilter === w.id ? 'selected' : ''}>${w.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Tab Content Area -->
      <div id="stock-tab-content">
        ${renderActiveTabContent(filteredProducts, movements, batches, serials, suppliers, warehouses)}
      </div>
    `;

    bindEvents();
  }

  function renderActiveTabContent(products, movements, batches, serials, suppliers, warehouses) {
    if (activeTab === 'overview') {
      return `
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product Information</th>
                <th>SKU</th>
                <th>Warehouse Location</th>
                <th>Available</th>
                <th>Reserved (POS)</th>
                <th>Incoming (PO)</th>
                <th>Total On Hand</th>
                <th>Stock Value</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => {
                const wh = warehouses.find(w => w.id === p.warehouseId);
                const reserved = Math.floor(p.quantity * 0.1); // Mock 10% reserved
                const incoming = p.quantity <= p.minStock ? p.reorderQty : 0;
                const value = Number(p.costPrice) * Number(p.quantity);

                return `
                  <tr>
                    <td><b>${escapeHtml(p.name)}</b></td>
                    <td style="font-family: monospace; font-weight:700;">${p.sku}</td>
                    <td>
                      <span style="font-size: 0.85rem;"><i class="fa-solid fa-warehouse" style="margin-right: 4px; color: var(--text-muted);"></i> ${wh ? wh.code : 'Central'}</span>
                      <div style="font-size:0.75rem; color: var(--text-subtle); font-family: monospace;">Bin: ${p.locationBin || 'Unassigned'}</div>
                    </td>
                    <td><span style="font-weight:700;">${p.quantity - reserved} ${p.unit}</span></td>
                    <td style="color: var(--status-warning); font-weight:600;">${reserved} ${p.unit}</td>
                    <td style="color: var(--status-info); font-weight:600;">+${incoming} ${p.unit}</td>
                    <td><span class="badge badge-in-stock" style="font-size: 0.85rem;">${p.quantity} ${p.unit}</span></td>
                    <td style="font-weight: 700; color: var(--accent-secondary);">$${value.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (activeTab === 'ledger') {
      return `
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>SKU / Product</th>
                <th>Action Type</th>
                <th>Qty Delta</th>
                <th>Warehouse</th>
                <th>Reference ID</th>
                <th>Receiving Notes</th>
              </tr>
            </thead>
            <tbody>
              ${movements.map(m => {
                const p = store.getProducts().find(prod => prod.id === m.productId);
                const wh = warehouses.find(w => w.id === m.warehouseId);
                const isPositive = m.qty > 0;

                return `
                  <tr>
                    <td style="font-size: 0.8rem; color: var(--text-muted);">${new Date(m.date).toLocaleString()}</td>
                    <td>
                      <div style="font-weight:700;">${p ? escapeHtml(p.name) : 'Deleted Product'}</div>
                      <div style="font-size:0.75rem; font-family: monospace; color: var(--text-subtle);">SKU: ${p ? p.sku : 'N/A'}</div>
                    </td>
                    <td><span class="badge ${isPositive ? 'badge-in-stock' : 'badge-out-stock'}">${m.type}</span></td>
                    <td style="font-weight: 800; color: ${isPositive ? 'var(--status-success)' : 'var(--status-danger)'};">
                      ${isPositive ? '+' : ''}${m.qty}
                    </td>
                    <td>${wh ? wh.name : 'Central Logistics'}</td>
                    <td style="font-family: monospace; font-size:0.8rem;">${m.source}</td>
                    <td style="font-size:0.8rem; color: var(--text-muted);">${m.notes || ''}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (activeTab === 'batches') {
      const mockToday = new Date('2026-08-06').getTime();
      return `
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product Info</th>
                <th>Batch Number</th>
                <th>Manufacturing Date</th>
                <th>Expiry Date</th>
                <th>Days Remaining</th>
                <th>Batch Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${batches.map(b => {
                const p = store.getProducts().find(prod => prod.id === b.productId);
                const expTime = new Date(b.expiryDate).getTime();
                const diffDays = Math.ceil((expTime - mockToday) / 86400000);
                const isExpired = diffDays <= 0;
                const isNearExpiry = diffDays > 0 && diffDays <= 90;

                let statusBadge = '<span class="badge badge-in-stock">Safe</span>';
                if (isExpired) {
                  statusBadge = '<span class="badge badge-out-stock">Expired</span>';
                } else if (isNearExpiry) {
                  statusBadge = '<span class="badge badge-low-stock">Near Expiry</span>';
                }

                return `
                  <tr>
                    <td><b>${p ? escapeHtml(p.name) : 'N/A'}</b></td>
                    <td style="font-family: monospace; font-weight:700;">${b.batchNumber}</td>
                    <td>${b.manufacturingDate}</td>
                    <td style="font-weight: 600; color: ${isExpired ? 'var(--status-danger)' : isNearExpiry ? 'var(--status-warning)' : 'var(--text-main)'}">${b.expiryDate}</td>
                    <td>
                      <b style="color: ${isExpired ? 'var(--status-danger)' : isNearExpiry ? 'var(--status-warning)' : 'var(--status-success)'}">
                        ${isExpired ? 'EXPIRED' : `${diffDays} days`}
                      </b>
                    </td>
                    <td><b>${b.quantity}</b></td>
                    <td>${statusBadge}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (activeTab === 'serials') {
      return `
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Registered Serial Number</th>
                <th>Assigned Product SKU</th>
                <th>Product Name</th>
                <th>Warehouse Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${serials.map(s => {
                const p = store.getProducts().find(prod => prod.id === s.productId);
                const wh = warehouses.find(w => w.id === s.warehouseId);

                return `
                  <tr>
                    <td style="font-family: monospace; font-weight: 800; color: var(--accent-primary);">${s.serialNumber}</td>
                    <td style="font-family: monospace;">${p ? p.sku : 'N/A'}</td>
                    <td><b>${p ? escapeHtml(p.name) : 'N/A'}</b></td>
                    <td>${wh ? wh.code : 'Central'} - ${s.locationBin || 'A-12'}</td>
                    <td><span class="badge badge-in-stock">${s.status}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (activeTab === 'reorder') {
      // Reorder recommendation engine based on min/max constraints
      const reorderList = products.filter(p => p.quantity <= p.reorderLevel);

      return `
        <div class="card" style="background-color: var(--bg-secondary); border-color: rgba(99,102,241,0.2); margin-bottom: 20px; padding: 16px;">
          <h3 style="font-size: 1rem;"><i class="fa-solid fa-wand-magic-sparkles" style="color: var(--accent-primary); margin-right: 8px;"></i> Smart Procurement Assistant</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">The system automatically scans min/max thresholds, detects out-of-stock items, and recommends replenishment items based on supplier lead times.</p>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Min / Max Caps</th>
                <th>Lead Time</th>
                <th>Recommended Supplier</th>
                <th>Suggested Purchase Qty</th>
                <th>Estimated Cost Basis</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${reorderList.map(p => {
                const sup = suppliers.find(s => s.id === p.supplierId) || { name: 'Apex Automation Corp', leadTimeDays: 7 };
                const suggestQty = Math.max(p.reorderQty || 100, (p.maxStock || 500) - p.quantity);
                const estCost = suggestQty * p.costPrice;

                return `
                  <tr>
                    <td>
                      <b>${escapeHtml(p.name)}</b>
                      <div style="font-size: 0.75rem; color: var(--text-subtle);">SKU: ${p.sku}</div>
                    </td>
                    <td>
                      <span class="badge badge-low-stock" style="font-weight: 700;">${p.quantity} ${p.unit}</span>
                    </td>
                    <td style="font-size: 0.85rem; color: var(--text-muted);">
                      Min: ${p.minStock} | Max: ${p.maxStock || 500}
                    </td>
                    <td><i class="fa-solid fa-clock"></i> ${sup.leadTimeDays} Days</td>
                    <td><b>${sup.name}</b></td>
                    <td>
                      <span style="font-weight: 800; color: var(--status-info);">+${suggestQty} ${p.unit}</span>
                    </td>
                    <td style="font-weight: 700; color: var(--status-success);">$${estCost.toFixed(2)}</td>
                    <td style="text-align: right;">
                      <button class="btn btn-primary btn-sm btn-reorder-po" data-prodid="${p.id}" data-supid="${p.supplierId || 'sup-1'}" data-qty="${suggestQty}" data-cost="${estCost}">
                        <i class="fa-solid fa-cart-plus"></i> Auto PO
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
              ${reorderList.length === 0 ? `
                <tr>
                  <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 30px;">
                    <i class="fa-solid fa-circle-check" style="font-size: 2rem; color: var(--status-success); margin-bottom: 8px;"></i>
                    <p>All stock levels are perfectly above reorder levels!</p>
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>
      `;
    }
  }

  function bindEvents() {
    // Tab switching
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        updateUI();
      });
    });

    // Search input
    container.querySelector('#stock-search')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      // Filter dynamically
      const content = container.querySelector('#stock-tab-content');
      // For fast update, let's re-render
      updateUI();
    });

    // WH Filter
    container.querySelector('#stock-wh-filter')?.addEventListener('change', (e) => {
      warehouseFilter = e.target.value;
      updateUI();
    });

    // Auto PO order buttons
    container.querySelectorAll('.btn-reorder-po').forEach(btn => {
      btn.addEventListener('click', () => {
        // Role check
        const role = store.getCurrentRole();
        if (role === 'Warehouse Staff' || role === 'View Only') {
          showToast(`Access Denied: Role '${role}' does not have procurement authorization.`, 'danger');
          return;
        }

        const prodId = btn.dataset.prodid;
        const supId = btn.dataset.supid;
        const qty = Number(btn.dataset.qty);
        const cost = Number(btn.dataset.cost);
        const p = store.getProductById(prodId);

        // Create PO
        const po = store.createPurchaseOrder(supId, p.warehouseId || 'wh-1', cost, 1);
        // Add items to PO
        const list = store.getPurchaseOrders();
        const createdPO = list.find(item => item.id === po.id);
        createdPO.items = [{ productId: prodId, qty: qty, price: p.costPrice }];
        store.setItem('esct_purchase_orders_v3', list);

        showToast(`Auto PO raised! PO Number: ${po.poNumber}. Supplier order queued.`, 'success');
        navigateTo('purchasing');
      });
    });
  }

  updateUI();
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

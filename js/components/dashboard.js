/**
 * Executive Inventory & Supply Chain Dashboard
 */
import { store } from '../store.js';

export function renderDashboardView(container, navigateTo, showToast) {
  const metrics = store.getMetrics();
  const products = store.getProducts();
  const movements = store.getMovements();
  const pos = store.getPurchaseOrders();
  const transfers = store.getTransfers();
  const batches = store.getBatches();
  
  // Calculate stock-in and stock-out counts from movements
  const stockInCount = movements.filter(m => m.type === 'RECEIPT' || m.type === 'ADJUSTMENT_IN').reduce((sum, m) => sum + Math.abs(m.qty), 0);
  const stockOutCount = movements.filter(m => m.type === 'DISPATCHED' || m.type === 'ADJUSTMENT_OUT' || (m.type === 'TRANSFER' && m.qty > 0)).reduce((sum, m) => sum + Math.abs(m.qty), 0);

  // Critical alerts
  const lowStockItems = products.filter(p => p.quantity > 0 && p.quantity <= p.minStock);
  const outOfStockItems = products.filter(p => p.quantity === 0);
  
  // Near expiry alert list (within 90 days from mock date 2026-08-06)
  const mockToday = new Date('2026-08-06').getTime();
  const nearExpiryThreshold = 90 * 86400000;
  const expiringBatches = batches.filter(b => {
    const expTime = new Date(b.expiryDate).getTime();
    return expTime > mockToday && (expTime - mockToday) <= nearExpiryThreshold;
  });

  container.innerHTML = `
    <!-- Top 4 Metrics Row -->
    <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-bottom: 24px;">
      <div class="kpi-card kpi-blue">
        <div class="kpi-header">
          <span class="kpi-title">Total Active SKUs</span>
          <div class="kpi-icon"><i class="fa-solid fa-boxes-stacked"></i></div>
        </div>
        <div class="kpi-value">${metrics.totalProducts}</div>
        <div class="kpi-subtext"><i class="fa-solid fa-folder-tree"></i> Across ${metrics.totalCategories} categories</div>
      </div>

      <div class="kpi-card kpi-green">
        <div class="kpi-header">
          <span class="kpi-title">Total Stock Value</span>
          <div class="kpi-icon"><i class="fa-solid fa-sack-dollar"></i></div>
        </div>
        <div class="kpi-value">$${metrics.totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        <div class="kpi-subtext"><i class="fa-solid fa-hand-holding-dollar"></i> Cost Basis: $${metrics.totalCostValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
      </div>

      <div class="kpi-card kpi-warning">
        <div class="kpi-header">
          <span class="kpi-title">Low Stock Items</span>
          <div class="kpi-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
        </div>
        <div class="kpi-value">${metrics.lowStockCount}</div>
        <div class="kpi-subtext">Items below min threshold</div>
      </div>

      <div class="kpi-card kpi-danger">
        <div class="kpi-header">
          <span class="kpi-title">Out of Stock</span>
          <div class="kpi-icon"><i class="fa-solid fa-circle-xmark"></i></div>
        </div>
        <div class="kpi-value">${metrics.outOfStockCount}</div>
        <div class="kpi-subtext">Requires immediate order</div>
      </div>
    </div>

    <!-- Secondary Metrics Row -->
    <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 24px;">
      <div class="kpi-card" style="padding: 16px 20px;">
        <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Overstock Items</div>
        <div style="font-size: 1.4rem; font-weight: 700; margin-top: 4px; color: #818cf8;">${metrics.overStockCount} Items</div>
        <div style="font-size: 0.75rem; color: var(--text-subtle); margin-top: 2px;">Exceeding maximum caps</div>
      </div>

      <div class="kpi-card" style="padding: 16px 20px;">
        <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Total Stock In</div>
        <div style="font-size: 1.4rem; font-weight: 700; margin-top: 4px; color: var(--status-success);">+${stockInCount} Units</div>
        <div style="font-size: 0.75rem; color: var(--text-subtle); margin-top: 2px;">Procured & adjusted items</div>
      </div>

      <div class="kpi-card" style="padding: 16px 20px;">
        <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Total Stock Out</div>
        <div style="font-size: 1.4rem; font-weight: 700; margin-top: 4px; color: var(--status-danger);">-${stockOutCount} Units</div>
        <div style="font-size: 0.75rem; color: var(--text-subtle); margin-top: 2px;">Dispatched & loss logs</div>
      </div>

      <div class="kpi-card" style="padding: 16px 20px;">
        <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Pending Purchases</div>
        <div style="font-size: 1.4rem; font-weight: 700; margin-top: 4px; color: var(--status-info);">${metrics.pendingPOs} POs</div>
        <div style="font-size: 0.75rem; color: var(--text-subtle); margin-top: 2px;">Awaiting receipt delivery</div>
      </div>

      <div class="kpi-card" style="padding: 16px 20px;">
        <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Pending Transfers</div>
        <div style="font-size: 1.4rem; font-weight: 700; margin-top: 4px; color: var(--status-warning);">${metrics.pendingTransfers} Transfers</div>
        <div style="font-size: 0.75rem; color: var(--text-subtle); margin-top: 2px;">In-transit warehouse stock</div>
      </div>
    </div>

    <!-- Quick Actions Panel -->
    <div class="card" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(99, 102, 241, 0.1)); margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <h3 style="font-size: 1.05rem; font-weight: 700;"><i class="fa-solid fa-bolt" style="color: var(--status-warning); margin-right: 8px;"></i> Quick Inventory Actions</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted);">Quick shortcut routes to initiate operational tasks.</p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" id="btn-quick-add"><i class="fa-solid fa-plus"></i> New Product</button>
          <button class="btn btn-secondary btn-sm" id="btn-quick-transfer"><i class="fa-solid fa-truck-ramp-box"></i> Stock Transfer</button>
          <button class="btn btn-secondary btn-sm" id="btn-quick-po"><i class="fa-solid fa-cart-shopping"></i> Raise PO</button>
          <button class="btn btn-secondary btn-sm" id="btn-quick-adjust"><i class="fa-solid fa-sliders"></i> Stock Adjustment</button>
          <button class="btn btn-secondary btn-sm" id="btn-quick-count"><i class="fa-solid fa-clipboard-check"></i> Physical Audit</button>
        </div>
      </div>
    </div>

    <!-- Two Column Dashboard Grid -->
    <div class="dashboard-grid">
      <!-- Left Column: Moving items & Critical Alerts -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
        
        <!-- Alerts Widget -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fa-solid fa-bell-exclamation" style="color: var(--status-danger);"></i> Critical Stock Alerts</div>
            <span class="badge badge-low-stock">${lowStockItems.length + outOfStockItems.length + expiringBatches.length} Critical Alerts</span>
          </div>

          <div class="alert-list">
            ${outOfStockItems.map(p => `
              <div class="alert-item out-of-stock">
                <div class="alert-info">
                  <div style="background-color: var(--status-danger-bg); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: var(--status-danger);"><i class="fa-solid fa-ban"></i></div>
                  <div class="alert-text">
                    <h4>${p.name}</h4>
                    <p>SKU: ${p.sku} | Location: ${p.locationBin || 'N/A'}</p>
                  </div>
                </div>
                <span class="badge badge-out-stock">OUT OF STOCK</span>
              </div>
            `).join('')}

            ${lowStockItems.map(p => `
              <div class="alert-item">
                <div class="alert-info">
                  <div style="background-color: var(--status-warning-bg); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: var(--status-warning);"><i class="fa-solid fa-triangle-exclamation"></i></div>
                  <div class="alert-text">
                    <h4>${p.name}</h4>
                    <p>SKU: ${p.sku} | Location: ${p.locationBin || 'N/A'}</p>
                  </div>
                </div>
                <span class="badge badge-low-stock">LOW STOCK: ${p.quantity} left</span>
              </div>
            `).join('')}

            ${expiringBatches.map(b => {
              const p = products.find(prod => prod.id === b.productId);
              return `
                <div class="alert-item" style="border-left-color: #f59e0b;">
                  <div class="alert-info">
                    <div style="background-color: rgba(245,158,11,0.15); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: #f59e0b;"><i class="fa-solid fa-hourglass-half"></i></div>
                    <div class="alert-text">
                      <h4>Batch ${b.batchNumber} - Expiring soon</h4>
                      <p>Product: ${p ? p.name : 'Unknown'} | Expiry: ${b.expiryDate}</p>
                    </div>
                  </div>
                  <span class="badge badge-category" style="background-color: rgba(245,158,11,0.15); color: #f59e0b;">BATCH EXPIRY</span>
                </div>
              `;
            }).join('')}

            ${outOfStockItems.length === 0 && lowStockItems.length === 0 && expiringBatches.length === 0 ? `
              <div style="text-align: center; color: var(--text-muted); padding: 20px 0;">
                <i class="fa-solid fa-circle-check" style="font-size: 2rem; color: var(--status-success); margin-bottom: 8px;"></i>
                <p>All stock counts and batch expiry dates are optimal!</p>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Product Performance Rankings -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fa-solid fa-ranking-star"></i> Product Turn Performance</div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <!-- Top Moving -->
            <div>
              <h4 style="font-size: 0.85rem; color: var(--status-success); margin-bottom: 12px;"><i class="fa-solid fa-arrow-trend-up"></i> Top Moving Products</h4>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); padding: 8px 12px; border-radius: var(--radius-sm);">
                  <div style="font-size: 0.85rem; font-weight:600; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:130px;">Industrial Optocoupler</div>
                  <span style="font-size: 0.8rem; font-weight:700; color: var(--status-success);">High Turnover</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); padding: 8px 12px; border-radius: var(--radius-sm);">
                  <div style="font-size: 0.85rem; font-weight:600; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:130px;">Shipping Boxes</div>
                  <span style="font-size: 0.8rem; font-weight:700; color: var(--status-success);">Fast Moving</span>
                </div>
              </div>
            </div>
            <!-- Slow Moving -->
            <div>
              <h4 style="font-size: 0.85rem; color: var(--status-danger); margin-bottom: 12px;"><i class="fa-solid fa-arrow-trend-down"></i> Slow Moving / Aging</h4>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); padding: 8px 12px; border-radius: var(--radius-sm);">
                  <div style="font-size: 0.85rem; font-weight:600; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:130px;">3-Phase AC Motor</div>
                  <span style="font-size: 0.8rem; font-weight:700; color: var(--status-danger);">Aging: 60+ Days</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); padding: 8px 12px; border-radius: var(--radius-sm);">
                  <div style="font-size: 0.85rem; font-weight:600; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:130px;">ANSI Hard Hat</div>
                  <span style="font-size: 0.8rem; font-weight:700; color: var(--status-warning);">Low Velocity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Recent Activity Ledger -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fa-solid fa-clock-rotate-left"></i> Live Supply Chain Logs</div>
          <button class="btn btn-secondary btn-sm" id="btn-view-ledger-all">Ledger Hub</button>
        </div>
        
        <div class="alert-list">
          ${movements.slice(0, 7).map(m => {
            const p = products.find(prod => prod.id === m.productId);
            const isPositive = m.qty > 0;
            return `
              <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span style="font-size: 0.725rem; color: var(--text-subtle);">${new Date(m.date).toLocaleString()}</span>
                  <h4 style="font-size: 0.85rem; font-weight: 700; margin-top: 2px;">${p ? p.name : 'Unknown Product'}</h4>
                  <p style="font-size: 0.775rem; color: var(--text-muted); margin-top: 1px;">Ref: ${m.source} | ${m.notes || ''}</p>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 1rem; font-weight: 800; color: ${isPositive ? 'var(--status-success)' : 'var(--status-danger)'};">
                    ${isPositive ? '+' : ''}${m.qty}
                  </span>
                  <div style="font-size: 0.725rem; font-weight: 600;" class="badge ${isPositive ? 'badge-in-stock' : 'badge-out-stock'}">${m.type}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  // Bind events
  container.querySelector('#btn-quick-add')?.addEventListener('click', () => navigateTo('products', { openForm: true }));
  container.querySelector('#btn-quick-transfer')?.addEventListener('click', () => navigateTo('transfers'));
  container.querySelector('#btn-quick-po')?.addEventListener('click', () => navigateTo('purchasing'));
  container.querySelector('#btn-quick-adjust')?.addEventListener('click', () => navigateTo('transfers'));
  container.querySelector('#btn-quick-count')?.addEventListener('click', () => navigateTo('transfers'));
  container.querySelector('#btn-view-ledger-all')?.addEventListener('click', () => navigateTo('stock'));
}

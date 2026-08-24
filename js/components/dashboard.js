/**
 * ZENORA INVENTORY & SUPPLY CHAIN
 * Executive Inventory Dashboard Component
 */
import { store } from '../store.js';

export function renderDashboardView(container, navigateTo, showToast) {
  const metrics   = store.getMetrics();
  const products  = store.getProducts();
  const movements = store.getMovements();
  const batches   = store.getBatches();
  const settings  = store.getSettings();
  const warehouses = store.getWarehouses();

  const currencySymbol = settings.currency ? settings.currency.match(/[\$€£₹]/)?.[0] || '$' : '$';

  // Movement totals
  const stockInCount  = movements
    .filter(m => m.type === 'RECEIPT' || m.type === 'ADJUSTMENT_IN')
    .reduce((sum, m) => sum + Math.abs(m.qty), 0);
  const stockOutCount = movements
    .filter(m => m.type === 'DISPATCHED' || m.type === 'ADJUSTMENT_OUT')
    .reduce((sum, m) => sum + Math.abs(m.qty), 0);

  // Dynamic product performance
  const topMoving  = store.getTopMovingProducts(3);
  const slowMoving = store.getSlowMovingProducts(3);

  // Reorder suggestions — products at or below reorder level
  const reorderNeeded = products.filter(p => Number(p.quantity) <= Number(p.reorderLevel || p.minStock)).slice(0, 5);

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
    <div class="card" style="background: linear-gradient(135deg, rgba(18,63,168,0.12), rgba(22,93,255,0.06)); border-color: rgba(22,93,255,0.2); margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <h3 style="font-size: 1rem; font-weight: 700; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-bolt" style="color: var(--status-warning);"></i> Quick Actions</h3>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">Shortcuts to common inventory operations.</p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" id="btn-quick-add"><i class="fa-solid fa-plus" aria-hidden="true"></i> New Product</button>
          <button class="btn btn-secondary btn-sm" id="btn-quick-transfer"><i class="fa-solid fa-truck-ramp-box" aria-hidden="true"></i> Transfer Stock</button>
          <button class="btn btn-secondary btn-sm" id="btn-quick-po"><i class="fa-solid fa-cart-shopping" aria-hidden="true"></i> Raise PO</button>
          <button class="btn btn-secondary btn-sm" id="btn-quick-adjust"><i class="fa-solid fa-sliders" aria-hidden="true"></i> Adjust Stock</button>
          <button class="btn btn-secondary btn-sm" id="btn-quick-count"><i class="fa-solid fa-clipboard-check" aria-hidden="true"></i> Stock Count</button>
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

        <!-- Product Performance Rankings (Dynamic) -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fa-solid fa-ranking-star"></i> Product Velocity Ranking</div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <!-- Top Moving -->
            <div>
              <h4 style="font-size: 0.82rem; color: var(--status-success); margin-bottom: 12px; display:flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-arrow-trend-up"></i> Top Moving
              </h4>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${topMoving.length > 0
                  ? topMoving.map(p => `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-primary); padding:8px 12px; border-radius:var(--radius-sm); gap:8px;">
                      <div style="font-size:0.82rem; font-weight:600; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; flex:1;" title="${p.name}">${p.name}</div>
                      <span style="font-size:0.75rem; font-weight:700; color:var(--status-success); white-space:nowrap;">${p.movementVolume} units</span>
                    </div>
                  `).join('')
                  : `<div style="font-size:0.82rem; color:var(--text-subtle); padding:8px;">No movement data yet.</div>`
                }
              </div>
            </div>
            <!-- Slow / Aging -->
            <div>
              <h4 style="font-size:0.82rem; color:var(--status-warning); margin-bottom:12px; display:flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-arrow-trend-down"></i> Slow Moving
              </h4>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${slowMoving.length > 0
                  ? slowMoving.map(p => {
                      const days = p.daysSinceLastMovement;
                      const label = days >= 999 ? 'No activity' : `${days}d idle`;
                      const color = days > 60 ? 'var(--status-danger)' : 'var(--status-warning)';
                      return `
                        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-primary); padding:8px 12px; border-radius:var(--radius-sm); gap:8px;">
                          <div style="font-size:0.82rem; font-weight:600; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; flex:1;" title="${p.name}">${p.name}</div>
                          <span style="font-size:0.75rem; font-weight:700; color:${color}; white-space:nowrap;">${label}</span>
                        </div>
                      `;
                    }).join('')
                  : `<div style="font-size:0.82rem; color:var(--text-subtle); padding:8px;">All products are active.</div>`
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Reorder Suggestions -->
        ${reorderNeeded.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fa-solid fa-rotate" style="color:var(--status-warning);"></i> Reorder Suggestions</div>
            <button class="btn btn-secondary btn-sm" id="btn-view-purchasing"><i class="fa-solid fa-cart-plus"></i> View Procurement</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${reorderNeeded.map(p => {
              const cat = store.getCategoryById(p.categoryId);
              return `
                <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-primary); padding:10px 14px; border-radius:var(--radius-md); border-left:3px solid var(--status-warning); gap:12px;">
                  <div style="flex:1; min-width:0;">
                    <div style="font-size:0.85rem; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${p.sku} &nbsp;·&nbsp; ${cat ? cat.name : 'Uncategorized'}</div>
                  </div>
                  <div style="text-align:right; flex-shrink:0;">
                    <div style="font-size:0.82rem; font-weight:700; color:var(--status-warning);">Qty: ${p.quantity}</div>
                    <div style="font-size:0.75rem; color:var(--text-subtle);">Reorder at: ${p.reorderLevel || p.minStock}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        ` : ''}
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
  container.querySelector('#btn-view-purchasing')?.addEventListener('click', () => navigateTo('purchasing'));
}


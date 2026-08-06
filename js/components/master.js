/**
 * Product Master Dashboard Component
 */
import { store } from '../store.js';

export function renderProductMasterView(container, navigateTo) {
  const metrics = store.getMetrics();
  const products = store.getProducts();
  const categories = store.getCategories();
  
  // Filter alert items
  const alertItems = products.filter(p => p.quantity <= p.minStock);

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card kpi-blue">
        <div class="kpi-header">
          <span class="kpi-title">Total Active SKUs</span>
          <div class="kpi-icon"><i class="fa-solid fa-boxes-stacked"></i></div>
        </div>
        <div class="kpi-value">${metrics.totalProducts}</div>
        <div class="kpi-subtext"><i class="fa-solid fa-layer-group"></i> Across ${metrics.totalCategories} Categories</div>
      </div>

      <div class="kpi-card kpi-green">
        <div class="kpi-header">
          <span class="kpi-title">Total Inventory Valuation</span>
          <div class="kpi-icon"><i class="fa-solid fa-sack-dollar"></i></div>
        </div>
        <div class="kpi-value">$${metrics.totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        <div class="kpi-subtext"><i class="fa-solid fa-arrow-trend-up"></i> Cost basis: $${metrics.totalCostValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
      </div>

      <div class="kpi-card kpi-warning">
        <div class="kpi-header">
          <span class="kpi-title">Low Stock Alerts</span>
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
        <div class="kpi-subtext">Requires immediate reorder</div>
      </div>
    </div>

    <!-- Dashboard Content Grid -->
    <div class="dashboard-grid">
      <!-- Left Column: Category Stock Analytics & Chart -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <i class="fa-solid fa-chart-pie"></i> Inventory Distribution by Category
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-export-master">
            <i class="fa-solid fa-download"></i> Export Summary
          </button>
        </div>
        <div class="category-analytics-bars" style="display: flex; flex-direction: column; gap: 18px; margin-top: 10px;">
          ${renderCategoryBars(categories, products, metrics.totalValue)}
        </div>
      </div>

      <!-- Right Column: Low Stock Alerts Widget -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <i class="fa-solid fa-bell"></i> Critical Inventory Alerts
          </div>
          <span class="badge badge-low-stock">${alertItems.length} Items</span>
        </div>

        <div class="alert-list">
          ${alertItems.length === 0 ? `
            <div style="text-align: center; color: var(--text-muted); padding: 30px 0;">
              <i class="fa-solid fa-circle-check" style="font-size: 2.5rem; color: var(--status-success); margin-bottom: 10px;"></i>
              <p>All stock levels are optimal!</p>
            </div>
          ` : alertItems.map(p => {
            const isOut = p.quantity === 0;
            return `
              <div class="alert-item ${isOut ? 'out-of-stock' : ''}">
                <div class="alert-info">
                  <img src="${p.image}" alt="${p.name}" class="alert-thumb" onerror="this.src='https://via.placeholder.com/40'">
                  <div class="alert-text">
                    <h4>${p.name}</h4>
                    <p>SKU: ${p.sku} | Location: ${p.locationBin}</p>
                  </div>
                </div>
                <div>
                  <span class="alert-badge ${isOut ? 'badge-out-stock' : 'badge-low-stock'}">
                    ${isOut ? 'Out of Stock' : `${p.quantity} ${p.unit} (Min: ${p.minStock})`}
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Quick Actions Banner -->
    <div class="card" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(99, 102, 241, 0.15));">
      <div class="card-header" style="border: none; margin-bottom: 0;">
        <div>
          <h3 style="font-size: 1.1rem; margin-bottom: 4px;">Quick Management Actions</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Manage product master catalog, add new inventory, or update category hierarchy.</p>
        </div>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-primary" id="btn-quick-add-prod">
            <i class="fa-solid fa-plus"></i> Add New Product
          </button>
          <button class="btn btn-secondary" id="btn-quick-manage-cats">
            <i class="fa-solid fa-folder-plus"></i> Manage Categories
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach button event listeners
  container.querySelector('#btn-quick-add-prod')?.addEventListener('click', () => navigateTo('product-form'));
  container.querySelector('#btn-quick-manage-cats')?.addEventListener('click', () => navigateTo('categories'));
  container.querySelector('#btn-export-master')?.addEventListener('click', () => exportSummaryCSV(products));
}

function renderCategoryBars(categories, products, grandTotalValue) {
  return categories.map(cat => {
    const catProducts = products.filter(p => p.categoryId === cat.id);
    const catItemCount = catProducts.length;
    const catValuation = catProducts.reduce((sum, p) => sum + (Number(p.sellingPrice) * Number(p.quantity)), 0);
    const percent = grandTotalValue > 0 ? Math.round((catValuation / grandTotalValue) * 100) : 0;

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 0.875rem;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${cat.color};"></span>
            <span style="font-weight: 600;">${cat.name}</span>
            <span style="color: var(--text-subtle); font-size: 0.775rem;">(${catItemCount} SKUs)</span>
          </div>
          <div>
            <span style="font-weight: 700;">$${catValuation.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            <span style="color: var(--text-muted); font-size: 0.775rem; margin-left: 6px;">(${percent}%)</span>
          </div>
        </div>
        <div style="width: 100%; height: 10px; background-color: var(--bg-primary); border-radius: 5px; overflow: hidden;">
          <div style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, ${cat.color}, ${cat.color}dd); border-radius: 5px; transition: width 0.6s ease;"></div>
        </div>
      </div>
    `;
  }).join('');
}

function exportSummaryCSV(products) {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "ID,SKU,Name,Category,CostPrice,SellingPrice,Quantity,MinStock,Supplier,LocationBin\n";
  
  products.forEach(p => {
    const row = [
      p.id,
      `"${p.sku}"`,
      `"${p.name}"`,
      `"${p.categoryId}"`,
      p.costPrice,
      p.sellingPrice,
      p.quantity,
      p.minStock,
      `"${p.supplier}"`,
      `"${p.locationBin}"`
    ].join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Product_Master_Export_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Inventory Valuation, Costing, & Integrations Component
 */
import { store } from '../store.js';

export function renderCostingView(container, navigateTo, showToast) {
  let activeTab = 'valuation';

  function updateUI() {
    const products = store.getProducts();
    const settings = store.getSettings();
    const valuation = store.getValuationMetrics();

    container.innerHTML = `
      <!-- Toolbar Tabs -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); margin-bottom: 20px; padding-bottom: 10px; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; gap: 8px;">
          <button class="btn ${activeTab === 'valuation' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="valuation">Asset Valuation</button>
          <button class="btn ${activeTab === 'integrations' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="integrations">System Integrations</button>
        </div>

        <div style="display: flex; gap: 10px; align-items: center;">
          <span style="font-size:0.85rem; color:var(--text-muted);">Active Valuation Model:</span>
          <select class="select-control btn-sm" id="costing-method-select">
            <option value="Average Costing" ${settings.costingMethod === 'Average Costing' ? 'selected' : ''}>Weighted Average Cost</option>
            <option value="FIFO" ${settings.costingMethod === 'FIFO' ? 'selected' : ''}>FIFO (First In, First Out)</option>
          </select>
        </div>
      </div>

      <!-- Tab Content -->
      <div id="costing-tab-content">
        ${renderActiveTabContent(products, valuation, settings)}
      </div>
    `;

    bindEvents();
  }

  function renderActiveTabContent(products, valuation, settings) {
    if (activeTab === 'valuation') {
      return `
        <!-- Valuation Metrics Grid -->
        <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-bottom: 20px;">
          <div class="kpi-card kpi-green">
            <div class="kpi-header">
              <span class="kpi-title">Cost Value (Assets Basis)</span>
              <div class="kpi-icon"><i class="fa-solid fa-calculator"></i></div>
            </div>
            <div class="kpi-value">$${valuation.costValuation.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <div class="kpi-subtext">Total balance sheet book value</div>
          </div>

          <div class="kpi-card kpi-blue">
            <div class="kpi-header">
              <span class="kpi-title">Retail Value (Market Basis)</span>
              <div class="kpi-icon"><i class="fa-solid fa-chart-line"></i></div>
            </div>
            <div class="kpi-value">$${valuation.retailValuation.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <div class="kpi-subtext">Estimated sales yield value</div>
          </div>

          <div class="kpi-card kpi-warning">
            <div class="kpi-header">
              <span class="kpi-title">Potential Profit Margin</span>
              <div class="kpi-icon"><i class="fa-solid fa-arrow-trend-up"></i></div>
            </div>
            <div class="kpi-value">$${valuation.potentialProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <div class="kpi-subtext">Average margin: ${((valuation.potentialProfit / (valuation.retailValuation || 1)) * 100).toFixed(0)}%</div>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product Detail</th>
                <th>SKU</th>
                <th>Units on Hand</th>
                <th>Cost Basis (${settings.costingMethod === 'FIFO' ? 'FIFO' : 'Avg'})</th>
                <th>Selling Price</th>
                <th>Margin (%)</th>
                <th>Total Value</th>
                <th>Cost Adjustment Ledger</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => {
                const qty = Number(p.quantity) || 0;
                let cost = Number(p.costPrice) || 0;
                if (settings.costingMethod === 'FIFO' && p.costHistory && p.costHistory.length > 0) {
                  cost = p.costHistory[p.costHistory.length - 1].cost;
                }
                const margin = (((p.sellingPrice - cost) / p.sellingPrice) * 100).toFixed(0);
                const assetVal = cost * qty;

                return `
                  <tr>
                    <td><b>${escapeHtml(p.name)}</b></td>
                    <td style="font-family: monospace;">${p.sku}</td>
                    <td><b>${qty} ${p.unit}</b></td>
                    <td>$${cost.toFixed(2)}</td>
                    <td style="color:var(--accent-secondary); font-weight:700;">$${Number(p.sellingPrice).toFixed(2)}</td>
                    <td style="color:var(--status-success); font-weight:700;">${margin}%</td>
                    <td style="font-weight:700;">$${assetVal.toFixed(2)}</td>
                    <td>
                      <div style="font-size:0.75rem; color:var(--text-subtle); display:flex; flex-direction:column; gap:2px;">
                        ${(p.costHistory || []).slice(-2).map(h => `
                          <span>• $${h.cost.toFixed(2)} (${new Date(h.date).toLocaleDateString()})</span>
                        `).join('')}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (activeTab === 'integrations') {
      return `
        <div style="display:grid; grid-template-columns: 1fr 2fr; gap:20px;">
          <!-- Left: Integrations status connections -->
          <div style="display:flex; flex-direction:column; gap:16px;">
            <div class="card">
              <h3 style="font-size: 0.95rem; font-weight:700; margin-bottom:12px;"><i class="fa-solid fa-link"></i> ERP Integration Status</h3>
              <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:0.85rem;"><i class="fa-solid fa-cash-register" style="margin-right:6px; color:var(--text-subtle);"></i> POS / Store Deductions</span>
                  <span class="badge badge-in-stock">CONNECTED</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:0.85rem;"><i class="fa-solid fa-address-book" style="margin-right:6px; color:var(--text-subtle);"></i> CRM Sales Orders</span>
                  <span class="badge badge-in-stock">CONNECTED</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:0.85rem;"><i class="fa-solid fa-file-invoice" style="margin-right:6px; color:var(--text-subtle);"></i> Invoices & Accounts</span>
                  <span class="badge badge-in-stock">CONNECTED</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:0.85rem;"><i class="fa-solid fa-people-group" style="margin-right:6px; color:var(--text-subtle);"></i> HR Payroll Sync</span>
                  <span class="badge badge-category" style="background-color:rgba(255,255,255,0.05); color:var(--text-muted);">DISCONNECTED</span>
                </div>
              </div>
            </div>

            <div class="card" style="background:linear-gradient(135deg, rgba(30,41,59,0.8), rgba(6,182,212,0.1));">
              <h3 style="font-size: 0.95rem; font-weight:700; margin-bottom:8px;"><i class="fa-solid fa-share-nodes"></i> Webhook Endpoint</h3>
              <p style="font-size:0.775rem; color:var(--text-muted); margin-bottom:10px;">Send raw JSON payloads to synchronize external CRM/POS stock logs instantly.</p>
              <div style="background-color:var(--bg-primary); padding:8px 12px; border-radius:var(--radius-sm); font-family:monospace; font-size:0.725rem; word-break:break-all; border:1px solid var(--border-color);">
                https://api.mpzone.erp/v1/inventory/sync-webhook
              </div>
            </div>
          </div>

          <!-- Right: Sync Logs -->
          <div class="card">
            <h3 style="font-size: 0.95rem; font-weight:700; margin-bottom:12px;"><i class="fa-solid fa-satellite-dish"></i> Live Synchronization Sync Logs</h3>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="background-color: var(--bg-primary); padding:10px; border-radius:var(--radius-sm); font-size:0.8rem;">
                <div style="display:flex; justify-content:space-between; color:var(--text-subtle); font-size:0.75rem;">
                  <span>POS Sales Sync Event</span>
                  <span>2 minutes ago</span>
                </div>
                <div style="font-weight:700; margin-top:2px;">POS-198089: Deducted 2 units of Industrial Optocoupler Array</div>
                <div style="color:var(--status-success); font-weight:600; font-size:0.75rem; margin-top:1px;"><i class="fa-solid fa-circle-check"></i> Stock levels matched. Account balance synced.</div>
              </div>

              <div style="background-color: var(--bg-primary); padding:10px; border-radius:var(--radius-sm); font-size:0.8rem;">
                <div style="display:flex; justify-content:space-between; color:var(--text-subtle); font-size:0.75rem;">
                  <span>CRM Sales Reservation Event</span>
                  <span>22 minutes ago</span>
                </div>
                <div style="font-weight:700; margin-top:2px;">SO-2026-9908: Reserved 50 units Stainless Steel Precision Rods</div>
                <div style="color:var(--status-success); font-weight:600; font-size:0.75rem; margin-top:1px;"><i class="fa-solid fa-circle-check"></i> Stock availability confirmed. Lead time checked.</div>
              </div>

              <div style="background-color: var(--bg-primary); padding:10px; border-radius:var(--radius-sm); font-size:0.8rem;">
                <div style="display:flex; justify-content:space-between; color:var(--text-subtle); font-size:0.75rem;">
                  <span>Invoice Creation Sync</span>
                  <span>1 hour ago</span>
                </div>
                <div style="font-weight:700; margin-top:2px;">INV-88092: Dispatched order to Apex Automation Corp</div>
                <div style="color:var(--status-success); font-weight:600; font-size:0.75rem; margin-top:1px;"><i class="fa-solid fa-circle-check"></i> Valuation cost basis updated for cost of goods sold (COGS).</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  function bindEvents() {
    // Tab togglers
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        updateUI();
      });
    });

    // Costing selector
    container.querySelector('#costing-method-select')?.addEventListener('change', (e) => {
      const selectedMethod = e.target.value;
      const settings = store.getSettings();
      settings.costingMethod = selectedMethod;
      store.setItem('esct_settings_v3', settings);

      showToast(`Inventory costing model changed to: ${selectedMethod}`, 'success');
      updateUI();
    });
  }

  updateUI();
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

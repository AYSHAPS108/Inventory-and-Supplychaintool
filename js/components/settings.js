/**
 * ERP System Settings & Integrations Component
 */
import { store } from '../store.js';

export function renderSettingsView(container, navigateTo, showToast) {
  let activeTab = 'general';

  function updateUI() {
    const settings = store.getSettings();
    const currentRole = store.getCurrentRole();

    container.innerHTML = `
      <!-- Toolbar Tabs -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); margin-bottom: 20px; padding-bottom: 10px; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; gap: 8px;">
          <button class="btn ${activeTab === 'general' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="general">System Settings</button>
          <button class="btn ${activeTab === 'roles' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="roles">Roles & Approval Policy</button>
          <button class="btn ${activeTab === 'integrations' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="integrations">Integrations Setup</button>
        </div>
      </div>

      <!-- Tab Content -->
      <div id="settings-tab-content">
        ${renderActiveTabContent(settings, currentRole)}
      </div>
    `;

    bindEvents();
  }

  function renderActiveTabContent(settings, currentRole) {
    if (activeTab === 'general') {
      return `
        <div class="form-card" style="margin: 0; max-width: 100%;">
          <form id="system-settings-form">
            <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:14px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;"><i class="fa-solid fa-sliders"></i> Global Inventory Configuration</h3>
            
            <div class="form-grid" style="margin-bottom:20px;">
              <div class="form-group">
                <label class="form-label">ERP Base Currency Code</label>
                <select id="set-currency" class="form-control">
                  <option value="USD ($)" ${settings.currency === 'USD ($)' ? 'selected' : ''}>USD - US Dollar ($)</option>
                  <option value="EUR (€)" ${settings.currency === 'EUR (€)' ? 'selected' : ''}>EUR - Euro (€)</option>
                  <option value="GBP (£)" ${settings.currency === 'GBP (£)' ? 'selected' : ''}>GBP - British Pound (£)</option>
                  <option value="INR (₹)" ${settings.currency === 'INR (₹)' ? 'selected' : ''}>INR - Indian Rupee (₹)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Default Tax GST Rate (%)</label>
                <input type="number" id="set-tax" class="form-control" value="${settings.taxDefault}">
              </div>

              <div class="form-group">
                <label class="form-label">Costing Valuation Model</label>
                <select id="set-costing" class="form-control">
                  <option value="Average Costing" ${settings.costingMethod === 'Average Costing' ? 'selected' : ''}>Weighted Average Cost</option>
                  <option value="FIFO" ${settings.costingMethod === 'FIFO' ? 'selected' : ''}>FIFO (First In, First Out)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Barcode Standard Format</label>
                <select id="set-barcode" class="form-control">
                  <option value="EAN-13" ${settings.barcodeFormat === 'EAN-13' ? 'selected' : ''}>EAN-13 Standard</option>
                  <option value="UPC-A" ${settings.barcodeFormat === 'UPC-A' ? 'selected' : ''}>UPC-A Standard</option>
                  <option value="CODE-128" ${settings.barcodeFormat === 'CODE-128' ? 'selected' : ''}>Code 128 Alphanumeric</option>
                </select>
              </div>
            </div>

            <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:14px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;"><i class="fa-solid fa-arrows-spin"></i> Stock Planning Rules</h3>
            <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <input type="checkbox" id="set-negative" ${settings.allowNegativeStock ? 'checked' : ''} style="width:18px; height:18px;">
                <label class="form-label" style="margin:0;">Allow Negative Inventory Balances (Not Recommended)</label>
              </div>
              <div style="display:flex; align-items:center; gap:10px;">
                <input type="checkbox" id="set-reorder" ${settings.autoReorderEnabled ? 'checked' : ''} style="width:18px; height:18px;">
                <label class="form-label" style="margin:0;">Enable Automated Reorder PO Drafts on Min Threshold detection</label>
              </div>
            </div>

            <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:14px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;"><i class="fa-solid fa-scale-balanced"></i> Units of Measure Registry</h3>
            <div class="form-group" style="margin-bottom:20px;">
              <label class="form-label">Active UOM Tags (comma-separated)</label>
              <input type="text" id="set-units" class="form-control" value="${settings.unitsList.join(', ')}">
            </div>

            <div style="display:flex; justify-content:flex-end;">
              <button type="submit" class="btn btn-primary"><i class="fa-solid fa-floppy-disk"></i> Save System Settings</button>
            </div>
          </form>
        </div>
      `;
    }

    if (activeTab === 'roles') {
      return `
        <div style="display:grid; grid-template-columns: 1fr 2fr; gap:20px;">
          <!-- Left Role rules -->
          <div class="card">
            <h3 style="font-size:0.95rem; font-weight:700; margin-bottom:12px;"><i class="fa-solid fa-users-gear"></i> Active Role: <b style="color:var(--accent-primary);">${currentRole}</b></h3>
            <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">The currently selected role overrides interface inputs, disabling restricted buttons and approval forms.</p>
            <div style="background-color:var(--bg-primary); padding:10px; border-radius:var(--radius-sm); font-size:0.775rem;">
              <b>Role Permissions Checklist:</b>
              <ul style="margin-top:6px; padding-left:14px; display:flex; flex-direction:column; gap:4px;">
                <li>${currentRole === 'Admin' || currentRole === 'Inventory Manager' ? '✅ Can Approve Stock Transfers' : '❌ Restricted: Approve Transfers'}</li>
                <li>${currentRole === 'Admin' || currentRole === 'Inventory Manager' ? '✅ Can Approve Stock Adjustments' : '❌ Restricted: Approve Adjustments'}</li>
                <li>${currentRole === 'Admin' || currentRole === 'Inventory Manager' || currentRole === 'Purchase Staff' ? '✅ Can Create Purchase Orders' : '❌ Restricted: Create POs'}</li>
                <li>${currentRole === 'View Only' ? '❌ Read-Only Session' : '✅ Read-Write Authorization'}</li>
              </ul>
            </div>
          </div>

          <!-- Right: Role matrix definition -->
          <div class="card">
            <h3 style="font-size:0.95rem; font-weight:700; margin-bottom:12px;"><i class="fa-solid fa-shield-halved"></i> ERP Approval Policies Matrix</h3>
            <div class="table-container">
              <table class="data-table" style="font-size:0.8rem;">
                <thead>
                  <tr>
                    <th>Role Group</th>
                    <th>Product CRUD</th>
                    <th>Receive GRN</th>
                    <th>Log Adjustments</th>
                    <th>Approve Adjusts/Trans</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>Admin</b></td>
                    <td style="color:var(--status-success);">Allowed</td>
                    <td style="color:var(--status-success);">Allowed</td>
                    <td style="color:var(--status-success);">Allowed</td>
                    <td style="color:var(--status-success);">Allowed</td>
                  </tr>
                  <tr>
                    <td><b>Inventory Manager</b></td>
                    <td style="color:var(--status-success);">Allowed</td>
                    <td style="color:var(--status-success);">Allowed</td>
                    <td style="color:var(--status-success);">Allowed</td>
                    <td style="color:var(--status-success);">Allowed</td>
                  </tr>
                  <tr>
                    <td><b>Warehouse Staff</b></td>
                    <td style="color:var(--status-danger);">Restricted</td>
                    <td style="color:var(--status-success);">Allowed</td>
                    <td style="color:var(--status-warning);">Pending Appr</td>
                    <td style="color:var(--status-danger);">Restricted</td>
                  </tr>
                  <tr>
                    <td><b>Purchase Staff</b></td>
                    <td style="color:var(--status-danger);">Restricted</td>
                    <td style="color:var(--status-danger);">Restricted</td>
                    <td style="color:var(--status-danger);">Restricted</td>
                    <td style="color:var(--status-danger);">Restricted</td>
                  </tr>
                  <tr>
                    <td><b>Store Manager</b></td>
                    <td style="color:var(--status-danger);">Restricted</td>
                    <td style="color:var(--status-success);">Allowed</td>
                    <td style="color:var(--status-warning);">Pending Appr</td>
                    <td style="color:var(--status-danger);">Restricted</td>
                  </tr>
                  <tr>
                    <td><b>View Only</b></td>
                    <td style="color:var(--status-danger);">Restricted</td>
                    <td style="color:var(--status-danger);">Restricted</td>
                    <td style="color:var(--status-danger);">Restricted</td>
                    <td style="color:var(--status-danger);">Restricted</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    if (activeTab === 'integrations') {
      return `
        <div class="card" style="margin-bottom:20px;">
          <h3 style="font-size:0.95rem; font-weight:700; margin-bottom:8px;"><i class="fa-solid fa-network-wired"></i> System Integration Hub</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">
            Connect Zenora with your existing business tools — POS, CRM, accounting, and payment platforms — for seamless inventory synchronization.
          </p>
          <div style="background:var(--status-info-bg); border:1px solid rgba(59,130,246,0.25); border-radius:var(--radius-md); padding:10px 14px; margin-bottom:20px; display:flex; align-items:center; gap:10px; font-size:0.82rem; color:var(--status-info);">
            <i class="fa-solid fa-circle-info"></i>
            <span>Integrations are configured via the <b>Settings API</b>. Contact your Zenora administrator to connect an external system.</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; background-color:var(--bg-primary); padding:14px 16px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
              <div>
                <b style="font-size:0.875rem;">POS Stock Deduction (Inventory ↔ POS)</b>
                <div style="font-size:0.75rem; color:var(--text-subtle); margin-top:3px;">Automatically decrements stock when a point-of-sale invoice is printed.</div>
              </div>
              <span class="badge" style="background:var(--bg-secondary); color:var(--text-muted); border:1px solid var(--border-color); white-space:nowrap;">
                <i class="fa-regular fa-clock"></i> Integration Ready
              </span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; background-color:var(--bg-primary); padding:14px 16px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
              <div>
                <b style="font-size:0.875rem;">CRM Sales Availability (Inventory ↔ CRM)</b>
                <div style="font-size:0.75rem; color:var(--text-subtle); margin-top:3px;">Reserves items in the sales pipeline to prevent oversell.</div>
              </div>
              <span class="badge" style="background:var(--bg-secondary); color:var(--text-muted); border:1px solid var(--border-color); white-space:nowrap;">
                <i class="fa-regular fa-clock"></i> Integration Ready
              </span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; background-color:var(--bg-primary); padding:14px 16px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
              <div>
                <b style="font-size:0.875rem;">Accounting & Finance Ledgers (Inventory ↔ Finance)</b>
                <div style="font-size:0.75rem; color:var(--text-subtle); margin-top:3px;">Records COGS and asset valuations directly into balance sheets.</div>
              </div>
              <span class="badge" style="background:var(--bg-secondary); color:var(--text-muted); border:1px solid var(--border-color); white-space:nowrap;">
                <i class="fa-regular fa-clock"></i> Integration Ready
              </span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; background-color:var(--bg-primary); padding:14px 16px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
              <div>
                <b style="font-size:0.875rem;">HR Payroll Sync (Inventory ↔ HR)</b>
                <div style="font-size:0.75rem; color:var(--text-subtle); margin-top:3px;">Links warehouse manager shifts to payroll performance tracking.</div>
              </div>
              <span class="badge" style="background:var(--bg-secondary); color:var(--text-subtle); border:1px solid var(--border-color); white-space:nowrap;">
                <i class="fa-solid fa-hourglass-half"></i> Coming Soon
              </span>
            </div>
          </div>
        </div>
      `;
    }

  }

  function bindEvents() {
    // Tab toggles
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        updateUI();
      });
    });

    // Form submission
    const form = container.querySelector('#system-settings-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const currency = container.querySelector('#set-currency').value;
      const taxDefault = parseInt(container.querySelector('#set-tax').value) || 18;
      const costingMethod = container.querySelector('#set-costing').value;
      const barcodeFormat = container.querySelector('#set-barcode').value;
      const allowNegativeStock = container.querySelector('#set-negative').checked;
      const autoReorderEnabled = container.querySelector('#set-reorder').checked;
      const unitsList = container.querySelector('#set-units').value.split(',').map(u => u.trim()).filter(u => u);

      const settingsPayload = {
        currency,
        taxDefault,
        costingMethod,
        barcodeFormat,
        allowNegativeStock,
        autoReorderEnabled,
        unitsList
      };

      store.setItem('esct_settings_v3', settingsPayload);
      showToast('Global ERP Settings saved successfully!', 'success');
      updateUI();
    });
  }

  updateUI();
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

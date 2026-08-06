/**
 * Stock Transfers, Adjustments, & Physical Audits Component
 */
import { store } from '../store.js';

export function renderTransfersView(container, navigateTo, showToast) {
  let activeTab = 'transfers';
  let auditWarehouseId = 'wh-1';
  let auditCountType = 'Cycle Count';
  
  // Local state for stock audit counted quantities
  let auditCountSheet = []; 

  function updateUI() {
    const transfers = store.getTransfers();
    const adjustments = store.getAdjustments();
    const counts = store.getInventoryCounts();
    const products = store.getProducts();
    const warehouses = store.getWarehouses();

    container.innerHTML = `
      <!-- Toolbar Tabs -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); margin-bottom: 20px; padding-bottom: 10px; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; gap: 8px;">
          <button class="btn ${activeTab === 'transfers' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="transfers">Inter-Warehouse Transfers</button>
          <button class="btn ${activeTab === 'adjustments' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="adjustments">Manual Adjustments</button>
          <button class="btn ${activeTab === 'audits' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="audits">Physical Audits (Counts)</button>
        </div>
      </div>

      <!-- Tab Content -->
      <div id="transfers-tab-content">
        ${renderActiveTabContent(transfers, adjustments, counts, products, warehouses)}
      </div>

      <!-- Modals Container -->
      <div id="transfers-modal" class="modal-overlay"></div>
    `;

    bindEvents();
  }

  function renderActiveTabContent(transfers, adjustments, counts, products, warehouses) {
    if (activeTab === 'transfers') {
      return `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 14px;">
          <button class="btn btn-primary btn-sm" id="btn-raise-transfer"><i class="fa-solid fa-plus"></i> Request Stock Transfer</button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Transfer Code</th>
                <th>Product</th>
                <th>From Warehouse</th>
                <th>To Warehouse</th>
                <th>Transfer Qty</th>
                <th>Requested Date</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${transfers.map(tr => {
                const p = products.find(prod => prod.id === tr.productId);
                const fromWH = warehouses.find(w => w.id === tr.fromWarehouseId);
                const toWH = warehouses.find(w => w.id === tr.toWarehouseId);

                return `
                  <tr>
                    <td style="font-family: monospace; font-weight:800; color:var(--accent-primary);">${tr.code}</td>
                    <td><b>${p ? escapeHtml(p.name) : 'Unknown SKU'}</b></td>
                    <td>${fromWH ? fromWH.code : 'WH-1'}</td>
                    <td>${toWH ? toWH.code : 'WH-2'}</td>
                    <td style="font-weight: 700;">${tr.qty} ${p ? p.unit : 'pcs'}</td>
                    <td style="font-size:0.8rem; color:var(--text-subtle);">${new Date(tr.requestDate).toLocaleDateString()}</td>
                    <td>
                      <span class="badge ${tr.status === 'Completed' ? 'badge-in-stock' : tr.status === 'In Transit' ? 'badge-category' : 'badge-low-stock'}">
                        ${tr.status}
                      </span>
                    </td>
                    <td style="text-align: right;">
                      ${tr.status === 'Pending Approval' ? `
                        <button class="btn btn-primary btn-sm btn-approve-tr" data-id="${tr.id}"><i class="fa-solid fa-check"></i> Approve</button>
                      ` : ''}
                      ${tr.status === 'In Transit' ? `
                        <button class="btn btn-secondary btn-sm btn-complete-tr" data-id="${tr.id}"><i class="fa-solid fa-truck-ramp-box"></i> Receive Transfer</button>
                      ` : ''}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (activeTab === 'adjustments') {
      return `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 14px;">
          <button class="btn btn-primary btn-sm" id="btn-raise-adjustment"><i class="fa-solid fa-sliders"></i> Log New Adjustment</button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Product Information</th>
                <th>Warehouse Site</th>
                <th>Qty Delta</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Staff Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${adjustments.map(adj => {
                const p = products.find(prod => prod.id === adj.productId);
                const wh = warehouses.find(w => w.id === adj.warehouseId);
                const isPositive = Number(adj.qtyChange) > 0;

                return `
                  <tr>
                    <td style="font-size:0.8rem; color:var(--text-subtle);">${new Date(adj.date).toLocaleString()}</td>
                    <td><b>${p ? escapeHtml(p.name) : 'Unknown SKU'}</b></td>
                    <td>${wh ? wh.code : 'WH-1'}</td>
                    <td style="font-weight: 800; color: ${isPositive ? 'var(--status-success)' : 'var(--status-danger)'};">
                      ${isPositive ? '+' : ''}${adj.qtyChange}
                    </td>
                    <td><span class="badge badge-category">${adj.reason}</span></td>
                    <td><span class="badge ${adj.status === 'Approved' ? 'badge-in-stock' : 'badge-low-stock'}">${adj.status}</span></td>
                    <td>${adj.createdBy || 'David Miller'}</td>
                    <td>
                      ${adj.status === 'Pending Approval' ? `
                        <button class="btn btn-primary btn-sm btn-approve-adj" data-id="${adj.id}"><i class="fa-solid fa-check"></i> Approve</button>
                      ` : 'N/A'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (activeTab === 'audits') {
      // If we are currently running an audit count sheet
      const wh = warehouses.find(w => w.id === auditWarehouseId);

      return `
        <div style="display:grid; grid-template-columns: 1fr 2fr; gap:20px;">
          <!-- Left count setup -->
          <div class="card" style="align-self: flex-start;">
            <h3 style="font-size:0.95rem; font-weight:700; margin-bottom:12px;"><i class="fa-solid fa-clipboard-list"></i> Configure Audit Sheet</h3>
            <div class="form-group" style="margin-bottom:12px;">
              <label class="form-label">Audit Warehouse *</label>
              <select id="audit-wh" class="form-control">
                ${warehouses.map(w => `<option value="${w.id}" ${auditWarehouseId === w.id ? 'selected' : ''}>${w.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label class="form-label">Counting Method *</label>
              <select id="audit-type" class="form-control">
                <option value="Cycle Count" ${auditCountType === 'Cycle Count' ? 'selected' : ''}>Cycle Count (Sect A)</option>
                <option value="Full Physical Count" ${auditCountType === 'Full Physical Count' ? 'selected' : ''}>Full Annual Count</option>
              </select>
            </div>
            <button class="btn btn-primary btn-sm btn-block" id="btn-load-audit-sheet"><i class="fa-solid fa-rotate"></i> Load Counting Sheet</button>

            <!-- Count History -->
            <div style="margin-top:20px; border-top: 1px solid var(--border-color); padding-top:14px;">
              <h4 style="font-size:0.8rem; font-weight:700; color:var(--text-muted); margin-bottom:10px;">Audit History</h4>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${counts.map(cnt => `
                  <div style="background-color: var(--bg-primary); padding: 8px; border-radius: var(--radius-sm); font-size:0.775rem;">
                    <div style="display:flex; justify-content:space-between; font-weight:700;">
                      <span>${cnt.countType}</span>
                      <span style="color:var(--status-success);">${cnt.status}</span>
                    </div>
                    <div style="color:var(--text-subtle); margin-top:2px;">Date: ${cnt.date} | Variances: ${cnt.varianceDetected}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right count sheets details -->
          <div class="card">
            <h3 style="font-size:0.95rem; font-weight:700; margin-bottom:6px;"><i class="fa-solid fa-calculator"></i> Discrepancy & Variance Calculator</h3>
            <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:16px;">Log physical counts. Variances are automatically calculated and adjusted upon submit.</p>
            
            ${auditCountSheet.length === 0 ? `
              <div style="text-align:center; padding: 40px; color:var(--text-subtle);">
                <i class="fa-solid fa-list-check" style="font-size:2.5rem; margin-bottom:8px;"></i>
                <p>Click "Load Counting Sheet" to generate the audit checklist for the selected facility.</p>
              </div>
            ` : `
              <form id="audit-sheet-form">
                <div style="max-height: 400px; overflow-y:auto; display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                  ${auditCountSheet.map((item, idx) => `
                    <div style="background-color: var(--bg-primary); padding: 12px; border:1px solid var(--border-color); border-radius: var(--radius-sm); display:grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap:12px; align-items:center;">
                      <div>
                        <div style="font-weight:700; font-size:0.85rem;">${escapeHtml(item.productName)}</div>
                        <div style="font-size:0.75rem; color:var(--text-subtle); font-family:monospace;">SKU: ${item.sku}</div>
                        <input type="hidden" class="audit-item-prodid" value="${item.productId}">
                      </div>
                      <div>
                        <div style="font-size:0.7rem; color:var(--text-subtle);">Expected Qty</div>
                        <b class="audit-item-expected" style="font-size:0.9rem;">${item.expectedQty}</b>
                      </div>
                      <div>
                        <label class="form-label" style="font-size:0.7rem;">Physical Count</label>
                        <input type="number" class="form-control btn-sm audit-item-physical" data-index="${idx}" value="${item.physicalQty}" min="0" style="padding: 4px 8px;">
                      </div>
                      <div>
                        <div style="font-size:0.7rem; color:var(--text-subtle);">Variance</div>
                        <b class="audit-item-variance" style="font-size:0.9rem; color: ${item.physicalQty - item.expectedQty === 0 ? 'var(--text-main)' : item.physicalQty - item.expectedQty > 0 ? 'var(--status-success)' : 'var(--status-danger)'}">
                          ${item.physicalQty - item.expectedQty > 0 ? '+' : ''}${item.physicalQty - item.expectedQty}
                        </b>
                      </div>
                    </div>
                  `).join('')}
                </div>
                <div style="display:flex; justify-content:flex-end; gap:12px;">
                  <button type="submit" class="btn btn-primary"><i class="fa-solid fa-sliders"></i> Post Physical Adjustments</button>
                </div>
              </form>
            `}
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

    // Request Transfer Action
    container.querySelector('#btn-raise-transfer')?.addEventListener('click', () => {
      // Role Check
      const role = store.getCurrentRole();
      if (role === 'View Only') {
        showToast("Access Denied: View Only role cannot request transfers.", 'danger');
        return;
      }
      openTransferModal();
    });

    // Request Adjustment Action
    container.querySelector('#btn-raise-adjustment')?.addEventListener('click', () => {
      // Role Check
      const role = store.getCurrentRole();
      if (role === 'View Only') {
        showToast("Access Denied: View Only role cannot log adjustments.", 'danger');
        return;
      }
      openAdjustmentModal();
    });

    // Approve Transfer Action
    container.querySelectorAll('.btn-approve-tr').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const role = store.getCurrentRole();
        if (role !== 'Admin' && role !== 'Inventory Manager') {
          showToast(`Access Denied: Role '${role}' lacks approval permissions.`, 'danger');
          return;
        }

        store.approveTransfer(id, 'David Miller');
        showToast('Stock Transfer approved and set to In Transit!', 'success');
        updateUI();
      });
    });

    // Complete Transfer Action
    container.querySelectorAll('.btn-complete-tr').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const role = store.getCurrentRole();
        if (role === 'View Only') {
          showToast("Access Denied: View Only role cannot complete transfers.", 'danger');
          return;
        }

        store.completeTransfer(id);
        showToast('Transfer items received. Warehouses stocks updated.', 'success');
        updateUI();
      });
    });

    // Approve Adjustment Action
    container.querySelectorAll('.btn-approve-adj').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const role = store.getCurrentRole();
        if (role !== 'Admin' && role !== 'Inventory Manager') {
          showToast(`Access Denied: Role '${role}' lacks approval permissions.`, 'danger');
          return;
        }

        store.approveAdjustment(id, 'David Miller');
        showToast('Manual stock adjustment approved & balance updated!', 'success');
        updateUI();
      });
    });

    // Load Audits sheet configuration
    container.querySelector('#btn-load-audit-sheet')?.addEventListener('click', () => {
      auditWarehouseId = container.querySelector('#audit-wh').value;
      auditCountType = container.querySelector('#audit-type').value;

      // Generate items in that warehouse
      const products = store.getProducts().filter(p => p.warehouseId === auditWarehouseId);
      auditCountSheet = products.map(p => ({
        productId: p.id,
        sku: p.sku,
        productName: p.name,
        expectedQty: p.quantity,
        physicalQty: p.quantity // Default is matching expected
      }));

      showToast(`Loaded ${auditCountSheet.length} product count items.`, 'info');
      updateUI();
    });

    // Handle physical quantity input change
    container.querySelectorAll('.audit-item-physical').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.index);
        const val = parseInt(e.target.value) || 0;
        auditCountSheet[idx].physicalQty = val;

        // Recalculate variance display inline
        const varianceElem = e.target.closest('div').nextElementSibling.querySelector('.audit-item-variance');
        const expected = auditCountSheet[idx].expectedQty;
        const variance = val - expected;
        varianceElem.textContent = `${variance > 0 ? '+' : ''}${variance}`;
        varianceElem.style.color = variance === 0 ? 'var(--text-main)' : variance > 0 ? 'var(--status-success)' : 'var(--status-danger)';
      });
    });

    // Submit Audit sheet
    const auditForm = container.querySelector('#audit-sheet-form');
    auditForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      // Role Check
      const role = store.getCurrentRole();
      if (role !== 'Admin' && role !== 'Inventory Manager' && role !== 'Store Manager') {
        showToast(`Access Denied: Role '${role}' lacks authority to reconcile audit counts.`, 'danger');
        return;
      }

      store.executeStockCount(auditWarehouseId, auditCountType, auditCountSheet);
      showToast('Inventory audit sheet logged. Variances reconciled automatically.', 'success');
      auditCountSheet = [];
      updateUI();
    });
  }

  function openTransferModal() {
    const modalContainer = container.querySelector('#transfers-modal');
    const products = store.getProducts();
    const warehouses = store.getWarehouses();

    modalContainer.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3>Request Inter-Warehouse Transfer</h3>
          <button class="btn btn-secondary btn-icon btn-sm" id="btn-close-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form id="transfer-modal-form">
          <div class="modal-body">
            <div class="form-group" style="margin-bottom:14px;">
              <label class="form-label">Transfer Product SKU *</label>
              <select id="tr-m-product" class="form-control" required>
                ${products.map(p => `<option value="${p.id}">${p.sku} - ${p.name} (Stock: ${p.quantity})</option>`).join('')}
              </select>
            </div>
            <div class="form-grid" style="margin-bottom:14px;">
              <div class="form-group">
                <label class="form-label">Source Warehouse *</label>
                <select id="tr-m-from" class="form-control" required>
                  ${warehouses.map(w => `<option value="${w.id}">${w.code} (${w.name})</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Destination Warehouse *</label>
                <select id="tr-m-to" class="form-control" required>
                  ${warehouses.map(w => `<option value="${w.id}">${w.code} (${w.name})</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Transfer Quantity *</label>
              <input type="number" id="tr-m-qty" class="form-control" placeholder="10" min="1" required>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Request Transfer</button>
          </div>
        </form>
      </div>
    `;

    modalContainer.classList.add('active');
    const close = () => modalContainer.classList.remove('active');
    modalContainer.querySelector('#btn-close-modal').addEventListener('click', close);
    modalContainer.querySelector('#btn-cancel-modal').addEventListener('click', close);

    const form = modalContainer.querySelector('#transfer-modal-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fromWh = modalContainer.querySelector('#tr-m-from').value;
      const toWh = modalContainer.querySelector('#tr-m-to').value;
      const productId = modalContainer.querySelector('#tr-m-product').value;
      const qty = parseInt(modalContainer.querySelector('#tr-m-qty').value, 10) || 0;

      if (fromWh === toWh) {
        showToast('Source and Destination Warehouses cannot be identical.', 'danger');
        return;
      }

      const p = store.getProductById(productId);
      if (p && p.quantity < qty) {
        showToast(`Insufficient quantity in source warehouse. Available: ${p.quantity}`, 'warning');
        return;
      }

      const trPayload = {
        productId,
        fromWarehouseId: fromWh,
        toWarehouseId: toWh,
        qty
      };

      store.createStockTransfer(trPayload);
      showToast('Stock transfer request queued. Awaiting manager approval.', 'success');
      close();
      updateUI();
    });
  }

  function openAdjustmentModal() {
    const modalContainer = container.querySelector('#transfers-modal');
    const products = store.getProducts();
    const warehouses = store.getWarehouses();

    modalContainer.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3>Log Inventory Stock Adjustment</h3>
          <button class="btn btn-secondary btn-icon btn-sm" id="btn-close-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form id="adjustment-modal-form">
          <div class="modal-body">
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label">Target Product SKU *</label>
              <select id="adj-m-product" class="form-control" required>
                ${products.map(p => `<option value="${p.id}">${p.sku} - ${p.name} (Stock: ${p.quantity})</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label">Warehouse Facility *</label>
              <select id="adj-m-wh" class="form-control" required>
                ${warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-grid" style="margin-bottom: 14px;">
              <div class="form-group">
                <label class="form-label">Qty Adjustment Delta * (use negative for loss)</label>
                <input type="number" id="adj-m-qty" class="form-control" placeholder="e.g. -10" required>
              </div>
              <div class="form-group">
                <label class="form-label">Adjustment Reason *</label>
                <select id="adj-m-reason" class="form-control" required>
                  <option value="Damage">Damage / Spoilage</option>
                  <option value="Loss">Loss / Theft</option>
                  <option value="Expired Stock">Expired Stock</option>
                  <option value="Audit Reconciliation">Reconciliation Variance</option>
                  <option value="Inventory Increase">Received Restock</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Process Adjustment</button>
          </div>
        </form>
      </div>
    `;

    modalContainer.classList.add('active');
    const close = () => modalContainer.classList.remove('active');
    modalContainer.querySelector('#btn-close-modal').addEventListener('click', close);
    modalContainer.querySelector('#btn-cancel-modal').addEventListener('click', close);

    const form = modalContainer.querySelector('#adjustment-modal-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const productId = modalContainer.querySelector('#adj-m-product').value;
      const warehouseId = modalContainer.querySelector('#adj-m-wh').value;
      const qtyChange = parseInt(modalContainer.querySelector('#adj-m-qty').value, 10) || 0;
      const reason = modalContainer.querySelector('#adj-m-reason').value;

      if (qtyChange === 0) {
        showToast('Quantity delta cannot be zero.', 'danger');
        return;
      }

      const role = store.getCurrentRole();
      const adjPayload = {
        productId,
        warehouseId,
        qtyChange,
        reason,
        createdBy: 'Sarah Jenkins'
      };

      store.createAdjustment(adjPayload);
      if (role === 'Warehouse Staff') {
        showToast('Adjustment logged. Pending manager approval.', 'info');
      } else {
        showToast('Adjustment approved and inventory stock levels modified!', 'success');
      }
      close();
      updateUI();
    });
  }

  updateUI();
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Procurement, Suppliers, & Goods Receiving (GRN) Component
 */
import { store } from '../store.js';

export function renderPurchasingView(container, navigateTo, showToast) {
  let activeTab = 'pos';
  let selectedPOId = null; // Used for goods receiving against PO
  let poFormItems = [{ productId: '', qty: 1, price: 0 }]; // For Raising PO

  function updateUI() {
    const purchaseOrders = store.getPurchaseOrders();
    const suppliers = store.getSuppliers();
    const products = store.getProducts();
    const warehouses = store.getWarehouses();

    container.innerHTML = `
      <!-- Toolbar Tabs -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); margin-bottom: 20px; padding-bottom: 10px; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; gap: 8px;">
          <button class="btn ${activeTab === 'pos' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="pos">Purchase Orders</button>
          <button class="btn ${activeTab === 'raise-po' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="raise-po">Raise PO</button>
          <button class="btn ${activeTab === 'grn' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="grn">Goods Receiving (GRN)</button>
          <button class="btn ${activeTab === 'suppliers' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="suppliers">Suppliers Registry</button>
          <button class="btn ${activeTab === 'tracking' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="tracking">Supply Chain Tracking</button>
        </div>
      </div>

      <!-- Tab Content -->
      <div id="purchasing-tab-content">
        ${renderActiveTabContent(purchaseOrders, suppliers, products, warehouses)}
      </div>

      <!-- Modals Container -->
      <div id="purchasing-modal" class="modal-overlay"></div>
    `;

    bindEvents();
  }

  function renderActiveTabContent(pos, suppliers, products, warehouses) {
    if (activeTab === 'pos') {
      return `
        <!-- PO Spend Metrics -->
        <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 20px;">
          <div class="kpi-card kpi-blue" style="padding: 12px 18px;">
            <div style="font-size: 0.75rem; color:var(--text-subtle);">TOTAL PROCUREMENT SPEND</div>
            <div style="font-size: 1.5rem; font-weight:700;">$${pos.reduce((sum, p) => sum + p.totalAmount, 0).toLocaleString()}</div>
          </div>
          <div class="kpi-card kpi-warning" style="padding: 12px 18px;">
            <div style="font-size: 0.75rem; color:var(--text-subtle);">PENDING APPROVALS</div>
            <div style="font-size: 1.5rem; font-weight:700;">${pos.filter(p => p.status === 'Pending Approval').length} POs</div>
          </div>
          <div class="kpi-card kpi-green" style="padding: 12px 18px;">
            <div style="font-size: 0.75rem; color:var(--text-subtle);">RECEIVED / CLOSED</div>
            <div style="font-size: 1.5rem; font-weight:700;">${pos.filter(p => p.status === 'Received').length} Orders</div>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Supplier</th>
                <th>Order Date</th>
                <th>Expected Delivery</th>
                <th>Delivery Site</th>
                <th>Total Value</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${pos.map(po => {
                const sup = suppliers.find(s => s.id === po.supplierId);
                const wh = warehouses.find(w => w.id === po.warehouseId);
                const itemsCount = po.items ? po.items.length : 1;

                return `
                  <tr>
                    <td style="font-family: monospace; font-weight: 800; color: var(--accent-primary);">${po.poNumber}</td>
                    <td><b>${sup ? escapeHtml(sup.name) : 'Apex Automation'}</b></td>
                    <td>${po.orderDate}</td>
                    <td>${po.expectedDate}</td>
                    <td>${wh ? wh.code : 'WH-CENTRAL'}</td>
                    <td style="font-weight: 700;">$${po.totalAmount.toFixed(2)}</td>
                    <td>
                      <span class="badge ${po.status === 'Received' ? 'badge-in-stock' : po.status === 'Approved' ? 'badge-category' : 'badge-low-stock'}">
                        ${po.status}
                      </span>
                    </td>
                    <td style="text-align: right; display:flex; gap:6px; justify-content: flex-end;">
                      ${po.status === 'Pending Approval' ? `
                        <button class="btn btn-primary btn-sm btn-approve-po" data-id="${po.id}"><i class="fa-solid fa-check"></i> Approve</button>
                      ` : ''}
                      ${po.status === 'Approved' ? `
                        <button class="btn btn-secondary btn-sm btn-receive-trigger" data-id="${po.id}"><i class="fa-solid fa-boxes-packing"></i> Receive</button>
                      ` : ''}
                      <button class="btn btn-secondary btn-icon btn-sm btn-pdf-po" data-id="${po.id}" title="Download PO PDF"><i class="fa-solid fa-file-pdf" style="color:var(--status-danger);"></i></button>
                      <button class="btn btn-secondary btn-icon btn-sm btn-email-po" data-id="${po.id}" title="Email PO"><i class="fa-solid fa-envelope" style="color:var(--accent-secondary);"></i></button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (activeTab === 'raise-po') {
      return `
        <div class="form-card" style="margin: 0; max-width: 100%;">
          <div class="form-header">
            <h2>Draft New Purchase Order</h2>
            <p>Generate procurement requests, assign suppliers, set discounts, and calculate itemized invoice estimates.</p>
          </div>
          <form id="raise-po-form">
            <div class="form-grid" style="margin-bottom: 20px;">
              <div class="form-group">
                <label class="form-label">Select Vendor / Supplier *</label>
                <select id="po-supplier" class="form-control" required>
                  ${suppliers.map(s => `<option value="${s.id}">${s.name} (Lead Time: ${s.leadTimeDays}d)</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Delivery Destination Warehouse *</label>
                <select id="po-warehouse" class="form-control" required>
                  ${warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Expected Delivery Date *</label>
                <input type="date" id="po-expected-date" class="form-control" value="${new Date(Date.now() + 7*86400000).toISOString().slice(0, 10)}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Tax Rate (%)</label>
                <input type="number" id="po-tax" class="form-control" value="18">
              </div>
            </div>

            <!-- Item Rows -->
            <div style="margin-bottom: 20px;">
              <h3 style="font-size:0.9rem; font-weight:700; margin-bottom:12px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">Order Line Items</h3>
              <div id="po-line-items" style="display:flex; flex-direction:column; gap:10px;">
                ${poFormItems.map((item, idx) => `
                  <div style="display:flex; gap:12px; align-items:center;">
                    <div style="flex:2;">
                      <select class="form-control po-item-product" data-index="${idx}" required>
                        <option value="">Choose Product SKU...</option>
                        ${products.map(p => `<option value="${p.id}" ${item.productId === p.id ? 'selected' : ''}>${p.sku} - ${p.name} ($${p.costPrice})</option>`).join('')}
                      </select>
                    </div>
                    <div style="flex:1;">
                      <input type="number" class="form-control po-item-qty" data-index="${idx}" placeholder="Qty" value="${item.qty}" min="1" required>
                    </div>
                    <div style="flex:1;">
                      <input type="number" step="0.01" class="form-control po-item-price" data-index="${idx}" placeholder="Cost" value="${item.price}" required>
                    </div>
                    <div style="width:40px; text-align:center;">
                      <button type="button" class="btn btn-danger btn-icon btn-sm btn-delete-po-line" data-index="${idx}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                `).join('')}
              </div>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-add-po-line" style="margin-top:12px;"><i class="fa-solid fa-plus"></i> Add Line Item</button>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top: 1px solid var(--border-color); padding-top:20px;">
              <div class="form-group">
                <label class="form-label">Flat Discount ($)</label>
                <input type="number" id="po-discount" class="form-control" value="0" style="max-width:120px;">
              </div>

              <div style="text-align:right;">
                <div style="font-size: 0.85rem; color:var(--text-subtle);">Subtotal: <b id="po-subtotal-val">$0.00</b></div>
                <div style="font-size: 0.85rem; color:var(--text-subtle);">Tax (18%): <b id="po-tax-val">$0.00</b></div>
                <div style="font-size: 1.15rem; font-weight:800; color:var(--accent-secondary); margin-top:4px;">Grand Total: <b id="po-total-val">$0.00</b></div>
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:24px;">
              <button type="submit" class="btn btn-primary"><i class="fa-solid fa-paper-plane"></i> Save & Send For Approval</button>
            </div>
          </form>
        </div>
      `;
    }

    if (activeTab === 'grn') {
      // Find POs ready for goods receipt note receipt (Approved POs)
      const approvedPOs = pos.filter(po => po.status === 'Approved');

      return `
        <div class="form-card" style="margin: 0; max-width: 100%;">
          <div class="form-header">
            <h2>Process Goods Receipt Note (GRN)</h2>
            <p>Log incoming inventory shipments against Approved Purchase Orders. Reconcile damaged units and register batch numbers and serials.</p>
          </div>

          <div class="form-group" style="margin-bottom: 20px; max-width: 300px;">
            <label class="form-label">Select Approved Purchase Order</label>
            <select id="grn-po-selector" class="form-control">
              <option value="">-- Choose Purchase Order --</option>
              ${approvedPOs.map(po => `<option value="${po.id}" ${selectedPOId === po.id ? 'selected' : ''}>${po.poNumber} (${suppliers.find(s => s.id === po.supplierId)?.name || 'Supplier'})</option>`).join('')}
            </select>
          </div>

          ${selectedPOId ? renderGRNReceiptForm(pos.find(po => po.id === selectedPOId), products) : `
            <div style="text-align: center; color: var(--text-muted); padding: 40px 0; border: 2px dashed var(--border-color); border-radius: var(--radius-lg);">
              <i class="fa-solid fa-truck-moving" style="font-size: 3rem; color: var(--text-subtle); margin-bottom: 12px;"></i>
              <p>Please select an approved Purchase Order from the dropdown to load shipping items.</p>
            </div>
          `}
        </div>
      `;
    }

    if (activeTab === 'suppliers') {
      return `
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th>Contact Details</th>
                <th>GSTIN</th>
                <th>Lead Time</th>
                <th>Payment Terms</th>
                <th>Rating</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${suppliers.map(sup => `
                <tr>
                  <td>
                    <div style="font-weight: 700;">${escapeHtml(sup.name)}</div>
                    <div style="font-size:0.75rem; color: var(--text-subtle);"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(sup.address)}</div>
                  </td>
                  <td>
                    <div>${sup.contactPerson}</div>
                    <div style="font-size:0.75rem; color: var(--text-muted);">${sup.email} | ${sup.phone}</div>
                  </td>
                  <td style="font-family: monospace;">${sup.gstin || 'N/A'}</td>
                  <td>${sup.leadTimeDays} Days</td>
                  <td>${sup.paymentTerms}</td>
                  <td>
                    <span style="color: var(--status-warning); font-weight:700;"><i class="fa-solid fa-star"></i> ${sup.rating}</span>
                  </td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-icon btn-sm btn-edit-sup" data-id="${sup.id}"><i class="fa-solid fa-pen"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (activeTab === 'tracking') {
      return `
        <div class="card" style="margin-bottom: 20px;">
          <h3 style="font-size: 1rem; margin-bottom: 12px;"><i class="fa-solid fa-truck-fast"></i> Lead Time & Fulfillment Tracking</h3>
          <p style="font-size: 0.85rem; color:var(--text-muted); margin-bottom: 16px;">Monitor delays in shipment deliveries. In transit PO status alerts and supplier logistics scorecard averages.</p>
          
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Vendor Name</th>
                  <th>On-Time Delivery Rate</th>
                  <th>Avg Procurement Cycle</th>
                  <th>Open Orders Count</th>
                  <th>Performance Level</th>
                </tr>
              </thead>
              <tbody>
                ${suppliers.map(s => {
                  const ratingVal = s.rating || 5.0;
                  const pct = ratingVal >= 4.7 ? '98%' : ratingVal >= 4.4 ? '92%' : '84%';
                  return `
                    <tr>
                      <td><b>${escapeHtml(s.name)}</b></td>
                      <td><b>${pct}</b> On Time</td>
                      <td>${s.leadTimeDays} Days avg</td>
                      <td>${pos.filter(po => po.supplierId === s.id && po.status === 'Approved').length} POs Open</td>
                      <td>
                        <span class="badge ${ratingVal >= 4.5 ? 'badge-in-stock' : 'badge-low-stock'}">
                          ${ratingVal >= 4.7 ? 'EXCELLENT' : ratingVal >= 4.4 ? 'GOOD' : 'AVERAGE'}
                        </span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }
  }

  function renderGRNReceiptForm(po, products) {
    return `
      <form id="grn-receipt-form" style="margin-top: 24px; border-top: 1px solid var(--border-color); padding-top: 20px;">
        <h3 style="font-size: 0.95rem; font-weight:700; margin-bottom: 16px;"><i class="fa-solid fa-pallet"></i> Log Received Cargo for ${po.poNumber}</h3>
        
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${po.items ? po.items.map((line, idx) => {
            const p = products.find(prod => prod.id === line.productId);
            return `
              <div style="background-color: var(--bg-primary); padding: 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md); display:grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap:12px; align-items:center;">
                <div>
                  <h4 style="font-size: 0.85rem; font-weight:700;">${p ? p.name : 'Unknown Product'}</h4>
                  <p style="font-size:0.75rem; color:var(--text-subtle);">Ordered: ${line.qty} ${p ? p.unit : 'pcs'}</p>
                  <input type="hidden" class="grn-line-prodid" value="${line.productId}">
                </div>
                <div>
                  <label class="form-label" style="font-size:0.75rem;">Received Qty</label>
                  <input type="number" class="form-control btn-sm grn-line-received" value="${line.qty}" min="0">
                </div>
                <div>
                  <label class="form-label" style="font-size:0.75rem;">Damaged / Rejected</label>
                  <input type="number" class="form-control btn-sm grn-line-damaged" value="0" min="0">
                </div>
                <div>
                  <label class="form-label" style="font-size:0.75rem;">Batch Number / Expiry</label>
                  <input type="text" class="form-control btn-sm grn-line-batch" placeholder="e.g. BAT-2026A">
                </div>
                <div class="form-group-full" style="grid-column: span 4; display: grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:8px; border-top: 1px dashed var(--border-color); padding-top:8px;">
                  <div>
                    <label class="form-label" style="font-size:0.7rem;">Expiry Date</label>
                    <input type="date" class="form-control btn-sm grn-line-expiry" value="${new Date(Date.now() + 365*86400000).toISOString().slice(0, 10)}">
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.7rem;">Serial Numbers (comma-separated for tracking)</label>
                    <input type="text" class="form-control btn-sm grn-line-serials" placeholder="SN-1, SN-2">
                  </div>
                </div>
              </div>
            `;
          }).join('') : ''}
        </div>

        <div class="form-group" style="margin-top: 20px;">
          <label class="form-label">Receiving Notes / Compliance Checklist</label>
          <textarea id="grn-notes" class="form-control" placeholder="All seals intact, structural integrity verified..."></textarea>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:24px;">
          <button type="submit" class="btn btn-primary"><i class="fa-solid fa-circle-check"></i> Post Goods Receipt Note</button>
        </div>
      </form>
    `;
  }

  function bindEvents() {
    // Tab togglers
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        updateUI();
      });
    });

    // PO Approval
    container.querySelectorAll('.btn-approve-po').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const role = store.getCurrentRole();
        if (role !== 'Admin' && role !== 'Inventory Manager') {
          showToast(`Access Denied: Role '${role}' lacks approval authorization.`, 'danger');
          return;
        }

        store.approvePurchaseOrder(id);
        showToast('PO approved! Ready for vendor shipment.', 'success');
        updateUI();
      });
    });

    // PO PDF and Email mock actions
    container.querySelectorAll('.btn-pdf-po').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const po = store.getPurchaseOrders().find(p => p.id === id);
        showToast(`PO PDF generation triggered for ${po.poNumber}. Document saved to reports folder.`, 'success');
      });
    });

    container.querySelectorAll('.btn-email-po').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const po = store.getPurchaseOrders().find(p => p.id === id);
        showToast(`Purchase order ${po.poNumber} emailed to vendor automatically.`, 'success');
      });
    });

    // Trigger goods receiving tab for a PO
    container.querySelectorAll('.btn-receive-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedPOId = btn.dataset.id;
        activeTab = 'grn';
        updateUI();
      });
    });

    // PO Form product line calculations
    const calcFormTotals = () => {
      const rows = container.querySelectorAll('#po-line-items > div');
      let subtotal = 0;
      rows.forEach(r => {
        const prodSelect = r.querySelector('.po-item-product');
        const qtyInput = r.querySelector('.po-item-qty');
        const priceInput = r.querySelector('.po-item-price');
        
        // Auto-fill price if product changes
        prodSelect?.addEventListener('change', () => {
          const p = store.getProductById(prodSelect.value);
          if (p) {
            priceInput.value = p.costPrice;
            calcFormTotals();
          }
        });

        const qty = parseInt(qtyInput?.value) || 0;
        const cost = parseFloat(priceInput?.value) || 0;
        subtotal += qty * cost;
      });

      const taxRate = parseFloat(container.querySelector('#po-tax')?.value) || 18;
      const discount = parseFloat(container.querySelector('#po-discount')?.value) || 0;
      
      const tax = (subtotal * taxRate) / 100;
      const grandTotal = Math.max(0, subtotal + tax - discount);

      const subElem = container.querySelector('#po-subtotal-val');
      const taxElem = container.querySelector('#po-tax-val');
      const totElem = container.querySelector('#po-total-val');

      if (subElem) subElem.textContent = `$${subtotal.toFixed(2)}`;
      if (taxElem) taxElem.textContent = `$${tax.toFixed(2)}`;
      if (totElem) totElem.textContent = `$${grandTotal.toFixed(2)}`;
    };

    container.querySelector('#btn-add-po-line')?.addEventListener('click', () => {
      poFormItems.push({ productId: '', qty: 1, price: 0 });
      updateUI();
      calcFormTotals();
    });

    container.querySelectorAll('.btn-delete-po-line').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        poFormItems.splice(idx, 1);
        updateUI();
        calcFormTotals();
      });
    });

    // Listeners for inputs
    container.querySelectorAll('.po-item-qty, .po-item-price').forEach(input => {
      input.addEventListener('input', calcFormTotals);
    });
    container.querySelector('#po-tax')?.addEventListener('input', calcFormTotals);
    container.querySelector('#po-discount')?.addEventListener('input', calcFormTotals);

    // Dynamic price filling trigger
    container.querySelectorAll('.po-item-product').forEach(select => {
      select.addEventListener('change', (e) => {
        const idx = parseInt(select.dataset.index);
        const p = store.getProductById(select.value);
        if (p) {
          poFormItems[idx].productId = p.id;
          poFormItems[idx].price = p.costPrice;
          updateUI();
          calcFormTotals();
        }
      });
    });

    // Submit PO form
    const poForm = container.querySelector('#raise-po-form');
    poForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      // Check role
      const role = store.getCurrentRole();
      if (role === 'Warehouse Staff' || role === 'View Only') {
        showToast(`Access Denied: Role '${role}' is not authorized to raise purchase requests.`, 'danger');
        return;
      }

      const supplierId = container.querySelector('#po-supplier').value;
      const warehouseId = container.querySelector('#po-warehouse').value;
      const expectedDate = container.querySelector('#po-expected-date').value;
      const taxRate = parseFloat(container.querySelector('#po-tax').value) || 18;
      const discount = parseFloat(container.querySelector('#po-discount').value) || 0;

      // Extract item list
      const items = [];
      const rows = container.querySelectorAll('#po-line-items > div');
      let subtotal = 0;
      rows.forEach(r => {
        const pId = r.querySelector('.po-item-product').value;
        const qty = parseInt(r.querySelector('.po-item-qty').value) || 0;
        const cost = parseFloat(r.querySelector('.po-item-price').value) || 0;
        items.push({ productId: pId, qty, price: cost });
        subtotal += qty * cost;
      });

      const tax = (subtotal * taxRate) / 100;
      const grandTotal = Math.max(0, subtotal + tax - discount);

      const poPayload = {
        supplierId,
        warehouseId,
        totalAmount: grandTotal,
        discount,
        tax,
        status: 'Pending Approval',
        expectedDate,
        items
      };

      store.savePurchaseOrder(poPayload);
      showToast('Purchase request raised. Pending manager review.', 'success');
      activeTab = 'pos';
      poFormItems = [{ productId: '', qty: 1, price: 0 }];
      updateUI();
    });

    // GRN PO selector dropdown
    container.querySelector('#grn-po-selector')?.addEventListener('change', (e) => {
      selectedPOId = e.target.value;
      updateUI();
    });

    // Post Goods Receipt Form Submit
    const grnForm = container.querySelector('#grn-receipt-form');
    grnForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      // Check role
      const role = store.getCurrentRole();
      if (role === 'View Only') {
        showToast("Access Denied: Role 'View Only' cannot process receipts.", 'danger');
        return;
      }

      const rows = grnForm.querySelectorAll('form > div > div');
      const receivedItems = [];

      rows.forEach(r => {
        const productId = r.querySelector('.grn-line-prodid').value;
        const receivedQty = parseInt(r.querySelector('.grn-line-received').value) || 0;
        const damagedQty = parseInt(r.querySelector('.grn-line-damaged').value) || 0;
        const batchNumber = r.querySelector('.grn-line-batch').value.trim();
        const expiryDate = r.querySelector('.grn-line-expiry').value;
        const serials = r.querySelector('.grn-line-serials').value.trim();

        receivedItems.push({
          productId,
          receivedQty,
          damagedQty,
          batchNumber,
          expiryDate,
          serials
        });
      });

      const notes = grnForm.querySelector('#grn-notes').value.trim();

      const success = store.receiveGoods(selectedPOId, receivedItems, notes);
      if (success) {
        showToast('Goods Receipt Note posted. Stocks incremented successfully.', 'success');
        selectedPOId = null;
        activeTab = 'pos';
        updateUI();
      } else {
        showToast('Failed to receive goods.', 'danger');
      }
    });

    // Initial calculations check
    if (activeTab === 'raise-po') {
      calcFormTotals();
    }
  }

  updateUI();
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

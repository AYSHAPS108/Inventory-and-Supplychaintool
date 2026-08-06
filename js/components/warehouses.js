/**
 * Warehouse & Storage Bins Component
 */
import { store } from '../store.js';

export function renderWarehousesView(container, navigateTo, showToast) {
  let activeTab = 'list';
  let searchQuery = '';

  function updateUI() {
    const warehouses = store.getWarehouses();
    const locations = store.getLocations();
    const products = store.getProducts();

    // Filters
    const filteredLocations = locations.filter(loc => {
      const q = searchQuery.toLowerCase();
      const wh = warehouses.find(w => w.id === loc.warehouseId);
      return loc.code.toLowerCase().includes(q) || loc.zone.toLowerCase().includes(q) || (wh && wh.name.toLowerCase().includes(q));
    });

    container.innerHTML = `
      <!-- Toolbar Tabs -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); margin-bottom: 20px; padding-bottom: 10px; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; gap: 8px;">
          <button class="btn ${activeTab === 'list' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="list">Warehouse Registry</button>
          <button class="btn ${activeTab === 'bins' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="bins">Storage Bins & Racks</button>
        </div>

        <div style="display: flex; gap: 10px; align-items: center;">
          ${activeTab === 'bins' ? `
            <div class="search-input-box" style="min-width: 240px;">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" id="loc-search" placeholder="Search Bin Code or Aisle..." value="${escapeHtml(searchQuery)}">
            </div>
          ` : ''}
          <button class="btn btn-primary btn-sm" id="btn-add-entity">
            <i class="fa-solid fa-plus"></i> ${activeTab === 'list' ? 'Add Warehouse' : 'Create Location Bin'}
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div id="warehouse-tab-content">
        ${renderActiveTabContent(warehouses, filteredLocations, products)}
      </div>

      <!-- Entity Modal Container -->
      <div id="warehouse-modal" class="modal-overlay"></div>
    `;

    bindEvents();
  }

  function renderActiveTabContent(warehouses, locations, products) {
    if (activeTab === 'list') {
      return `
        <div class="category-grid" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
          ${warehouses.map(wh => {
            const whProducts = products.filter(p => p.warehouseId === wh.id);
            const totalStock = whProducts.reduce((sum, p) => sum + Number(p.quantity), 0);
            const valuation = whProducts.reduce((sum, p) => sum + (Number(p.sellingPrice) * Number(p.quantity)), 0);

            return `
              <div class="category-card" style="border-left: 4px solid ${wh.isPrimary ? 'var(--accent-primary)' : 'var(--border-color)'};">
                <div class="category-card-header">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.25rem; color: var(--accent-primary);"><i class="fa-solid fa-warehouse"></i></span>
                    <h3 style="font-size: 1rem; font-weight:700;">${escapeHtml(wh.name)}</h3>
                  </div>
                  <div style="display: flex; gap: 6px;">
                    <button class="btn btn-secondary btn-icon btn-sm btn-edit-wh" data-id="${wh.id}"><i class="fa-solid fa-pen"></i></button>
                  </div>
                </div>

                <div style="font-family: monospace; font-size: 0.775rem; color: var(--text-subtle); margin-bottom: 8px;">WH-CODE: ${wh.code} | Status: <b style="color:var(--status-success);">${wh.status || 'Active'}</b></div>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(wh.address)}</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.8rem; margin-bottom: 14px; background-color: var(--bg-primary); padding: 10px; border-radius: var(--radius-sm);">
                  <div><span style="color:var(--text-subtle);">Manager:</span> <b>${escapeHtml(wh.manager)}</b></div>
                  <div><span style="color:var(--text-subtle);">Phone:</span> <b>${escapeHtml(wh.phone)}</b></div>
                  <div><span style="color:var(--text-subtle);">Footprint:</span> <b>${escapeHtml(wh.capacity)}</b></div>
                  <div><span style="color:var(--text-subtle);">Items:</span> <b>${totalStock} Units</b></div>
                </div>

                <div class="category-stats-row">
                  <div>
                    <span style="font-size: 0.725rem; color: var(--text-subtle);">STOCK VALUE</span>
                    <div style="font-weight: 700; color: var(--accent-secondary); font-size: 0.95rem;">$${valuation.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                  </div>
                  <div style="text-align: right;">
                    <span class="badge ${wh.isPrimary ? 'badge-in-stock' : 'badge-category'}">${wh.isPrimary ? 'PRIMARY HUB' : 'SATELLITE WAREHOUSE'}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (activeTab === 'bins') {
      return `
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Storage Bin Code</th>
                <th>Warehouse Location</th>
                <th>Zone / Sect</th>
                <th>Aisle No</th>
                <th>Rack Assignment</th>
                <th>Shelf Position</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${locations.map(loc => {
                const wh = warehouses.find(w => w.id === loc.warehouseId);
                return `
                  <tr>
                    <td style="font-family: monospace; font-weight:800; color: var(--accent-primary); font-size: 0.95rem;">${loc.code}</td>
                    <td><b>${wh ? wh.name : 'Central Hub'}</b></td>
                    <td><span class="badge badge-category">${loc.zone || 'Zone A'}</span></td>
                    <td>Aisle ${loc.aisle || '01'}</td>
                    <td>${loc.rack || 'RACK-01'}</td>
                    <td>Shelf ${loc.shelf || '01'}</td>
                    <td><span class="badge badge-in-stock">Available</span></td>
                    <td style="text-align: right;">
                      <button class="btn btn-secondary btn-icon btn-sm btn-edit-loc" data-id="${loc.id}"><i class="fa-solid fa-pen"></i></button>
                    </td>
                  </tr>
                `;
              }).join('')}
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

    // Search Bin
    container.querySelector('#loc-search')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      updateUI();
    });

    // Add warehouse/location buttons
    container.querySelector('#btn-add-entity')?.addEventListener('click', () => {
      // Role Check
      const role = store.getCurrentRole();
      if (role !== 'Admin' && role !== 'Inventory Manager') {
        showToast(`Access Denied: Role '${role}' is not authorized to create warehouses or bin locations.`, 'danger');
        return;
      }

      if (activeTab === 'list') {
        openWarehouseModal(null);
      } else {
        openLocationModal(null);
      }
    });

    // Edit warehouse buttons
    container.querySelectorAll('.btn-edit-wh').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const wh = store.getWarehouseById(id);
        openWarehouseModal(wh);
      });
    });

    // Edit location buttons
    container.querySelectorAll('.btn-edit-loc').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const loc = store.getLocations().find(l => l.id === id);
        openLocationModal(loc);
      });
    });
  }

  function openWarehouseModal(wh) {
    const isEdit = Boolean(wh);
    const modalContainer = container.querySelector('#warehouse-modal');

    modalContainer.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3>${isEdit ? 'Edit Warehouse Detail' : 'Add New Warehouse'}</h3>
          <button class="btn btn-secondary btn-icon btn-sm" id="btn-close-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form id="warehouse-modal-form">
          <div class="modal-body">
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label">Warehouse Name *</label>
              <input type="text" id="wh-m-name" class="form-control" value="${isEdit ? escapeHtml(wh.name) : ''}" required>
            </div>
            <div class="form-grid" style="margin-bottom: 14px;">
              <div class="form-group">
                <label class="form-label">Warehouse Code *</label>
                <input type="text" id="wh-m-code" class="form-control" value="${isEdit ? escapeHtml(wh.code) : ''}" required style="text-transform: uppercase;">
              </div>
              <div class="form-group">
                <label class="form-label">Capacity (sq ft)</label>
                <input type="text" id="wh-m-capacity" class="form-control" value="${isEdit ? escapeHtml(wh.capacity) : '15,000 sq ft'}">
              </div>
            </div>
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label">Address Description</label>
              <textarea id="wh-m-address" class="form-control" required>${isEdit ? escapeHtml(wh.address) : ''}</textarea>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Manager In-Charge</label>
                <input type="text" id="wh-m-manager" class="form-control" value="${isEdit ? escapeHtml(wh.manager) : ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Contact Phone</label>
                <input type="text" id="wh-m-phone" class="form-control" value="${isEdit ? escapeHtml(wh.phone) : ''}">
              </div>
            </div>
            <div class="form-group" style="margin-top: 14px;">
              <label class="form-label">Is Primary Logistics Hub</label>
              <input type="checkbox" id="wh-m-primary" ${isEdit && wh.isPrimary ? 'checked' : ''}>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Create Warehouse'}</button>
          </div>
        </form>
      </div>
    `;

    modalContainer.classList.add('active');
    const close = () => modalContainer.classList.remove('active');
    modalContainer.querySelector('#btn-close-modal').addEventListener('click', close);
    modalContainer.querySelector('#btn-cancel-modal').addEventListener('click', close);

    const form = modalContainer.querySelector('#warehouse-modal-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = {
        id: isEdit ? wh.id : undefined,
        name: modalContainer.querySelector('#wh-m-name').value.trim(),
        code: modalContainer.querySelector('#wh-m-code').value.trim().toUpperCase(),
        capacity: modalContainer.querySelector('#wh-m-capacity').value.trim(),
        address: modalContainer.querySelector('#wh-m-address').value.trim(),
        manager: modalContainer.querySelector('#wh-m-manager').value.trim(),
        phone: modalContainer.querySelector('#wh-m-phone').value.trim(),
        isPrimary: modalContainer.querySelector('#wh-m-primary').checked,
        status: 'Active'
      };

      store.saveWarehouse(payload);
      showToast(`Warehouse "${payload.name}" saved successfully!`, 'success');
      close();
      updateUI();
    });
  }

  function openLocationModal(loc) {
    const isEdit = Boolean(loc);
    const modalContainer = container.querySelector('#warehouse-modal');
    const warehouses = store.getWarehouses();

    modalContainer.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3>${isEdit ? 'Edit Location Bin' : 'Create Storage Bin'}</h3>
          <button class="btn btn-secondary btn-icon btn-sm" id="btn-close-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form id="location-modal-form">
          <div class="modal-body">
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label">Warehouse Facility</label>
              <select id="loc-m-warehouse" class="form-control" required>
                ${warehouses.map(w => `<option value="${w.id}" ${isEdit && loc.warehouseId === w.id ? 'selected' : ''}>${w.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label">Location Bin Code * (e.g. A-12-04)</label>
              <input type="text" id="loc-m-code" class="form-control" value="${isEdit ? escapeHtml(loc.code) : ''}" required>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Zone</label>
                <input type="text" id="loc-m-zone" class="form-control" value="${isEdit ? escapeHtml(loc.zone) : 'Zone A'}">
              </div>
              <div class="form-group">
                <label class="form-label">Aisle Number</label>
                <input type="text" id="loc-m-aisle" class="form-control" value="${isEdit ? escapeHtml(loc.aisle) : '12'}">
              </div>
            </div>
            <div class="form-grid" style="margin-top: 14px;">
              <div class="form-group">
                <label class="form-label">Rack ID</label>
                <input type="text" id="loc-m-rack" class="form-control" value="${isEdit ? escapeHtml(loc.rack) : 'RACK-03'}">
              </div>
              <div class="form-group">
                <label class="form-label">Shelf Position</label>
                <input type="text" id="loc-m-shelf" class="form-control" value="${isEdit ? escapeHtml(loc.shelf) : 'SHELF-02'}">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Create Location'}</button>
          </div>
        </form>
      </div>
    `;

    modalContainer.classList.add('active');
    const close = () => modalContainer.classList.remove('active');
    modalContainer.querySelector('#btn-close-modal').addEventListener('click', close);
    modalContainer.querySelector('#btn-cancel-modal').addEventListener('click', close);

    const form = modalContainer.querySelector('#location-modal-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = {
        id: isEdit ? loc.id : undefined,
        warehouseId: modalContainer.querySelector('#loc-m-warehouse').value,
        code: modalContainer.querySelector('#loc-m-code').value.trim(),
        zone: modalContainer.querySelector('#loc-m-zone').value.trim(),
        aisle: modalContainer.querySelector('#loc-m-aisle').value.trim(),
        rack: modalContainer.querySelector('#loc-m-rack').value.trim(),
        shelf: modalContainer.querySelector('#loc-m-shelf').value.trim(),
        bin: modalContainer.querySelector('#loc-m-code').value.trim().split('-').pop() || '01'
      };

      store.saveLocation(payload);
      showToast(`Storage Bin "${payload.code}" saved!`, 'success');
      close();
      updateUI();
    });
  }

  updateUI();
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

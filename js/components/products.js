/**
 * 2. Products Component (Product Master, Add Product, Barcode, SKU, Tax, Pricing, Units)
 */
import { store } from '../store.js';

export function renderProductsView(container, navigateTo, showToast) {
  let products = store.getProducts();
  const categories = store.getCategories();
  const subcategories = store.getSubcategories();
  const brands = store.getBrands();
  const suppliers = store.getSuppliers();
  const warehouses = store.getWarehouses();

  let searchQuery = '';
  let selectedCategory = 'all';

  function updateUI() {
    products = store.getProducts();
    const filtered = products.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchQuery = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.barcode && p.barcode.includes(q));
      const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
      return matchQuery && matchCat;
    });

    container.innerHTML = `
      <div class="filter-toolbar">
        <div class="filter-group">
          <div class="search-input-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="prod-search" placeholder="Search SKU, Barcode, Name..." value="${escapeHtml(searchQuery)}">
          </div>

          <select class="select-control" id="prod-cat-filter">
            <option value="all">All Categories</option>
            ${categories.map(c => `<option value="${c.id}" ${selectedCategory === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>

        <button class="btn btn-primary" id="btn-open-add-product">
          <i class="fa-solid fa-plus"></i> Add New Product
        </button>
      </div>

      <!-- Data Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Product Info</th>
              <th>SKU / Barcode</th>
              <th>Category / Brand</th>
              <th>Pricing & Tax</th>
              <th>Stock Level</th>
              <th>Location</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(p => {
              const cat = categories.find(c => c.id === p.categoryId);
              const brand = brands.find(b => b.id === p.brandId);
              const margin = (((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100).toFixed(0);

              return `
                <tr>
                  <td>
                    <div class="product-cell">
                      <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/44'">
                      <div>
                        <div class="product-title-text">${escapeHtml(p.name)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-subtle);">${p.supplier || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style="font-family: monospace; font-weight: 700; color: var(--accent-primary);">${p.sku}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);"><i class="fa-solid fa-barcode"></i> ${p.barcode || 'N/A'}</div>
                  </td>
                  <td>
                    <span class="badge badge-category">${cat ? cat.name : 'N/A'}</span>
                    <div style="font-size: 0.75rem; color: var(--text-subtle); margin-top: 2px;">${brand ? brand.name : ''}</div>
                  </td>
                  <td>
                    <div style="font-weight: 700;">$${Number(p.sellingPrice).toFixed(2)}</div>
                    <div style="font-size: 0.75rem; color: var(--text-subtle);">Cost: $${Number(p.costPrice).toFixed(2)} (${margin}% Margin) | Tax: ${p.taxRate || 18}%</div>
                  </td>
                  <td>
                    <span style="font-weight: 700; color: ${p.quantity <= p.minStock ? 'var(--status-warning)' : 'var(--text-main)'};">
                      ${p.quantity} ${p.unit || 'pcs'}
                    </span>
                    <div style="font-size: 0.75rem; color: var(--text-subtle);">Min: ${p.minStock} | Reorder: ${p.reorderLevel || 30}</div>
                  </td>
                  <td>
                    <span style="font-family: monospace; font-size: 0.85rem;">${p.locationBin || 'N/A'}</span>
                  </td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-icon btn-sm btn-edit-product" data-id="${p.id}" title="Edit Product">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-danger btn-icon btn-sm btn-delete-product" data-id="${p.id}" title="Delete Product">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Add/Edit Product Modal -->
      <div id="product-modal" class="modal-overlay"></div>
    `;

    bindEvents();
  }

  function bindEvents() {
    container.querySelector('#prod-search')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      updateUI();
    });

    container.querySelector('#prod-cat-filter')?.addEventListener('change', (e) => {
      selectedCategory = e.target.value;
      updateUI();
    });

    container.querySelector('#btn-open-add-product')?.addEventListener('click', () => {
      openProductModal(null);
    });

    container.querySelectorAll('.btn-edit-product').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const p = store.getProductById(id);
        openProductModal(p);
      });
    });

    container.querySelectorAll('.btn-delete-product').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const p = store.getProductById(id);
        if (confirm(`Delete product "${p.name}"?`)) {
          store.deleteProduct(id);
          showToast(`Product "${p.name}" deleted.`, 'info');
          updateUI();
        }
      });
    });
  }

  function openProductModal(existingProduct) {
    const isEdit = Boolean(existingProduct);
    const modalContainer = container.querySelector('#product-modal');

    modalContainer.innerHTML = `
      <div class="modal-card" style="max-width: 750px;">
        <div class="modal-header">
          <h3>${isEdit ? 'Edit Product Specification' : 'Add New Product Master'}</h3>
          <button class="btn btn-secondary btn-icon btn-sm" id="btn-close-prod-modal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form id="product-modal-form">
          <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
            <div class="form-grid">
              <div class="form-group form-group-full">
                <label class="form-label">Product Name <span class="required">*</span></label>
                <input type="text" id="m-name" class="form-control" value="${isEdit ? escapeHtml(existingProduct.name) : ''}" required>
              </div>

              <div class="form-group">
                <label class="form-label">Category <span class="required">*</span></label>
                <select id="m-category" class="form-control" required>
                  ${categories.map(c => `<option value="${c.id}" ${isEdit && existingProduct.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Subcategory</label>
                <select id="m-subcategory" class="form-control">
                  ${subcategories.map(s => `<option value="${s.id}" ${isEdit && existingProduct.subcategoryId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">SKU Code <span class="required">*</span></label>
                <div class="input-with-button">
                  <input type="text" id="m-sku" class="form-control" value="${isEdit ? escapeHtml(existingProduct.sku) : ''}" required>
                  <button type="button" class="btn btn-secondary btn-sm" id="m-btn-gen-sku">Auto</button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Barcode / EAN-13</label>
                <div class="input-with-button">
                  <input type="text" id="m-barcode" class="form-control" value="${isEdit ? escapeHtml(existingProduct.barcode || '') : ''}">
                  <button type="button" class="btn btn-secondary btn-sm" id="m-btn-gen-barcode">Gen</button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Brand</label>
                <select id="m-brand" class="form-control">
                  ${brands.map(b => `<option value="${b.id}" ${isEdit && existingProduct.brandId === b.id ? 'selected' : ''}>${b.name}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Unit of Measure <span class="required">*</span></label>
                <select id="m-unit" class="form-control" required>
                  <option value="pcs" ${isEdit && existingProduct.unit === 'pcs' ? 'selected' : ''}>pcs (Pieces)</option>
                  <option value="kg" ${isEdit && existingProduct.unit === 'kg' ? 'selected' : ''}>kg (Kilograms)</option>
                  <option value="liters" ${isEdit && existingProduct.unit === 'liters' ? 'selected' : ''}>liters</option>
                  <option value="boxes" ${isEdit && existingProduct.unit === 'boxes' ? 'selected' : ''}>boxes</option>
                  <option value="bags" ${isEdit && existingProduct.unit === 'bags' ? 'selected' : ''}>bags</option>
                  <option value="meters" ${isEdit && existingProduct.unit === 'meters' ? 'selected' : ''}>meters</option>
                  <option value="pallets" ${isEdit && existingProduct.unit === 'pallets' ? 'selected' : ''}>pallets</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Cost Price ($) <span class="required">*</span></label>
                <input type="number" step="0.01" id="m-cost" class="form-control" value="${isEdit ? existingProduct.costPrice : ''}" required>
              </div>

              <div class="form-group">
                <label class="form-label">Selling Price ($) <span class="required">*</span></label>
                <input type="number" step="0.01" id="m-selling" class="form-control" value="${isEdit ? existingProduct.sellingPrice : ''}" required>
              </div>

              <div class="form-group">
                <label class="form-label">Tax Rate (%)</label>
                <input type="number" id="m-tax" class="form-control" value="${isEdit ? existingProduct.taxRate || 18 : 18}">
              </div>

              <div class="form-group">
                <label class="form-label">Initial Quantity <span class="required">*</span></label>
                <input type="number" id="m-qty" class="form-control" value="${isEdit ? existingProduct.quantity : '0'}" required>
              </div>

              <div class="form-group">
                <label class="form-label">Min Stock Threshold</label>
                <input type="number" id="m-min" class="form-control" value="${isEdit ? existingProduct.minStock : '10'}">
              </div>

              <div class="form-group">
                <label class="form-label">Reorder Trigger Level</label>
                <input type="number" id="m-reorder" class="form-control" value="${isEdit ? existingProduct.reorderLevel || '30' : '30'}">
              </div>

              <div class="form-group">
                <label class="form-label">Primary Warehouse</label>
                <select id="m-warehouse" class="form-control">
                  ${warehouses.map(w => `<option value="${w.id}" ${isEdit && existingProduct.warehouseId === w.id ? 'selected' : ''}>${w.name}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Warehouse Bin Location</label>
                <input type="text" id="m-bin" class="form-control" value="${isEdit ? escapeHtml(existingProduct.locationBin || '') : ''}">
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-prod-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Create Product'}</button>
          </div>
        </form>
      </div>
    `;

    modalContainer.classList.add('active');

    const closeModal = () => modalContainer.classList.remove('active');
    modalContainer.querySelector('#btn-close-prod-modal').addEventListener('click', closeModal);
    modalContainer.querySelector('#btn-cancel-prod-modal').addEventListener('click', closeModal);

    // Auto SKU
    modalContainer.querySelector('#m-btn-gen-sku').addEventListener('click', () => {
      const catId = modalContainer.querySelector('#m-category').value;
      const name = modalContainer.querySelector('#m-name').value;
      modalContainer.querySelector('#m-sku').value = store.generateSKU(catId, name);
    });

    // Auto Barcode
    modalContainer.querySelector('#m-btn-gen-barcode').addEventListener('click', () => {
      const randBarcode = '890' + Math.floor(1000000000 + Math.random() * 9000000000);
      modalContainer.querySelector('#m-barcode').value = randBarcode;
    });

    // Submit
    const form = modalContainer.querySelector('#product-modal-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = {
        id: isEdit ? existingProduct.id : undefined,
        name: modalContainer.querySelector('#m-name').value.trim(),
        categoryId: modalContainer.querySelector('#m-category').value,
        subcategoryId: modalContainer.querySelector('#m-subcategory').value,
        brandId: modalContainer.querySelector('#m-brand').value,
        sku: modalContainer.querySelector('#m-sku').value.trim(),
        barcode: modalContainer.querySelector('#m-barcode').value.trim(),
        unit: modalContainer.querySelector('#m-unit').value,
        costPrice: parseFloat(modalContainer.querySelector('#m-cost').value) || 0,
        sellingPrice: parseFloat(modalContainer.querySelector('#m-selling').value) || 0,
        taxRate: parseFloat(modalContainer.querySelector('#m-tax').value) || 18,
        quantity: parseInt(modalContainer.querySelector('#m-qty').value, 10) || 0,
        minStock: parseInt(modalContainer.querySelector('#m-min').value, 10) || 10,
        reorderLevel: parseInt(modalContainer.querySelector('#m-reorder').value, 10) || 30,
        warehouseId: modalContainer.querySelector('#m-warehouse').value,
        locationBin: modalContainer.querySelector('#m-bin').value.trim(),
        image: isEdit ? existingProduct.image : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500'
      };

      store.saveProduct(payload);
      showToast(isEdit ? `Product "${payload.name}" updated!` : `Product "${payload.name}" created!`, 'success');
      closeModal();
      updateUI();
    });
  }

  updateUI();
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

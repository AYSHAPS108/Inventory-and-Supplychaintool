/**
 * Product Creation & Edit Form Component
 */
import { store, PRESET_IMAGES } from '../store.js';

export function renderProductFormView(container, navigateTo, showToast, options = {}) {
  const isEdit = Boolean(options.productId);
  const existingProduct = isEdit ? store.getProductById(options.productId) : null;
  const categories = store.getCategories();

  let selectedImage = existingProduct ? existingProduct.image : PRESET_IMAGES[0];
  let activeTab = 'basic';

  container.innerHTML = `
    <div class="form-card">
      <div class="form-header">
        <h2>${isEdit ? 'Edit Product Specification' : 'Create New Master Product'}</h2>
        <p>${isEdit ? 'Update inventory thresholds, supplier details, or pricing.' : 'Add a new stock keeping unit (SKU) to the supply chain inventory catalog.'}</p>
      </div>

      <!-- Navigation Tabs -->
      <div class="form-tabs">
        <div class="form-tab ${activeTab === 'basic' ? 'active' : ''}" data-tab="basic">
          <i class="fa-solid fa-circle-info"></i> Basic Details
        </div>
        <div class="form-tab ${activeTab === 'pricing' ? 'active' : ''}" data-tab="pricing">
          <i class="fa-solid fa-tags"></i> Pricing & Stock
        </div>
        <div class="form-tab ${activeTab === 'logistics' ? 'active' : ''}" data-tab="logistics">
          <i class="fa-solid fa-truck-ramp-box"></i> Logistics & Media
        </div>
      </div>

      <form id="product-master-form">
        <!-- Tab 1: Basic Information -->
        <div class="tab-content" id="tab-basic" style="display: block;">
          <div class="form-grid">
            <div class="form-group form-group-full">
              <label class="form-label">Product Title / Name <span class="required">*</span></label>
              <input type="text" id="form-name" class="form-control" placeholder="e.g. 3-Phase AC Motor 5.5kW" value="${existingProduct ? escapeHtml(existingProduct.name) : ''}" required>
            </div>

            <div class="form-group">
              <label class="form-label">Category <span class="required">*</span></label>
              <select id="form-category" class="form-control" required>
                <option value="">Select Category</option>
                ${categories.map(c => `<option value="${c.id}" ${existingProduct && existingProduct.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">SKU Code <span class="required">*</span></label>
              <div class="input-with-button">
                <input type="text" id="form-sku" class="form-control" placeholder="e.g. ELEC-SENS-001" value="${existingProduct ? escapeHtml(existingProduct.sku) : ''}" required>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-generate-sku" title="Auto-Generate SKU">
                  <i class="fa-solid fa-wand-magic-sparkles"></i> Auto
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Barcode / EAN-13</label>
              <input type="text" id="form-barcode" class="form-control" placeholder="e.g. 8901234567891" value="${existingProduct ? escapeHtml(existingProduct.barcode || '') : ''}">
            </div>

            <div class="form-group form-group-full">
              <label class="form-label">Product Description</label>
              <textarea id="form-description" class="form-control" placeholder="Detailed technical specifications, material compliance, or notes...">${existingProduct ? escapeHtml(existingProduct.description || '') : ''}</textarea>
            </div>
          </div>
        </div>

        <!-- Tab 2: Pricing & Stock -->
        <div class="tab-content" id="tab-pricing" style="display: none;">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Cost Price ($) <span class="required">*</span></label>
              <input type="number" step="0.01" min="0" id="form-cost" class="form-control" placeholder="0.00" value="${existingProduct ? existingProduct.costPrice : ''}" required>
            </div>

            <div class="form-group">
              <label class="form-label">Selling Price ($) <span class="required">*</span></label>
              <input type="number" step="0.01" min="0" id="form-selling" class="form-control" placeholder="0.00" value="${existingProduct ? existingProduct.sellingPrice : ''}" required>
            </div>

            <div class="form-group">
              <label class="form-label">Initial Quantity in Stock <span class="required">*</span></label>
              <input type="number" min="0" id="form-qty" class="form-control" placeholder="100" value="${existingProduct ? existingProduct.quantity : '0'}" required>
            </div>

            <div class="form-group">
              <label class="form-label">Unit of Measure <span class="required">*</span></label>
              <select id="form-unit" class="form-control" required>
                <option value="pcs" ${existingProduct && existingProduct.unit === 'pcs' ? 'selected' : ''}>pcs (Pieces)</option>
                <option value="kg" ${existingProduct && existingProduct.unit === 'kg' ? 'selected' : ''}>kg (Kilograms)</option>
                <option value="liters" ${existingProduct && existingProduct.unit === 'liters' ? 'selected' : ''}>liters</option>
                <option value="boxes" ${existingProduct && existingProduct.unit === 'boxes' ? 'selected' : ''}>boxes</option>
                <option value="bags" ${existingProduct && existingProduct.unit === 'bags' ? 'selected' : ''}>bags</option>
                <option value="meters" ${existingProduct && existingProduct.unit === 'meters' ? 'selected' : ''}>meters</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Minimum Stock Alert Threshold <span class="required">*</span></label>
              <input type="number" min="0" id="form-min-stock" class="form-control" placeholder="10" value="${existingProduct ? existingProduct.minStock : '10'}" required>
            </div>

            <div class="form-group">
              <label class="form-label">Maximum Warehouse Capacity</label>
              <input type="number" min="0" id="form-max-stock" class="form-control" placeholder="500" value="${existingProduct ? existingProduct.maxStock || '' : '500'}">
            </div>
          </div>
        </div>

        <!-- Tab 3: Logistics & Media -->
        <div class="tab-content" id="tab-logistics" style="display: none;">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Primary Supplier Name</label>
              <input type="text" id="form-supplier" class="form-control" placeholder="e.g. Apex Automation Corp" value="${existingProduct ? escapeHtml(existingProduct.supplier || '') : ''}">
            </div>

            <div class="form-group">
              <label class="form-label">Lead Time (Days)</label>
              <input type="number" min="0" id="form-lead-time" class="form-control" placeholder="7" value="${existingProduct ? existingProduct.leadTimeDays || '7' : '7'}">
            </div>

            <div class="form-group form-group-full">
              <label class="form-label">Warehouse Bin Location</label>
              <input type="text" id="form-bin" class="form-control" placeholder="e.g. A-12-04" value="${existingProduct ? escapeHtml(existingProduct.locationBin || '') : ''}">
            </div>

            <div class="form-group form-group-full">
              <label class="form-label">Product Image URL</label>
              <input type="url" id="form-image-url" class="form-control" placeholder="https://..." value="${selectedImage}">
              
              <div class="image-preview-container">
                <div class="image-preview-box">
                  <img id="form-image-preview" src="${selectedImage}" alt="Preview" onerror="this.src='https://via.placeholder.com/80'">
                </div>
                <div>
                  <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">Or Select a Preset Image:</div>
                  <div class="preset-images-grid">
                    ${PRESET_IMAGES.map((img, idx) => `
                      <img src="${img}" class="preset-img-option ${img === selectedImage ? 'selected' : ''}" data-url="${img}" alt="Preset ${idx+1}">
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Buttons -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--border-color);">
          <button type="button" class="btn btn-secondary" id="btn-cancel-form">Cancel</button>
          
          <div style="display: flex; gap: 12px;">
            <button type="submit" class="btn btn-primary">
              <i class="fa-solid fa-floppy-disk"></i> ${isEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  `;

  bindFormEvents();

  function bindFormEvents() {
    // Tab switching
    container.querySelectorAll('.form-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.dataset.tab;
        container.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        container.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        container.querySelector(`#tab-${tabId}`).style.display = 'block';
      });
    });

    // Auto SKU Generation
    container.querySelector('#btn-generate-sku')?.addEventListener('click', () => {
      const catId = container.querySelector('#form-category').value;
      const name = container.querySelector('#form-name').value;
      const newSku = store.generateSKU(catId, name);
      container.querySelector('#form-sku').value = newSku;
      showToast(`Generated SKU: ${newSku}`, 'info');
    });

    // Image selector preset & custom URL preview
    const urlInput = container.querySelector('#form-image-url');
    const previewImg = container.querySelector('#form-image-preview');

    urlInput?.addEventListener('input', (e) => {
      selectedImage = e.target.value;
      previewImg.src = selectedImage;
    });

    container.querySelectorAll('.preset-img-option').forEach(opt => {
      opt.addEventListener('click', () => {
        container.querySelectorAll('.preset-img-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedImage = opt.dataset.url;
        urlInput.value = selectedImage;
        previewImg.src = selectedImage;
      });
    });

    // Cancel Button
    container.querySelector('#btn-cancel-form')?.addEventListener('click', () => {
      navigateTo('product-list');
    });

    // Form Submit
    const form = container.querySelector('#product-master-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = container.querySelector('#form-name').value.trim();
      const categoryId = container.querySelector('#form-category').value;
      const sku = container.querySelector('#form-sku').value.trim();
      const barcode = container.querySelector('#form-barcode').value.trim();
      const description = container.querySelector('#form-description').value.trim();

      const costPrice = parseFloat(container.querySelector('#form-cost').value) || 0;
      const sellingPrice = parseFloat(container.querySelector('#form-selling').value) || 0;
      const quantity = parseInt(container.querySelector('#form-qty').value, 10) || 0;
      const unit = container.querySelector('#form-unit').value;
      const minStock = parseInt(container.querySelector('#form-min-stock').value, 10) || 0;
      const maxStock = parseInt(container.querySelector('#form-max-stock').value, 10) || 500;

      const supplier = container.querySelector('#form-supplier').value.trim();
      const leadTimeDays = parseInt(container.querySelector('#form-lead-time').value, 10) || 7;
      const locationBin = container.querySelector('#form-bin').value.trim();

      if (!name || !categoryId || !sku) {
        showToast('Please fill in all required fields marked with *', 'danger');
        return;
      }

      const productPayload = {
        id: isEdit ? existingProduct.id : undefined,
        name,
        categoryId,
        sku,
        barcode,
        description,
        costPrice,
        sellingPrice,
        quantity,
        unit,
        minStock,
        maxStock,
        supplier,
        leadTimeDays,
        locationBin,
        image: selectedImage || PRESET_IMAGES[0]
      };

      store.saveProduct(productPayload);
      showToast(isEdit ? `Product "${name}" updated!` : `Product "${name}" created successfully!`, 'success');
      navigateTo('product-list');
    });
  }
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

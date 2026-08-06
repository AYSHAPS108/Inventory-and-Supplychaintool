/**
 * Categories & Classification Management Component
 */
import { store } from '../store.js';

export function renderCategoriesView(container, navigateTo, showToast) {
  let activeTab = 'categories';
  let subFormCategoryId = 'cat-1';

  function updateUI() {
    const categories = store.getCategories();
    const subcategories = store.getSubcategories();
    const brands = store.getBrands();
    const products = store.getProducts();
    const settings = store.getSettings();

    container.innerHTML = `
      <!-- Toolbar Tabs -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); margin-bottom: 20px; padding-bottom: 10px; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; gap: 8px;">
          <button class="btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="categories">Category Tree</button>
          <button class="btn ${activeTab === 'subcategories' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="subcategories">Subcategories</button>
          <button class="btn ${activeTab === 'brands' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="brands">Brands & Units</button>
          <button class="btn ${activeTab === 'attributes' ? 'btn-primary' : 'btn-secondary'} btn-sm tab-btn" data-tab="attributes">Attributes & Groups</button>
        </div>

        <button class="btn btn-primary btn-sm" id="btn-add-classification">
          <i class="fa-solid fa-plus"></i> Add New Classification
        </button>
      </div>

      <!-- Tab Content -->
      <div id="classification-tab-content">
        ${renderActiveTabContent(categories, subcategories, brands, products, settings)}
      </div>

      <!-- Classification Modals -->
      <div id="classification-modal" class="modal-overlay"></div>
    `;

    bindEvents();
  }

  function renderActiveTabContent(categories, subcategories, brands, products, settings) {
    if (activeTab === 'categories') {
      return `
        <div class="category-grid">
          ${categories.map(cat => {
            const catProducts = products.filter(p => p.categoryId === cat.id);
            const valuation = catProducts.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);

            return `
              <div class="category-card">
                <div class="category-card-header">
                  <div class="category-icon-box" style="background: linear-gradient(135deg, ${cat.color || '#6366f1'}, ${cat.color || '#6366f1'}aa);">
                    <i class="fa-solid ${cat.icon || 'fa-folder'}"></i>
                  </div>
                  <div style="display: flex; gap: 6px;">
                    <button class="btn btn-secondary btn-icon btn-sm btn-edit-cat" data-id="${cat.id}"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-danger btn-icon btn-sm btn-delete-cat" data-id="${cat.id}"><i class="fa-solid fa-trash"></i></button>
                  </div>
                </div>

                <h3 style="font-size: 1.1rem; font-weight: 700; margin-top: 10px;">${escapeHtml(cat.name)}</h3>
                <div style="font-size: 0.775rem; color: var(--text-subtle); margin-bottom: 8px; font-family: monospace;">CODE: ${cat.code}</div>
                <p style="font-size: 0.825rem; color: var(--text-muted); min-height: 40px; margin-bottom: 16px;">${escapeHtml(cat.description || 'No description.')}</p>

                <div class="category-stats-row">
                  <div>
                    <div style="font-size: 0.75rem; color: var(--text-subtle);">ASSIGNED SKUs</div>
                    <div class="category-stat-num">${catProducts.length} Products</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 0.75rem; color: var(--text-subtle);">TOTAL VALUATION</div>
                    <div class="category-stat-num" style="color: var(--accent-secondary);">$${valuation.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (activeTab === 'subcategories') {
      return `
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Subcategory Name</th>
                <th>Parent Category</th>
                <th>Assigned Products Count</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${subcategories.map(sub => {
                const parent = categories.find(c => c.id === sub.categoryId);
                const count = products.filter(p => p.subcategoryId === sub.id).length;
                return `
                  <tr>
                    <td><b>${escapeHtml(sub.name)}</b></td>
                    <td><span class="badge badge-category" style="${parent ? `background-color: ${parent.color}20; color: ${parent.color};` : ''}">${parent ? parent.name : 'Uncategorized'}</span></td>
                    <td><b>${count} SKUs</b></td>
                    <td><span class="badge badge-in-stock">Active</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (activeTab === 'brands') {
      return `
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:20px;">
          <!-- Brands Table -->
          <div class="card">
            <h3 style="font-size:0.95rem; font-weight:700; margin-bottom:12px;"><i class="fa-solid fa-copyright"></i> Brands Index</h3>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Brand Name</th>
                    <th>Origin Country</th>
                    <th>Compliance Website</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${brands.map(b => `
                    <tr>
                      <td><b>${escapeHtml(b.name)}</b></td>
                      <td>${b.country}</td>
                      <td><a href="${b.website}" target="_blank" style="color:var(--accent-secondary);">${b.website}</a></td>
                      <td><span class="badge badge-in-stock">Approved</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Units of measure list -->
          <div class="card" style="align-self: flex-start;">
            <h3 style="font-size:0.95rem; font-weight:700; margin-bottom:12px;"><i class="fa-solid fa-weight-scale"></i> Active UOM Units</h3>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${settings.unitsList.map(unit => `
                <div style="background-color: var(--bg-primary); padding:10px; border-radius: var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
                  <b style="text-transform: uppercase; font-size:0.85rem;">${unit}</b>
                  <span class="badge badge-in-stock" style="font-size:0.7rem;">System Active</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    if (activeTab === 'attributes') {
      return `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
          <!-- Product Attributes -->
          <div class="card">
            <h3 style="font-size: 0.95rem; font-weight:700; margin-bottom:12px;"><i class="fa-solid fa-list-check"></i> Standard Product Attributes</h3>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="background-color: var(--bg-primary); padding:10px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <b>Variants Size / Dimension</b>
                  <div style="font-size:0.75rem; color:var(--text-subtle);">E.g. Foot Mount motor sizes, rod diameters</div>
                </div>
                <span class="badge badge-category">SYSTEM</span>
              </div>
              <div style="background-color: var(--bg-primary); padding:10px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <b>Material Composition</b>
                  <div style="font-size:0.75rem; color:var(--text-subtle);">E.g. Marine grade 316L, High-Density polyethylene</div>
                </div>
                <span class="badge badge-category">SYSTEM</span>
              </div>
              <div style="background-color: var(--bg-primary); padding:10px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <b>HSN / SAC Code</b>
                  <div style="font-size:0.75rem; color:var(--text-subtle);">Assigned for taxation and customs declarations</div>
                </div>
                <span class="badge badge-category">SYSTEM</span>
              </div>
            </div>
          </div>

          <!-- Product Groups -->
          <div class="card">
            <h3 style="font-size: 0.95rem; font-weight:700; margin-bottom:12px;"><i class="fa-solid fa-layer-group"></i> Product Classification Groups</h3>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="background-color: var(--bg-primary); padding:10px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <b>Raw Material Group</b>
                  <div style="font-size:0.75rem; color:var(--text-subtle);">Metals, chemicals, plastic resins</div>
                </div>
                <span class="badge badge-in-stock">ACTIVE</span>
              </div>
              <div style="background-color: var(--bg-primary); padding:10px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <b>Electronics & Components</b>
                  <div style="font-size:0.75rem; color:var(--text-subtle);">Active microcontrollers, sensors, wire harnesses</div>
                </div>
                <span class="badge badge-in-stock">ACTIVE</span>
              </div>
              <div style="background-color: var(--bg-primary); padding:10px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <b>Finished Consumable Goods</b>
                  <div style="font-size:0.75rem; color:var(--text-subtle);">PPE safety gear, cardboard packaging kits</div>
                </div>
                <span class="badge badge-in-stock">ACTIVE</span>
              </div>
            </div>
          </div>
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

    // Add classification triggers modal
    container.querySelector('#btn-add-classification')?.addEventListener('click', () => {
      // Role Check
      const role = store.getCurrentRole();
      if (role !== 'Admin' && role !== 'Inventory Manager') {
        showToast(`Access Denied: Role '${role}' is not authorized to create categories or brands.`, 'danger');
        return;
      }

      if (activeTab === 'categories') {
        openCategoryModal(null);
      } else if (activeTab === 'subcategories') {
        openSubcategoryModal();
      } else if (activeTab === 'brands') {
        openBrandModal();
      } else {
        showToast('System Attributes and Groups are managed globally in Settings.', 'info');
      }
    });

    // Edit categories
    container.querySelectorAll('.btn-edit-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const cat = store.getCategoryById(id);
        openCategoryModal(cat);
      });
    });

    // Delete categories
    container.querySelectorAll('.btn-delete-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const cat = store.getCategoryById(id);
        const prods = store.getProducts().filter(p => p.categoryId === id);

        if (prods.length > 0) {
          showToast(`Cannot delete category "${cat.name}". ${prods.length} products are assigned to it.`, 'warning');
          return;
        }

        if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
          store.deleteCategory(id);
          showToast(`Category "${cat.name}" deleted.`, 'info');
          updateUI();
        }
      });
    });
  }

  function openCategoryModal(cat) {
    const isEdit = Boolean(cat);
    const modalContainer = container.querySelector('#classification-modal');
    const presetColors = ['#6366f1', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
    const presetIcons = ['fa-microchip', 'fa-cubes', 'fa-cogs', 'fa-boxes-packing', 'fa-hard-hat', 'fa-truck', 'fa-wrench', 'fa-industry'];

    modalContainer.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3>${isEdit ? 'Edit Category Detail' : 'Create New Category'}</h3>
          <button class="btn btn-secondary btn-icon btn-sm" id="btn-close-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form id="category-modal-form">
          <div class="modal-body">
            <div class="form-group" style="margin-bottom:14px;">
              <label class="form-label">Category Name *</label>
              <input type="text" id="cat-m-name" class="form-control" value="${isEdit ? escapeHtml(cat.name) : ''}" required>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
              <label class="form-label">Category Code Prefix * (e.g. ELEC)</label>
              <input type="text" id="cat-m-code" class="form-control" value="${isEdit ? escapeHtml(cat.code) : ''}" required style="text-transform: uppercase;">
            </div>
            <div class="form-group" style="margin-bottom:14px;">
              <label class="form-label">Description</label>
              <textarea id="cat-m-desc" class="form-control">${isEdit ? escapeHtml(cat.description || '') : ''}</textarea>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
              <label class="form-label">Badge Color</label>
              <div style="display:flex; gap:10px; align-items:center;">
                <input type="color" id="cat-m-color" value="${isEdit ? cat.color : '#6366f1'}">
                <div style="display:flex; gap:6px;">
                  ${presetColors.map(c => `<span class="color-preset-dot" data-color="${c}" style="width:20px; height:20px; border-radius:50%; background-color:${c}; cursor:pointer; display:inline-block;"></span>`).join('')}
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Category Icon</label>
              <select id="cat-m-icon" class="form-control">
                ${presetIcons.map(ic => `<option value="${ic}" ${isEdit && cat.icon === ic ? 'selected' : ''}>${ic.replace('fa-', '')}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Create'}</button>
          </div>
        </form>
      </div>
    `;

    modalContainer.classList.add('active');
    const close = () => modalContainer.classList.remove('active');
    modalContainer.querySelector('#btn-close-modal').addEventListener('click', close);
    modalContainer.querySelector('#btn-cancel-modal').addEventListener('click', close);

    modalContainer.querySelectorAll('.color-preset-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        modalContainer.querySelector('#cat-m-color').value = dot.dataset.color;
      });
    });

    const form = modalContainer.querySelector('#category-modal-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = {
        id: isEdit ? cat.id : undefined,
        name: modalContainer.querySelector('#cat-m-name').value.trim(),
        code: modalContainer.querySelector('#cat-m-code').value.trim().toUpperCase(),
        description: modalContainer.querySelector('#cat-m-desc').value.trim(),
        color: modalContainer.querySelector('#cat-m-color').value,
        icon: modalContainer.querySelector('#cat-m-icon').value
      };

      store.saveCategory(payload);
      showToast(`Category "${payload.name}" saved!`, 'success');
      close();
      updateUI();
    });
  }

  function openSubcategoryModal() {
    const modalContainer = container.querySelector('#classification-modal');
    const categories = store.getCategories();

    modalContainer.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3>Create New Subcategory</h3>
          <button class="btn btn-secondary btn-icon btn-sm" id="btn-close-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form id="subcategory-modal-form">
          <div class="modal-body">
            <div class="form-group" style="margin-bottom:14px;">
              <label class="form-label">Parent Category *</label>
              <select id="sub-m-parent" class="form-control" required>
                ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Subcategory Name *</label>
              <input type="text" id="sub-m-name" class="form-control" required placeholder="e.g. Sensors & ICs">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Subcategory</button>
          </div>
        </form>
      </div>
    `;

    modalContainer.classList.add('active');
    const close = () => modalContainer.classList.remove('active');
    modalContainer.querySelector('#btn-close-modal').addEventListener('click', close);
    modalContainer.querySelector('#btn-cancel-modal').addEventListener('click', close);

    const form = modalContainer.querySelector('#subcategory-modal-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const parentId = modalContainer.querySelector('#sub-m-parent').value;
      const name = modalContainer.querySelector('#sub-m-name').value.trim();

      const subcategories = store.getSubcategories();
      subcategories.push({
        id: 'sub-' + Date.now(),
        categoryId: parentId,
        name
      });
      store.setItem('esct_subcategories_v3', subcategories);

      showToast(`Subcategory "${name}" created successfully!`, 'success');
      close();
      updateUI();
    });
  }

  function openBrandModal() {
    const modalContainer = container.querySelector('#classification-modal');

    modalContainer.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3>Register Product Brand</h3>
          <button class="btn btn-secondary btn-icon btn-sm" id="btn-close-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form id="brand-modal-form">
          <div class="modal-body">
            <div class="form-group" style="margin-bottom:14px;">
              <label class="form-label">Brand Name *</label>
              <input type="text" id="br-m-name" class="form-control" required placeholder="e.g. Apex Industrial">
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Origin Country</label>
                <input type="text" id="br-m-country" class="form-control" placeholder="Germany">
              </div>
              <div class="form-group">
                <label class="form-label">Corporate Website</label>
                <input type="url" id="br-m-web" class="form-control" placeholder="https://...">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Brand</button>
          </div>
        </form>
      </div>
    `;

    modalContainer.classList.add('active');
    const close = () => modalContainer.classList.remove('active');
    modalContainer.querySelector('#btn-close-modal').addEventListener('click', close);
    modalContainer.querySelector('#btn-cancel-modal').addEventListener('click', close);

    const form = modalContainer.querySelector('#brand-modal-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = {
        name: modalContainer.querySelector('#br-m-name').value.trim(),
        country: modalContainer.querySelector('#br-m-country').value.trim() || 'Global',
        website: modalContainer.querySelector('#br-m-web').value.trim() || 'https://example.com'
      };

      store.saveBrand(payload);
      showToast(`Brand "${payload.name}" registered successfully!`, 'success');
      close();
      updateUI();
    });
  }

  updateUI();
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

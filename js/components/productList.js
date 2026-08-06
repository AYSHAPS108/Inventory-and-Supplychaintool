/**
 * Product List Component
 */
import { store } from '../store.js';

let state = {
  searchQuery: '',
  categoryFilter: 'all',
  stockFilter: 'all',
  sortBy: 'name-asc',
  viewMode: 'table', // 'table' or 'grid'
  currentPage: 1,
  pageSize: 8,
  selectedIds: new Set()
};

export function renderProductListView(container, navigateTo, showToast) {
  const categories = store.getCategories();
  
  function updateUI() {
    const products = getFilteredProducts();
    const totalPages = Math.max(1, Math.ceil(products.length / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;

    const startIdx = (state.currentPage - 1) * state.pageSize;
    const paginatedProducts = products.slice(startIdx, startIdx + state.pageSize);

    container.innerHTML = `
      <!-- Toolbar -->
      <div class="filter-toolbar">
        <div class="filter-group">
          <div class="search-input-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="list-search" placeholder="Search SKU, Product Name..." value="${escapeHtml(state.searchQuery)}">
          </div>

          <select class="select-control" id="list-cat-filter">
            <option value="all">All Categories</option>
            ${categories.map(c => `<option value="${c.id}" ${state.categoryFilter === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>

          <select class="select-control" id="list-stock-filter">
            <option value="all" ${state.stockFilter === 'all' ? 'selected' : ''}>All Stock Status</option>
            <option value="in" ${state.stockFilter === 'in' ? 'selected' : ''}>In Stock</option>
            <option value="low" ${state.stockFilter === 'low' ? 'selected' : ''}>Low Stock</option>
            <option value="out" ${state.stockFilter === 'out' ? 'selected' : ''}>Out of Stock</option>
          </select>

          <select class="select-control" id="list-sort-by">
            <option value="name-asc" ${state.sortBy === 'name-asc' ? 'selected' : ''}>Sort: Name (A-Z)</option>
            <option value="name-desc" ${state.sortBy === 'name-desc' ? 'selected' : ''}>Sort: Name (Z-A)</option>
            <option value="qty-desc" ${state.sortBy === 'qty-desc' ? 'selected' : ''}>Sort: Stock (High-Low)</option>
            <option value="qty-asc" ${state.sortBy === 'qty-asc' ? 'selected' : ''}>Sort: Stock (Low-High)</option>
            <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>Sort: Price (High-Low)</option>
            <option value="price-asc" ${state.sortBy === 'price-asc' ? 'selected' : ''}>Sort: Price (Low-High)</option>
          </select>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <!-- Bulk actions button if selected -->
          ${state.selectedIds.size > 0 ? `
            <button class="btn btn-danger btn-sm" id="btn-bulk-delete">
              <i class="fa-solid fa-trash"></i> Delete Selected (${state.selectedIds.size})
            </button>
          ` : ''}

          <div class="view-toggle">
            <button class="view-toggle-btn ${state.viewMode === 'table' ? 'active' : ''}" id="btn-view-table" title="Table View">
              <i class="fa-solid fa-table-list"></i>
            </button>
            <button class="view-toggle-btn ${state.viewMode === 'grid' ? 'active' : ''}" id="btn-view-grid" title="Grid View">
              <i class="fa-solid fa-grip"></i>
            </button>
          </div>

          <button class="btn btn-primary" id="btn-add-product">
            <i class="fa-solid fa-plus"></i> New Product
          </button>
        </div>
      </div>

      <!-- Main Data Content View -->
      ${paginatedProducts.length === 0 ? `
        <div class="card" style="text-align: center; padding: 60px 20px;">
          <i class="fa-solid fa-box-open" style="font-size: 3rem; color: var(--text-subtle); margin-bottom: 16px;"></i>
          <h3 style="margin-bottom: 8px;">No products found</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">Try adjusting your filters or search terms.</p>
          <button class="btn btn-secondary" id="btn-reset-filters">Reset Filters</button>
        </div>
      ` : state.viewMode === 'table' ? renderTableView(paginatedProducts, categories) : renderGridView(paginatedProducts, categories)}

      <!-- Pagination Footer -->
      <div class="pagination-container">
        <div>
          Showing <b>${products.length === 0 ? 0 : startIdx + 1}</b> to <b>${Math.min(startIdx + state.pageSize, products.length)}</b> of <b>${products.length}</b> items
        </div>

        <div class="pagination-controls">
          <button class="btn btn-secondary btn-sm" id="btn-prev-page" ${state.currentPage <= 1 ? 'disabled' : ''}>
            <i class="fa-solid fa-chevron-left"></i> Previous
          </button>
          <span>Page ${state.currentPage} of ${totalPages}</span>
          <button class="btn btn-secondary btn-sm" id="btn-next-page" ${state.currentPage >= totalPages ? 'disabled' : ''}>
            Next <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Detail Modal Container -->
      <div id="product-detail-modal" class="modal-overlay"></div>
    `;

    bindEvents();
  }

  function getFilteredProducts() {
    let products = store.getProducts();

    // Search query
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q) ||
        p.locationBin.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (state.categoryFilter !== 'all') {
      products = products.filter(p => p.categoryId === state.categoryFilter);
    }

    // Stock Filter
    if (state.stockFilter !== 'all') {
      products = products.filter(p => {
        const status = store.getStockStatus(p);
        return status.code === state.stockFilter;
      });
    }

    // Sorting
    products.sort((a, b) => {
      if (state.sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (state.sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (state.sortBy === 'qty-desc') return b.quantity - a.quantity;
      if (state.sortBy === 'qty-asc') return a.quantity - b.quantity;
      if (state.sortBy === 'price-desc') return b.sellingPrice - a.sellingPrice;
      if (state.sortBy === 'price-asc') return a.sellingPrice - b.sellingPrice;
      return 0;
    });

    return products;
  }

  function bindEvents() {
    // Search & Select filters
    const searchInput = container.querySelector('#list-search');
    searchInput?.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      state.currentPage = 1;
      updateUI();
    });

    container.querySelector('#list-cat-filter')?.addEventListener('change', (e) => {
      state.categoryFilter = e.target.value;
      state.currentPage = 1;
      updateUI();
    });

    container.querySelector('#list-stock-filter')?.addEventListener('change', (e) => {
      state.stockFilter = e.target.value;
      state.currentPage = 1;
      updateUI();
    });

    container.querySelector('#list-sort-by')?.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      updateUI();
    });

    // View toggles
    container.querySelector('#btn-view-table')?.addEventListener('click', () => {
      state.viewMode = 'table';
      updateUI();
    });

    container.querySelector('#btn-view-grid')?.addEventListener('click', () => {
      state.viewMode = 'grid';
      updateUI();
    });

    container.querySelector('#btn-add-product')?.addEventListener('click', () => {
      navigateTo('product-form');
    });

    container.querySelector('#btn-reset-filters')?.addEventListener('click', () => {
      state.searchQuery = '';
      state.categoryFilter = 'all';
      state.stockFilter = 'all';
      state.currentPage = 1;
      updateUI();
    });

    // Pagination
    container.querySelector('#btn-prev-page')?.addEventListener('click', () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        updateUI();
      }
    });

    container.querySelector('#btn-next-page')?.addEventListener('click', () => {
      state.currentPage++;
      updateUI();
    });

    // Checkbox selecting
    const selectAllCheckbox = container.querySelector('#select-all-products');
    selectAllCheckbox?.addEventListener('change', (e) => {
      const paginated = getFilteredProducts().slice((state.currentPage - 1) * state.pageSize, state.currentPage * state.pageSize);
      if (e.target.checked) {
        paginated.forEach(p => state.selectedIds.add(p.id));
      } else {
        paginated.forEach(p => state.selectedIds.delete(p.id));
      }
      updateUI();
    });

    container.querySelectorAll('.product-select-chk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        if (e.target.checked) {
          state.selectedIds.add(id);
        } else {
          state.selectedIds.delete(id);
        }
        updateUI();
      });
    });

    // Bulk Delete
    container.querySelector('#btn-bulk-delete')?.addEventListener('click', () => {
      if (confirm(`Are you sure you want to delete ${state.selectedIds.size} products?`)) {
        store.deleteMultipleProducts(Array.from(state.selectedIds));
        showToast(`${state.selectedIds.size} products deleted successfully`, 'success');
        state.selectedIds.clear();
        updateUI();
      }
    });

    // Action handlers: View details, Edit, Delete
    container.querySelectorAll('.btn-action-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        showProductDetailModal(id, container, showToast, updateUI);
      });
    });

    container.querySelectorAll('.btn-action-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        navigateTo('product-form', { productId: id });
      });
    });

    container.querySelectorAll('.btn-action-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const prod = store.getProductById(id);
        if (confirm(`Are you sure you want to delete "${prod.name}"?`)) {
          store.deleteProduct(id);
          showToast(`Product "${prod.name}" deleted`, 'info');
          updateUI();
        }
      });
    });
  }

  updateUI();
}

function renderTableView(products, categories) {
  return `
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 40px;">
              <input type="checkbox" id="select-all-products">
            </th>
            <th>Product Info</th>
            <th>Category</th>
            <th>Selling Price</th>
            <th>Stock Level</th>
            <th>Status</th>
            <th>Location</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => {
            const cat = categories.find(c => c.id === p.categoryId);
            const status = store.getStockStatus(p);
            const isChecked = state.selectedIds.has(p.id);

            return `
              <tr>
                <td>
                  <input type="checkbox" class="product-select-chk" data-id="${p.id}" ${isChecked ? 'checked' : ''}>
                </td>
                <td>
                  <div class="product-cell">
                    <img src="${p.image}" alt="${p.name}" class="product-img" onerror="this.src='https://via.placeholder.com/44'">
                    <div>
                      <div class="product-title-text">${escapeHtml(p.name)}</div>
                      <div class="product-sku-text">SKU: ${p.sku} | Barcode: ${p.barcode || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge badge-category" style="${cat ? `background-color: ${cat.color}20; color: ${cat.color}; border-color: ${cat.color}40;` : ''}">
                    ${cat ? cat.name : 'Uncategorized'}
                  </span>
                </td>
                <td>
                  <span style="font-weight: 700;">$${Number(p.sellingPrice).toFixed(2)}</span>
                  <div style="font-size: 0.75rem; color: var(--text-subtle);">Cost: $${Number(p.costPrice).toFixed(2)}</div>
                </td>
                <td>
                  <span style="font-weight: 700; color: ${p.quantity <= p.minStock ? 'var(--status-warning)' : 'var(--text-main)'}">
                    ${p.quantity} ${p.unit}
                  </span>
                  <div style="font-size: 0.75rem; color: var(--text-subtle);">Min: ${p.minStock}</div>
                </td>
                <td>
                  <span class="badge ${status.badgeClass}">${status.status}</span>
                </td>
                <td>
                  <span style="font-size: 0.85rem; font-family: monospace;">${p.locationBin || 'N/A'}</span>
                </td>
                <td style="text-align: right;">
                  <button class="btn btn-secondary btn-icon btn-sm btn-action-view" data-id="${p.id}" title="View Details">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                  <button class="btn btn-secondary btn-icon btn-sm btn-action-edit" data-id="${p.id}" title="Edit Product">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button class="btn btn-danger btn-icon btn-sm btn-action-delete" data-id="${p.id}" title="Delete Product">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderGridView(products, categories) {
  return `
    <div class="products-grid">
      ${products.map(p => {
        const cat = categories.find(c => c.id === p.categoryId);
        const status = store.getStockStatus(p);

        return `
          <div class="product-card">
            <div class="product-card-img-wrapper">
              <img src="${p.image}" alt="${p.name}" class="product-card-img" onerror="this.src='https://via.placeholder.com/260x160'">
              <span class="badge ${status.badgeClass}" style="position: absolute; top: 12px; right: 12px;">${status.status}</span>
            </div>
            <div class="product-card-body">
              <span class="badge badge-category" style="align-self: flex-start; margin-bottom: 8px; ${cat ? `background-color: ${cat.color}20; color: ${cat.color};` : ''}">
                ${cat ? cat.name : 'Uncategorized'}
              </span>
              <h3 class="product-card-title">${escapeHtml(p.name)}</h3>
              <div style="font-size: 0.775rem; color: var(--text-muted); margin-bottom: 12px;">SKU: ${p.sku}</div>

              <div class="product-card-meta">
                <span class="product-card-price">$${Number(p.sellingPrice).toFixed(2)}</span>
                <span style="font-weight: 600; font-size: 0.85rem;">Stock: ${p.quantity} ${p.unit}</span>
              </div>

              <div class="product-card-actions">
                <button class="btn btn-secondary btn-sm btn-action-view" data-id="${p.id}" style="flex: 1;">
                  <i class="fa-solid fa-eye"></i> Details
                </button>
                <button class="btn btn-secondary btn-icon btn-sm btn-action-edit" data-id="${p.id}">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-danger btn-icon btn-sm btn-action-delete" data-id="${p.id}">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function showProductDetailModal(productId, container, showToast, updateUI) {
  const p = store.getProductById(productId);
  if (!p) return;

  const cat = store.getCategoryById(p.categoryId);
  const status = store.getStockStatus(p);
  const margin = (((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100).toFixed(1);

  const modalContainer = container.querySelector('#product-detail-modal');
  modalContainer.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <h3 style="font-size: 1.15rem;">${escapeHtml(p.name)}</h3>
          <span class="badge ${status.badgeClass}">${status.status}</span>
        </div>
        <button class="btn btn-secondary btn-icon btn-sm" id="btn-close-modal">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="modal-body">
        <div style="display: flex; gap: 20px; margin-bottom: 24px;">
          <img src="${p.image}" alt="${p.name}" style="width: 140px; height: 140px; object-fit: cover; border-radius: var(--radius-md); border: 1px solid var(--border-color);" onerror="this.src='https://via.placeholder.com/140'">
          <div style="flex: 1;">
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 12px;">${escapeHtml(p.description || 'No description provided.')}</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.85rem;">
              <div><b style="color: var(--text-subtle);">SKU:</b> ${p.sku}</div>
              <div><b style="color: var(--text-subtle);">Barcode:</b> ${p.barcode || 'N/A'}</div>
              <div><b style="color: var(--text-subtle);">Category:</b> ${cat ? cat.name : 'Uncategorized'}</div>
              <div><b style="color: var(--text-subtle);">Bin Location:</b> ${p.locationBin || 'N/A'}</div>
              <div><b style="color: var(--text-subtle);">Supplier:</b> ${p.supplier || 'N/A'}</div>
              <div><b style="color: var(--text-subtle);">Lead Time:</b> ${p.leadTimeDays || 0} days</div>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background-color: var(--bg-primary); padding: 16px; border-radius: var(--radius-md); text-align: center;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-subtle);">COST PRICE</div>
            <div style="font-size: 1.1rem; font-weight: 700;">$${Number(p.costPrice).toFixed(2)}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-subtle);">SELLING PRICE</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-secondary);">$${Number(p.sellingPrice).toFixed(2)}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-subtle);">PROFIT MARGIN</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--status-success);">${margin}%</div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-close-modal-footer">Close</button>
      </div>
    </div>
  `;

  modalContainer.classList.add('active');

  const closeModal = () => modalContainer.classList.remove('active');
  modalContainer.querySelector('#btn-close-modal').addEventListener('click', closeModal);
  modalContainer.querySelector('#btn-close-modal-footer').addEventListener('click', closeModal);
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

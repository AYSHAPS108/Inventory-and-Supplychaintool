/**
 * Enterprise Supply Chain OS - Central Data Store & Persistence Engine
 */

const STORAGE_KEYS = {
  PRODUCTS: 'esct_products_v3',
  CATEGORIES: 'esct_categories_v3',
  SUBCATEGORIES: 'esct_subcategories_v3',
  BRANDS: 'esct_brands_v3',
  WAREHOUSES: 'esct_warehouses_v3',
  LOCATIONS: 'esct_locations_v3',
  MOVEMENTS: 'esct_movements_v3',
  TRANSFERS: 'esct_transfers_v3',
  PURCHASE_ORDERS: 'esct_purchase_orders_v3',
  SUPPLIERS: 'esct_suppliers_v3',
  SETTINGS: 'esct_settings_v3',
  ADJUSTMENTS: 'esct_adjustments_v3',
  COUNTS: 'esct_counts_v3',
  BATCHES: 'esct_batches_v3',
  SERIALS: 'esct_serials_v3',
  CURRENT_ROLE: 'esct_role_v3'
};

const SEED_CATEGORIES = [
  { id: 'cat-1', name: 'Electronics & Sensors', code: 'ELEC', description: 'Microcontrollers, IoT sensors, PCB assemblies', color: '#6366f1', icon: 'fa-microchip' },
  { id: 'cat-2', name: 'Raw Materials', code: 'RAW', description: 'Steel alloys, aluminum billets, polymer resins', color: '#06b6d4', icon: 'fa-cubes' },
  { id: 'cat-3', name: 'Industrial Machinery', code: 'MACH', description: 'Pumps, electric motors, hydraulic valves', color: '#f59e0b', icon: 'fa-cogs' },
  { id: 'cat-4', name: 'Packaging & Logistics', code: 'PKG', description: 'Corrugated boxes, pallets, thermal labels', color: '#10b981', icon: 'fa-boxes-packing' },
  { id: 'cat-5', name: 'Safety & PPE', code: 'PPE', description: 'Helmets, safety goggles, respirators', color: '#ef4444', icon: 'fa-hard-hat' }
];

const SEED_SUBCATEGORIES = [
  { id: 'sub-1', categoryId: 'cat-1', name: 'Sensors & Transducers' },
  { id: 'sub-2', categoryId: 'cat-1', name: 'Microcontrollers & ICs' },
  { id: 'sub-3', categoryId: 'cat-2', name: 'Stainless Steel & Alloys' },
  { id: 'sub-4', categoryId: 'cat-3', name: 'Electric Motors & Drives' },
  { id: 'sub-5', categoryId: 'cat-4', name: 'Cardboard & Shipping Boxes' }
];

const SEED_BRANDS = [
  { id: 'brand-1', name: 'Apex Electronics', country: 'USA', website: 'https://apexelectronics.example' },
  { id: 'brand-2', name: 'Vortex Industrial', country: 'Germany', website: 'https://vortexdrives.example' },
  { id: 'brand-3', name: 'GlobalAlloy', country: 'Japan', website: 'https://globalalloy.example' },
  { id: 'brand-4', name: 'SafeGuard Global', country: 'UK', website: 'https://safeguard.example' }
];

const SEED_WAREHOUSES = [
  { id: 'wh-1', name: 'Central Logistics Hub', code: 'WH-CENTRAL', address: '100 Supply Chain Blvd, Industrial Park', manager: 'David Miller', phone: '+1 555-0192', capacity: '10,000 sq ft', status: 'Active', isPrimary: true },
  { id: 'wh-2', name: 'East Coast Distribution Center', code: 'WH-EAST', address: '45 Harbor Commerce Way, NJ', manager: 'Sarah Jenkins', phone: '+1 555-0344', capacity: '25,000 sq ft', status: 'Active', isPrimary: false },
  { id: 'wh-3', name: 'Overseas Transit Depot', code: 'WH-DEPOT', address: 'Port Terminal 4, Rotterdam', manager: 'Jan de Jong', phone: '+31 20 555 12', capacity: '15,000 sq ft', status: 'Active', isPrimary: false }
];

const SEED_LOCATIONS = [
  { id: 'loc-1', warehouseId: 'wh-1', code: 'A-12-04', zone: 'Zone A', aisle: '12', rack: 'RACK-03', shelf: 'SHELF-02', bin: '04' },
  { id: 'loc-2', warehouseId: 'wh-1', code: 'B-04-01', zone: 'Zone B', aisle: '04', rack: 'RACK-01', shelf: 'SHELF-04', bin: '01' },
  { id: 'loc-3', warehouseId: 'wh-2', code: 'R-01-18', zone: 'Rack R1', aisle: '01', rack: 'RACK-10', shelf: 'SHELF-01', bin: '18' },
  { id: 'loc-4', warehouseId: 'wh-2', code: 'P-08-02', zone: 'Pallet P8', aisle: '08', rack: 'RACK-05', shelf: 'SHELF-03', bin: '02' },
  { id: 'loc-5', warehouseId: 'wh-3', code: 'S-03-09', zone: 'Shelf S3', aisle: '03', rack: 'RACK-02', shelf: 'SHELF-05', bin: '09' }
];

const SEED_SUPPLIERS = [
  { id: 'sup-1', name: 'Apex Automation Corp', contactPerson: 'Robert Chen', email: 'sales@apexauto.com', phone: '+1 800-555-0111', address: 'San Jose, CA', gstin: '06AAAAC1111A1Z1', leadTimeDays: 7, rating: 4.8, paymentTerms: 'Net 30' },
  { id: 'sup-2', name: 'Vortex Drives Ltd', contactPerson: 'Klaus Webber', email: 'orders@vortexdrives.de', phone: '+49 89 555 99', address: 'Munich, Germany', gstin: '06AAAAC2222B1Z2', leadTimeDays: 14, rating: 4.5, paymentTerms: 'Net 45' },
  { id: 'sup-3', name: 'Global Alloy Supplies', contactPerson: 'Elena Rostova', email: 'info@globalalloy.com', phone: '+1 888-444-2211', address: 'Osaka, Japan', gstin: '06AAAAC3333C1Z3', leadTimeDays: 5, rating: 4.9, paymentTerms: 'Net 15' },
  { id: 'sup-4', name: 'SafeGuard PPE Global', contactPerson: 'Mark Taylor', email: 'support@safeguardppe.com', phone: '+44 20 7946 0912', address: 'London, UK', gstin: '06AAAAC4444D1Z4', leadTimeDays: 4, rating: 4.2, paymentTerms: 'Net 30' }
];

export const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500',
  'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500',
  'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500'
];

const SEED_PRODUCTS = [
  {
    id: 'prod-101',
    sku: 'ELEC-SENS-001',
    name: 'Industrial Optocoupler Sensor Array',
    categoryId: 'cat-1',
    subcategoryId: 'sub-1',
    brandId: 'brand-1',
    supplierId: 'sup-1',
    warehouseId: 'wh-1',
    locationBin: 'A-12-04',
    barcode: '8901234567891',
    description: 'High-precision photoelectric sensor array for automated assembly lines.',
    costPrice: 42.50,
    sellingPrice: 78.00,
    taxRate: 18,
    quantity: 145,
    minStock: 25,
    maxStock: 500,
    reorderLevel: 30,
    reorderQty: 100,
    unit: 'pcs',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500',
    hsnCode: '85414900',
    status: 'Active',
    variants: 'Standard, High Temp',
    createdAt: '2026-02-01T09:30:00Z',
    costHistory: [
      { date: '2026-02-01T09:30:00Z', cost: 42.50, qty: 100 },
      { date: '2026-05-10T11:00:00Z', cost: 43.00, qty: 45 }
    ]
  },
  {
    id: 'prod-102',
    sku: 'MACH-MTR-088',
    name: '3-Phase AC Induction Motor 5.5kW',
    categoryId: 'cat-3',
    subcategoryId: 'sub-4',
    brandId: 'brand-2',
    supplierId: 'sup-2',
    warehouseId: 'wh-1',
    locationBin: 'B-04-01',
    barcode: '8901234567892',
    description: 'Heavy-duty 400V 5.5kW squirrel cage induction motor.',
    costPrice: 380.00,
    sellingPrice: 590.00,
    taxRate: 18,
    quantity: 8,
    minStock: 15,
    maxStock: 60,
    reorderLevel: 20,
    reorderQty: 25,
    unit: 'pcs',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500',
    hsnCode: '85015220',
    status: 'Active',
    variants: '5.5kW Foot Mount',
    createdAt: '2026-02-05T14:15:00Z',
    costHistory: [
      { date: '2026-02-05T14:15:00Z', cost: 380.00, qty: 8 }
    ]
  },
  {
    id: 'prod-103',
    sku: 'RAW-STL-404',
    name: '316L Stainless Steel Precision Rods (20mm x 3m)',
    categoryId: 'cat-2',
    subcategoryId: 'sub-3',
    brandId: 'brand-3',
    supplierId: 'sup-3',
    warehouseId: 'wh-2',
    locationBin: 'R-01-18',
    barcode: '8901234567893',
    description: 'Corrosion-resistant marine grade stainless steel round bars.',
    costPrice: 65.00,
    sellingPrice: 110.00,
    taxRate: 12,
    quantity: 320,
    minStock: 50,
    maxStock: 1000,
    reorderLevel: 75,
    reorderQty: 200,
    unit: 'pcs',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500',
    hsnCode: '72221119',
    status: 'Active',
    variants: '20mm, 30mm',
    createdAt: '2026-02-10T11:00:00Z',
    costHistory: [
      { date: '2026-02-10T11:00:00Z', cost: 65.00, qty: 320 }
    ]
  },
  {
    id: 'prod-104',
    sku: 'PKG-BOX-500',
    name: 'Triple-Wall Heavy Duty Shipping Boxes',
    categoryId: 'cat-4',
    subcategoryId: 'sub-5',
    brandId: 'brand-1',
    supplierId: 'sup-1',
    warehouseId: 'wh-2',
    locationBin: 'P-08-02',
    barcode: '8901234567894',
    description: 'Export-grade corrugated cardboard boxes.',
    costPrice: 2.10,
    sellingPrice: 4.80,
    taxRate: 5,
    quantity: 1200,
    minStock: 200,
    maxStock: 3000,
    reorderLevel: 300,
    reorderQty: 1000,
    unit: 'boxes',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500',
    hsnCode: '48191010',
    status: 'Active',
    variants: '500x500x500mm',
    createdAt: '2026-02-12T16:20:00Z',
    costHistory: [
      { date: '2026-02-12T16:20:00Z', cost: 2.10, qty: 1200 }
    ]
  },
  {
    id: 'prod-105',
    sku: 'PPE-HLM-202',
    name: 'ANSI Z89.1 Hard Hat with Visor Mount',
    categoryId: 'cat-5',
    subcategoryId: 'sub-1',
    brandId: 'brand-4',
    supplierId: 'sup-4',
    warehouseId: 'wh-3',
    locationBin: 'S-03-09',
    barcode: '8901234567895',
    description: 'Vented high-density polyethylene protective helmet.',
    costPrice: 14.20,
    sellingPrice: 28.50,
    taxRate: 18,
    quantity: 18,
    minStock: 40,
    maxStock: 250,
    reorderLevel: 45,
    reorderQty: 100,
    unit: 'pcs',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500',
    hsnCode: '65061010',
    status: 'Active',
    variants: 'Yellow, White, Blue',
    createdAt: '2026-02-18T08:45:00Z',
    costHistory: [
      { date: '2026-02-18T08:45:00Z', cost: 14.20, qty: 18 }
    ]
  }
];

const SEED_MOVEMENTS = [
  { id: 'mov-1', productId: 'prod-101', type: 'RECEIPT', qty: 100, source: 'PO-2026-001', warehouseId: 'wh-1', date: '2026-02-02T10:00:00Z', notes: 'Initial Shipment Received' },
  { id: 'mov-2', productId: 'prod-102', type: 'ADJUSTMENT', qty: -2, source: 'AUDIT', warehouseId: 'wh-1', date: '2026-02-06T11:30:00Z', notes: 'Damaged in transit' },
  { id: 'mov-3', productId: 'prod-103', type: 'TRANSFER', qty: 50, source: 'TR-2026-001', warehouseId: 'wh-2', date: '2026-02-15T15:20:00Z', notes: 'Inter-warehouse rebalance' }
];

const SEED_TRANSFERS = [
  { id: 'tr-101', code: 'TR-2026-001', fromWarehouseId: 'wh-1', toWarehouseId: 'wh-2', productId: 'prod-103', qty: 50, status: 'Completed', requestDate: '2026-02-14T09:00:00Z', completedDate: '2026-02-15T15:20:00Z' },
  { id: 'tr-102', code: 'TR-2026-002', fromWarehouseId: 'wh-2', toWarehouseId: 'wh-3', productId: 'prod-104', qty: 200, status: 'In Transit', requestDate: '2026-02-20T10:00:00Z', completedDate: null }
];

const SEED_PURCHASE_ORDERS = [
  { id: 'po-101', poNumber: 'PO-2026-001', supplierId: 'sup-1', warehouseId: 'wh-1', totalAmount: 4250.00, discount: 0, tax: 765.00, status: 'Received', orderDate: '2026-02-01', expectedDate: '2026-02-08', items: [{ productId: 'prod-101', qty: 100, price: 42.50 }] },
  { id: 'po-102', poNumber: 'PO-2026-002', supplierId: 'sup-2', warehouseId: 'wh-1', totalAmount: 7600.00, discount: 200, tax: 1368.00, status: 'Approved', orderDate: '2026-02-18', expectedDate: '2026-03-04', items: [{ productId: 'prod-102', qty: 20, price: 380.00 }] },
  { id: 'po-103', poNumber: 'PO-2026-003', supplierId: 'sup-4', warehouseId: 'wh-3', totalAmount: 1420.00, discount: 50, tax: 255.60, status: 'Pending Approval', orderDate: '2026-02-22', expectedDate: '2026-02-26', items: [{ productId: 'prod-105', qty: 100, price: 14.20 }] }
];

const SEED_ADJUSTMENTS = [
  { id: 'adj-1', productId: 'prod-102', warehouseId: 'wh-1', qtyChange: -2, reason: 'Damage', status: 'Approved', date: '2026-02-06T11:30:00Z', createdBy: 'Sarah Jenkins', approvedBy: 'David Miller' }
];

const SEED_COUNTS = [
  { id: 'cnt-1', countType: 'Cycle Count', date: '2026-06-01', status: 'Completed', warehouseId: 'wh-1', itemsCount: 3, varianceDetected: 2, notes: 'Zone A annual reconciliation' }
];

const SEED_BATCHES = [
  { id: 'bat-1', productId: 'prod-101', batchNumber: 'BAT-SENS-09A', manufacturingDate: '2026-01-10', expiryDate: '2028-01-10', quantity: 100 },
  { id: 'bat-2', productId: 'prod-105', batchNumber: 'BAT-PPE-26K', manufacturingDate: '2026-02-15', expiryDate: '2026-10-15', quantity: 18 }
];

const SEED_SERIALS = [
  { id: 'ser-1', productId: 'prod-102', serialNumber: 'SN-MTR-9901A', status: 'In Stock', warehouseId: 'wh-1', locationBin: 'B-04-01' },
  { id: 'ser-2', productId: 'prod-102', serialNumber: 'SN-MTR-9902A', status: 'In Stock', warehouseId: 'wh-1', locationBin: 'B-04-01' }
];

const SEED_SETTINGS = {
  currency: 'USD ($)',
  taxDefault: 18,
  allowNegativeStock: false,
  autoReorderEnabled: true,
  barcodeFormat: 'EAN-13',
  unitsList: ['pcs', 'kg', 'liters', 'boxes', 'bags', 'meters', 'pallets', 'rolls', 'sets'],
  costingMethod: 'Average Costing'
};

// ─── Backend API base URL (configurable) ───
const BACKEND_BASE_URL = 'http://localhost:3000';

class Store {
  constructor() {
    this._backendOnline = false;
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES))     localStorage.setItem(STORAGE_KEYS.CATEGORIES,      JSON.stringify(SEED_CATEGORIES));
    if (!localStorage.getItem(STORAGE_KEYS.SUBCATEGORIES))  localStorage.setItem(STORAGE_KEYS.SUBCATEGORIES,   JSON.stringify(SEED_SUBCATEGORIES));
    if (!localStorage.getItem(STORAGE_KEYS.BRANDS))         localStorage.setItem(STORAGE_KEYS.BRANDS,          JSON.stringify(SEED_BRANDS));
    if (!localStorage.getItem(STORAGE_KEYS.WAREHOUSES))     localStorage.setItem(STORAGE_KEYS.WAREHOUSES,      JSON.stringify(SEED_WAREHOUSES));
    if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS))      localStorage.setItem(STORAGE_KEYS.LOCATIONS,       JSON.stringify(SEED_LOCATIONS));
    if (!localStorage.getItem(STORAGE_KEYS.SUPPLIERS))      localStorage.setItem(STORAGE_KEYS.SUPPLIERS,       JSON.stringify(SEED_SUPPLIERS));
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS))       localStorage.setItem(STORAGE_KEYS.PRODUCTS,        JSON.stringify(SEED_PRODUCTS));
    if (!localStorage.getItem(STORAGE_KEYS.MOVEMENTS))      localStorage.setItem(STORAGE_KEYS.MOVEMENTS,       JSON.stringify(SEED_MOVEMENTS));
    if (!localStorage.getItem(STORAGE_KEYS.TRANSFERS))      localStorage.setItem(STORAGE_KEYS.TRANSFERS,       JSON.stringify(SEED_TRANSFERS));
    if (!localStorage.getItem(STORAGE_KEYS.PURCHASE_ORDERS))localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(SEED_PURCHASE_ORDERS));
    if (!localStorage.getItem(STORAGE_KEYS.ADJUSTMENTS))    localStorage.setItem(STORAGE_KEYS.ADJUSTMENTS,     JSON.stringify(SEED_ADJUSTMENTS));
    if (!localStorage.getItem(STORAGE_KEYS.COUNTS))         localStorage.setItem(STORAGE_KEYS.COUNTS,          JSON.stringify(SEED_COUNTS));
    if (!localStorage.getItem(STORAGE_KEYS.BATCHES))        localStorage.setItem(STORAGE_KEYS.BATCHES,         JSON.stringify(SEED_BATCHES));
    if (!localStorage.getItem(STORAGE_KEYS.SERIALS))        localStorage.setItem(STORAGE_KEYS.SERIALS,         JSON.stringify(SEED_SERIALS));
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS))       localStorage.setItem(STORAGE_KEYS.SETTINGS,        JSON.stringify(SEED_SETTINGS));
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE))   localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE,    'Admin');
  }

  /**
   * Attempt to sync with the NestJS backend.
   * Gracefully falls back to localStorage mode if the backend is unreachable.
   * The frontend remains fully functional in offline/localStorage mode.
   */
  async syncWithBackend() {
    try {
      // Ping the backend with a short timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const [productsRes, categoriesRes, warehousesRes, suppliersRes] = await Promise.all([
        fetch(`${BACKEND_BASE_URL}/api/products`,   { signal: controller.signal }),
        fetch(`${BACKEND_BASE_URL}/api/categories`, { signal: controller.signal }),
        fetch(`${BACKEND_BASE_URL}/api/warehouses`, { signal: controller.signal }),
        fetch(`${BACKEND_BASE_URL}/api/suppliers`,  { signal: controller.signal }),
      ]);
      clearTimeout(timeout);

      if (!productsRes.ok) throw new Error(`Backend returned ${productsRes.status}`);

      const [products, categories, warehouses, suppliers] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        warehousesRes.json(),
        suppliersRes.json(),
      ]);

      // Normalize backend data to match frontend schema
      const normalizedProducts = products.map(p => ({
        id:           p.id,
        sku:          p.sku,
        name:         p.name,
        categoryId:   p.categoryId || p.category_id,
        supplierId:   p.supplierId || p.supplier_id,
        warehouseId:  p.warehouseId || p.warehouse_id,
        barcode:      p.barcode || '',
        description:  p.description || '',
        costPrice:    Number(p.costPrice  || p.cost_price  || 0),
        sellingPrice: Number(p.sellingPrice || p.selling_price || 0),
        quantity:     Number(p.quantity || 0),
        minStock:     Number(p.minStock  || p.min_stock  || 10),
        maxStock:     Number(p.maxStock  || p.max_stock  || 500),
        reorderLevel: Number(p.reorderLevel || p.reorder_level || 30),
        reorderQty:   Number(p.reorderQty   || p.reorder_qty   || 100),
        unit:         p.unit || 'pcs',
        locationBin:  p.locationBin  || p.location_bin || '',
        imageUrl:     p.imageUrl     || p.image_url    || '',
        image:        p.imageUrl     || p.image_url    || p.image || '',
        hsnCode:      p.hsnCode      || p.hsn_code     || '',
        status:       p.status       || 'Active',
        variants:     p.variants     || '',
        createdAt:    p.createdAt    || p.created_at   || new Date().toISOString(),
        costHistory:  p.costHistory  || [{ date: p.createdAt || new Date().toISOString(), cost: Number(p.costPrice || 0), qty: Number(p.quantity || 0) }],
      }));

      // Update localStorage with backend data
      this.setItem(STORAGE_KEYS.PRODUCTS,   normalizedProducts);
      this.setItem(STORAGE_KEYS.CATEGORIES, categories.map(c => ({
        id:          c.id,
        name:        c.name,
        code:        c.code,
        description: c.description || '',
        color:       c.color || '#165DFF',
        icon:        c.icon  || 'fa-folder',
      })));
      this.setItem(STORAGE_KEYS.WAREHOUSES, warehouses.map(w => ({
        id:        w.id,
        name:      w.name,
        code:      w.code,
        address:   w.address   || '',
        manager:   w.manager   || '',
        phone:     w.phone     || '',
        capacity:  w.capacity  || '',
        status:    w.status    || 'Active',
        isPrimary: w.isPrimary || w.is_primary || false,
      })));
      this.setItem(STORAGE_KEYS.SUPPLIERS, suppliers.map(s => ({
        id:            s.id,
        name:          s.name,
        contactPerson: s.contactPerson || s.contact_person || '',
        email:         s.email   || '',
        phone:         s.phone   || '',
        address:       s.address || '',
        gstin:         s.gstin   || '',
        leadTimeDays:  Number(s.leadTimeDays || s.lead_time_days || 7),
        rating:        Number(s.rating || 5.0),
        paymentTerms:  s.paymentTerms || s.payment_terms || 'Net 30',
      })));

      this._backendOnline = true;
      console.info('[Zenora] ✅ Synced with backend. Products:', normalizedProducts.length);
    } catch (err) {
      // Backend not available — continue with localStorage data
      this._backendOnline = false;
      throw err; // Let app.js handle the graceful fallback message
    }
  }

  /** Returns true if the NestJS backend was reachable on last sync */
  isBackendOnline() {
    return this._backendOnline;
  }

  generateSKU(categoryId, productName) {
    const categories = this.getCategories();
    const cat = categories.find(c => c.id === categoryId);
    const prefix = cat ? cat.code.toUpperCase() : 'GEN';
    const cleanName = (productName || 'PROD').trim().replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase();
    const randNum = Math.floor(100 + Math.random() * 900);
    return `${prefix}-${cleanName}-${randNum}`;
  }

  getItem(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getProducts() { return this.getItem(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS); }
  getCategories() { return this.getItem(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES); }
  getSubcategories() { return this.getItem(STORAGE_KEYS.SUBCATEGORIES, SEED_SUBCATEGORIES); }
  getBrands() { return this.getItem(STORAGE_KEYS.BRANDS, SEED_BRANDS); }
  getWarehouses() { return this.getItem(STORAGE_KEYS.WAREHOUSES, SEED_WAREHOUSES); }
  getLocations() { return this.getItem(STORAGE_KEYS.LOCATIONS, SEED_LOCATIONS); }
  getSuppliers() { return this.getItem(STORAGE_KEYS.SUPPLIERS, SEED_SUPPLIERS); }
  getMovements() { return this.getItem(STORAGE_KEYS.MOVEMENTS, SEED_MOVEMENTS); }
  getTransfers() { return this.getItem(STORAGE_KEYS.TRANSFERS, SEED_TRANSFERS); }
  getPurchaseOrders() { return this.getItem(STORAGE_KEYS.PURCHASE_ORDERS, SEED_PURCHASE_ORDERS); }
  getAdjustments() { return this.getItem(STORAGE_KEYS.ADJUSTMENTS, SEED_ADJUSTMENTS); }
  getInventoryCounts() { return this.getItem(STORAGE_KEYS.COUNTS, SEED_COUNTS); }
  getBatches() { return this.getItem(STORAGE_KEYS.BATCHES, SEED_BATCHES); }
  getSerials() { return this.getItem(STORAGE_KEYS.SERIALS, SEED_SERIALS); }
  getSettings() { return this.getItem(STORAGE_KEYS.SETTINGS, SEED_SETTINGS); }
  getCurrentRole() { return localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) || 'Admin'; }

  setCurrentRole(role) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
  }

  getProductById(id) { return this.getProducts().find(p => p.id === id); }
  getCategoryById(id) { return this.getCategories().find(c => c.id === id); }
  getSupplierById(id) { return this.getSuppliers().find(s => s.id === id); }
  getWarehouseById(id) { return this.getWarehouses().find(w => w.id === id); }

  saveProduct(prod) {
    const list = this.getProducts();
    if (prod.id) {
      const idx = list.findIndex(p => p.id === prod.id);
      if (idx !== -1) {
        const oldCost = list[idx].costPrice;
        if (Number(oldCost) !== Number(prod.costPrice)) {
          if (!prod.costHistory) prod.costHistory = [];
          prod.costHistory.push({
            date: new Date().toISOString(),
            cost: Number(prod.costPrice),
            qty: Number(prod.quantity)
          });
        }
        list[idx] = { ...list[idx], ...prod };
      }
    } else {
      prod.id = 'prod-' + Date.now();
      prod.createdAt = new Date().toISOString();
      prod.costHistory = [{
        date: prod.createdAt,
        cost: Number(prod.costPrice),
        qty: Number(prod.quantity)
      }];
      list.push(prod);
    }
    this.setItem(STORAGE_KEYS.PRODUCTS, list);
    return prod;
  }

  deleteProduct(id) {
    const list = this.getProducts().filter(p => p.id !== id);
    this.setItem(STORAGE_KEYS.PRODUCTS, list);
  }

  deleteMultipleProducts(ids) {
    const list = this.getProducts().filter(p => !ids.includes(p.id));
    this.setItem(STORAGE_KEYS.PRODUCTS, list);
  }

  saveWarehouse(wh) {
    const list = this.getWarehouses();
    if (wh.id) {
      const idx = list.findIndex(w => w.id === wh.id);
      if (idx !== -1) list[idx] = { ...list[idx], ...wh };
    } else {
      wh.id = 'wh-' + Date.now();
      list.push(wh);
    }
    this.setItem(STORAGE_KEYS.WAREHOUSES, list);
  }

  saveLocation(loc) {
    const list = this.getLocations();
    if (loc.id) {
      const idx = list.findIndex(l => l.id === loc.id);
      if (idx !== -1) list[idx] = { ...list[idx], ...loc };
    } else {
      loc.id = 'loc-' + Date.now();
      list.push(loc);
    }
    this.setItem(STORAGE_KEYS.LOCATIONS, list);
  }

  saveSupplier(sup) {
    const list = this.getSuppliers();
    if (sup.id) {
      const idx = list.findIndex(s => s.id === sup.id);
      if (idx !== -1) list[idx] = { ...list[idx], ...sup };
    } else {
      sup.id = 'sup-' + Date.now();
      sup.rating = 5.0;
      list.push(sup);
    }
    this.setItem(STORAGE_KEYS.SUPPLIERS, list);
  }

  saveCategory(cat) {
    const list = this.getCategories();
    if (cat.id) {
      const idx = list.findIndex(c => c.id === cat.id);
      if (idx !== -1) list[idx] = { ...list[idx], ...cat };
    } else {
      cat.id = 'cat-' + Date.now();
      list.push(cat);
    }
    this.setItem(STORAGE_KEYS.CATEGORIES, list);
    return cat;
  }

  deleteCategory(id) {
    const list = this.getCategories().filter(c => c.id !== id);
    this.setItem(STORAGE_KEYS.CATEGORIES, list);
  }

  savePurchaseOrder(po) {
    const list = this.getPurchaseOrders();
    if (po.id) {
      const idx = list.findIndex(p => p.id === po.id);
      if (idx !== -1) list[idx] = { ...list[idx], ...po };
    } else {
      po.id = 'po-' + Date.now();
      po.poNumber = 'PO-2026-' + Math.floor(100 + Math.random() * 900);
      po.orderDate = new Date().toISOString().slice(0, 10);
      list.unshift(po);
    }
    this.setItem(STORAGE_KEYS.PURCHASE_ORDERS, list);
    return po;
  }

  approvePurchaseOrder(id) {
    const list = this.getPurchaseOrders();
    const po = list.find(p => p.id === id);
    if (po && po.status === 'Pending Approval') {
      po.status = 'Approved';
      this.setItem(STORAGE_KEYS.PURCHASE_ORDERS, list);
      return true;
    }
    return false;
  }

  receiveGoods(poId, receivedItems, notes) {
    const pos = this.getPurchaseOrders();
    const po = pos.find(p => p.id === poId);
    if (!po) return false;

    const products = this.getProducts();
    const movements = this.getMovements();
    const batches = this.getBatches();
    const serials = this.getSerials();

    receivedItems.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) return;

      const receivedQty = Number(item.receivedQty) || 0;
      const damagedQty = Number(item.damagedQty) || 0;
      const rejectedQty = Number(item.rejectedQty) || 0;
      const usableQty = Math.max(0, receivedQty - damagedQty - rejectedQty);

      if (usableQty > 0) {
        prod.quantity += usableQty;

        movements.unshift({
          id: 'mov-' + Date.now() + Math.random().toString(36).substr(2, 5),
          productId: prod.id,
          type: 'RECEIPT',
          qty: usableQty,
          source: po.poNumber,
          warehouseId: po.warehouseId,
          date: new Date().toISOString(),
          notes: `GRN: Received ${receivedQty} (Damaged: ${damagedQty}, Rejected: ${rejectedQty}). ${notes || ''}`
        });

        if (item.batchNumber) {
          batches.push({
            id: 'bat-' + Date.now() + Math.random().toString(36).substr(2, 5),
            productId: prod.id,
            batchNumber: item.batchNumber,
            manufacturingDate: item.mfgDate || new Date().toISOString().slice(0,10),
            expiryDate: item.expiryDate || new Date(Date.now() + 365*86400000).toISOString().slice(0,10),
            quantity: usableQty
          });
        }

        if (item.serials) {
          const snList = item.serials.split(',').map(s => s.trim()).filter(s => s);
          snList.forEach(sn => {
            serials.push({
              id: 'ser-' + Date.now() + Math.random().toString(36).substr(2, 5),
              productId: prod.id,
              serialNumber: sn,
              status: 'In Stock',
              warehouseId: po.warehouseId,
              locationBin: prod.locationBin
            });
          });
        }
      }
    });

    po.status = 'Received';
    this.setItem(STORAGE_KEYS.PRODUCTS, products);
    this.setItem(STORAGE_KEYS.MOVEMENTS, movements);
    this.setItem(STORAGE_KEYS.BATCHES, batches);
    this.setItem(STORAGE_KEYS.SERIALS, serials);
    this.setItem(STORAGE_KEYS.PURCHASE_ORDERS, pos);
    return true;
  }

  createStockTransfer(transfer) {
    const list = this.getTransfers();
    transfer.id = 'tr-' + Date.now();
    transfer.code = 'TR-2026-' + Math.floor(100 + Math.random() * 900);
    transfer.status = 'Pending Approval';
    transfer.requestDate = new Date().toISOString();
    transfer.completedDate = null;
    list.unshift(transfer);
    this.setItem(STORAGE_KEYS.TRANSFERS, list);
    return transfer;
  }

  approveTransfer(id, approverName) {
    const list = this.getTransfers();
    const tr = list.find(t => t.id === id);
    if (tr && tr.status === 'Pending Approval') {
      tr.status = 'In Transit';
      tr.approvedBy = approverName;
      this.setItem(STORAGE_KEYS.TRANSFERS, list);
      return true;
    }
    return false;
  }

  completeTransfer(id) {
    const transfers = this.getTransfers();
    const tr = transfers.find(t => t.id === id);
    if (!tr || tr.status !== 'In Transit') return false;

    const products = this.getProducts();
    const prod = products.find(p => p.id === tr.productId);
    if (prod) {
      prod.warehouseId = tr.toWarehouseId;
      
      const movements = this.getMovements();
      movements.unshift({
        id: 'mov-' + Date.now(),
        productId: tr.productId,
        type: 'TRANSFER',
        qty: tr.qty,
        source: tr.code,
        warehouseId: tr.toWarehouseId,
        date: new Date().toISOString(),
        notes: `Transfer completed from ${tr.fromWarehouseId} to ${tr.toWarehouseId}`
      });

      tr.status = 'Completed';
      tr.completedDate = new Date().toISOString();

      this.setItem(STORAGE_KEYS.PRODUCTS, products);
      this.setItem(STORAGE_KEYS.MOVEMENTS, movements);
      this.setItem(STORAGE_KEYS.TRANSFERS, transfers);
      return true;
    }
    return false;
  }

  createAdjustment(adj) {
    const adjustments = this.getAdjustments();
    const products = this.getProducts();
    const prod = products.find(p => p.id === adj.productId);
    if (!prod) return false;

    adj.id = 'adj-' + Date.now();
    adj.date = new Date().toISOString();
    
    const role = this.getCurrentRole();
    if (role === 'Warehouse Staff') {
      adj.status = 'Pending Approval';
    } else {
      adj.status = 'Approved';
      prod.quantity = Math.max(0, prod.quantity + Number(adj.qtyChange));
      this.setItem(STORAGE_KEYS.PRODUCTS, products);

      const movements = this.getMovements();
      movements.unshift({
        id: 'mov-' + Date.now(),
        productId: adj.productId,
        type: adj.qtyChange > 0 ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT',
        qty: adj.qtyChange,
        source: 'ADJ-' + adj.reason.toUpperCase(),
        warehouseId: adj.warehouseId,
        date: adj.date,
        notes: `Stock adjustment: ${adj.reason}`
      });
      this.setItem(STORAGE_KEYS.MOVEMENTS, movements);
    }

    adjustments.unshift(adj);
    this.setItem(STORAGE_KEYS.ADJUSTMENTS, adjustments);
    return adj;
  }

  approveAdjustment(id, approver) {
    const list = this.getAdjustments();
    const adj = list.find(a => a.id === id);
    if (adj && adj.status === 'Pending Approval') {
      const products = this.getProducts();
      const prod = products.find(p => p.id === adj.productId);
      if (prod) {
        prod.quantity = Math.max(0, prod.quantity + Number(adj.qtyChange));
        adj.status = 'Approved';
        adj.approvedBy = approver;

        this.setItem(STORAGE_KEYS.PRODUCTS, products);

        const movements = this.getMovements();
        movements.unshift({
          id: 'mov-' + Date.now(),
          productId: adj.productId,
          type: adj.qtyChange > 0 ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT',
          qty: adj.qtyChange,
          source: 'ADJ-' + adj.reason.toUpperCase(),
          warehouseId: adj.warehouseId,
          date: new Date().toISOString(),
          notes: `Stock adjustment approved: ${adj.reason}`
        });
        this.setItem(STORAGE_KEYS.MOVEMENTS, movements);
        this.setItem(STORAGE_KEYS.ADJUSTMENTS, list);
        return true;
      }
    }
    return false;
  }

  executeStockCount(warehouseId, countType, countedProducts) {
    const counts = this.getInventoryCounts();
    const products = this.getProducts();
    const movements = this.getMovements();

    let varianceCount = 0;
    const itemsCount = countedProducts.length;

    countedProducts.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) return;

      const physical = Number(item.physicalQty);
      const expected = Number(item.expectedQty);
      const diff = physical - expected;

      if (diff !== 0) {
        varianceCount++;
        prod.quantity = physical;

        movements.unshift({
          id: 'mov-' + Date.now() + Math.random().toString(36).substr(2, 5),
          productId: prod.id,
          type: diff > 0 ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT',
          qty: diff,
          source: 'CYCLE-COUNT',
          warehouseId: warehouseId,
          date: new Date().toISOString(),
          notes: `Stock audit adjustment. Variance: ${diff}`
        });
      }
    });

    counts.unshift({
      id: 'cnt-' + Date.now(),
      countType,
      date: new Date().toISOString().slice(0, 10),
      status: 'Completed',
      warehouseId,
      itemsCount,
      varianceDetected: varianceCount,
      notes: `Executed ${countType}. Reconciled ${varianceCount} variances.`
    });

    this.setItem(STORAGE_KEYS.PRODUCTS, products);
    this.setItem(STORAGE_KEYS.MOVEMENTS, movements);
    this.setItem(STORAGE_KEYS.COUNTS, counts);
    return true;
  }

  getValuationMetrics() {
    const products = this.getProducts();
    const settings = this.getSettings();

    let totalCostValuation = 0;
    let totalRetailValuation = 0;

    products.forEach(p => {
      const qty = Number(p.quantity) || 0;
      
      let costBasis = Number(p.costPrice) || 0;
      if (settings.costingMethod === 'FIFO' && p.costHistory && p.costHistory.length > 0) {
        costBasis = p.costHistory[p.costHistory.length - 1].cost;
      }

      totalCostValuation += costBasis * qty;
      totalRetailValuation += (Number(p.sellingPrice) || 0) * qty;
    });

    return {
      costValuation: totalCostValuation,
      retailValuation: totalRetailValuation,
      potentialProfit: Math.max(0, totalRetailValuation - totalCostValuation)
    };
  }

  getMetrics() {
    const products = this.getProducts();
    const categories = this.getCategories();
    const pos = this.getPurchaseOrders();
    const transfers = this.getTransfers();
    const batches = this.getBatches();

    const totalProducts = products.length;
    const totalCategories = categories.length;

    let totalValue = 0;
    let totalCostValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let overStockCount = 0;

    products.forEach(p => {
      const qty = Number(p.quantity) || 0;
      totalValue += (Number(p.sellingPrice) || 0) * qty;
      totalCostValue += (Number(p.costPrice) || 0) * qty;

      if (qty === 0) {
        outOfStockCount++;
      } else if (qty <= Number(p.minStock)) {
        lowStockCount++;
      } else if (p.maxStock && qty >= Number(p.maxStock)) {
        overStockCount++;
      }
    });

    const pendingPOs = pos.filter(po => po.status === 'Pending Approval' || po.status === 'Approved').length;
    const pendingTransfers = transfers.filter(tr => tr.status === 'Pending Approval' || tr.status === 'In Transit').length;

    const mockToday = new Date('2026-08-06').getTime();
    const nearExpiryDays = 90 * 86400000;
    const expiringBatchesCount = batches.filter(b => {
      const expTime = new Date(b.expiryDate).getTime();
      return expTime > mockToday && (expTime - mockToday) <= nearExpiryDays;
    }).length;

    return {
      totalProducts,
      totalCategories,
      totalValue,
      totalCostValue,
      lowStockCount,
      outOfStockCount,
      overStockCount,
      pendingPOs,
      pendingTransfers,
      expiringBatchesCount
    };
  }

  getStockStatus(prod) {
    const qty = Number(prod.quantity) || 0;
    const min = Number(prod.minStock) || 0;
    const max = Number(prod.maxStock) || 99999;

    if (qty === 0) {
      return { status: 'Out of Stock', code: 'out', badgeClass: 'badge-out-stock' };
    } else if (qty <= min) {
      return { status: 'Low Stock', code: 'low', badgeClass: 'badge-low-stock' };
    } else if (qty >= max) {
      return { status: 'Overstock', code: 'over', badgeClass: 'badge-category' };
    } else {
      return { status: 'In Stock', code: 'in', badgeClass: 'badge-in-stock' };
    }
  }

  /**
   * Compute top-moving products by total stock inflow (RECEIPT movements)
   * @param {number} limit
   * @returns {Array} sorted products with movementVolume
   */
  getTopMovingProducts(limit = 3) {
    const movements = this.getMovements();
    const products  = this.getProducts();

    // Count inbound movement qty per product
    const volumeMap = {};
    movements.forEach(m => {
      if (m.type === 'RECEIPT' || m.type === 'ADJUSTMENT_IN') {
        volumeMap[m.productId] = (volumeMap[m.productId] || 0) + Math.abs(m.qty);
      }
    });

    return products
      .filter(p => volumeMap[p.id] !== undefined)
      .sort((a, b) => (volumeMap[b.id] || 0) - (volumeMap[a.id] || 0))
      .slice(0, limit)
      .map(p => ({ ...p, movementVolume: volumeMap[p.id] || 0 }));
  }

  /**
   * Compute slow/aging products — those with no inbound movement in last N days,
   * or that are below reorder level, sorted by days since last movement.
   * @param {number} limit
   * @returns {Array}
   */
  getSlowMovingProducts(limit = 3) {
    const movements = this.getMovements();
    const products  = this.getProducts();
    const now = Date.now();

    // Find last movement date per product
    const lastMovMap = {};
    movements.forEach(m => {
      const t = new Date(m.date).getTime();
      if (!lastMovMap[m.productId] || t > lastMovMap[m.productId]) {
        lastMovMap[m.productId] = t;
      }
    });

    return products
      .map(p => {
        const lastMov = lastMovMap[p.id];
        const daysSince = lastMov ? Math.floor((now - lastMov) / 86400000) : 999;
        return { ...p, daysSinceLastMovement: daysSince };
      })
      .filter(p => p.daysSinceLastMovement > 30 || p.quantity <= p.minStock)
      .sort((a, b) => b.daysSinceLastMovement - a.daysSinceLastMovement)
      .slice(0, limit);
  }

  resetToDefault() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    this._backendOnline = false;
    this.init();
  }
}

export const store = new Store();

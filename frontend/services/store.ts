import {
  Product,
  Category,
  Subcategory,
  Brand,
  Warehouse,
  LocationBin,
  Supplier,
  PurchaseOrder,
  StockMovement,
  StockTransfer,
  StockAdjustment,
  Settings,
  UserRole,
  Metrics
} from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'zenora_expo_products_v1',
  CATEGORIES: 'zenora_expo_categories_v1',
  SUBCATEGORIES: 'zenora_expo_subcategories_v1',
  BRANDS: 'zenora_expo_brands_v1',
  WAREHOUSES: 'zenora_expo_warehouses_v1',
  LOCATIONS: 'zenora_expo_locations_v1',
  SUPPLIERS: 'zenora_expo_suppliers_v1',
  PURCHASE_ORDERS: 'zenora_expo_po_v1',
  MOVEMENTS: 'zenora_expo_movements_v1',
  TRANSFERS: 'zenora_expo_transfers_v1',
  ADJUSTMENTS: 'zenora_expo_adjustments_v1',
  SETTINGS: 'zenora_expo_settings_v1',
  ROLE: 'zenora_expo_role_v1',
  THEME: 'zenora_expo_theme_v1'
};

const SEED_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Electronics & Sensors', code: 'ELEC', description: 'Microcontrollers, IoT sensors, PCB assemblies', color: '#6366f1', icon: 'microchip' },
  { id: 'cat-2', name: 'Raw Materials', code: 'RAW', description: 'Steel alloys, aluminum billets, polymer resins', color: '#06b6d4', icon: 'cube' },
  { id: 'cat-3', name: 'Industrial Machinery', code: 'MACH', description: 'Pumps, electric motors, hydraulic valves', color: '#f59e0b', icon: 'cog' },
  { id: 'cat-4', name: 'Packaging & Logistics', code: 'PKG', description: 'Corrugated boxes, pallets, thermal labels', color: '#10b981', icon: 'box' },
  { id: 'cat-5', name: 'Safety & PPE', code: 'PPE', description: 'Helmets, safety goggles, respirators', color: '#ef4444', icon: 'shield' }
];

const SEED_SUBCATEGORIES: Subcategory[] = [
  { id: 'sub-1', categoryId: 'cat-1', name: 'Sensors & Transducers' },
  { id: 'sub-2', categoryId: 'cat-1', name: 'Microcontrollers & ICs' },
  { id: 'sub-3', categoryId: 'cat-2', name: 'Stainless Steel & Alloys' },
  { id: 'sub-4', categoryId: 'cat-3', name: 'Electric Motors & Drives' },
  { id: 'sub-5', categoryId: 'cat-4', name: 'Cardboard & Shipping Boxes' }
];

const SEED_BRANDS: Brand[] = [
  { id: 'brand-1', name: 'Apex Electronics', country: 'USA', website: 'https://apexelectronics.example' },
  { id: 'brand-2', name: 'Vortex Industrial', country: 'Germany', website: 'https://vortexdrives.example' },
  { id: 'brand-3', name: 'GlobalAlloy', country: 'Japan', website: 'https://globalalloy.example' },
  { id: 'brand-4', name: 'SafeGuard Global', country: 'UK', website: 'https://safeguard.example' }
];

const SEED_WAREHOUSES: Warehouse[] = [
  { id: 'wh-1', name: 'Central Logistics Hub', code: 'WH-CENTRAL', address: '100 Supply Chain Blvd, Industrial Park', manager: 'David Miller', phone: '+1 555-0192', capacity: '10,000 sq ft', status: 'Active', isPrimary: true },
  { id: 'wh-2', name: 'East Coast Distribution Center', code: 'WH-EAST', address: '45 Harbor Commerce Way, NJ', manager: 'Sarah Jenkins', phone: '+1 555-0344', capacity: '25,000 sq ft', status: 'Active', isPrimary: false },
  { id: 'wh-3', name: 'Overseas Transit Depot', code: 'WH-DEPOT', address: 'Port Terminal 4, Rotterdam', manager: 'Jan de Jong', phone: '+31 20 555 12', capacity: '15,000 sq ft', status: 'Active', isPrimary: false }
];

const SEED_LOCATIONS: LocationBin[] = [
  { id: 'loc-1', warehouseId: 'wh-1', code: 'A-12-04', zone: 'Zone A', aisle: '12', rack: 'RACK-03', shelf: 'SHELF-02', bin: '04' },
  { id: 'loc-2', warehouseId: 'wh-1', code: 'B-04-01', zone: 'Zone B', aisle: '04', rack: 'RACK-01', shelf: 'SHELF-04', bin: '01' },
  { id: 'loc-3', warehouseId: 'wh-2', code: 'R-01-18', zone: 'Rack R1', aisle: '01', rack: 'RACK-10', shelf: 'SHELF-01', bin: '18' },
  { id: 'loc-4', warehouseId: 'wh-2', code: 'P-08-02', zone: 'Pallet P8', aisle: '08', rack: 'RACK-05', shelf: 'SHELF-03', bin: '02' },
  { id: 'loc-5', warehouseId: 'wh-3', code: 'S-03-09', zone: 'Shelf S3', aisle: '03', rack: 'RACK-02', shelf: 'SHELF-05', bin: '09' }
];

const SEED_SUPPLIERS: Supplier[] = [
  { id: 'sup-1', name: 'Apex Automation Corp', contactPerson: 'Robert Chen', email: 'sales@apexauto.com', phone: '+1 800-555-0111', address: 'San Jose, CA', gstin: '06AAAAC1111A1Z1', leadTimeDays: 7, rating: 4.8, paymentTerms: 'Net 30' },
  { id: 'sup-2', name: 'Vortex Drives Ltd', contactPerson: 'Klaus Webber', email: 'orders@vortexdrives.de', phone: '+49 89 555 99', address: 'Munich, Germany', gstin: '06AAAAC2222B1Z2', leadTimeDays: 14, rating: 4.5, paymentTerms: 'Net 45' },
  { id: 'sup-3', name: 'Global Alloy Supplies', contactPerson: 'Elena Rostova', email: 'info@globalalloy.com', phone: '+1 888-444-2211', address: 'Osaka, Japan', gstin: '06AAAAC3333C1Z3', leadTimeDays: 5, rating: 4.9, paymentTerms: 'Net 15' },
  { id: 'sup-4', name: 'SafeGuard PPE Global', contactPerson: 'Mark Taylor', email: 'support@safeguardppe.com', phone: '+44 20 7946 0912', address: 'London, UK', gstin: '06AAAAC4444D1Z4', leadTimeDays: 4, rating: 4.2, paymentTerms: 'Net 30' }
];

const SEED_PRODUCTS: Product[] = [
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
    status: 'Active'
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
    description: 'Heavy-duty 400V 5.5kW squirrel cage induction motor for conveyor systems.',
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
    status: 'Active'
  },
  {
    id: 'prod-103',
    sku: 'RAW-STL-404',
    name: '316L Stainless Steel Precision Rods',
    categoryId: 'cat-2',
    subcategoryId: 'sub-3',
    brandId: 'brand-3',
    supplierId: 'sup-3',
    warehouseId: 'wh-2',
    locationBin: 'R-01-18',
    barcode: '8901234567893',
    description: 'Corrosion-resistant marine grade stainless steel round bars (Dia: 25mm, L: 3m).',
    costPrice: 65.00,
    sellingPrice: 110.00,
    taxRate: 18,
    quantity: 320,
    minStock: 50,
    maxStock: 1000,
    reorderLevel: 80,
    reorderQty: 200,
    unit: 'pcs',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500',
    hsnCode: '72221100',
    status: 'Active'
  },
  {
    id: 'prod-104',
    sku: 'PKG-BOX-500',
    name: 'Triple-Wall Heavy Duty Shipping Boxes',
    categoryId: 'cat-4',
    subcategoryId: 'sub-5',
    brandId: 'brand-4',
    supplierId: 'sup-4',
    warehouseId: 'wh-2',
    locationBin: 'P-08-02',
    barcode: '8901234567894',
    description: 'Export-grade corrugated cardboard boxes for container transport (600x400x400mm).',
    costPrice: 2.10,
    sellingPrice: 4.80,
    taxRate: 12,
    quantity: 1200,
    minStock: 200,
    maxStock: 3000,
    reorderLevel: 300,
    reorderQty: 1000,
    unit: 'boxes',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500',
    hsnCode: '48191010',
    status: 'Active'
  },
  {
    id: 'prod-105',
    sku: 'PPE-HLM-202',
    name: 'ANSI Z89.1 Hard Hat with Visor Mount',
    categoryId: 'cat-5',
    subcategoryId: 'sub-5',
    brandId: 'brand-4',
    supplierId: 'sup-4',
    warehouseId: 'wh-3',
    locationBin: 'S-03-09',
    barcode: '8901234567895',
    description: 'Vented high-density polyethylene protective helmet with 6-point ratchet suspension.',
    costPrice: 14.20,
    sellingPrice: 28.50,
    taxRate: 18,
    quantity: 0,
    minStock: 40,
    maxStock: 250,
    reorderLevel: 50,
    reorderQty: 100,
    unit: 'pcs',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500',
    hsnCode: '65061090',
    status: 'Active'
  }
];

const SEED_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'PO-2026-001',
    supplierId: 'sup-1',
    warehouseId: 'wh-1',
    orderDate: '2026-02-15',
    expectedDate: '2026-02-28',
    status: 'Approved',
    paymentTerms: 'Net 30',
    subtotal: 4250.00,
    taxTotal: 765.00,
    grandTotal: 5015.00,
    items: [
      { productId: 'prod-101', sku: 'ELEC-SENS-001', name: 'Industrial Optocoupler Sensor Array', quantity: 100, unitPrice: 42.50, taxPercent: 18, totalAmount: 5015.00 }
    ],
    createdAt: '2026-02-15T10:00:00Z'
  },
  {
    id: 'po-2',
    poNumber: 'PO-2026-002',
    supplierId: 'sup-2',
    warehouseId: 'wh-1',
    orderDate: '2026-02-18',
    expectedDate: '2026-03-05',
    status: 'Sent',
    paymentTerms: 'Net 45',
    subtotal: 7600.00,
    taxTotal: 1368.00,
    grandTotal: 8968.00,
    items: [
      { productId: 'prod-102', sku: 'MACH-MTR-088', name: '3-Phase AC Induction Motor 5.5kW', quantity: 20, unitPrice: 380.00, taxPercent: 18, totalAmount: 8968.00 }
    ],
    createdAt: '2026-02-18T14:30:00Z'
  }
];

const SEED_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-1',
    date: '2026-02-20 09:15',
    productId: 'prod-101',
    productName: 'Industrial Optocoupler Sensor Array',
    sku: 'ELEC-SENS-001',
    type: 'IN',
    quantity: 50,
    referenceNo: 'GRN-2026-041',
    warehouseId: 'wh-1',
    warehouseName: 'Central Logistics Hub',
    recordedBy: 'David Miller'
  },
  {
    id: 'mov-2',
    date: '2026-02-22 14:00',
    productId: 'prod-102',
    productName: '3-Phase AC Induction Motor 5.5kW',
    sku: 'MACH-MTR-088',
    type: 'OUT',
    quantity: 2,
    referenceNo: 'DO-2026-118',
    warehouseId: 'wh-1',
    warehouseName: 'Central Logistics Hub',
    recordedBy: 'Sarah Jenkins'
  },
  {
    id: 'mov-3',
    date: '2026-02-24 11:30',
    productId: 'prod-103',
    productName: '316L Stainless Steel Precision Rods',
    sku: 'RAW-STL-404',
    type: 'TRANSFER',
    quantity: 40,
    referenceNo: 'TR-2026-009',
    warehouseId: 'wh-2',
    warehouseName: 'East Coast Distribution Center',
    recordedBy: 'Jan de Jong'
  }
];

const SEED_TRANSFERS: StockTransfer[] = [
  {
    id: 'tr-1',
    transferNo: 'TR-2026-001',
    date: '2026-02-24',
    fromWarehouseId: 'wh-1',
    toWarehouseId: 'wh-2',
    items: [{ productId: 'prod-103', sku: 'RAW-STL-404', name: '316L Stainless Steel Precision Rods', quantity: 40 }],
    status: 'In Transit',
    notes: 'Transfer to support East Coast manufacturing schedule',
    createdBy: 'David Miller'
  }
];

const SEED_ADJUSTMENTS: StockAdjustment[] = [
  {
    id: 'adj-1',
    adjustmentNo: 'ADJ-2026-001',
    date: '2026-02-21',
    warehouseId: 'wh-1',
    productId: 'prod-101',
    productName: 'Industrial Optocoupler Sensor Array',
    systemQty: 147,
    countedQty: 145,
    varianceQty: -2,
    reason: 'Damaged in transit inspection',
    recordedBy: 'David Miller'
  }
];

const SEED_SETTINGS: Settings = {
  companyName: 'Zenora Industrial Supply Group',
  companyAddress: '100 Supply Chain Blvd, Industrial Gateway',
  currency: '$',
  defaultTaxRate: 18,
  valuationMethod: 'FIFO',
  lowStockThresholdPercent: 20,
  enableBatchTracking: true,
  enableSerialTracking: true
};

// Storage helper functions
function getStored<T>(key: string, defaultVal: T): T {
  try {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    }
  } catch (e) {
    // LocalStorage error fallback
  }
  return defaultVal;
}

function setStored<T>(key: string, val: T): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(val));
    }
  } catch (e) {
    // ignore
  }
}

class Store {
  private categories: Category[] = [];
  private subcategories: Subcategory[] = [];
  private brands: Brand[] = [];
  private warehouses: Warehouse[] = [];
  private locations: LocationBin[] = [];
  private suppliers: Supplier[] = [];
  private products: Product[] = [];
  private purchaseOrders: PurchaseOrder[] = [];
  private movements: StockMovement[] = [];
  private transfers: StockTransfer[] = [];
  private adjustments: StockAdjustment[] = [];
  private settings: Settings = SEED_SETTINGS;
  private currentRole: UserRole = 'Admin';
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    this.categories = getStored(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
    this.subcategories = getStored(STORAGE_KEYS.SUBCATEGORIES, SEED_SUBCATEGORIES);
    this.brands = getStored(STORAGE_KEYS.BRANDS, SEED_BRANDS);
    this.warehouses = getStored(STORAGE_KEYS.WAREHOUSES, SEED_WAREHOUSES);
    this.locations = getStored(STORAGE_KEYS.LOCATIONS, SEED_LOCATIONS);
    this.suppliers = getStored(STORAGE_KEYS.SUPPLIERS, SEED_SUPPLIERS);
    this.products = getStored(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    this.purchaseOrders = getStored(STORAGE_KEYS.PURCHASE_ORDERS, SEED_PURCHASE_ORDERS);
    this.movements = getStored(STORAGE_KEYS.MOVEMENTS, SEED_MOVEMENTS);
    this.transfers = getStored(STORAGE_KEYS.TRANSFERS, SEED_TRANSFERS);
    this.adjustments = getStored(STORAGE_KEYS.ADJUSTMENTS, SEED_ADJUSTMENTS);
    this.settings = getStored(STORAGE_KEYS.SETTINGS, SEED_SETTINGS);
    this.currentRole = getStored(STORAGE_KEYS.ROLE, 'Admin');
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  resetToDefault() {
    this.categories = [...SEED_CATEGORIES];
    this.subcategories = [...SEED_SUBCATEGORIES];
    this.brands = [...SEED_BRANDS];
    this.warehouses = [...SEED_WAREHOUSES];
    this.locations = [...SEED_LOCATIONS];
    this.suppliers = [...SEED_SUPPLIERS];
    this.products = [...SEED_PRODUCTS];
    this.purchaseOrders = [...SEED_PURCHASE_ORDERS];
    this.movements = [...SEED_MOVEMENTS];
    this.transfers = [...SEED_TRANSFERS];
    this.adjustments = [...SEED_ADJUSTMENTS];
    this.settings = { ...SEED_SETTINGS };
    this.currentRole = 'Admin';

    setStored(STORAGE_KEYS.CATEGORIES, this.categories);
    setStored(STORAGE_KEYS.SUBCATEGORIES, this.subcategories);
    setStored(STORAGE_KEYS.BRANDS, this.brands);
    setStored(STORAGE_KEYS.WAREHOUSES, this.warehouses);
    setStored(STORAGE_KEYS.LOCATIONS, this.locations);
    setStored(STORAGE_KEYS.SUPPLIERS, this.suppliers);
    setStored(STORAGE_KEYS.PRODUCTS, this.products);
    setStored(STORAGE_KEYS.PURCHASE_ORDERS, this.purchaseOrders);
    setStored(STORAGE_KEYS.MOVEMENTS, this.movements);
    setStored(STORAGE_KEYS.TRANSFERS, this.transfers);
    setStored(STORAGE_KEYS.ADJUSTMENTS, this.adjustments);
    setStored(STORAGE_KEYS.SETTINGS, this.settings);
    setStored(STORAGE_KEYS.ROLE, this.currentRole);

    this.notify();
  }

  // Getters
  getCategories(): Category[] { return [...this.categories]; }
  getSubcategories(): Subcategory[] { return [...this.subcategories]; }
  getBrands(): Brand[] { return [...this.brands]; }
  getWarehouses(): Warehouse[] { return [...this.warehouses]; }
  getLocations(): LocationBin[] { return [...this.locations]; }
  getSuppliers(): Supplier[] { return [...this.suppliers]; }
  getProducts(): Product[] { return [...this.products]; }
  getPurchaseOrders(): PurchaseOrder[] { return [...this.purchaseOrders]; }
  getMovements(): StockMovement[] { return [...this.movements]; }
  getTransfers(): StockTransfer[] { return [...this.transfers]; }
  getAdjustments(): StockAdjustment[] { return [...this.adjustments]; }
  getSettings(): Settings { return { ...this.settings }; }
  getCurrentRole(): UserRole { return this.currentRole; }

  setCurrentRole(role: UserRole) {
    this.currentRole = role;
    setStored(STORAGE_KEYS.ROLE, role);
    this.notify();
  }

  // Products CRUD
  saveProduct(prodData: Partial<Product>): Product {
    if (prodData.id) {
      const idx = this.products.findIndex(p => p.id === prodData.id);
      if (idx !== -1) {
        this.products[idx] = { ...this.products[idx], ...prodData } as Product;
        setStored(STORAGE_KEYS.PRODUCTS, this.products);
        this.notify();
        return this.products[idx];
      }
    }
    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      sku: prodData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: prodData.name || 'New Product Item',
      categoryId: prodData.categoryId || this.categories[0]?.id || 'cat-1',
      subcategoryId: prodData.subcategoryId,
      brandId: prodData.brandId,
      supplierId: prodData.supplierId,
      warehouseId: prodData.warehouseId || this.warehouses[0]?.id || 'wh-1',
      locationBin: prodData.locationBin || 'A-01-01',
      barcode: prodData.barcode || '890' + Math.floor(1000000000 + Math.random() * 9000000000),
      description: prodData.description || '',
      costPrice: Number(prodData.costPrice) || 0,
      sellingPrice: Number(prodData.sellingPrice) || 0,
      taxRate: prodData.taxRate || this.settings.defaultTaxRate,
      quantity: Number(prodData.quantity) || 0,
      minStock: Number(prodData.minStock) || 10,
      maxStock: Number(prodData.maxStock) || 500,
      reorderLevel: Number(prodData.reorderLevel) || 15,
      reorderQty: Number(prodData.reorderQty) || 50,
      unit: prodData.unit || 'pcs',
      image: prodData.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500',
      hsnCode: prodData.hsnCode || '84713010',
      status: prodData.status || 'Active',
      createdAt: new Date().toISOString()
    };
    this.products.unshift(newProduct);

    // Record initial movement if qty > 0
    if (newProduct.quantity > 0) {
      this.recordMovement({
        productId: newProduct.id,
        productName: newProduct.name,
        sku: newProduct.sku,
        type: 'IN',
        quantity: newProduct.quantity,
        referenceNo: 'INIT-STOCK',
        warehouseId: newProduct.warehouseId || 'wh-1',
        warehouseName: this.warehouses.find(w => w.id === newProduct.warehouseId)?.name || 'Central Logistics Hub',
        reason: 'Initial Stock Count'
      });
    }

    setStored(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify();
    return newProduct;
  }

  deleteProduct(id: string) {
    this.products = this.products.filter(p => p.id !== id);
    setStored(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify();
  }

  // Categories CRUD
  saveCategory(catData: Partial<Category>): Category {
    if (catData.id) {
      const idx = this.categories.findIndex(c => c.id === catData.id);
      if (idx !== -1) {
        this.categories[idx] = { ...this.categories[idx], ...catData } as Category;
        setStored(STORAGE_KEYS.CATEGORIES, this.categories);
        this.notify();
        return this.categories[idx];
      }
    }
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name: catData.name || 'New Category',
      code: catData.code || 'CAT',
      description: catData.description || '',
      color: catData.color || '#6366f1',
      icon: catData.icon || 'cube'
    };
    this.categories.push(newCat);
    setStored(STORAGE_KEYS.CATEGORIES, this.categories);
    this.notify();
    return newCat;
  }

  deleteCategory(id: string) {
    this.categories = this.categories.filter(c => c.id !== id);
    setStored(STORAGE_KEYS.CATEGORIES, this.categories);
    this.notify();
  }

  // Warehouses CRUD
  saveWarehouse(whData: Partial<Warehouse>): Warehouse {
    if (whData.id) {
      const idx = this.warehouses.findIndex(w => w.id === whData.id);
      if (idx !== -1) {
        this.warehouses[idx] = { ...this.warehouses[idx], ...whData } as Warehouse;
        setStored(STORAGE_KEYS.WAREHOUSES, this.warehouses);
        this.notify();
        return this.warehouses[idx];
      }
    }
    const newWh: Warehouse = {
      id: 'wh-' + Date.now(),
      name: whData.name || 'New Warehouse',
      code: whData.code || 'WH-NEW',
      address: whData.address || '',
      manager: whData.manager || '',
      phone: whData.phone || '',
      capacity: whData.capacity || '5,000 sq ft',
      status: whData.status || 'Active',
      isPrimary: Boolean(whData.isPrimary)
    };
    this.warehouses.push(newWh);
    setStored(STORAGE_KEYS.WAREHOUSES, this.warehouses);
    this.notify();
    return newWh;
  }

  // Suppliers CRUD
  saveSupplier(supData: Partial<Supplier>): Supplier {
    if (supData.id) {
      const idx = this.suppliers.findIndex(s => s.id === supData.id);
      if (idx !== -1) {
        this.suppliers[idx] = { ...this.suppliers[idx], ...supData } as Supplier;
        setStored(STORAGE_KEYS.SUPPLIERS, this.suppliers);
        this.notify();
        return this.suppliers[idx];
      }
    }
    const newSup: Supplier = {
      id: 'sup-' + Date.now(),
      name: supData.name || 'New Supplier Corp',
      contactPerson: supData.contactPerson || '',
      email: supData.email || '',
      phone: supData.phone || '',
      address: supData.address || '',
      gstin: supData.gstin || '',
      leadTimeDays: Number(supData.leadTimeDays) || 7,
      rating: Number(supData.rating) || 4.5,
      paymentTerms: supData.paymentTerms || 'Net 30'
    };
    this.suppliers.push(newSup);
    setStored(STORAGE_KEYS.SUPPLIERS, this.suppliers);
    this.notify();
    return newSup;
  }

  // Purchase Orders CRUD
  savePurchaseOrder(poData: Partial<PurchaseOrder>): PurchaseOrder {
    if (poData.id) {
      const idx = this.purchaseOrders.findIndex(p => p.id === poData.id);
      if (idx !== -1) {
        const oldStatus = this.purchaseOrders[idx].status;
        this.purchaseOrders[idx] = { ...this.purchaseOrders[idx], ...poData } as PurchaseOrder;

        // If status turned into Received, update product stocks and ledger!
        if (oldStatus !== 'Received' && poData.status === 'Received') {
          this.purchaseOrders[idx].items.forEach(item => {
            const prod = this.products.find(p => p.id === item.productId);
            if (prod) {
              prod.quantity += item.quantity;
              this.recordMovement({
                productId: prod.id,
                productName: prod.name,
                sku: prod.sku,
                type: 'IN',
                quantity: item.quantity,
                referenceNo: this.purchaseOrders[idx].poNumber,
                warehouseId: this.purchaseOrders[idx].warehouseId,
                warehouseName: this.warehouses.find(w => w.id === this.purchaseOrders[idx].warehouseId)?.name || 'Warehouse',
                reason: `PO Receipt ${this.purchaseOrders[idx].poNumber}`
              });
            }
          });
          setStored(STORAGE_KEYS.PRODUCTS, this.products);
        }

        setStored(STORAGE_KEYS.PURCHASE_ORDERS, this.purchaseOrders);
        this.notify();
        return this.purchaseOrders[idx];
      }
    }
    const newPO: PurchaseOrder = {
      id: 'po-' + Date.now(),
      poNumber: poData.poNumber || `PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      supplierId: poData.supplierId || this.suppliers[0]?.id || 'sup-1',
      warehouseId: poData.warehouseId || this.warehouses[0]?.id || 'wh-1',
      orderDate: poData.orderDate || new Date().toISOString().split('T')[0],
      expectedDate: poData.expectedDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: poData.status || 'Draft',
      paymentTerms: poData.paymentTerms || 'Net 30',
      notes: poData.notes || '',
      subtotal: Number(poData.subtotal) || 0,
      taxTotal: Number(poData.taxTotal) || 0,
      grandTotal: Number(poData.grandTotal) || 0,
      items: poData.items || [],
      createdAt: new Date().toISOString()
    };
    this.purchaseOrders.unshift(newPO);
    setStored(STORAGE_KEYS.PURCHASE_ORDERS, this.purchaseOrders);
    this.notify();
    return newPO;
  }

  // Stock Movement & Transfers
  recordMovement(movementData: Omit<StockMovement, 'id' | 'date' | 'recordedBy'>): StockMovement {
    const newMov: StockMovement = {
      id: 'mov-' + Date.now() + '-' + Math.floor(Math.random() * 100),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      recordedBy: this.currentRole,
      ...movementData
    };
    this.movements.unshift(newMov);
    setStored(STORAGE_KEYS.MOVEMENTS, this.movements);
    return newMov;
  }

  saveStockTransfer(trData: Partial<StockTransfer>): StockTransfer {
    const newTr: StockTransfer = {
      id: 'tr-' + Date.now(),
      transferNo: `TR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      fromWarehouseId: trData.fromWarehouseId || 'wh-1',
      toWarehouseId: trData.toWarehouseId || 'wh-2',
      items: trData.items || [],
      status: trData.status || 'Completed',
      notes: trData.notes || '',
      createdBy: this.currentRole
    };

    if (newTr.status === 'Completed') {
      newTr.items.forEach(item => {
        const prod = this.products.find(p => p.id === item.productId);
        if (prod) {
          const fromWh = this.warehouses.find(w => w.id === newTr.fromWarehouseId)?.name || 'Source WH';
          const toWh = this.warehouses.find(w => w.id === newTr.toWarehouseId)?.name || 'Target WH';
          this.recordMovement({
            productId: prod.id,
            productName: prod.name,
            sku: prod.sku,
            type: 'TRANSFER',
            quantity: item.quantity,
            referenceNo: newTr.transferNo,
            warehouseId: newTr.toWarehouseId,
            warehouseName: `${fromWh} -> ${toWh}`,
            reason: `Inter-warehouse transfer ${newTr.transferNo}`
          });
        }
      });
    }

    this.transfers.unshift(newTr);
    setStored(STORAGE_KEYS.TRANSFERS, this.transfers);
    this.notify();
    return newTr;
  }

  saveStockAdjustment(adjData: Partial<StockAdjustment>): StockAdjustment {
    const variance = (Number(adjData.countedQty) || 0) - (Number(adjData.systemQty) || 0);
    const newAdj: StockAdjustment = {
      id: 'adj-' + Date.now(),
      adjustmentNo: `ADJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      warehouseId: adjData.warehouseId || 'wh-1',
      productId: adjData.productId || '',
      productName: adjData.productName || '',
      systemQty: Number(adjData.systemQty) || 0,
      countedQty: Number(adjData.countedQty) || 0,
      varianceQty: variance,
      reason: adjData.reason || 'Physical Count Adjustment',
      recordedBy: this.currentRole
    };

    // Update product stock
    const prod = this.products.find(p => p.id === adjData.productId);
    if (prod) {
      prod.quantity = newAdj.countedQty;
      this.recordMovement({
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        type: 'ADJUSTMENT',
        quantity: Math.abs(variance),
        referenceNo: newAdj.adjustmentNo,
        warehouseId: newAdj.warehouseId,
        warehouseName: this.warehouses.find(w => w.id === newAdj.warehouseId)?.name || 'Warehouse',
        reason: `${newAdj.reason} (Variance: ${variance > 0 ? '+' : ''}${variance})`
      });
      setStored(STORAGE_KEYS.PRODUCTS, this.products);
    }

    this.adjustments.unshift(newAdj);
    setStored(STORAGE_KEYS.ADJUSTMENTS, this.adjustments);
    this.notify();
    return newAdj;
  }

  saveSettings(newSettings: Partial<Settings>): Settings {
    this.settings = { ...this.settings, ...newSettings };
    setStored(STORAGE_KEYS.SETTINGS, this.settings);
    this.notify();
    return this.settings;
  }

  getMetrics(): Metrics {
    const totalProducts = this.products.length;
    const totalCategories = this.categories.length;
    const totalValue = this.products.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);
    const totalCostValue = this.products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
    const lowStockCount = this.products.filter(p => p.quantity > 0 && p.quantity <= p.minStock).length;
    const outOfStockCount = this.products.filter(p => p.quantity === 0).length;
    const totalWarehouses = this.warehouses.length;
    const totalSuppliers = this.suppliers.length;
    const pendingPOs = this.purchaseOrders.filter(po => po.status === 'Draft' || po.status === 'Sent' || po.status === 'Approved').length;

    return {
      totalProducts,
      totalCategories,
      totalValue,
      totalCostValue,
      lowStockCount,
      outOfStockCount,
      totalWarehouses,
      totalSuppliers,
      pendingPOs
    };
  }
}

export const store = new Store();

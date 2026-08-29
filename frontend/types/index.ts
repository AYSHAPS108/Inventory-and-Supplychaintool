export type UserRole = 
  | 'Admin'
  | 'Inventory Manager'
  | 'Warehouse Staff'
  | 'Purchase Staff'
  | 'Store Manager'
  | 'View Only';

export type AppRoute = 
  | 'dashboard'
  | 'products'
  | 'stock'
  | 'warehouses'
  | 'purchasing'
  | 'transfers'
  | 'costing'
  | 'reports'
  | 'settings';

export type ThemeMode = 'dark' | 'light';

export interface Category {
  id: string;
  name: string;
  code: string;
  description: string;
  color: string;
  icon: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
  country: string;
  website: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  manager: string;
  phone: string;
  capacity: string;
  status: 'Active' | 'Inactive';
  isPrimary: boolean;
}

export interface LocationBin {
  id: string;
  warehouseId: string;
  code: string;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  bin: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  leadTimeDays: number;
  rating: number;
  paymentTerms: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  category?: Category;
  subcategoryId?: string;
  brandId?: string;
  supplierId?: string;
  supplier?: string;
  warehouseId?: string;
  locationBin?: string;
  barcode?: string;
  description?: string;
  costPrice: number;
  sellingPrice: number;
  taxRate?: number;
  quantity: number;
  minStock: number;
  maxStock: number;
  reorderLevel?: number;
  reorderQty?: number;
  unit: string;
  image?: string;
  imageUrl?: string;
  leadTimeDays?: number;
  hsnCode?: string;
  status?: 'Active' | 'Inactive' | 'Draft';
  createdAt?: string;
}

export interface POLineItem {
  id?: string;
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  totalAmount: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  warehouseId: string;
  orderDate: string;
  expectedDate: string;
  status: 'Draft' | 'Sent' | 'Approved' | 'Received' | 'Cancelled';
  paymentTerms: string;
  notes?: string;
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  items: POLineItem[];
  createdAt: string;
}

export interface StockMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'RETURN';
  quantity: number;
  referenceNo: string;
  warehouseId: string;
  warehouseName: string;
  reason?: string;
  recordedBy: string;
}

export interface StockTransfer {
  id: string;
  transferNo: string;
  date: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  items: { productId: string; sku: string; name: string; quantity: number }[];
  status: 'Pending' | 'In Transit' | 'Completed' | 'Cancelled';
  notes?: string;
  createdBy: string;
}

export interface StockAdjustment {
  id: string;
  adjustmentNo: string;
  date: string;
  warehouseId: string;
  productId: string;
  productName: string;
  systemQty: number;
  countedQty: number;
  varianceQty: number;
  reason: string;
  recordedBy: string;
}

export interface Settings {
  companyName: string;
  companyAddress: string;
  currency: string;
  defaultTaxRate: number;
  valuationMethod: 'FIFO' | 'Weighted Average';
  lowStockThresholdPercent: number;
  enableBatchTracking: boolean;
  enableSerialTracking: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

export interface Metrics {
  totalProducts: number;
  totalCategories: number;
  totalValue: number;
  totalCostValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalWarehouses: number;
  totalSuppliers: number;
  pendingPOs: number;
}

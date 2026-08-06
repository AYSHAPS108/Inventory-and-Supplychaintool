export interface Category {
  id: string;
  name: string;
  code: string;
  description: string;
  color: string;
  icon: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  category?: Category;
  barcode?: string;
  description?: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  minStock: number;
  maxStock: number;
  unit: string;
  supplier?: string;
  leadTimeDays?: number;
  locationBin?: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface Metrics {
  totalProducts: number;
  totalCategories: number;
  totalValue: number;
  totalCostValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

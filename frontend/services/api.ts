import { Product, Category, Metrics } from '../types';

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Electronics & Sensors', code: 'ELEC', description: 'Microcontrollers, IoT sensors, PCB assemblies', color: '#6366f1', icon: 'microchip' },
  { id: 'cat-2', name: 'Raw Materials', code: 'RAW', description: 'Steel alloys, aluminum billets, polymer resins', color: '#06b6d4', icon: 'cube' },
  { id: 'cat-3', name: 'Industrial Machinery', code: 'MACH', description: 'Pumps, electric motors, hydraulic valves', color: '#f59e0b', icon: 'cog' },
  { id: 'cat-4', name: 'Packaging & Logistics', code: 'PKG', description: 'Corrugated boxes, wooden pallets, strapping', color: '#10b981', icon: 'box' },
  { id: 'cat-5', name: 'Safety & PPE', code: 'PPE', description: 'Helmets, safety goggles, respirators', color: '#ef4444', icon: 'shield' }
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 'prod-101', sku: 'ELEC-SENS-001', name: 'Industrial Optocoupler Sensor Array', categoryId: 'cat-1', barcode: '8901234567891', description: 'High-precision photoelectric sensor array for automated assembly lines.', costPrice: 42.5, sellingPrice: 78.0, quantity: 145, minStock: 25, maxStock: 500, unit: 'pcs', supplier: 'Apex Automation Corp', leadTimeDays: 7, locationBin: 'A-12-04', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500' },
  { id: 'prod-102', sku: 'MACH-MTR-088', name: '3-Phase AC Induction Motor 5.5kW', categoryId: 'cat-3', barcode: '8901234567892', description: 'Heavy-duty 400V 5.5kW squirrel cage induction motor.', costPrice: 380.0, sellingPrice: 590.0, quantity: 8, minStock: 15, maxStock: 60, unit: 'pcs', supplier: 'Vortex Drives Ltd', leadTimeDays: 14, locationBin: 'B-04-01', imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500' },
  { id: 'prod-103', sku: 'RAW-STL-404', name: '316L Stainless Steel Precision Rods', categoryId: 'cat-2', barcode: '8901234567893', description: 'Corrosion-resistant marine grade stainless steel round bars.', costPrice: 65.0, sellingPrice: 110.0, quantity: 320, minStock: 50, maxStock: 1000, unit: 'pcs', supplier: 'Global Alloy Supplies', leadTimeDays: 5, locationBin: 'R-01-18', imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500' },
  { id: 'prod-104', sku: 'PKG-BOX-500', name: 'Triple-Wall Heavy Duty Shipping Boxes', categoryId: 'cat-4', barcode: '8901234567894', description: 'Export-grade corrugated cardboard boxes for container transport.', costPrice: 2.1, sellingPrice: 4.8, quantity: 1200, minStock: 200, maxStock: 3000, unit: 'boxes', supplier: 'PackRight Logistics', leadTimeDays: 3, locationBin: 'P-08-02', imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500' },
  { id: 'prod-105', sku: 'PPE-HLM-202', name: 'ANSI Z89.1 Hard Hat with Visor Mount', categoryId: 'cat-5', barcode: '8901234567895', description: 'Vented high-density protective helmet with ratchet suspension.', costPrice: 14.2, sellingPrice: 28.5, quantity: 18, minStock: 40, maxStock: 250, unit: 'pcs', supplier: 'SafeGuard PPE Global', leadTimeDays: 4, locationBin: 'S-03-09', imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500' }
];

let categoriesState = [...INITIAL_CATEGORIES];
let productsState = [...INITIAL_PRODUCTS];

export const ApiService = {
  getCategories: async (): Promise<Category[]> => categoriesState,
  
  saveCategory: async (category: Partial<Category>): Promise<Category> => {
    if (category.id) {
      const idx = categoriesState.findIndex(c => c.id === category.id);
      if (idx !== -1) categoriesState[idx] = { ...categoriesState[idx], ...category } as Category;
      return categoriesState[idx];
    } else {
      const newCat: Category = {
        id: 'cat-' + Date.now(),
        name: category.name || 'New Category',
        code: category.code || 'CAT',
        description: category.description || '',
        color: category.color || '#6366f1',
        icon: category.icon || 'folder'
      };
      categoriesState.push(newCat);
      return newCat;
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    categoriesState = categoriesState.filter(c => c.id !== id);
  },

  getProducts: async (): Promise<Product[]> => productsState,

  saveProduct: async (product: Partial<Product>): Promise<Product> => {
    if (product.id) {
      const idx = productsState.findIndex(p => p.id === product.id);
      if (idx !== -1) productsState[idx] = { ...productsState[idx], ...product } as Product;
      return productsState[idx];
    } else {
      const newProd: Product = {
        id: 'prod-' + Date.now(),
        sku: product.sku || 'SKU-000',
        name: product.name || 'New Product',
        categoryId: product.categoryId || 'cat-1',
        costPrice: Number(product.costPrice) || 0,
        sellingPrice: Number(product.sellingPrice) || 0,
        quantity: Number(product.quantity) || 0,
        minStock: Number(product.minStock) || 10,
        maxStock: Number(product.maxStock) || 500,
        unit: product.unit || 'pcs',
        supplier: product.supplier || '',
        locationBin: product.locationBin || '',
        imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500'
      };
      productsState.push(newProd);
      return newProd;
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    productsState = productsState.filter(p => p.id !== id);
  },

  getMetrics: async (): Promise<Metrics> => {
    const totalProducts = productsState.length;
    const totalCategories = categoriesState.length;
    const totalValue = productsState.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);
    const totalCostValue = productsState.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
    const lowStockCount = productsState.filter(p => p.quantity > 0 && p.quantity <= p.minStock).length;
    const outOfStockCount = productsState.filter(p => p.quantity === 0).length;

    return { totalProducts, totalCategories, totalValue, totalCostValue, lowStockCount, outOfStockCount };
  }
};

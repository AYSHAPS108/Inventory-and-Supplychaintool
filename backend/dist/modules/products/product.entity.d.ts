import { Category } from '../categories/category.entity';
export declare class Product {
    id: string;
    sku: string;
    name: string;
    categoryId: string;
    category: Category;
    barcode: string;
    description: string;
    costPrice: number;
    sellingPrice: number;
    quantity: number;
    minStock: number;
    maxStock: number;
    unit: string;
    supplier: string;
    leadTimeDays: number;
    locationBin: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

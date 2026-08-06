import { Product } from '../products/product.entity';
export declare class Category {
    id: string;
    name: string;
    code: string;
    description: string;
    color: string;
    icon: string;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}

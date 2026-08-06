import { Repository } from 'typeorm';
import { Product } from './product.entity';
export declare class ProductsService {
    private productsRepository;
    constructor(productsRepository: Repository<Product>);
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    create(createProductDto: Partial<Product>): Promise<Product>;
    update(id: string, updateProductDto: Partial<Product>): Promise<Product>;
    remove(id: string): Promise<void>;
    getMetrics(): Promise<{
        totalProducts: number;
        totalValue: number;
        totalCostValue: number;
        lowStockCount: number;
        outOfStockCount: number;
    }>;
}

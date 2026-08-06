import { ProductsService } from './products.service';
import { Product } from './product.entity';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<Product[]>;
    getMetrics(): Promise<{
        totalProducts: number;
        totalValue: number;
        totalCostValue: number;
        lowStockCount: number;
        outOfStockCount: number;
    }>;
    findOne(id: string): Promise<Product>;
    create(createProductDto: Partial<Product>): Promise<Product>;
    update(id: string, updateProductDto: Partial<Product>): Promise<Product>;
    remove(id: string): Promise<void>;
}

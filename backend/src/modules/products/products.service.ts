import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['category'] });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async create(createProductDto: Partial<Product>): Promise<Product> {
    const id = createProductDto.id || 'prod-' + Date.now();
    const product = this.productsRepository.create({ id, ...createProductDto });
    return this.productsRepository.save(product);
  }

  async update(id: string, updateProductDto: Partial<Product>): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async getMetrics() {
    const products = await this.findAll();
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (Number(p.sellingPrice) * Number(p.quantity)), 0);
    const totalCostValue = products.reduce((sum, p) => sum + (Number(p.costPrice) * Number(p.quantity)), 0);
    const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity <= p.minStock).length;
    const outOfStockCount = products.filter(p => p.quantity === 0).length;

    return {
      totalProducts,
      totalValue,
      totalCostValue,
      lowStockCount,
      outOfStockCount,
    };
  }
}

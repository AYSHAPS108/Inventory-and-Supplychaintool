import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockAdjustment } from './stock-adjustment.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class StockAdjustmentsService {
  constructor(
    @InjectRepository(StockAdjustment)
    private readonly adjustmentRepository: Repository<StockAdjustment>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<StockAdjustment[]> {
    return this.adjustmentRepository.find({
      relations: ['product', 'warehouse'],
    });
  }

  async findOne(id: string): Promise<StockAdjustment> {
    const adjustment = await this.adjustmentRepository.findOne({
      where: { id },
      relations: ['product', 'warehouse'],
    });
    if (!adjustment) {
      throw new NotFoundException(`Stock Adjustment with ID "${id}" not found`);
    }
    return adjustment;
  }

  async create(createAdjustmentDto: Partial<StockAdjustment>): Promise<StockAdjustment> {
    const id = 'adj-' + Date.now();
    const qtyChange = Number(createAdjustmentDto.quantityChange) || 0;

    if (qtyChange === 0) {
      throw new BadRequestException('Quantity change cannot be zero');
    }

    // Find and validate product
    const product = await this.productRepository.findOne({
      where: { id: createAdjustmentDto.productId, warehouseId: createAdjustmentDto.warehouseId },
    });

    if (!product) {
      throw new NotFoundException('Product not found in specified warehouse');
    }

    // Verify negative stock limit
    if (product.quantity + qtyChange < 0) {
      throw new BadRequestException(`Cannot adjust stock below zero. Current stock: ${product.quantity}, Requested change: ${qtyChange}`);
    }

    // Process adjustment
    const adjustment = this.adjustmentRepository.create({
      ...createAdjustmentDto,
      id,
      quantityChange: qtyChange,
      status: createAdjustmentDto.status || 'Approved',
    });

    const savedAdjustment = await this.adjustmentRepository.save(adjustment);

    // If approved, update active stock immediately
    if (savedAdjustment.status === 'Approved') {
      product.quantity += qtyChange;
      await this.productRepository.save(product);
    }

    return savedAdjustment;
  }

  async approve(id: string, approvedBy?: string): Promise<StockAdjustment> {
    const adjustment = await this.findOne(id);
    if (adjustment.status !== 'Pending Approval') {
      throw new BadRequestException(`Adjustment is already in "${adjustment.status}" status`);
    }

    const product = await this.productRepository.findOne({
      where: { id: adjustment.productId, warehouseId: adjustment.warehouseId },
    });
    if (!product) {
      throw new NotFoundException('Product not found in specified warehouse');
    }

    if (product.quantity + adjustment.quantityChange < 0) {
      throw new BadRequestException(`Cannot approve adjustment. Would result in negative stock. Current stock: ${product.quantity}`);
    }

    adjustment.status = 'Approved';
    adjustment.approvedBy = approvedBy || 'Admin';

    const savedAdjustment = await this.adjustmentRepository.save(adjustment);

    // Apply stock changes
    product.quantity += adjustment.quantityChange;
    await this.productRepository.save(product);

    return savedAdjustment;
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockTransfer } from './stock-transfer.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class StockTransfersService {
  constructor(
    @InjectRepository(StockTransfer)
    private readonly transferRepository: Repository<StockTransfer>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<StockTransfer[]> {
    return this.transferRepository.find({
      relations: ['fromWarehouse', 'toWarehouse', 'product'],
    });
  }

  async findOne(id: string): Promise<StockTransfer> {
    const transfer = await this.transferRepository.findOne({
      where: { id },
      relations: ['fromWarehouse', 'toWarehouse', 'product'],
    });
    if (!transfer) {
      throw new NotFoundException(`Stock Transfer with ID "${id}" not found`);
    }
    return transfer;
  }

  async create(createTransferDto: Partial<StockTransfer>): Promise<StockTransfer> {
    const id = 'tr-' + Date.now();
    const code = createTransferDto.code || 'TR-' + Date.now().toString().slice(-6);

    // Validate product exists in source warehouse and has enough quantity
    const srcProduct = await this.productRepository.findOne({
      where: { id: createTransferDto.productId, warehouseId: createTransferDto.fromWarehouseId },
    });

    if (!srcProduct) {
      throw new BadRequestException('Product not found in source warehouse');
    }

    if (srcProduct.quantity < createTransferDto.quantity) {
      throw new BadRequestException(`Insufficient stock in source warehouse. Available: ${srcProduct.quantity}`);
    }

    const transfer = this.transferRepository.create({
      ...createTransferDto,
      id,
      code,
      status: createTransferDto.status || 'Pending Approval',
    });

    return this.transferRepository.save(transfer);
  }

  async update(id: string, updateTransferDto: Partial<StockTransfer>): Promise<StockTransfer> {
    const transfer = await this.findOne(id);
    Object.assign(transfer, updateTransferDto);
    return this.transferRepository.save(transfer);
  }

  async approve(id: string, approvedBy?: string): Promise<StockTransfer> {
    const transfer = await this.findOne(id);
    if (transfer.status !== 'Pending Approval') {
      throw new BadRequestException(`Transfer cannot be approved in "${transfer.status}" status`);
    }
    transfer.status = 'Approved';
    transfer.approvedBy = approvedBy || 'Admin';
    return this.transferRepository.save(transfer);
  }

  async receiveTransfer(id: string): Promise<StockTransfer> {
    const transfer = await this.findOne(id);
    if (transfer.status !== 'Approved') {
      throw new BadRequestException(`Transfer must be Approved before receiving. Current status: ${transfer.status}`);
    }

    // Deduct from source warehouse product
    const srcProduct = await this.productRepository.findOne({
      where: { id: transfer.productId, warehouseId: transfer.fromWarehouseId },
    });
    if (!srcProduct) {
      throw new NotFoundException('Source product not found');
    }
    if (srcProduct.quantity < transfer.quantity) {
      throw new BadRequestException(`Insufficient stock in source warehouse to fulfill. Available: ${srcProduct.quantity}`);
    }
    srcProduct.quantity -= transfer.quantity;
    await this.productRepository.save(srcProduct);

    // Add to destination warehouse product
    // First try to find existing product with same SKU in the destination warehouse
    let destProduct = await this.productRepository.findOne({
      where: { sku: srcProduct.sku, warehouseId: transfer.toWarehouseId },
    });

    if (!destProduct) {
      // Create new SKU entry for destination warehouse
      const newProdId = 'prod-' + Date.now();
      destProduct = this.productRepository.create({
        sku: srcProduct.sku,
        name: srcProduct.name,
        categoryId: srcProduct.categoryId,
        barcode: srcProduct.barcode,
        description: srcProduct.description,
        costPrice: Number(srcProduct.costPrice) || 0,
        sellingPrice: Number(srcProduct.sellingPrice) || 0,
        minStock: srcProduct.minStock,
        maxStock: srcProduct.maxStock,
        unit: srcProduct.unit,
        supplierId: srcProduct.supplierId,
        id: newProdId,
        warehouseId: transfer.toWarehouseId,
        quantity: transfer.quantity,
        locationBin: 'TBD', // To be designated by staff
      });
    } else {
      destProduct.quantity = (Number(destProduct.quantity) || 0) + transfer.quantity;
    }
    await this.productRepository.save(destProduct);

    transfer.status = 'Completed';
    transfer.completedDate = new Date();

    return this.transferRepository.save(transfer);
  }
}

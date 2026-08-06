import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly poRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private readonly poItemRepository: Repository<PurchaseOrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<PurchaseOrder[]> {
    return this.poRepository.find({
      relations: ['supplier', 'warehouse', 'items', 'items.product'],
    });
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const po = await this.poRepository.findOne({
      where: { id },
      relations: ['supplier', 'warehouse', 'items', 'items.product'],
    });
    if (!po) {
      throw new NotFoundException(`Purchase Order with ID "${id}" not found`);
    }
    return po;
  }

  async create(createPoDto: Partial<PurchaseOrder> & { items: Partial<PurchaseOrderItem>[] }): Promise<PurchaseOrder> {
    const id = 'po-' + Date.now();
    const poNumber = createPoDto.poNumber || 'PO-' + Date.now().toString().slice(-6);

    let totalAmount = 0;
    let taxAmount = 0;
    let discountAmount = 0;

    const items: PurchaseOrderItem[] = [];

    // Construct PO Items
    if (createPoDto.items && createPoDto.items.length > 0) {
      for (const itemDto of createPoDto.items) {
        const item = new PurchaseOrderItem();
        item.id = 'poitem-' + Math.random().toString(36).slice(2, 11);
        item.purchaseOrderId = id;
        item.productId = itemDto.productId;
        item.quantity = Number(itemDto.quantity) || 0;
        item.price = Number(itemDto.price) || 0;
        item.taxRate = Number(itemDto.taxRate) || 18.00;
        item.discountRate = Number(itemDto.discountRate) || 0.00;

        const subtotal = item.price * item.quantity;
        const discount = subtotal * (item.discountRate / 100);
        const tax = (subtotal - discount) * (item.taxRate / 100);

        totalAmount += (subtotal - discount + tax);
        taxAmount += tax;
        discountAmount += discount;

        items.push(item);
      }
    }

    const po = this.poRepository.create({
      ...createPoDto,
      id,
      poNumber,
      totalAmount,
      taxAmount,
      discountAmount,
      status: createPoDto.status || 'Pending Approval',
      items,
    });

    return this.poRepository.save(po);
  }

  async update(id: string, updatePoDto: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const po = await this.findOne(id);
    Object.assign(po, updatePoDto);
    return this.poRepository.save(po);
  }

  async remove(id: string): Promise<void> {
    const po = await this.findOne(id);
    await this.poRepository.remove(po);
  }

  async approve(id: string): Promise<PurchaseOrder> {
    const po = await this.findOne(id);
    if (po.status !== 'Pending Approval') {
      throw new BadRequestException(`Cannot approve PO that is in "${po.status}" status`);
    }
    po.status = 'Approved';
    return this.poRepository.save(po);
  }

  async receiveGoods(id: string, notes?: string): Promise<PurchaseOrder> {
    const po = await this.findOne(id);
    if (po.status !== 'Approved') {
      throw new BadRequestException(`Cannot receive goods for PO that is in "${po.status}" status (must be Approved)`);
    }

    // Dynamic stock update in transaction
    for (const item of po.items) {
      const product = await this.productRepository.findOne({ where: { id: item.productId } });
      if (product) {
        product.quantity = (Number(product.quantity) || 0) + Number(item.quantity);
        await this.productRepository.save(product);
      }
    }

    po.status = 'Received';
    if (notes) {
      po.notes = po.notes ? po.notes + '\n' + notes : notes;
    }

    return this.poRepository.save(po);
  }
}

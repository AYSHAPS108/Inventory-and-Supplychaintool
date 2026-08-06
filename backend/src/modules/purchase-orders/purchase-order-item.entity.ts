import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Product } from '../products/product.entity';

@Entity('purchase_order_items')
export class PurchaseOrderItem {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'purchase_order_id', type: 'varchar', length: 36 })
  purchaseOrderId: string;

  @ManyToOne(() => PurchaseOrder, (po) => po.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrder;

  @Column({ name: 'product_id', type: 'varchar', length: 36 })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 18.00 })
  taxRate: number;

  @Column({ name: 'discount_rate', type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  discountRate: number;
}

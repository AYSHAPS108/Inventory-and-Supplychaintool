import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

@Entity('stock_adjustments')
export class StockAdjustment {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'product_id', type: 'varchar', length: 36 })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'warehouse_id', type: 'varchar', length: 36 })
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ name: 'quantity_change', type: 'int' })
  quantityChange: number;

  @Column({ type: 'varchar', length: 100 })
  reason: string; // 'Damage', 'Loss', 'Expired', etc.

  @Column({ type: 'varchar', length: 20, default: 'Approved' })
  status: string;

  @Column({ name: 'created_by', type: 'varchar', length: 50, nullable: true })
  createdBy: string;

  @Column({ name: 'approved_by', type: 'varchar', length: 50, nullable: true })
  approvedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

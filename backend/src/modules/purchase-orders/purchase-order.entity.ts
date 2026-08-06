import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Supplier } from '../suppliers/supplier.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'po_number', type: 'varchar', length: 50, unique: true })
  poNumber: string;

  @Column({ name: 'supplier_id', type: 'varchar', length: 36 })
  supplierId: string;

  @ManyToOne(() => Supplier, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ name: 'warehouse_id', type: 'varchar', length: 36 })
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  totalAmount: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  taxAmount: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  discountAmount: number;

  @Column({ type: 'varchar', length: 30, default: 'Pending Approval' })
  status: string;

  @Column({ name: 'order_date', type: 'date', default: () => 'CURRENT_DATE' })
  orderDate: Date;

  @Column({ name: 'expected_date', type: 'date', nullable: true })
  expectedDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => PurchaseOrderItem, (item) => item.purchaseOrder, { cascade: true })
  items: PurchaseOrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

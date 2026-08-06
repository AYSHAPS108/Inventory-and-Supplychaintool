import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Warehouse } from '../warehouses/warehouse.entity';
import { Product } from '../products/product.entity';

@Entity('stock_transfers')
export class StockTransfer {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ name: 'from_warehouse_id', type: 'varchar', length: 36 })
  fromWarehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'from_warehouse_id' })
  fromWarehouse: Warehouse;

  @Column({ name: 'to_warehouse_id', type: 'varchar', length: 36 })
  toWarehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'to_warehouse_id' })
  toWarehouse: Warehouse;

  @Column({ name: 'product_id', type: 'varchar', length: 36 })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'varchar', length: 30, default: 'Pending Approval' })
  status: string;

  @CreateDateColumn({ name: 'request_date' })
  requestDate: Date;

  @Column({ name: 'completed_date', type: 'timestamp with time zone', nullable: true })
  completedDate: Date;

  @Column({ name: 'created_by', type: 'varchar', length: 50, nullable: true })
  createdBy: string;

  @Column({ name: 'approved_by', type: 'varchar', length: 50, nullable: true })
  approvedBy: string;
}

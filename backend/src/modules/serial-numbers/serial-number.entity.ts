import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

@Entity('serial_numbers')
export class SerialNumber {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'product_id', type: 'varchar', length: 36 })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'serial_number', type: 'varchar', length: 100, unique: true })
  serialNumber: string;

  @Column({ type: 'varchar', length: 30, default: 'In Stock' })
  status: string; // 'In Stock', 'Reserved', 'Dispatched', etc.

  @Column({ name: 'warehouse_id', type: 'varchar', length: 36, nullable: true })
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ name: 'location_bin', type: 'varchar', length: 50, nullable: true })
  locationBin: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

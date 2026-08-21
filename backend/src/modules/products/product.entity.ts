import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

@Entity('products')
export class Product {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'category_id', type: 'varchar', length: 36 })
  categoryId: string;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', length: 50, nullable: true })
  barcode: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'cost_price', type: 'decimal', precision: 12, scale: 2, default: 0 })
  costPrice: number;

  @Column({ name: 'selling_price', type: 'decimal', precision: 12, scale: 2, default: 0 })
  sellingPrice: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ name: 'min_stock', type: 'int', default: 10 })
  minStock: number;

  @Column({ name: 'max_stock', type: 'int', default: 500, nullable: true })
  maxStock: number;

  @Column({ name: 'reorder_level', type: 'int', default: 30, nullable: true })
  reorderLevel: number;

  @Column({ name: 'reorder_qty', type: 'int', default: 100, nullable: true })
  reorderQty: number;

  @Column({ type: 'varchar', length: 20, default: 'pcs' })
  unit: string;

  @Column({ name: 'supplier_id', type: 'varchar', length: 36, nullable: true })
  supplierId: string;

  @ManyToOne(() => Supplier, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ name: 'warehouse_id', type: 'varchar', length: 36, nullable: true })
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ name: 'location_bin', type: 'varchar', length: 50, nullable: true })
  locationBin: string;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;

  @Column({ name: 'hsn_code', type: 'varchar', length: 15, nullable: true })
  hsnCode: string;

  @Column({ type: 'varchar', length: 20, default: 'Active' })
  status: string;

  @Column({ type: 'text', nullable: true })
  variants: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

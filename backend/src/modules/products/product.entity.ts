import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';

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

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'RESTRICT' })
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

  @Column({ name: 'max_stock', type: 'int', default: 500 })
  maxStock: number;

  @Column({ type: 'varchar', length: 20, default: 'pcs' })
  unit: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  supplier: string;

  @Column({ name: 'lead_time_days', type: 'int', default: 7 })
  leadTimeDays: number;

  @Column({ name: 'location_bin', type: 'varchar', length: 50, nullable: true })
  locationBin: string;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

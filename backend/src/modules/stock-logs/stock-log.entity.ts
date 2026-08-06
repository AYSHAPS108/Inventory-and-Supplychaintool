import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('stock_logs')
export class StockLog {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'product_id', type: 'varchar', length: 36 })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'change_qty', type: 'int' })
  changeQty: number;

  @Column({ name: 'previous_qty', type: 'int' })
  previousQty: number;

  @Column({ name: 'new_qty', type: 'int' })
  newQty: number;

  @Column({ type: 'varchar', length: 100 })
  reason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Warehouse } from '../warehouses/warehouse.entity';

@Entity('storage_locations')
export class StorageLocation {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'warehouse_id', type: 'varchar', length: 36 })
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  zone: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  aisle: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  rack: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  shelf: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  bin: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

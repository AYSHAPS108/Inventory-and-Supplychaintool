import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ name: 'contact_person', type: 'varchar', length: 100, nullable: true })
  contactPerson: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 15, unique: true, nullable: true })
  gstin: string;

  @Column({ name: 'payment_terms', type: 'varchar', length: 50, default: 'Net 30' })
  paymentTerms: string;

  @Column({ name: 'lead_time_days', type: 'int', default: 7 })
  leadTimeDays: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0 })
  rating: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

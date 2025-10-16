import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('companies')
export class CompanyEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('text', { nullable: true })
  description: string | null;

  @Column('varchar', { length: 255, nullable: true })
  website: string | null;

  @Column('int', { name: 'industry_id', nullable: true })
  industryId: number | null;

  @Column('int', { nullable: true })
  size: number | null;

  @Column('varchar', { name: 'contact_email', length: 255, nullable: true })
  contactEmail: string | null;

  @Column('varchar', { name: 'logo_url', length: 500, nullable: true })
  logoUrl: string | null;

  @Column('varchar', { length: 255, nullable: true })
  address: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'now()',
  })
  updatedAt: Date;
}

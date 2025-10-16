import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyEntity } from './company.entity';
import { JobCategoryEntity } from './job-category.entity';
import { LocationEntity } from './location.entity';

@Entity('jobs')
export class JobEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column('bigint', { name: 'company_id' })
  companyId: string;

  @ManyToOne(() => CompanyEntity, { nullable: false })
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @Column('int', { name: 'category_id', nullable: true })
  categoryId: number | null;

  @ManyToOne(() => JobCategoryEntity, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category?: JobCategoryEntity | null;

  @Column('int', { name: 'location_id', nullable: true })
  locationId: number | null;

  @ManyToOne(() => LocationEntity, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location?: LocationEntity | null;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('text', { nullable: true })
  description: string | null;

  @Column('text', { nullable: true })
  requirements: string | null;

  @Column('varchar', { name: 'location', length: 255, nullable: true })
  locationText: string | null;

  @Column('varchar', { name: 'employment_type', length: 50, nullable: true })
  employmentType: string | null;

  @Column('varchar', { name: 'experience_level', length: 50, nullable: true })
  experienceLevel: string | null;

  @Column('numeric', { name: 'salary_min', precision: 15, scale: 0, nullable: true })
  salaryMin: string | null;

  @Column('numeric', { name: 'salary_max', precision: 15, scale: 0, nullable: true })
  salaryMax: string | null;

  @Column('varchar', { name: 'salary_currency', length: 3, nullable: true })
  salaryCurrency: string | null;

  @Column('varchar', { name: 'application_method', length: 50, nullable: true })
  applicationMethod: string | null;

  @Column('varchar', { name: 'application_url', length: 500, nullable: true })
  applicationUrl: string | null;

  @Column('varchar', { name: 'application_email', length: 255, nullable: true })
  applicationEmail: string | null;

  @Column('bigint', { name: 'apply_count', nullable: true })
  applyCount: string | null;

  @Column('timestamp', { nullable: true })
  deadline: Date | null;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  @Column('varchar', { name: 'created_by', nullable: true })
  createdBy: string | null;

  @Column('varchar', { name: 'updated_by', nullable: true })
  updatedBy: string | null;

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

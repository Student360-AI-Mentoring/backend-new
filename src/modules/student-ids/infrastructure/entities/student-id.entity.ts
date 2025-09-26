import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('national_student_ids')
export class StudentIdEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar', { name: 'full_name', nullable: true })
  fullName: string;

  @Column('date', { name: 'date_of_birth', nullable: true })
  dateOfBirth: Date;

  @Column('varchar', { nullable: true })
  university: string;

  @Column('varchar', { nullable: true })
  major: string;

  @Column('int', { name: 'enrollment_year', nullable: true })
  enrollmentYear: number;

  @Column('int', { name: 'graduation_year', nullable: true })
  graduationYear: number;

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

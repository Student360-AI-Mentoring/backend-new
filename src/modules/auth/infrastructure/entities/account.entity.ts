import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { AccountTypeEntity } from './account-type.entity';
import { UserTokenEntity } from './user-token.entity';
import { StudentIdEntity } from '../../../student-ids/infrastructure/entities/student-id.entity';

@Entity('accounts')
export class AccountEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar', { name: 'national_student_id', nullable: true })
  nationalStudentId: string | null;

  @ManyToOne(() => StudentIdEntity, { nullable: true })
  @JoinColumn({ name: 'national_student_id', referencedColumnName: 'id' })
  nationalStudent?: StudentIdEntity;

  @Column('varchar', { name: 'external_id', nullable: true })
  externalId: string | null;

  @Column('int', { name: 'account_type_id' })
  accountTypeId: number;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar', { name: 'password_hash' })
  passwordHash: string;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  @Column('boolean', { name: 'is_verified', default: false })
  isVerified: boolean;

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

  // Relations
  @ManyToOne(() => AccountTypeEntity)
  @JoinColumn({ name: 'account_type_id' })
  accountType?: AccountTypeEntity;

  @OneToMany(() => UserTokenEntity, (token) => token.account)
  tokens?: UserTokenEntity[];
}

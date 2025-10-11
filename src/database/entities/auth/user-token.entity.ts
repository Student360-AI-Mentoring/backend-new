import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('user_tokens')
export class UserTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'account_id' })
  accountId: string;

  @Column('varchar', { name: 'refresh_token' })
  refreshToken: string;

  @Column('timestamp', { name: 'expires_at' })
  expiresAt: Date;

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
  @ManyToOne(() => AccountEntity, (account) => account.tokens)
  @JoinColumn({ name: 'account_id' })
  account?: AccountEntity;
}

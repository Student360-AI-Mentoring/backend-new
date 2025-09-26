import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('account_types')
export class AccountTypeEntity {
  @PrimaryColumn('int')
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;
}

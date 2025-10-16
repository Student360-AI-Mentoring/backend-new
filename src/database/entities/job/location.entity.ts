import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('locations')
export class LocationEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { length: 100, unique: true })
  name: string;
}

import { Column } from 'typeorm';
import { BaseEntity } from './entity.base';

export class BusinessCategoryEnum extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', unique: true, nullable: false })
  name: string;
}

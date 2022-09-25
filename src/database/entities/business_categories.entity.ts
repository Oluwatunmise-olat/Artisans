import { Column, Entity } from 'typeorm';

import { BaseEntity } from './entity.base';

@Entity({ name: 'business_categories' })
export class BusinessCategory extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', unique: true, nullable: false })
  name: string;
}

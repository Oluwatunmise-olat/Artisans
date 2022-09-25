import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BusinessCategory } from './business_categories.entity';
import { BaseEntity } from './entity.base';
import { Users } from './users.entity';

@Entity({ name: 'business' })
export class Business extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  @Column({ nullable: true, type: 'varchar', length: 1000 })
  avatar?: string;

  @Column({ type: 'tinyint', name: 'is_verified', default: false })
  is_verified: boolean;

  @Column({ comment: 'Business catch phrase', name: 'tag', type: 'text' })
  tag: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  user_id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  category_id: string;

  @OneToOne(() => Users, (user) => user.uuid)
  @JoinColumn({ referencedColumnName: 'uuid', name: 'user_id' })
  user: Users;

  @OneToOne(() => BusinessCategory, (businessCategory) => businessCategory.uuid)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'uuid' })
  category: BusinessCategory;
}

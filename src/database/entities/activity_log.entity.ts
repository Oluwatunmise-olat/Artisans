import { Column, Entity } from 'typeorm';

import { ActivityLogEnum } from '../../typings';
import { BaseEntity } from './entity.base';

@Entity({ name: 'activity_log' })
export class ActivityLogs extends BaseEntity {
  @Column({ type: 'boolean', default: false, name: 'type' })
  is_read: boolean;

  @Column({
    type: 'enum',
    enumName: 'activity_log.type',
    enum: Object.values(ActivityLogEnum),
    nullable: false,
  })
  type: ActivityLogEnum;

  @Column({ type: 'uuid', nullable: false, name: 'activity_id' })
  activity_id: string;

  @Column({ name: 'user_id', nullable: false, type: 'uuid' })
  user_id: string;
}

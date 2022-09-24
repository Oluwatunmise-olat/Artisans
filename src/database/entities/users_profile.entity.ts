import { ActivitySubscriptionEnum } from 'src/typings';
import { Column } from 'typeorm';
import { BaseEntity } from './entity.base';

export class UsersProfile extends BaseEntity {
  @Column({
    name: 'activities_subscribed',
    enumName: 'users_profile.activities_subscribed',
    enum: Object.values(ActivitySubscriptionEnum),
    type: 'enum',
    nullable: false,
  })
  activities_subscribed: Array<ActivitySubscriptionEnum>;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  user_id: string;
}

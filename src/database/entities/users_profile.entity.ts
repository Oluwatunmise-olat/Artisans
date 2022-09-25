import { ActivitySubscriptionEnum } from 'src/typings';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './entity.base';
import { Users } from './users.entity';
@Entity({ name: 'users_profile' })
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

  @OneToOne(() => Users, (user) => user.uuid)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}

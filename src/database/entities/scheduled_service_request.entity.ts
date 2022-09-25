import { ScheduledServicePeriodicRequestEnum } from 'src/typings';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Business } from './business.entity';
import { BaseEntity } from './entity.base';
import { Users } from './users.entity';

@Entity({ name: 'scheduled_service_request' })
export class ScheduledServiceRequest extends BaseEntity {
  @Column({ name: 'title', nullable: false, type: 'varchar' })
  title: string;

  @Column({
    name: 'every',
    type: 'enum',
    enum: Object.values(ScheduledServicePeriodicRequestEnum),
    enumName: 'scheduled_service_request.every',
  })
  every: ScheduledServicePeriodicRequestEnum;

  @Column({ name: 'reoccurs', nullable: false, type: 'integer' })
  reoccurs: number;

  @Column({ type: 'tinyint', nullable: false, name: 'active' })
  active: boolean;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'start_date',
  })
  start_date: Date;

  @Column({ name: 'business_id', type: 'uuid', nullable: false })
  business_id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  user_id: string;

  @ManyToOne(() => Business, (business) => business.uuid)
  @JoinColumn({ name: 'business_id', referencedColumnName: 'uuid' })
  business: Business;

  @ManyToOne(() => Users, (user) => user.uuid)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'uuid' })
  user: Users;
}

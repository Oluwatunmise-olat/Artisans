import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

import { ServiceRequestStatusEnum } from '../../typings';
import { Business } from './business.entity';
import { BaseEntity } from './entity.base';
import { ServiceFeedback } from './service_feedback.entity';
import { Users } from './users.entity';

@Entity({ name: 'service_requests' })
export class ServiceRequest extends BaseEntity {
  @Column({
    name: 'status',
    type: 'enum',
    enum: Object.values(ServiceRequestStatusEnum),
    enumName: 'service_requests.status',
  })
  status: ServiceRequestStatusEnum;

  @Column({ name: 'title', nullable: false, type: 'varchar' })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: false })
  description: string;

  @Column({ type: 'boolean', name: 'is_scheduled_request', nullable: false })
  is_scheduled_request: boolean;

  @Column({
    type: 'uuid',
    name: 'scheduled_service_request_id',
    nullable: false,
  })
  scheduled_service_request_id: string;

  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  user_id: string;

  @Column({ type: 'uuid', name: 'business_id', nullable: false })
  business_id: string;

  @ManyToOne(() => Business, (business) => business.uuid)
  @JoinColumn({ name: 'business_id', referencedColumnName: 'uuid' })
  business: Business;

  @ManyToOne(() => Users, (user) => user.uuid)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'uuid' })
  user: Users;

  feedbacks: ServiceFeedback[];
}

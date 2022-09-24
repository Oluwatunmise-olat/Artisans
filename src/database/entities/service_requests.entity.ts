import { ServiceRequestStatusEnum } from 'src/typings';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './entity.base';

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

  @Column({ type: 'tinyint', name: 'is_scheduled_request', nullable: false })
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
}

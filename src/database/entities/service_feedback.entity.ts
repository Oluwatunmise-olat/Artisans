import { Max, Min } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from './entity.base';
import { ServiceRequest } from './service_requests.entity';

@Entity({ name: 'service_feedback' })
export class ServiceFeedback extends BaseEntity {
  @Min(0, { message: 'Minimum rating value is 0' })
  @Max(5, { message: 'Maximum rating value is 5' })
  @Column({ type: 'integer', nullable: false })
  rating: number;

  @Column({ name: 'review', nullable: true, type: 'text' })
  review: string;

  @Column({ type: 'uuid', nullable: false, name: 'service_request_id' })
  service_request_id: string;

  @OneToOne(() => ServiceRequest, (serviceReq) => serviceReq.uuid)
  @JoinColumn({ name: 'service_request_id', referencedColumnName: 'uuid' })
  service_request: ServiceRequest;
}

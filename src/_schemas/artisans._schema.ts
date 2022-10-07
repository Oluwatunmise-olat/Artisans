import { ServiceRequest } from 'src/database/entities';
import { ServiceRequestStatusEnum } from 'src/typings';

export class ServiceRequested {
  title: string;
  response: ServiceRequestStatusEnum;
  userId: string;
  businessId: string;
  serviceRequestId: string;

  constructor(data: ServiceRequest) {
    if (data) {
      this.response = data.status;
      this.serviceRequestId = data.uuid;
      this.userId = data.user_id;
      this.businessId = data.business_id;
      this.title = data.title;
    }
    return;
  }
}

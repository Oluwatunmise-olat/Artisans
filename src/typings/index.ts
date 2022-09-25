// Entity Typings

export enum UsersAccountTypeEnum {
  ADMIN = 'admin',
  BUSINESS = 'business',
  USER = 'user',
}

export enum ActivityLogEnum {
  CHAT = 'chat',
  SERVICE_REQUEST_ACCEPTED = 'service_request_accepted',
  SERVICE_REQUEST_DECLINED = 'service_request_declined',
  SERVICE_REQUEST_COMPLETED = 'service_request_completed',
  SERVICE_REQUEST_SCHEDULED = 'service_request_scheduled',
}

export enum ScheduledServicePeriodicRequestEnum {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export enum ServiceRequestStatusEnum {
  ACCEPTED = 'accepted',
  BOOKED = 'booked',
  CANCELED = 'canceled',
  DONE = 'done',
  PENDING = 'pending',
}

export enum ActivitySubscriptionEnum {
  EMAIL = 'email',
  CHAT = 'chat',
  SERVICE_REQUESTS = 'service_requests',
}

// Response Typings
export interface IAPIResponse {
  status: boolean;
  message: string;
  data?: any;
}
export interface JWT_TOKEN {
  email: string;
  uuid: string;
  type: UsersAccountTypeEnum;
}

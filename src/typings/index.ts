export enum UsersAccountTypeEnum {
  ADMIN = 'admin',
  BUSINESS = 'business',
  USER = 'user',
}

export interface IAPIResponse {
  status: boolean;
  message: string;
  data?: any;
}
export interface JWT_TOKEN {
  email: string;
  uuid: string;
}

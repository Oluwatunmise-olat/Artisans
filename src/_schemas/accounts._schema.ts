import { Exclude } from 'class-transformer';

import { Business, Users } from 'src/database/entities';

export class UserAccountCreated {
  userId: string;
  email: string;
  @Exclude()
  private readonly user: Users;

  constructor(data: Users) {
    if (data) {
      this.user = data;
      this.email = this.user.email;
      this.userId = this.user.uuid;
    }
    return;
  }
}
export class BusinessAccountCreated {
  businessId: string;
  userId: string;
  name: string;
  @Exclude()
  private readonly business: Business;

  constructor(data: Business) {
    if (data) {
      this.userId = data.user_id;
      this.businessId = data.uuid;
      this.name = data.name;
    }
    return;
  }
}

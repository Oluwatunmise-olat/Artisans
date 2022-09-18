import { Column, Entity } from 'typeorm';

import { UsersAccountTypeEnum } from 'src/typings';
import { BaseEntity } from './entity.base';

@Entity({ name: 'users' })
export class Users extends BaseEntity {
  @Column({ nullable: false, name: 'first_name' })
  first_name: string;

  @Column({ nullable: false, name: 'last_name' })
  last_name: string;

  @Column({ nullable: true, name: 'avatar' })
  avatar: string;

  @Column({
    nullable: false,
    name: 'account_type',
    enum: Object.values(UsersAccountTypeEnum),
    enumName: 'users.account_type',
  })
  account_type: string;

  @Column({ nullable: false, name: 'email', unique: true })
  email: string;

  @Column({ nullable: false, name: 'phone' })
  phone: string;

  @Column({ nullable: true, name: 'is_email_verified', default: false })
  is_email_verified: boolean;

  @Column({ nullable: false, name: 'is_phone_verified', default: false })
  is_phone_verified: boolean;

  @Column({ name: 'password', nullable: false })
  password: string;
}

import {
  ArrayNotEmpty,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';

import { ActivitySubscriptionEnum } from 'src/typings';
import { IsUserExistsWithEmail } from '../../custom-validators/providers';

export class AccountSignUpDto {
  @IsNotEmpty({})
  @IsString({})
  first_name: string;

  @IsNotEmpty({})
  @IsString({})
  last_name: string;

  @IsNotEmpty({})
  @IsEmail({})
  @Validate(IsUserExistsWithEmail)
  email: string;

  @IsNotEmpty({})
  @IsString({})
  phone: string;

  @IsNotEmpty({})
  @IsString({})
  password: string;
}

export class AccountLoginDto {
  @IsNotEmpty({})
  @IsEmail({})
  email: string;

  @IsNotEmpty({})
  @IsString({})
  password: string;
}

export class UpdateUserProfileDto {
  @IsEnum(ActivitySubscriptionEnum, { each: true })
  @ArrayNotEmpty()
  @IsOptional()
  activities_subscribed_to: ActivitySubscriptionEnum[];

  @IsOptional()
  @IsNotEmpty({})
  @IsString({})
  first_name: string;

  @IsOptional()
  @IsNotEmpty({})
  @IsString({})
  last_name: string;
}

export class AccountVerificationDto {}

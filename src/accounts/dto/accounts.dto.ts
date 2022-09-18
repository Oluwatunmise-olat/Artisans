import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
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

  // perform phone transformation
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

export class AccountVerificationDto {}

import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AccountSignUpDto } from './accounts.dto';

export class BusinessCreationDto extends PickType(AccountSignUpDto, [
  'email',
  'first_name',
  'last_name',
  'password',
  'phone',
]) {
  // unique business name
  @IsNotEmpty({})
  @IsString({})
  business_name: string;

  @IsNotEmpty({})
  @IsString({})
  tag: string;

  @IsNotEmpty({})
  @IsString({})
  category_id: string;
}

export class UpdateBusinessProfileDto {
  @IsOptional()
  @IsNotEmpty({})
  @IsString({})
  business_name: string;

  @IsOptional()
  @IsNotEmpty({})
  @IsString({})
  tag: string;
}

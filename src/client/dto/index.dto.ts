import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateServiceRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  artisan_id: string;

  @IsBoolean()
  @IsOptional()
  is_scheduled_request: boolean;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((validationSchema) => validationSchema.is_scheduled_request)
  scheduled_request_id: string;
}

export class CreateServiceRequestFeedbackDto {
  @IsNumber()
  @Max(5)
  @Min(0)
  rating: number;

  @IsString()
  @IsNotEmpty()
  review: string;
}

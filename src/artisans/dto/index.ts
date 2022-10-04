import { IsEnum } from 'class-validator';
import { ServiceRequestStatusEnum } from 'src/typings';

export class ServiceRequestResponseDto {
  @IsEnum(ServiceRequestStatusEnum)
  status: ServiceRequestStatusEnum;
}

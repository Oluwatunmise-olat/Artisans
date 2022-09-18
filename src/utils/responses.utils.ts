import { Injectable } from '@nestjs/common';
import { IAPIResponse } from 'src/typings';

@Injectable()
export class APIResponse {
  success(message?: string, data?: any): IAPIResponse {
    return { status: true, message, data };
  }

  error(message?: string, data?: any): IAPIResponse {
    return { status: false, message, data };
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { IAPIResponse } from 'src/typings';

@Injectable()
export class APIResponse {
  resolve({
    statusCode,
    message,
    data,
  }: {
    statusCode: HttpStatus;
    message?: string;
    data?: any;
  }) {
    const usedSuccessRanges = {
      200: HttpStatus.OK,
      201: HttpStatus.CREATED,
      202: HttpStatus.ACCEPTED,
      203: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
      204: HttpStatus.NO_CONTENT,
    };

    if (usedSuccessRanges[statusCode]) {
      return this.success(message, data);
    }

    return this.error(message, data);
  }

  success(message?: string, data?: any): IAPIResponse {
    return { status: true, message, data };
  }

  error(message?: string, data?: any): IAPIResponse {
    return { status: false, message, data };
  }
}

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UsersAccountTypeEnum } from 'src/typings';

// can be switched to use nestjs reflection and meatdata

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(
    private readonly permittedRoles:
      | UsersAccountTypeEnum
      | UsersAccountTypeEnum[],
  ) {
    if (!Array.isArray(this.permittedRoles)) {
      this.permittedRoles = [this.permittedRoles];
    }
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest();

    const { user } = request;

    if (!this.permittedRoles.includes(user.account_type)) {
      throw new HttpException(
        {
          message: 'Unauthorized to access resource',
          statusCode: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}

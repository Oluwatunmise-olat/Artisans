import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';
import * as passport from 'passport';
import { Request, Response } from 'express';

import { BASIC_AUTH_TOKEN, JWT_AUTH_TOKEN } from '../providers/constants';
import { validateDto } from 'src/custom-validators/providers';
import { AccountLoginDto } from '../dto/accounts.dto';

export const AuthGuard = (guardType: 'basic' | 'jwt') => {
  const strategyToken =
    guardType === 'basic' ? BASIC_AUTH_TOKEN : JWT_AUTH_TOKEN;

  @Injectable()
  class PassportAuthGuards {
    async canActivate(context: ExecutionContext) {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest<Request>();
      const response = ctx.getResponse<Response>();

      if (guardType === 'basic') {
        await this.validateBody(request.body);
      }

      const user = await this.authStatus(request, response, strategyToken);
      request.user = user;

      return true;
    }

    async validateBody(data: any) {
      const { status, message } = await validateDto(AccountLoginDto, data);

      if (!status) {
        throw new HttpException({ message }, HttpStatus.BAD_REQUEST);
      }
    }

    async authStatus(
      request: Request,
      response: Response,
      strategyToken: string,
    ) {
      return new Promise((resolve, reject) => {
        passport.authenticate(
          strategyToken,
          {
            session: false,
            failWithError: true,
          },
          (error, payload) => {
            if (error || !payload) {
              reject(error ? error : new UnauthorizedException());
            }
            resolve(payload);
          },
        )(request, response);
      });
    }
  }

  return PassportAuthGuards;
};

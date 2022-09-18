import { Injectable, mixin, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import * as passport from 'passport';

import { JWT_AUTH_TOKEN } from './constants';
import { AccountsService } from '../accounts.service';

@Injectable()
export class JWTAuthStrategy extends Strategy {
  name = JWT_AUTH_TOKEN;

  constructor(
    private readonly configService: ConfigService,
    private readonly accountService: AccountsService,
  ) {
    const callback = async (token, doneCallBack: VerifiedCallback) => {
      try {
        const { instance } = await this.accountService.userExists({
          email: token.email,
        });

        if (!instance) {
          throw new UnauthorizedException();
        }

        return doneCallBack(null, instance);
      } catch (error) {
        doneCallBack(error, null);
      }
    };

    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        secretOrKey: configService.get('SECRET_KEY', { infer: true }),
        passReqToCallback: false,
      },
      callback,
    );

    passport.use(this.name, this);
  }
}

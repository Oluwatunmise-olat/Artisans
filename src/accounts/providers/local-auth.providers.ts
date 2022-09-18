import { Strategy } from 'passport-local';
import * as passport from 'passport';
import { Inject, Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts.service';

import { BASIC_AUTH_TOKEN } from './constants';
import { VerifiedCallback } from 'passport-jwt';

@Injectable()
export class BasicAuthStrategy extends Strategy {
  name = BASIC_AUTH_TOKEN;

  constructor(@Inject(AccountsService) accountService: AccountsService) {
    const callback = async (
      usernameField: string,
      passwordField: string,
      doneCallBack: VerifiedCallback,
    ) => {
      try {
        const user = await accountService.validateUser(
          usernameField,
          passwordField,
        );
        doneCallBack(null, user);
      } catch (error) {
        doneCallBack(error, null);
      }
    };

    super({ usernameField: 'email', passwordField: 'password' }, callback);

    passport.use(this.name, this);
  }
}

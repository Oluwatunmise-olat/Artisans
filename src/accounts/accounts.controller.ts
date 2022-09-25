import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { AccountsService } from './accounts.service';
import { AccountSignUpDto, UpdateUserProfileDto } from './dto/accounts.dto';
import { UsersAccountTypeEnum } from '../typings';
import { APIResponse } from 'src/utils';
import { AuthGuard } from './guards';
import {
  BusinessCreationDto,
  UpdateBusinessProfileDto,
} from './dto/business.dto';
import { UserTypeGuard } from './providers';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountService: AccountsService,
    private apiResponse: APIResponse,
  ) {}

  @Post('signup')
  async signUp(@Res() res: Response, @Body() payload: AccountSignUpDto) {
    const { message, data, statusCode } = await this.accountService.createUser({
      ...payload,
      account_type: UsersAccountTypeEnum.USER,
    });

    return res.status(statusCode).send(this.apiResponse.success(message, data));
  }

  @Post('business/signup')
  async signUpAsBusiness(
    @Res() res: Response,
    @Body() payload: BusinessCreationDto,
  ) {
    const { statusCode, data, message } =
      await this.accountService.createBusinessAccount({ payload });

    return res
      .status(statusCode)
      .send(this.apiResponse.resolve({ message, data, statusCode }));
  }

  @Post('login')
  @UseGuards(AuthGuard('basic'))
  async signIn(@Req() req: Request, @Res() res: Response) {
    const { message, data, statusCode } = await this.accountService.login(
      req.user,
    );

    return res.status(statusCode).send(this.apiResponse.success(message, data));
  }

  @Post('business/login')
  @UseGuards(AuthGuard('basic'))
  async signInAsBusiness(@Req() req: Request, @Res() res: Response) {
    const { message, data, statusCode } = await this.accountService.login(
      req.user,
      UsersAccountTypeEnum.BUSINESS,
    );

    return res.status(statusCode).send(this.apiResponse.success(message, data));
  }

  @Post('switch')
  async switchToUserAccount() {
    // switch business account to user
    throw new Error('not implemented');
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'), new UserTypeGuard(UsersAccountTypeEnum.USER))
  async updateUserProfile(
    @Res() response: Response,
    @Req() request: Request,
    @Body() payload: UpdateUserProfileDto,
  ) {
    const { statusCode, message, data } =
      await this.accountService.updateUserProfile({
        user: request.user,
        payload,
      });

    return response
      .status(statusCode)
      .send(this.apiResponse.success(message, data));
  }

  @Patch('business/profile')
  @UseGuards(AuthGuard('jwt'), new UserTypeGuard(UsersAccountTypeEnum.BUSINESS))
  async updateBusinessProfile(
    @Res() response: Response,
    @Req() request: Request,
    @Body() payload: UpdateBusinessProfileDto,
  ) {
    const { statusCode, message, data } =
      await this.accountService.updateBusinessProfile({
        user: request.user,
        payload,
      });

    return response
      .status(statusCode)
      .send(this.apiResponse.success(message, data));
  }
}

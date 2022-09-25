import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AccountsService } from './accounts.service';
import { AccountLoginDto, AccountSignUpDto } from './dto/accounts.dto';
import { UsersAccountTypeEnum } from '../typings';
import { APIResponse } from 'src/utils';
import { AuthGuard } from './guards';

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

  @Post('login')
  @UseGuards(AuthGuard('basic'))
  async signIn(
    @Req() req: Request,
    @Res() res: Response,
    @Body() payload: AccountLoginDto,
  ) {
    const { message, data, statusCode } = await this.accountService.login(
      req.user,
    );

    return res.status(statusCode).send(this.apiResponse.success(message, data));
  }

  @Post('business')
  async createBusinessAccount(@Body() payload: any, @Res() response: Response) {
    const {} = await this.accountService;
  }

  @Post('business/login')
  @UseGuards(AuthGuard('basic'))
  async signInAsBusiness(
    @Req() req: Request,
    @Res() res: Response,
    @Body() payload: AccountLoginDto,
  ) {
    const { message, data, statusCode } = await this.accountService.login(
      req.user,
      UsersAccountTypeEnum.BUSINESS,
    );

    return res.status(statusCode).send(this.apiResponse.success(message, data));
  }

  // async switchToBusinessAccount() {
  //   return null;
  // }

  // async createBusiness() {}
}

// direct from user creation to business
// move from user to business
// add global exception handlers

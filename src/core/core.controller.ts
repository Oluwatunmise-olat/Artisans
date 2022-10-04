import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthGuard } from 'src/accounts/guards';
import { UserTypeGuard } from 'src/accounts/providers';
import { UsersAccountTypeEnum } from 'src/typings';
import { APIResponse } from 'src/utils';
import { CoreService } from './core.service';

@Controller('core')
export class CoreController {
  constructor(
    private readonly coreService: CoreService,
    private apiResponse: APIResponse,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('business-categories')
  async getAllBusinessCategories(@Res() response: Response) {
    const { statusCode, message, data } =
      await this.coreService.getAllBusinessCategories();

    return response
      .status(statusCode)
      .send(this.apiResponse.resolve({ message, data, statusCode }));
  }

  @UseGuards(
    AuthGuard('jwt'),
    new UserTypeGuard([UsersAccountTypeEnum.USER, UsersAccountTypeEnum.ADMIN]),
  )
  @Get('business-categories/:category_id')
  async getBusinessCategoryArtisans(
    @Res() response: Response,
    @Param('category_id') category_id: string,
  ) {
    const { statusCode, message, data } =
      await this.coreService.getBusinessCategoryArtisans(category_id);

    return response
      .status(statusCode)
      .send(this.apiResponse.resolve({ message, data, statusCode }));
  }

  // logging
  // exception handlers
  // tests -> e2e,integration,unittest
  // scheduled requests
}

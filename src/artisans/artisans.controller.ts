import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthGuard } from 'src/accounts/guards';
import { UserTypeGuard } from 'src/accounts/providers';
import { UsersAccountTypeEnum } from 'src/typings';
import { APIResponse } from 'src/utils';
import { ArtisansService } from './artisans.service';

@Controller('artisans')
export class ArtisansController {
  constructor(
    private readonly artisansService: ArtisansService,
    private apiResponse: APIResponse,
  ) {}

  @UseGuards(AuthGuard('jwt'), new UserTypeGuard(UsersAccountTypeEnum.USER))
  @Get(':artisan_id')
  async getArtisanProfile(
    @Res() response: Response,
    @Param('artisan_id') artisan_id: string,
  ) {
    const { statusCode, message, data } =
      await this.artisansService.getArtisanProfile(artisan_id);

    return response
      .status(statusCode)
      .send(this.apiResponse.resolve({ message, data, statusCode }));
  }
}

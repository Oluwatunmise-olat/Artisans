import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { AuthGuard } from 'src/accounts/guards';
import { UserTypeGuard } from 'src/accounts/providers';
import { UsersAccountTypeEnum } from 'src/typings';
import { APIResponse } from 'src/utils';
import { ArtisansService } from './artisans.service';
import { ServiceRequestResponseDto } from './dto';

@Controller('artisans')
export class ArtisansController {
  constructor(
    private readonly artisansService: ArtisansService,
    private apiResponse: APIResponse,
  ) {}

  @UseGuards(AuthGuard('jwt'), new UserTypeGuard(UsersAccountTypeEnum.BUSINESS))
  @Get('charts')
  async getTopArtisansInField(
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const { statusCode, message, data } =
      await this.artisansService.getTopArtisansInField(request.user);

    return response
      .status(statusCode)
      .send(this.apiResponse.resolve({ message, data, statusCode }));
  }

  @UseGuards(AuthGuard('jwt'), new UserTypeGuard(UsersAccountTypeEnum.BUSINESS))
  @Get('portfolio')
  async getPortfolioStats(@Res() response: Response, @Req() request: Request) {
    const { statusCode, message, data } =
      await this.artisansService.getPortfolioStatistics(request.user);

    return response
      .status(statusCode)
      .send(this.apiResponse.resolve({ message, data, statusCode }));
  }

  @UseGuards(AuthGuard('jwt'), new UserTypeGuard(UsersAccountTypeEnum.BUSINESS))
  @Patch('services/:service_request_id/respond')
  async responseToServiceRequests(
    @Res() response: Response,
    @Req() request: Request,
    @Body() payload: ServiceRequestResponseDto,
    @Param('service_request_id') service_request_id: string,
  ) {
    const { statusCode, message } =
      await this.artisansService.respondToServiceRequests({
        payload,
        serviceReqId: service_request_id,
        user: request.user,
      });

    return response
      .status(statusCode)
      .send(this.apiResponse.resolve({ message, statusCode }));
  }

  @UseGuards(AuthGuard('jwt'), new UserTypeGuard(UsersAccountTypeEnum.BUSINESS))
  @Get('services')
  async getServiceRequests(@Res() response: Response, @Req() request: Request) {
    const { statusCode, message, data } =
      await this.artisansService.getAllServiceRequests(request.user);

    return response
      .status(statusCode)
      .send(this.apiResponse.resolve({ message, data, statusCode }));
  }

  @UseGuards(AuthGuard('jwt'), new UserTypeGuard(UsersAccountTypeEnum.BUSINESS))
  @Get('services/:service_request_id')
  async getServiceRequestDetails(
    @Res() response: Response,
    @Param('service_request_id') service_request_id: string,
  ) {
    const { statusCode, message, data } =
      await this.artisansService.getServiceRequestDetails({
        serviceRequestId: service_request_id,
      });

    return response
      .status(statusCode)
      .send(this.apiResponse.resolve({ message, data, statusCode }));
  }

  @UseGuards(AuthGuard('jwt'), new UserTypeGuard(UsersAccountTypeEnum.USER))
  @Get('/:artisan_id')
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

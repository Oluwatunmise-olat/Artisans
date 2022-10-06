import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Request, Response } from 'express';

import { AuthGuard } from 'src/accounts/guards';
import { UserTypeGuard } from 'src/accounts/providers';
import { UsersAccountTypeEnum } from 'src/typings';
import { APIResponse } from 'src/utils';
import { ClientService } from './client.service';
import {
  CreateServiceRequestDto,
  CreateServiceRequestFeedbackDto,
} from './dto/index.dto';

@Controller('clients')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private apiResponse: APIResponse,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('email.user_created')
  handleUserCreatedEvent(payload: any) {
    console.log(payload.content, '>>>>>');
  }

  @Post('services')
  @UseGuards(AuthGuard('jwt'), new UserTypeGuard(UsersAccountTypeEnum.USER))
  async createServiceRequest(
    @Res() response: Response,
    @Req() request: Request,
    @Body() payload: CreateServiceRequestDto,
  ) {
    const { statusCode, message } =
      await this.clientService.createServiceRequest(payload, request.user);

    return response
      .status(statusCode)
      .send(this.apiResponse.resolve({ message, statusCode }));
  }

  @Get('notifications')
  @UseGuards(AuthGuard('jwt'), new UserTypeGuard(UsersAccountTypeEnum.USER))
  async getActivityLogs(@Res() response: Response, @Req() request: Request) {
    const { message, data, statusCode } =
      await this.clientService.getActivityLogs(request.user);

    return response
      .status(statusCode)
      .send(this.apiResponse.resolve({ message, statusCode, data }));
  }

  @Get('services')
  @UseGuards(AuthGuard('jwt'), new UserTypeGuard(UsersAccountTypeEnum.USER))
  async getAllServiceRequests(
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const { message, data, statusCode } =
      await this.clientService.getAllServiceRequests(request.user);

    return response
      .status(statusCode)
      .send(this.apiResponse.resolve({ message, statusCode, data }));
  }

  @Get('services/:service_request_id')
  @UseGuards(AuthGuard('jwt'), new UserTypeGuard(UsersAccountTypeEnum.USER))
  async getServiceRequestDetails(
    @Res() response: Response,
    @Req() request: Request,
    @Param('service_request_id') service_request_id: string,
  ) {
    const { message, data, statusCode } =
      await this.clientService.getServiceRequestDetails({
        user: request.user,
        serviceRequestId: service_request_id,
      });

    return response
      .status(statusCode)
      .send(this.apiResponse.resolve({ message, statusCode, data }));
  }

  @Post('services/:service_request_id/feedback')
  @UseGuards(AuthGuard('jwt'), new UserTypeGuard(UsersAccountTypeEnum.USER))
  async createServiceRequestFeedback(
    @Res() response: Response,
    @Req() request: Request,
    @Param('service_request_id') service_request_id: string,
    @Body() payload: CreateServiceRequestFeedbackDto,
  ) {
    const { message, statusCode } =
      await this.clientService.createServiceRequestFeedback({
        user: request.user,
        payload,
        serviceRequestId: service_request_id,
      });

    return response
      .status(statusCode)
      .send(this.apiResponse.resolve({ message, statusCode }));
  }
}

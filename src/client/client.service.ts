import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  ActivityLogs,
  Business,
  ScheduledServiceRequest,
  ServiceFeedback,
  ServiceRequest,
  Users,
} from 'src/database/entities';

import { ServiceRequestStatusEnum } from 'src/typings';
import {
  CreateServiceRequestDto,
  CreateServiceRequestFeedbackDto,
} from './dto/index.dto';
import { RabbitMQService } from 'src/utils/rabbit.utils';
import { EventTypes } from 'src/typings/events';
import { ServiceRequested } from 'src/_schemas/artisans._schema';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,

    @InjectRepository(ServiceRequest)
    private readonly serviceReqRepository: Repository<ServiceRequest>,

    @InjectRepository(ScheduledServiceRequest)
    private readonly scheduledServiceReqRepository: Repository<ScheduledServiceRequest>,

    @InjectRepository(ActivityLogs)
    private readonly activityLogsRepository: Repository<ActivityLogs>,

    @InjectRepository(ServiceFeedback)
    private readonly serviceReqFeedbackRepository: Repository<ServiceFeedback>,

    private readonly rabbitService: RabbitMQService,
  ) {}

  async createServiceRequest(payload: CreateServiceRequestDto, user: Users) {
    const artisanExists = await this.businessRepository.findOne({
      where: { uuid: payload.artisan_id, deleted_at: null },
    });
    const DEFAULT_STATUS = ServiceRequestStatusEnum.PENDING;

    if (!artisanExists) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Artisan not found' };
    }

    if (payload.is_scheduled_request) {
      const scheduledRequestExists =
        await this.scheduledServiceReqRepository.findOne({
          where: {
            deleted_at: null,
            uuid: payload.scheduled_request_id,
            user_id: user.uuid,
            business_id: payload.artisan_id,
          },
        });

      if (!scheduledRequestExists)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Scheduled service request not found',
        };
    }

    const serviceRequest = this.serviceReqRepository.create({
      ...payload,
      status: DEFAULT_STATUS,
      user_id: user.uuid,
      business_id: payload.artisan_id,
    });

    const savedServiceReq = await this.serviceReqRepository.save(
      serviceRequest,
    );

    // Emit service requested event to -> business via websocket and save to activity_logs

    this.rabbitService.publish(
      {
        sourceId: user.uuid,
        targetId: artisanExists.uuid,
        payload: new ServiceRequested(savedServiceReq),
      },
      EventTypes.EVENT_SERVICE_REQUEST_A,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Service request sent successfully',
    };
  }

  async getActivityLogs(user: Users) {
    const activities = await this.activityLogsRepository.find({
      where: { deleted_at: null, user_id: user.uuid },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Activity logs fetched successfully',
      data: activities,
    };
  }

  async getAllServiceRequests(user: Users) {
    // and pagination later
    // 12hrs -> am
    // 24hrs -> pm
    const serviceRequests = await this.serviceReqRepository
      .createQueryBuilder('service_requests')
      .leftJoin(
        (queryBuilder) =>
          queryBuilder
            .select(['business.uuid AS business_id', 'users.*'])
            .from(Business, 'business')
            .leftJoin('users', 'users', 'users.uuid = business.user_id'),
        'business_user_profile',
        'business_user_profile.business_id = service_requests.business_id',
      )
      .where('service_requests.deleted_at IS NULL')
      .andWhere('service_requests.user_id = :userId', { userId: user.uuid })
      .select([
        'service_requests.status AS status',
        'service_requests.title AS title',
        `TO_CHAR("service_requests"."created_at", 'FMDay,DDth FMMonth HH12:MI a.m.') AS date`,
        'service_requests.uuid AS uuid',
      ])
      .execute();

    return {
      statusCode: HttpStatus.OK,
      message: 'Service requests fetched successfully',
      data: serviceRequests,
    };
  }

  async getServiceRequestDetails({
    user,
    serviceRequestId,
  }: {
    user: Users;
    serviceRequestId: string;
  }) {
    const serviceRequestDetails = await this.serviceReqRepository
      .createQueryBuilder('service_requests')
      .select([
        'title',
        'description',
        'status',
        `TO_CHAR("service_requests"."created_at", 'FMDay, DDth FMMonth yyyy') AS date`,
        `TO_CHAR("service_requests"."created_at", 'HH12:MI a.m.') AS time`,
      ])
      .where('deleted_at IS NULL')
      .andWhere('user_id = :userId', { userId: user.uuid })
      .andWhere('uuid = :serviceRequestId', { serviceRequestId })
      .execute();

    return {
      statusCode: HttpStatus.OK,
      message: 'Service requests details fetched successfully',
      data: serviceRequestDetails,
    };
  }

  async createServiceRequestFeedback({
    user,
    payload,
    serviceRequestId,
  }: {
    user: Users;
    payload: CreateServiceRequestFeedbackDto;
    serviceRequestId: string;
  }) {
    const serviceReqExists = await this.serviceReqRepository.findOne({
      where: { deleted_at: null, uuid: serviceRequestId, user_id: user.uuid },
    });

    if (!serviceReqExists)
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Unauthorized to perform action',
      };

    const feedbackExists = await this.serviceReqFeedbackRepository.findOne({
      where: {
        deleted_at: null,
        service_request_id: serviceRequestId,
        service_request: { user_id: user.uuid },
      },
    });

    if (!feedbackExists) {
      const feedback = this.serviceReqFeedbackRepository.create({
        ...payload,
        service_request_id: serviceRequestId,
      });
      await this.serviceReqFeedbackRepository.save(feedback);
    }

    return { statusCode: HttpStatus.CREATED, message: 'Feedback received' };
  }
}

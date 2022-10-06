import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Business,
  ServiceFeedback,
  ServiceRequest,
  Users,
} from 'src/database/entities';
import { ServiceRequestStatusEnum } from 'src/typings';
import { ServiceRequestResponseDto } from './dto';

@Injectable()
export class ArtisansService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,

    @InjectRepository(ServiceFeedback)
    private readonly serviceFeedbackRepository: Repository<ServiceFeedback>,

    @InjectRepository(ServiceRequest)
    private readonly serviceReqRepository: Repository<ServiceRequest>,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getArtisanProfile(artisanId: string) {
    const [artisanExists] = await this.usersRepository
      .createQueryBuilder('users')
      .innerJoin(
        (queryBuilder) =>
          queryBuilder
            .select([
              'COUNT(service_requests.*) AS no_of_completed_work',
              'AVG(COALESCE(service_feedback.rating, 0)) AS average_rating',
              'business.user_id AS user_id',
              'business.name AS business_name',
              'business.avatar AS avatar',
              'business.is_verified AS status',
            ])
            .from(Business, 'business')
            .leftJoin(
              'service_requests',
              'service_requests',
              'service_requests.business_id = business.uuid',
            )
            .leftJoin(
              'service_feedback',
              'service_feedback',
              'service_feedback.service_request_id = service_requests.uuid',
            )
            .groupBy('business.uuid')
            .addGroupBy('service_requests.status')
            .having('business.uuid = :artisanId', { artisanId })
            .andHaving('service_requests.status = :workStatus', {
              workStatus: ServiceRequestStatusEnum.DONE,
            }),
        'business_alias',
        'business_alias.user_id = users.uuid',
      )
      .where('users.deleted_at IS NULL')
      .andWhere('business_alias.status IS FALSE')
      .select([
        "CONCAT(users.first_name, ' ',users.last_name) AS full_name",
        'business_alias.business_name AS business_name',
        'business_alias.no_of_completed_work',
        'business_alias.average_rating',
        'business_alias.avatar',
      ])
      .execute();

    if (!artisanExists) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Artisan not found' };
    }

    const lastFiveFeedbacks = await this.serviceFeedbackRepository
      .createQueryBuilder('feedback')
      .innerJoin(
        'service_requests',
        'service_requests',
        'service_requests.uuid = feedback.service_request_id',
      )
      .innerJoin('users', 'users', 'users.uuid = service_requests.user_id')
      .select([
        'CONCAT(users.first_name, users.last_name) AS name',
        'feedback.review AS review',
        'feedback.rating AS rating',
      ])
      .orderBy('feedback.created_at', 'DESC')
      .limit(5)
      .getMany();

    const payload = { ...artisanExists, feedbacks: lastFiveFeedbacks };

    return {
      statusCode: HttpStatus.OK,
      message: 'Artisan details fetched successfully',
      data: payload,
    };
  }

  async getTopArtisansInField(user: Users) {
    const LIMIT = 20;

    const userBusinessCategory = await this.businessRepository.findOne({
      where: { deleted_at: null, user_id: user.uuid },
    });

    const topArtisans = await this.businessRepository
      .createQueryBuilder('business')
      .leftJoin(
        'service_requests',
        'service_requests',
        'service_requests.business_id = business.uuid',
      )
      .leftJoin(
        'service_feedback',
        'service_feedback',
        'service_feedback.service_request_id=service_requests.uuid',
      )
      .having('business.category_id = :category_id', {
        category_id: userBusinessCategory.category_id,
      })
      .andHaving('business.deleted_at IS NULL')
      .andHaving('business.is_verified IS FALSE')
      .groupBy('business.uuid')
      .orderBy('AVG(service_feedback.rating)', 'DESC')
      .select([
        'business.name AS business_name',
        'COALESCE(AVG(service_feedback.rating), 0) AS average_rating',
        'business.uuid AS uuid',
        'business.avatar AS avatar',
      ])
      .limit(LIMIT)
      .execute();

    return {
      statusCode: HttpStatus.OK,
      message: `Top ranked artisans in your field`,
      data: topArtisans,
    };
  }

  async getPortfolioStatistics(user: Users) {
    const { uuid } = await this.businessRepository.findOne({
      where: { deleted_at: null, user_id: user.uuid },
    });

    const groupedServiceRequests: [
      { service_requests_count: string; status: ServiceRequestStatusEnum },
    ] = await this.serviceReqRepository
      .createQueryBuilder('service_requests')
      .groupBy('service_requests.business_id')
      .addGroupBy('service_requests.status')
      .having('business_id = :businessId', {
        businessId: uuid,
      })
      .select(['COUNT(*) as service_requests_count', 'status'])
      .execute();

    let totalServiceRequests = 0;
    let data = {};

    for (const serviceReq of groupedServiceRequests) {
      const title = `total_${serviceReq.status.toLowerCase()}_requests`;

      totalServiceRequests += Number(serviceReq.service_requests_count);
      data = { ...data, [title]: Number(serviceReq.service_requests_count) };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Portfolio fetched successfully',
      data: { ...data, total_service_requests: totalServiceRequests },
    };
  }

  async getAllServiceRequests(user: Users) {
    const { uuid } = await this.businessRepository.findOne({
      where: { deleted_at: null, user_id: user.uuid },
    });

    const serviceRequests = await this.serviceReqRepository
      .createQueryBuilder('service_requests')
      .leftJoin('users', 'users', 'users.uuid = service_requests.user_id')
      .where('service_requests.deleted_at IS NULL')
      .andWhere('service_requests.business_id = :businessId', {
        businessId: uuid,
      })
      .select([
        'service_requests.status AS status',
        'service_requests.title AS title',
        `TO_CHAR("service_requests"."created_at", 'FMDay,DDth FMMonth HH12:MI a.m.') AS date`,
        'service_requests.uuid AS uuid',
        "CONCAT(users.first_name, ' ',users.last_name) AS full_name",
        'users.phone AS phone',
        'users.avatar AS avatar',
      ])
      .execute();

    return {
      statusCode: HttpStatus.OK,
      message: 'Service requests fetched successfully',
      data: serviceRequests,
    };
  }

  async getServiceRequestDetails({
    serviceRequestId,
  }: {
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
        "CONCAT(users.first_name, ' ',users.last_name) AS full_name",
        'users.phone AS phone',
        'users.avatar AS avatar',
      ])
      .leftJoin('users', 'users', 'users.uuid = service_requests.user_id')
      .where('service_requests.deleted_at IS NULL')
      .andWhere('service_requests.uuid = :serviceRequestId', {
        serviceRequestId,
      })
      .execute();

    return {
      statusCode: HttpStatus.OK,
      message: 'Service requests details fetched successfully',
      data: serviceRequestDetails,
    };
  }

  async respondToServiceRequests({
    payload,
    serviceReqId,
    user,
  }: {
    payload: ServiceRequestResponseDto;
    serviceReqId: string;
    user: Users;
  }) {
    const serviceReqExists = await this.serviceReqRepository.findOne({
      where: {
        deleted_at: null,
        uuid: serviceReqId,
        business: { user_id: user.uuid },
      },
    });

    if (serviceReqExists) {
      await this.serviceReqRepository.save({
        ...payload,
        uuid: serviceReqExists.uuid,
      });

      // Emit events based on response
    }

    return { statusCode: HttpStatus.OK, message: 'Service response sent' };
  }
}

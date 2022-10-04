import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Business, ServiceFeedback, Users } from 'src/database/entities';
import { ServiceRequestStatusEnum } from 'src/typings';

@Injectable()
export class ArtisansService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,

    @InjectRepository(ServiceFeedback)
    private readonly serviceFeedbackRepository: Repository<ServiceFeedback>,

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
}

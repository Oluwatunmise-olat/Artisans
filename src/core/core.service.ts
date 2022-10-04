import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Business, BusinessCategory } from 'src/database/entities';

@Injectable()
export class CoreService {
  constructor(
    @InjectRepository(BusinessCategory)
    private readonly businessCategoryRepository: Repository<BusinessCategory>,

    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async getAllBusinessCategories() {
    // pagination can be added later
    const businessCategories = await this.businessCategoryRepository.find({
      where: { deleted_at: null },
      select: { name: true, uuid: true },
      order: { created_at: 'DESC' },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Business categories fetched successfully',
      data: businessCategories,
    };
  }

  async getBusinessCategoryArtisans(businessCategoryId: string) {
    // pagination can be added later
    const categoryArtisans = await this.businessRepository
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
        category_id: businessCategoryId,
      })
      .andHaving('business.deleted_at IS NULL')
      .andHaving('business.is_verified IS FALSE')
      .groupBy('business.uuid')
      .orderBy('AVG(service_feedback.rating)', 'DESC')
      .select([
        'business.name AS business_name',
        'COALESCE(AVG(service_feedback.rating), 0) AS average_rating',
        'business.uuid AS uuid',
      ])
      .execute();

    return {
      statusCode: HttpStatus.OK,
      message: 'Business category artisans fetched successfully',
      data: categoryArtisans,
    };
  }
}

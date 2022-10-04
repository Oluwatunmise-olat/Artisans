import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { ActivitySubscriptionEnum, UsersAccountTypeEnum } from 'src/typings';
import { AccountSignUpDto, UpdateUserProfileDto } from './dto/accounts.dto';
import {
  Business,
  BusinessCategory,
  Users,
  UsersProfile,
} from '../database/entities';
import { Hash, JwtService } from '../utils';
import {
  BusinessCreationDto,
  UpdateBusinessProfileDto,
} from './dto/business.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(UsersProfile)
    private readonly usersProfileRepository: Repository<UsersProfile>,

    @InjectRepository(BusinessCategory)
    private readonly businessCategoryRepository: Repository<BusinessCategory>,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,

    @InjectRepository(Business)
    private readonly businessService: Repository<Business>,

    private readonly hashService: Hash,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(
    payload: AccountSignUpDto & { account_type: UsersAccountTypeEnum },
    create = true,
  ) {
    try {
      const defaultProfileSubscribedEvents = Object.values(
        ActivitySubscriptionEnum,
      );

      const unSavedUser = this.usersRepository.create(payload);

      const userProfile = this.usersProfileRepository.create({
        activities_subscribed: defaultProfileSubscribedEvents,
      });

      unSavedUser.password = await this.hashService.make(unSavedUser.password);

      if (!create) {
        return { data: { unSavedUser, unSavedUserProfile: userProfile } };
      }

      const { uuid } = await this.usersRepository.save(unSavedUser);

      await this.usersProfileRepository.save({
        user_id: uuid,
        activities_subscribed: defaultProfileSubscribedEvents,
      });

      // Emit user welcome email event

      return {
        message: 'Account created',
        data: null,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      // custom http exception and logging
      throw new InternalServerErrorException();
    }
  }

  async login(user: Users, type = UsersAccountTypeEnum.USER) {
    const token = await this.jwtService.generateAccessToken({
      email: user.email,
      uuid: user.uuid,
      type,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'User login success',
      data: { token },
    };
  }

  async createBusinessAccount({ payload }: { payload: BusinessCreationDto }) {
    const { first_name, last_name, email, password, phone } = payload;

    const categoryExists = await this.businessCategoryRepository.findOne({
      where: { uuid: payload.category_id, deleted_at: null },
    });

    if (!categoryExists)
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Category not found',
        data: null,
      };

    const userAccountPayload = await this.createUser(
      {
        account_type: UsersAccountTypeEnum.BUSINESS,
        first_name,
        last_name,
        email,
        password,
        phone,
      },
      false,
    );

    const businessAccountPayload = this.businessService.create({
      name: payload.business_name,
      tag: payload.tag,
      category_id: categoryExists.uuid,
    });

    let businessPayload;

    try {
      await this.entityManager.transaction('SERIALIZABLE', async (trx) => {
        const { uuid } = await trx.save(userAccountPayload.data.unSavedUser);

        await trx.save(UsersProfile, {
          ...userAccountPayload.data.unSavedUserProfile,
          user_id: uuid,
        });

        businessAccountPayload.user_id = uuid;
        businessPayload = await trx.save(businessAccountPayload);
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Business account created',
        data: businessPayload,
      };
    } catch (error) {
      // custom error handling and logging

      throw new InternalServerErrorException();
    }
  }

  async updateUserProfile({
    user,
    payload,
  }: {
    user: Users;
    payload: UpdateUserProfileDto;
  }) {
    if (payload.activities_subscribed_to) {
      await this.usersProfileRepository
        .createQueryBuilder()
        .update({ activities_subscribed: payload.activities_subscribed_to })
        .where('user_id = :user_id', { user_id: user.uuid })
        .execute();
      delete payload.activities_subscribed_to;
    }

    await this.usersRepository.save({
      uuid: user.uuid,
      ...payload,
    });

    const userPayload = await this.usersRepository.findOne({
      where: { uuid: user.uuid, deleted_at: null },
      relations: { profile: true },
      select: {
        uuid: true,
        first_name: true,
        last_name: true,
        is_email_verified: true,
        is_phone_verified: true,
        phone: true,
        email: true,
        avatar: true,
        account_type: true,
        profile: { activities_subscribed: true, uuid: true },
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Users profile updated',
      data: userPayload,
    };
  }

  async updateBusinessProfile({
    user,
    payload,
  }: {
    user: Users;
    payload: UpdateBusinessProfileDto;
  }) {
    const {
      raw: [businessProfile],
    } = await this.businessService
      .createQueryBuilder()
      .update({ ...payload, name: payload.business_name })
      .where('user_id = :user_id', { user_id: user.uuid })
      .andWhere(`deleted_at IS NULL`)
      .returning([
        'uuid',
        'name',
        'avatar',
        'tag',
        'is_verified',
        'category_id',
      ])
      .execute();

    return {
      statusCode: HttpStatus.OK,
      message: 'Business profile updated',
      data: businessProfile,
    };
  }

  async validateUser(usernameField: string, passwordField: string) {
    const { status, instance } = await this.userExists({
      email: usernameField,
    });

    if (!status) {
      throw new UnauthorizedException();
    }

    const passwordMatch = await this.hashService.verify(
      passwordField,
      instance.password,
    );

    if (!passwordMatch) {
      // custom http exception and logging
      throw new UnauthorizedException();
    }

    return instance;
  }

  async userExists({ email }: { email: string }) {
    const userExists = await this.usersRepository.findOneBy({
      email,
      deleted_at: null,
    });

    return { status: !!userExists, instance: userExists };
  }
}

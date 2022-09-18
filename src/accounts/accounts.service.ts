import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersAccountTypeEnum } from 'src/typings';
import { AccountSignUpDto } from './dto/accounts.dto';
import { Users } from '../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hash, JwtService } from '../utils';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly hashService: Hash,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(
    payload: AccountSignUpDto & { account_type: UsersAccountTypeEnum },
  ) {
    try {
      const unSavedUser = this.usersRepository.create(payload);

      unSavedUser.password = await this.hashService.make(unSavedUser.password);

      await this.usersRepository.save(unSavedUser);

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

  async login(user: Users) {
    const token = await this.jwtService.generateAccessToken({
      email: user.email,
      uuid: user.uuid,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'User login success',
      data: { token },
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

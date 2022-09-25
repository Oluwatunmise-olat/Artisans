import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Business,
  BusinessCategory,
  Users,
  UsersProfile,
} from 'src/database/entities';
import { UtilsModule } from 'src/utils/utils.module';
import { BasicAuthStrategy, JWTAuthStrategy } from './providers';

@Module({
  providers: [AccountsService, BasicAuthStrategy, JWTAuthStrategy],
  controllers: [AccountsController],
  imports: [
    TypeOrmModule.forFeature([Users, UsersProfile, BusinessCategory, Business]),
    UtilsModule,
  ],
  exports: [AccountsService],
})
export class AccountsModule {}

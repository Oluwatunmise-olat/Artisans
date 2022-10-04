import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import {
  ActivityLogs,
  Business,
  ScheduledServiceRequest,
  ServiceFeedback,
  ServiceRequest,
} from 'src/database/entities';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  providers: [ClientService],
  controllers: [ClientController],
  imports: [
    TypeOrmModule.forFeature([
      Business,
      ServiceRequest,
      ScheduledServiceRequest,
      ActivityLogs,
      ServiceFeedback,
    ]),
    UtilsModule,
  ],
})
export class ClientModule {}

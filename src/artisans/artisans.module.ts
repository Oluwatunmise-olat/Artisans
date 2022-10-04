import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArtisansService } from './artisans.service';
import { ArtisansController } from './artisans.controller';
import { Business, ServiceFeedback, Users } from 'src/database/entities';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  providers: [ArtisansService],
  controllers: [ArtisansController],
  imports: [
    TypeOrmModule.forFeature([Business, ServiceFeedback, Users]),
    UtilsModule,
  ],
})
export class ArtisansModule {}

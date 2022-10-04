import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business, BusinessCategory } from 'src/database/entities';
import { UtilsModule } from 'src/utils/utils.module';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';

@Module({
  controllers: [CoreController],
  providers: [CoreService],
  imports: [
    TypeOrmModule.forFeature([BusinessCategory, Business]),
    UtilsModule,
  ],
})
export class CoreModule {}

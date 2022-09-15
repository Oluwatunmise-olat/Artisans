import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountsModule } from './accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import EnvValidationSchema from '../env';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./.env'],
      isGlobal: true,
      validationSchema: EnvValidationSchema,
      validationOptions: { allowUnknown: true, abortEarly: false },
    }),
    AccountsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_DB_HOST'),
        port: Number(configService.get('POSTGRES_DB_PORT')),
        username: configService.get('POSTGRES_DB_USER'),
        password: configService.get('POSTGRES_DB_PASSWORD'),
        database: configService.get('POSTGRES_DB_NAME'),
        entities: [__dirname + './database/entities/*.entity.{ts,js'],
        synchronize: false,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

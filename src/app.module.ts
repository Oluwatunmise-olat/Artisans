import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountsModule } from './accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import EnvValidationSchema from '../env';
import { UtilsModule } from './utils/utils.module';
import { CustomValidatorsModule } from './custom-validators/validators.module';
import { CoreModule } from './core/core.module';
import { ClientModule } from './client/client.module';
import { ArtisansModule } from './artisans/artisans.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./.env'],
      isGlobal: true,
      validationSchema: EnvValidationSchema,
      validationOptions: { allowUnknown: true, abortEarly: false },
    }),
    AccountsModule,
    UtilsModule,
    CustomValidatorsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_DB_HOST'),
          port: Number(configService.get('POSTGRES_DB_PORT')),
          username: configService.get('POSTGRES_DB_USER'),
          password: configService.get('POSTGRES_DB_PASSWORD'),
          database: configService.get('POSTGRES_DB_NAME'),
          autoLoadEntities: true,
          synchronize: false,
          metadataTableName: 'migrations',
          migrations: [__dirname + '/../src/database/migrations/*{.ts,.js}'],
          cli: {
            migrationsDir: __dirname + '/../src/database/migrations',
          },
        };
      },
    }),
    CoreModule,
    ConfigModule,
    ClientModule,
    ArtisansModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

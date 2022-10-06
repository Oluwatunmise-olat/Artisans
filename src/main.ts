import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';
import { CustomValidatorsModule } from './custom-validators/validators.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  useContainer(app.select(CustomValidatorsModule), { fallbackOnErrors: true }); // allows for dependency injection in class-validator
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();

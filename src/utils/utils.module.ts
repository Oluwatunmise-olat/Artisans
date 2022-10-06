import {
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { Queues } from 'src/typings/events';
import { Hash, APIResponse, JwtService } from '.';
import { RabbitMQService } from './rabbit.utils';

@Module({
  providers: [APIResponse, Hash, JwtService, RabbitMQService],
  exports: [APIResponse, Hash, JwtService, RabbitMQService],
})
export class UtilsModule
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private rabbitmqService: RabbitMQService;
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown(signal?: string) {
    await this.rabbitmqService.disconnectClient();
  }

  async onApplicationBootstrap() {
    this.rabbitmqService = await this.moduleRef.get<RabbitMQService>(
      RabbitMQService,
    );

    await this.rabbitmqService.connectClient();

    await this.initConsumers();
  }

  private async initConsumers() {
    /**
     * Register Queues to consume from
     *
     * @example await this.rabbitmqService.consume(Queues.EMAIL_QUEUE);
     */

    return;
  }
}

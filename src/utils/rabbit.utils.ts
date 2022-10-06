import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Queues } from 'src/typings/events';
import { RabbitMQManager } from './transport/rabbitmq-manager';

@Injectable({ scope: Scope.DEFAULT })
export class RabbitMQService {
  private rabbitClient: RabbitMQManager;

  constructor(
    private readonly configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    const USER = this.configService.get('RABBIT_MQ_USERNAME');
    const PASSWORD = this.configService.get('RABBIT_MQ_PASSWORD');
    const HOST = this.configService.get('RABBIT_MQ_HOST');
    const PORT = this.configService.get('RABBIT_MQ_PORT');
    const PROTOCOL = this.configService.get('RABBIT_MQ_PROTOCOL');

    this.rabbitClient = new RabbitMQManager(
      {
        username: USER,
        password: PASSWORD,
        host: HOST,
        port: PORT,
        protocol: PROTOCOL,
      },
      this.eventEmitter,
    );
  }

  public async connectClient() {
    await this.rabbitClient.connect();
  }

  public async disconnectClient() {
    await this.rabbitClient.disconnect();
  }

  public publish(message: any, routingKey: string) {
    return this.rabbitClient.publish(message, routingKey);
  }

  public consume(queueName: Queues) {
    return this.rabbitClient.consume(queueName);
  }
}

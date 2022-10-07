import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as amqp from 'amqplib';

import {
  EventTypes,
  Queues,
  RabbitMQConnectionConfig,
} from 'src/typings/events';

@Injectable()
export class RabbitMQManager {
  // implement logger
  protected channel: amqp.Channel;
  protected connection: amqp.Connection;

  PREFETCH_COUNT = 1;
  EXCHANGE = 'artisans.main_exchange';
  EXCHANGE_TYPE = 'topic';
  MESSAGE_TTL_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 30 * 4; // 4 months

  constructor(
    private readonly connectionOptions: RabbitMQConnectionConfig,
    private eventEmitter: EventEmitter2,
  ) {}

  async connect() {
    if (!this.connection) {
      try {
        this.connection = await amqp.connect(this.connectionOptions);
      } catch (error) {
        // handle connection error
        console.log(error);
      }
    }

    const channel = await this.createChannel();

    await this.assert(Queues.EMAIL_QUEUE, channel);
    await this.bindQueue(Queues.EMAIL_QUEUE, channel);

    await this.assert(Queues.NOTIFICATION_QUEUE, channel);
    await this.bindQueue(Queues.NOTIFICATION_QUEUE, channel);

    await this.bindCustom(
      [Queues.EMAIL_QUEUE, Queues.NOTIFICATION_QUEUE],
      channel,
      EventTypes.EVENT_SERVICE_REQUEST_A,
    );

    return this.connection;
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.close();
    }
  }

  async createChannel() {
    const connection = await this.connection;

    if (!this.channel) {
      this.channel = await connection.createChannel();
      await this.channel.prefetch(this.PREFETCH_COUNT);
      return this.channel;
    }

    return this.channel;
  }

  async assertQueue(queueName: string, channel: amqp.Channel) {
    await channel.assertQueue(queueName, {
      durable: false,
      messageTtl: this.MESSAGE_TTL_IN_MILLISECONDS,
    });
  }

  async assertExchange(exchangeName: string, channel: amqp.Channel) {
    await channel.assertExchange(exchangeName, this.EXCHANGE_TYPE, {
      durable: true,
    });
  }

  private async assert(queueName: Queues, channel: amqp.Channel) {
    await this.assertExchange(this.EXCHANGE, channel);

    await this.assertQueue(queueName, channel);
  }

  private async bindQueue(queueName: Queues, channel: amqp.Channel) {
    await channel.bindQueue(queueName, this.EXCHANGE, `${queueName}.#`);
  }

  private async bindCustom(
    queueName: Queues[],
    channel: amqp.Channel,
    bindingKey: string,
  ) {
    queueName.forEach(async (name) => {
      await channel.bindQueue(name, this.EXCHANGE, bindingKey);
    });
  }

  async publish(message: any, routingKey: string) {
    const channel = await this.createChannel();
    channel.publish(this.EXCHANGE, routingKey, this.serialize(message));
  }

  async consume(queueName: Queues) {
    /**
     * Emit event based on routing key so listeners can exists any where in codebase
     */
    const channel = await this.createChannel();

    // At least once message delivery
    channel.consume(
      queueName,
      (message) => {
        const routingKey = message.fields.routingKey;
        this.eventEmitter.emit(routingKey, {
          content: this.deserialize(message.content),
          channel: channel,
          messageField: message,
        });
      },
      { noAck: false },
    );
  }

  serialize(payload: any) {
    return Buffer.isBuffer(payload)
      ? payload
      : Buffer.from(JSON.stringify(payload));
  }

  deserialize(payload: Buffer) {
    return JSON.parse(payload.toString());
  }
}

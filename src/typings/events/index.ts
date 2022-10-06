export enum EventTypes {
  USER_CREATED = 'UserCreatedEvent',
}

export interface Events {
  messageID: string;
  type: EventTypes;
  Event: object;
}

export enum Queues {
  NOTIFICATION_QUEUE = 'notification',
  EMAIL_QUEUE = 'email',
}

export interface RabbitMQConnectionConfig {
  /**
   * RabbitMQ instance password
   *
   * @example password#45
   */
  password: string;

  /**
   * RabbitMQ instance user
   *
   * @example artisans_mq
   */
  username: string;

  /**
   * RabbitMQ instance port
   *
   * @example 5672
   */
  port: number;

  /**
   * RabbitMQ instance hostname
   *
   * @example rabbit_mq_server
   */
  host: string;

  /**
   * RabbitMQ instance protocol
   *
   * @example amqp
   */
  protocol: string;
}

import * as amqp from 'amqplib';

/**
 * Event Types That Can be Published and Consumed
 */
export enum EventTypes {
  EVENT_USER_CREATED_E = 'email.user_created',
  EVENT_BUSINESS_CREATED_E = 'email.business_created',
  EVENT_SERVICE_REQUEST_A = 'service.requested',
  EVENT_SERVICE_REQUEST_RESPONSE_N = 'notification.service_request_responded',
}

/**
 * Published Message Schema
 *
 * @note messages payload can be in different schemas based on event type by creating a class instance for each event to be produced
 *
 * @description sourceId is used to determine who triggered an event in cases were the same event can be triggered by different respondent
 * @description an example is service request as a user can cancel an event, so also the business can cancel an event
 */
export interface EventPayload {
  sourceId?: string;
  targetId?: string;
  payload: any;
}

/**
 * Consumed Message Schema
 *
 */
export interface EventMessage {
  messageField: amqp.Message;
  channel: amqp.Channel;
  content: EventPayload;
}

/**
 * Available Queues
 */
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

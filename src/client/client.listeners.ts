import { OnEvent } from '@nestjs/event-emitter';

import { EventMessage, EventTypes } from 'src/typings/events';

export class ClientConsumers {
  @OnEvent(EventTypes.EVENT_USER_CREATED_E)
  handleUserCreatedEvent(payload: EventMessage) {
    console.log(payload.content, '>>>>>');
  }
}

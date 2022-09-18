export enum EventTypes {
  USER_CREATED = 'UserCreatedEvent',
}

export interface Events {
  messageID: string;
  type: EventTypes;
  Event: object;
}

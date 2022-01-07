import {
  Publisher,
  Subjects,
  OrderCreatedEvent,
} from '@reenanfs-ticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

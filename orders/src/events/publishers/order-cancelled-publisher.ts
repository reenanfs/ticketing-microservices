import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from '@reenanfs-ticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

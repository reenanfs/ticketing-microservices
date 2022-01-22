import {
  Publisher,
  Subjects,
  PaymentCreatedEvent,
} from '@reenanfs-ticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}

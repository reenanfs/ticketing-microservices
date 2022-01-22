import {
  Publisher,
  Subjects,
  ExpirationCompletedEvent,
} from '@reenanfs-ticketing/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted;
}

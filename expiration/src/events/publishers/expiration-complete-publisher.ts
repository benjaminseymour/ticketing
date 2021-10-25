import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@benjaminseymour-tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}

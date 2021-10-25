import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@benjaminseymour-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

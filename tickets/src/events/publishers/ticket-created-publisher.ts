import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@benjaminseymour-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

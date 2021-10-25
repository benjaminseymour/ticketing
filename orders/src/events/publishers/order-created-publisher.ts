import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@benjaminseymour-tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

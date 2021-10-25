import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@benjaminseymour-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

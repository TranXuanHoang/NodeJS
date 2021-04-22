import { OrderCancelledEvent, Publisher, Subjects } from "@hoang-ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}

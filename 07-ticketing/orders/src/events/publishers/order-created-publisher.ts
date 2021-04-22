import { OrderCreatedEvent, Publisher, Subjects } from "@hoang-ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}

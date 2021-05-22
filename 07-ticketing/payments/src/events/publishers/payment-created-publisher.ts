import { PaymentCreatedEvent, Publisher, Subjects } from "@hoang-ticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}

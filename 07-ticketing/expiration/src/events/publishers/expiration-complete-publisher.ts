import { ExpirationCompleteEvent, Publisher, Subjects } from "@hoang-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}

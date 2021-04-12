import { Publisher, Subjects, TicketCreatedEvent } from '@hoang-ticketing/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}

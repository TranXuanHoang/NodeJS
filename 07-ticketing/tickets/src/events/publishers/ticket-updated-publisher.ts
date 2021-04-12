import { Publisher, Subjects, TicketUpdatedEvent } from '@hoang-ticketing/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}

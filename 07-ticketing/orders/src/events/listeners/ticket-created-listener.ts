import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketCreatedEvent } from '@hoang-ticketing/common'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  queueGroupName = queueGroupName

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data

    // Pass the id to the Ticket.build() function so that both orders and tickets
    // microservices will use the same id to refer to the same ticket even though
    // the ticket data itself is duplicated in each microservice
    const ticket = Ticket.build({
      id,
      title,
      price
    })
    await ticket.save()

    msg.ack()
  }
}

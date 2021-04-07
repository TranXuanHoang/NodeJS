import { Message } from "node-nats-streaming"
import { Listener } from './base-listener'
import { Subjects } from "./subjects"
import { TicketCreatedEvent } from "./ticket-created-event"

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  queueGroupName = 'payments-service'

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log(JSON.stringify(data, null, 2), "\n")

    // Acknowledge the NATS Streaming Server that the message was already
    // received AND processed
    msg.ack()
  }
}

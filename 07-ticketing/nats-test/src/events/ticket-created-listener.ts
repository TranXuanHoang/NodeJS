import { Message } from "node-nats-streaming"
import { Listener } from './base-listener'

export class TicketCreatedListener extends Listener {
  subject = 'ticket:created'
  queueGroupName = 'payments-service'

  onMessage(data: any, msg: Message) {
    console.log(JSON.stringify(data, null, 2), "\n")

    // Acknowledge the NATS Streaming Server that the message was already
    // received AND processed
    msg.ack()
  }
}

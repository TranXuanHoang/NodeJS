import { Message, Stan } from "node-nats-streaming"
import { Subjects } from "./subjects"

interface Event {
  subject: Subjects
  data: any
}

export abstract class Listener<T extends Event> {
  /** Name of the channel this listener is going to listen to. */
  abstract subject: T['subject']

  /**
   * Name of the queue group this listener will join. NATS will send
   * the message to only one of the listeners joining this `queueGroup`.
   */
  abstract queueGroupName: string

  /** Function to run when a message is received. */
  abstract onMessage(data: T['data'], msg: Message): void

  /** Pre-initialized NATS client. */
  protected client: Stan

  /** Number of seconds this listener has to ack a message. */
  protected ackWait = 5 * 1000 // 5s

  constructor(client: Stan) {
    this.client = client
  }

  /** Default subscription options. */
  subscriptionOptions() {
    return this.client.subscriptionOptions()
      .setDeliverAllAvailable() // Get all events be redelivered when app restarted
      .setManualAckMode(true) // Up to this listener to notify NATS the message has been received
      .setAckWait(this.ackWait) // Specifically set the amount of time this listener has to acknowledge NATS
      .setDurableName(this.queueGroupName) // Only get events redelivered if they haven't been processed
  }

  /** Code to set up the subscription. */
  listen() {
    const subcription = this.client.subscribe(
      this.subject,
      this.queueGroupName, // Each event is only sent to one listener that subscribed to this queue group
      this.subscriptionOptions()
    )

    subcription.on('message', (msg: Message) => {
      console.log(
        `Message received: ${this.subject} / ` +
        `${this.queueGroupName} #${msg.getSequence()}`
      )

      const parsedData = this.parseMessage(msg)
      this.onMessage(parsedData, msg)

      // Acknowledge the NATS Streaming Server that the message was already
      // received AND processed in the `onMessage()` method by calling:
      // msg.ack()
    })
  }

  /** Helper function to parse a message. */
  parseMessage(msg: Message) {
    const data = msg.getData()

    return typeof data === 'string'
      ? JSON.parse(data) // data is a string
      : JSON.parse(data.toString('utf8')) // data is a buffer
  }
}

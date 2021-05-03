import { OrderCancelledEvent } from '@hoang-ticketing/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from '../order-cancelled-listener'

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client)


  // Create and save a ticket with an orderId
  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: 'ticket created user Id'
  })

  const orderId = mongoose.Types.ObjectId().toHexString()
  ticket.set({ orderId })
  await ticket.save()

  // Create the fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }

  // Create the fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, orderId, data, msg }
}

it ('updates the ticket, publishes an event, and acks the message', async () => {
  const { listener, ticket, orderId, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).toBeUndefined()
  expect(msg.ack).toBeCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

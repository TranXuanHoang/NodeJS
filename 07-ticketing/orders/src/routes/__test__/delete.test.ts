import { OrderStatus } from '@hoang-ticketing/common'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

const credential = { email: 'test@mail.com', password: 'password' }

it('marks an order as cancelled', async () => {
  // Create a ticket with Ticket model
  const ticket = Ticket.build({
    title: 'Title',
    price: 20
  })
  await ticket.save()

  // Register a user
  const user = global.signup(credential)

  // Make a request to create an order with the above ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // Make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  // Confirm that the order has been cancelled
  const { body: updatedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)
  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled)
})

it('emits an order cancelled event', async () => {
  // Create a ticket with Ticket model
  const ticket = Ticket.build({
    title: 'Title',
    price: 20
  })
  await ticket.save()

  // Register a user
  const user = global.signup(credential)

  // Make a request to create an order with the above ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // Make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  // Make sure that an event was published
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

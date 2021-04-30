import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

const credential = { email: 'test@mail.com', password: 'password' }

it('returns an error if the ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup(credential))
    .send({ ticketId })
    .expect(404)
})

it('returns an error if the ticket is already reserved', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Title',
    price: 10
  })
  await ticket.save()

  // Create an order whilte associating it with the ticket created above
  const order = Order.build({
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket: ticket
  })
  await order.save()

  // Try to create another order that will try to reserve
  // a ticket that was already reserved by another order
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup(credential))
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('reserves a ticket', async () => {
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  let orders = await Order.find({})
  expect(orders.length).toEqual(0)

  // Create tickets
  const ticket1 = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Title 1',
    price: 10
  })
  await ticket1.save()

  const ticket2 = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Title 2',
    price: 20
  })
  await ticket2.save()

  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(2)

  // Try to create orders
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup(credential))
    .send({ ticketId: ticket1.id })
    .expect(201)
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup(credential))
    .send({ ticketId: ticket2.id })
    .expect(201)

  orders = await Order.find({})
  expect(orders.length).toEqual(2)
})

it('emits an order created event', async () => {
  // Create tickets
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Title',
    price: 10
  })
  await ticket.save()

  // Try to create an order
  const user = global.signup(credential)
  await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

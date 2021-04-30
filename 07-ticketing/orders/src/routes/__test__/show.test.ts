import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

const credential = { email: 'test@mail.com', password: 'password' }

it('fetches the order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Title',
    price: 20
  })
  await ticket.save()

  // Register a user
  const user = global.signup(credential)

  // Make a request to buid an order with the above ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // Make a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)
  expect(fetchedOrder).toEqual(order)
})

it('returns an error if one user tries to fetch another user\'s order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Title',
    price: 20
  })
  await ticket.save()

  // Make a request to buid an order with the above ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup(credential))
    .send({ ticketId: ticket.id })
    .expect(201)

  // Make a request to fetch the order using authentication
  // cookie of another user
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signup(credential))
    .send()
    .expect(401)
})

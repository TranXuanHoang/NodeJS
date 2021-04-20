import request from 'supertest'
import { app } from '../../app'
import { Ticket, TicketAttrs } from '../../models/ticket'

const credential1 = { email: 'test1@mail.com', password: 'password' }
const credential2 = { email: 'test2@mail.com', password: 'password' }

const buildTicket = async (ticket: TicketAttrs) => {
  const tk = Ticket.build(ticket)
  await tk.save()

  return tk
}

it('fetches orders for a particular user', async () => {
  // Create three tickets
  const ticketsData = [
    { title: 'Ticket 1', price: 10 },
    { title: 'Ticket 2', price: 20 },
    { title: 'Ticket 3', price: 30 },
  ] as TicketAttrs[]

  const tickets = []
  for await (const ticket of ticketsData.map(tk => buildTicket(tk))) {
    tickets.push(ticket)
  }
  expect(tickets.length).toEqual(ticketsData.length)

  // Signup 2 Users
  const user1 = global.signup(credential1)
  const user2 = global.signup(credential2)

  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: tickets[0].id })
    .expect(201)

  // Create two orders as User #2
  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: tickets[1].id })
    .expect(201)
  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: tickets[2].id })
    .expect(201)

  // Make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .send()
    .expect(200)

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2)
  expect(response.body[0]).toEqual(order1)
  expect(response.body[1]).toEqual(order2)
})

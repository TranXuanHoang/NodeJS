import request from 'supertest'
import { app } from '../../app'

const credential = { email: 'test@mail.com', password: 'password' }

interface TicketData {
  title: string
  price: number
}

const createTicket = (ticketData: TicketData) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup(credential))
    .send(ticketData)
}

it('can fetch a list of tickets', async () => {
  const ticketsData = [
    {
      title: 'Concert',
      price: 10
    },
    {
      title: 'Art Exhibition',
      price: 20
    }
  ]

  for (const ticket of ticketsData) {
    const res = await createTicket(ticket)
    expect(res.status).toEqual(201)
  }

  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200)

  expect(response.body.length).toEqual(ticketsData.length)
  for (let i = 0; i < response.body.length; i++) {
    const fetchedTicket = response.body[i]
    expect(fetchedTicket.title).toEqual(ticketsData[i].title)
    expect(fetchedTicket.price).toEqual(ticketsData[i].price)
  }
})

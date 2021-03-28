import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

const credential = { email: 'test@mail.com', password: 'password' }

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})

  expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)
})

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup(credential))
    .send({})

  expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup(credential))
    .send({
      title: '',
      price: 10
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup(credential))
    .send({
      price: 10
    })
    .expect(400)
})

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup(credential))
    .send({
      title: 'Title',
      price: -10
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup(credential))
    .send({
      title: 'Title'
    })
    .expect(400)
})

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  const ticket = {
    title: 'Title',
    price: 10
  }

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup(credential))
    .send(ticket)
    .expect(201)

  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0].title).toEqual(ticket.title)
  expect(tickets[0].price).toEqual(ticket.price)
})

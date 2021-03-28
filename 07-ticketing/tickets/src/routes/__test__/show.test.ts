import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'

const credential = { email: 'test@mail.com', password: 'password' }

it('returns a 404 if the ticket is not found', async () => {
  const id = mongoose.Types.ObjectId().toHexString()

  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404)
})

it('returns the ticket if the ticket is found', async () => {
  const ticketData = {
    title: 'Concert',
    price: 20
  }

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup(credential))
    .send(ticketData)
    .expect(201)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)

  expect(ticketResponse.body.title).toEqual(ticketData.title)
  expect(ticketResponse.body.price).toEqual(ticketData.price)
})

import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'

const credential = { email: 'test@mail.com', password: 'password' }

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signup(credential))
    .send({
      title: 'Concert',
      price: 20
    })
    .expect(404)
})

it('returns 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Concert',
      price: 20
    })
    .expect(401)
})

it('returns 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup(credential))
    .send({
      title: 'Concert',
      price: 20
    })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signup(credential)) // a different user
    .send({
      title: 'Concert',
      price: 20
    })
    .expect(401)
})

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signup(credential)

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Concert',
      price: 20
    })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20
    })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Concert',
      price: -20
    })
    .expect(400)
})

it('updates the ticket provided valid inputs', async () => {
  const ticketOriginalData = {
    title: 'Concert',
    price: 20
  }

  const cookie = global.signup(credential)

  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(ticketOriginalData)
    .expect(201)

  const ticketModifiedData = {
    title: 'Music Concert',
    price: 30
  }

  const updateResponse = await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set('Cookie', cookie)
    .send(ticketModifiedData)
    .expect(200)

  expect(updateResponse.body.title).toEqual(ticketModifiedData.title)
  expect(updateResponse.body.price).toEqual(ticketModifiedData.price)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${updateResponse.body.id}`)
    .send()
    .expect(200)

  expect(ticketResponse.body.title).toEqual(ticketModifiedData.title)
  expect(ticketResponse.body.price).toEqual(ticketModifiedData.price)
})

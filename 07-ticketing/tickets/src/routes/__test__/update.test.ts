import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

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

it('publishes an event', async () => {
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

  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set('Cookie', cookie)
    .send(ticketModifiedData)
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signup(credential)

  // Create and save a new ticket
  const ticketOriginalData = {
    title: 'Concert',
    price: 20
  }

  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(ticketOriginalData)
    .expect(201)

  const ticketId = createResponse.body.id

  // Set the ticket as being reserved by specifying an orderId
  const ticket = await Ticket.findById(ticketId)
  const orderId = mongoose.Types.ObjectId().toHexString()
  ticket!.set({ orderId })
  await ticket!.save()

  // Try to send an update ticket request
  const ticketModifiedData = {
    title: 'Music Concert',
    price: 30
  }

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send(ticketModifiedData)
    .expect(400)

  // Assert that the tiket was not updated
  const currentTicket = await Ticket.findById(ticketId)
  expect(currentTicket!.title).toEqual(ticketOriginalData.title)
  expect(currentTicket!.price).toEqual(ticketOriginalData.price)
  expect(currentTicket!.orderId).toEqual(orderId)
})

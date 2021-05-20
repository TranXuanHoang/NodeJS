/** This file contains all test cases that uses a mocked version of Stripe. */

import { OrderStatus } from '@hoang-ticketing/common'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { stripe } from '../../stripe'

// Mock the stripe.ts
jest.mock('../../stripe')

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup({ email: 'test@mail.com', password: 'password' }).authSession)
    .send({
      token: 'myPaymentToken',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404)
})

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup({ email: 'test@mail.com', password: 'password' }).authSession)
    .send({
      token: 'myPaymentToken',
      orderId: order.id
    })
    .expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
  // Register a user and get back an authentication session token and userId
  const { authSession, userId } = global.signup({ email: 'test@mail.com', password: 'password' })

  // Fake an order that has been cancelled
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    version: 1,
    userId,
    status: OrderStatus.Cancelled
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', authSession)
    .send({
      token: 'myPaymentToken',
      orderId: order.id
    })
    .expect(400)
})

it('returns a 204 with valid inputs', async () => {
  // Register a user and get back an authentication session token and userId
  const { authSession, userId } = global.signup({ email: 'test@mail.com', password: 'password' })

  // Fake an order that has been cancelled
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    version: 1,
    userId,
    status: OrderStatus.Created
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', authSession)
    .send({
      token: 'tok_visa', // this tok_visa always work on Stripe test mode
      orderId: order.id
    })
    .expect(201)

  const charOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
  expect(charOptions.source).toEqual('tok_visa')
  expect(charOptions.amount).toEqual(order.price * 100)
  expect(charOptions.currency).toEqual('usd')

  expect(stripe.charges.create).toHaveBeenCalled()
})

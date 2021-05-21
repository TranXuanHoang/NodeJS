/**
 * This file contains test cases the use a real version of Stripe.
 * meaning that when the test cases are run, a real request will be sent
 * to Stripe to charge a testing account with a testing credit card.
 */

import { OrderStatus } from '@hoang-ticketing/common'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Payment } from '../../models/payment'

// Do not mock the 'stripe' dependency and the 'stripe.ts' file itself
jest.unmock('stripe')
jest.unmock('../../stripe')
import { stripe } from '../../stripe'

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

it('returns a 201 with valid inputs', async () => {
  // Register a user and get back an authentication session token and userId
  const { authSession, userId } = global.signup({ email: 'test@mail.com', password: 'password' })

  const price = Math.floor(Math.random() * 100000)

  // Fake an order that has been cancelled
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price,
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

  // Send a charge create request to a realistic Stripe testing environment
  const stripeCharges = await stripe.charges.list({ limit: 50 })
  const stripeCharge = stripeCharges.data.find(charge => {
    return charge.amount === price * 100
  })
  expect(stripeCharge).toBeDefined()

  // Make sure that payment object was created and saved
  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id
  })
  expect(payment).not.toBeNull()
})

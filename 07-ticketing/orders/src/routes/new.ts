import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest
} from '@hoang-ticketing/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { Order } from '../models/order'
import { Ticket } from '../models/ticket'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post('/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      // Check if the inut ticketId is a valid id usable in MongoDB
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket ID must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    // Make sure that this ticket is not already reserved.
    // Run query to look at all orders. Find an order where the ticket
    // is the ticket we just fond AND the orders status is NOT cancelled.
    // If we find an order from that means the ticket IS reserved
    const isReserved = await ticket.isReserved()
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }

    // Calculate an expiration date for this order
    const expriration = new Date()
    expriration.setSeconds(expriration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expriration,
      ticket
    })
    await order.save()

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(), // UTC time in string format,
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price
      }
    })

    res.status(201).send(order)
  }
)

export { router as newOrderRouter }

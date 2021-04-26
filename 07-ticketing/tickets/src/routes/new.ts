import { requireAuth, validateRequest } from '@hoang-ticketing/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'
import { Ticket } from '../models/ticket'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post('/api/tickets',
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id
    })

    await ticket.save()

    // Publish an event to NATS
    // Should refer to the 'ticket' data after it was save to the MongoDB
    // (like ticket.id, ticket.title, ...) to make sure that the
    // data saved into the DB and the one sent to NATS are the same
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    })

    res.status(201).send(ticket)
  }
)

export { router as createTicketRouter }


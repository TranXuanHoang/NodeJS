import { OrderStatus } from '@hoang-ticketing/common'
import mongoose from 'mongoose'
import { TicketDoc } from './ticket'

export { OrderStatus }

/**
 * An interface describing properties that are
 * required to create a new Order.
 */
interface OrderAttrs {
  userId: string
  status: OrderStatus
  expriresAt: Date
  ticket: TicketDoc
}

/**
 * An interface describing properties that an Order Document has.
 */
interface OrderDoc extends mongoose.Document {
  userId: string
  status: OrderStatus
  expriresAt: Date
  ticket: TicketDoc
}

/**
 * An interface describing properties that an Order Model has.
 * Specifically, a build method is defined with an input parameter
 * specifying what attributes need to be provided when creating
 * the `OrderModel`.
 */
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    // Mongoose will make sure that 'status' value is alway
    // one of the values defined in the OrderStatus enum
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

// pre('save', function Fn) means anytime we attempt to
// save a document to the database collection, we are going to
// execute the callback function Fn. Note that the callback function
// is defined without using the arrow (=>) notation so that
// inside of that callback function we can use 'this' to refer to
// the actual document to be saved to the database. If we use the
// arrow function notation, 'this' will be the context of the ticket.ts
// file instead of the ticket documentation as supposed to be.
orderSchema.pre('save', async function (done) {
  if (this.isModified()) {
    // Do something here before the data is saved to the Ticket collection
  }
  done()
})

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }

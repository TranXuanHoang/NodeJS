import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { Order, OrderStatus } from './order'

/** An interface describing properties that are required to create a new Ticket. */
export interface TicketAttrs {
  id: string
  title: string
  price: number
}

/** An interface describing properties that a Ticket Document has. */
export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  version: number
  isReserved(): Promise<boolean>
}

/** An interface describing properties that a Ticket Model has. */
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
  findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    requited: true
  },
  price: {
    type: Number,
    requited: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

// Config a plugin to automatically increase version by one for each update session
ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

// pre('save', function Fn) means anytime we attempt to
// save a document to the database collection, we are going to
// execute the callback function Fn. Note that the callback function
// is defined without using the arrow (=>) notation so that
// inside of that callback function we can use 'this' to refer to
// the actual document to be saved to the database. If we use the
// arrow function notation, 'this' will be the context of the ticket.ts
// file instead of the ticket documentation as supposed to be.
ticketSchema.pre('save', async function (done) {
  if (this.isModified()) {
    // Do something here before the data is saved to the Ticket collection
  }
  done()
})

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  })
}

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  // When new Ticket(), we tranform the id property to _id so that
  // MongoDB will use that _id as the id of the document to be added
  const { id, ...attrsWithoutId } = attrs
  return new Ticket({ _id: attrs.id, ...attrsWithoutId })
}

// Note that it is critical to use the 'function' keyword here
// so that inside the function body 'this' will be the ticket
// that we just called 'isReserved' on
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this.id, // Ticket id
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  })
  return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }

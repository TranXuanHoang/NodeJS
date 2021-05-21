import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PaymentArrts {
  orderId: string
  stripeId: string
}

interface PaymentDoc extends mongoose.Document {
  orderId: string
  stripeId: string
  version: number
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentArrts): PaymentDoc
}

const paymentSchema = new mongoose.Schema({
  orderId: {
    required: true,
    type: String
  },
  stripeId: {
    required: true,
    type: String
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

paymentSchema.set('versionKey', 'version')
paymentSchema.plugin(updateIfCurrentPlugin)

paymentSchema.statics.build = (attrs: PaymentArrts) => {
  return new Payment(attrs)
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema)

export { Payment }



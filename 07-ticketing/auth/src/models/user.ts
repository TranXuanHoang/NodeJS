import mongoose from 'mongoose'
import { Password } from '../services/password'

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string
  password: string
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string
  password: string
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    requited: true
  },
  password: {
    type: String,
    requited: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.password
      delete ret.__v
    }
  }
})

// pre('save', function Fn) means anytime we attempt to
// save a document to the database collection, we are going to
// execute the callback function Fn. Note that the callback function
// is defined without using the arrow (=>) notation so that
// inside of that callback function we can use 'this' to refer to
// the actual document to be saved to the database. If we use the
// arrow function notation, 'this' will be the context of the user.ts
// file instead of the user documentation as supposed to be.
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
  }
  done()
})

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }

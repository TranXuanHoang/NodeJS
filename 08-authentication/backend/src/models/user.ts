import mongoose from 'mongoose'

/** An interface describing properties that are required to create a new User. */
interface UserAttrs {
  email: string
  password: string
}

/** An interface describing properties that a User Document has. */
interface UserDoc extends mongoose.Document {
  email: string
  password: string
}

/** An interface describing properties that a User Model has. */
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

// Define model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true, // each email can be used to register only one user account
    lowercase: true // always convert email to lowercase
  },
  password: {
    type: String,
    require: true
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

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

// Create the model class
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

// Export the model
export { User }

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

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

// On Save Hook, encrypt password.
// pre('save', function Fn) means anytime we attempt to
// save a document to the database collection, we are going to
// execute the callback function Fn. Note that the callback function
// is defined without using the arrow (=>) notation so that
// inside of that callback function we can use 'this' to refer to
// the actual document to be saved to the database. If we use the
// arrow function notation, 'this' will be the context of the user.ts
// file instead of the user documentation as supposed to be.
userSchema.pre('save', async function (next) {
  // Get access to the user model
  const user = this

  if (user.isModified('password')) {
    // Generate a salt
    const salt = await bcrypt.genSalt(10)

    // Hash (encrypt) plain text password using salt
    const hashedPassword = await bcrypt.hash(user.get('password'), salt)

    // Overwrite plain text password inside the user model with encrypted password
    user.set('password', hashedPassword)
  }

  // Go ahead and save the model
  next()
})

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

// Create the model class
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

// Export the model
export { User }

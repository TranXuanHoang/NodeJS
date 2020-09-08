const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = {
  createUser: async ({ userInput }, req) => {
    const { email, name, password } = userInput
    const existingUser = await User.findOne({ email: email })
    if (existingUser) {
      const error = new Error('User exists already!')
      throw error
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({
      email,
      name,
      password: hashedPassword
    })
    const createdUser = await user.save()
    return { ...createdUser._doc, _id: createdUser._id.toString() }
  }
}

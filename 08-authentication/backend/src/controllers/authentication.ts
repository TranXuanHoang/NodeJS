import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { config } from "../config";
import { User, UserDoc } from "../models/user";

/** Generates a `JSON Web Token` recognizing the input `user`. */
const tokenForUser = (user: UserDoc) => {
  return jwt.sign(
    // The payload to sign
    {
      sub: user.id,
      iat: new Date().getTime() // issued at time
      // Shouldn't include password here
    },
    // Secret key for signing the payload
    config.jwt_secret_key,
    // Other options
    {
      // With 1 hour of expiration
      expiresIn: '1h'
    }
  )
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' })
  }

  // See if a user with the given email exists
  const existingUser = await User.findOne({ email })

  // If a user with email does exist, return an error
  if (existingUser) {
    // Status code 422 - unable to process the request data
    return res.status(422).send({ error: 'Email is already in use!' })
  }

  // If a user with email does NOT exist, create and save user record
  const user = User.build({
    email, password
  })
  await user.save()

  // Generate a JWT
  const token = tokenForUser(user)

  // Respond to request indicating the user was created
  return res.send({ token })
}

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  // User has already had their email and password authenticated
  // We just need to given them a token
  const authenticatedUser = req.user as UserDoc

  // Generate a JWT
  const token = tokenForUser(authenticatedUser)

  // Respond to request indicating the user was created
  return res.send({ token })
}

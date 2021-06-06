import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

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

  // Respond to request indicating the user was created
  return res.send({ success: true })
}

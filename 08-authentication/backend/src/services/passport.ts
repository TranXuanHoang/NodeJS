import passport from 'passport'
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
  VerifiedCallback
} from 'passport-jwt'
import { config } from '../config'
import { User } from '../models/user'

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.jwt_secret_key
} as StrategyOptions

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions,
  // payload: decoded JWT payload = {sub: ..., iat: ...}
  // done: a callback called depending whether we successfully authenticated the user
  async (payload: string, done: VerifiedCallback) => {
    try {
      // See if the user ID in the payload exists in our database
      // If it does, call 'done' with that user
      // otherwise, call done without a user object
      const user = await User.findById(payload.sub)

      if (user) {
        // Tell passport the user who was found from the database
        return done(null, user)
      } else {
        return done(null, false)
      }
    } catch (err) {
      return done(err, false)
    }
  }
)

// Tell passport to use the JWT strategy
export default passport.use(jwtLogin)

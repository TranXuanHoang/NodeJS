import passport from 'passport'
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
  VerifiedCallback
} from 'passport-jwt'
import {
  IStrategyOptions,
  Strategy as LocalStrategy
} from 'passport-local'
import { config } from '../config'
import { User } from '../models/user'

// Create local strategy
const localOptions = {
  usernameField: 'email',
  passwordField: 'password'
} as IStrategyOptions

const localLogin = new LocalStrategy(localOptions,
  async (email: string, password: string, done) => {
    // Verify this username (email) and password, call done with
    // the user if it is the correct username (email) and password
    // otherwise, call done with false
    try {
      const user = await User.findOne({ email })

      if (!user) {
        return done(null, false)
      }

      // Compare passwords
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return done(null, false)
      }

      // If the password and email are matching, call done with user
      // meaning that req.user = user
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  }
)

// Create JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.jwt_secret_key
} as StrategyOptions

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

// Tell passport to use the JWT and local strategies
const useLoginStrategies = () => {
  passport.use(jwtLogin)
  passport.use(localLogin)
}

export default useLoginStrategies()

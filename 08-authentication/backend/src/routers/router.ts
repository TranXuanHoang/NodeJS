import { Request, Response, Router } from 'express'
import passport from 'passport'
import { signin, signup } from '../controllers/authentication'
import passportService from '../services/passport'

// Run the logic inside the passportService
passportService

/** Defines a helper for authentication requests  */
const requireAuth = passport.authenticate('jwt', {
  // Don't create session when authenticating the user
  // as we use token-based authentication
  session: false
})

/**
 * Defines a helper for authenticating using email and password
 * (local authentication strategy)
 */
const requireSignin = passport.authenticate('local', {
  session: false
})

const router = Router()

router.get('/',
  requireAuth,
  (req: Request, res: Response) => {
    return res.send({ msg: 'Hello World' })
  }
)

router.post('/signin', requireSignin, signin)
router.post('/signup', signup)

export { router as appRoutes }

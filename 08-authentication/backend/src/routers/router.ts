import { Request, Response, Router } from 'express'
import passport from 'passport'
import { signup } from '../controllers/authentication'
import passportService from '../services/passport'

// Run the logic inside the passportService
passportService

/** Defines a helper for authentication requests  */
const requireAuth = passport.authenticate('jwt', {
  // Don't create session when authenticating the user
  // as we use token-based authentication
  session: false
})

const router = Router()

router.get('/',
  requireAuth,
  (req: Request, res: Response) => {
    return res.send({ msg: 'Hello World' })
  }
)

router.post('/signup', signup)

export { router as appRoutes }

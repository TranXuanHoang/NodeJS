import { Request, Response, Router } from 'express'
import { signup } from '../controllers/authentication'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  return res.send({ msg: 'Hello World' })
})

router.post('/signup', signup)

export { router as appRoutes }

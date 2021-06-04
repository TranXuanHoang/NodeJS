import { Request, Response, Router } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  return res.send({ msg: 'Hello World' })
})

export { router as appRoutes }

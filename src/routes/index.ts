import { Response, Router } from 'express'
import httpResponse from '../lib/responses'
const router = Router()

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' })
// })

router.get('/', (_, res: Response) => res.json(httpResponse({ message: 'OK' })))

router.use((_, res: Response) => res.status(404).json(httpResponse({ error: 'Endpoint not found' })))

export default router

import express, { Request, Response } from 'express'
import httpResponse from '../lib/responses'
import UserController from '../controllers/userController'
const router = express.Router()

/* GET users listing. */
router.post('/', (req: Request, res: Response) => UserController.login(req, res))

export default router

import express, { Request, Response } from 'express'
import httpResponse from '../lib/responses'
import UserController from '../controllers/userController'
const router = express.Router()

/* GET users listing. */
/**
 * @swagger
 * /users:
 *   post:
 *     summary: login
 *     responses:
 *       200:
 *         description: Successful response
 */
router.post('/', (req: Request, res: Response) => UserController.login(req, res))

export default router

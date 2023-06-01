import express, { Request, Response } from 'express'
import httpResponse from '../lib/responses'
import UserController from '../controllers/userController'
const router = express.Router()

/* GET users listing. */
/**
 * @swagger
 * /user:
 *   post:
 *     summary: login
 *     requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                description: "use: 'user1' if you want to authenticate"
 *              password:
 *                type: string
 *                description: "use: 'password1' if you want to authenticate"
 *            required:
 *              - username
 *              - password
 *     responses:
 *       200:
 *         description: Successful response
 */
router.post('/', (req: Request, res: Response) => UserController.login(req, res))

export default router

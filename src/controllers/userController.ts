import { Request, Response } from 'express'
import { User } from '../models/user'
import httpResponse from '../lib/responses'
import BaseController, { IBaseController } from './baseControllers'

// In-memory user storage just for example
const users: User[] = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
]

export interface IUserController extends IBaseController {
  login(req: Request, res: Response): Promise<Response>
}

export class UserController extends BaseController implements IUserController {
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { username, password } = req.body
      const user = users.find(u => u.username === username && u.password === password)

      if (!user) {
        return res.status(401).json(httpResponse({ error: 'Invalid credentials' }))
      }

      return res.json(httpResponse<boolean>({ data: true }))
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json(httpResponse({ error: error.message }))
      }
    }
    return res.status(500).json(httpResponse({ error: 'Unknown error' }))
  }
}

export default new UserController()

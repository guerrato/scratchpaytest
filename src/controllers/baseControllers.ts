import { Response } from 'express'
import httpResponse from '../lib/responses'

export interface IBaseController {
  notImplemented(res: Response): Response
}

export default abstract class BaseController implements IBaseController {
  notImplemented(res: Response): Response {
    return res.status(405).json(httpResponse({ error: 'invalid method' }))
  }
}

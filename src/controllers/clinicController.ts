import { Request, Response } from 'express'
import { searchClinic, SearchResults } from '../services/clinicService'
import httpResponse from '../lib/responses'
import BaseController, { IBaseController } from './baseControllers'
import { isValidTimeFormat } from '../helpers/time'

export interface IClinicController extends IBaseController {
  search(req: Request, res: Response): Promise<Response>
}

export class ClinicController extends BaseController implements IClinicController {
  async search(req: Request, res: Response): Promise<Response> {
    try {
      const { q, state, from, to, type, page = 1, limit = 10 } = (req.query as any) ?? {}

      if (type) {
        if (!['vet', 'dental'].includes(type)) {
          throw new Error('Invalid type. It must be vet or dental')
        }
      }

      if (from) {
        if (!isValidTimeFormat(from)) {
          throw new Error('Invalid "from" filter format. It must be in HH:mm format')
        }
      }

      if (to) {
        if (!isValidTimeFormat(to)) {
          throw new Error('Invalid "to" filter format. It must be in HH:mm format')
        }
      }

      const result = await searchClinic({
        options: { searchTerm: q, state, from, to, type },
        page: parseInt(page),
        limit: parseInt(limit),
      })
      return res.json(httpResponse<SearchResults>({ data: result }))
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json(httpResponse({ error: error.message }))
      }
    }
    return res.status(500).json(httpResponse({ error: 'Unknown error' }))
  }
}

export default new ClinicController()

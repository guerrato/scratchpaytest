import express, { Request, Response } from 'express'
import httpResponse from '../lib/responses'
import ClinicController from '../controllers/clinicController'
const router = express.Router()

/* GET clinic listing. */
/**
 * @swagger
 * /clinic/search:
 *   get:
 *     summary: Search clinics based by filters and returns them paginated
 *     parameters:
 *     - in: query
 *       name: q
 *       type: string
 *       required: false
 *       description: used for search by clinic name
 *     - in: query
 *       name: state
 *       type: string
 *       required: false
 *       description: used for filter by state, type any name or state acronym
 *     - in: query
 *       name: from
 *       type: string
 *       required: false
 *       description: clinic oppening time. must be "HH:mm"
 *     - in: query
 *       name: to
 *       type: string
 *       required: false
 *       description: clinic closing time. must be "HH:mm"
 *     - in: query
 *       name: type
 *       type: string
 *       required: false
 *       description: set the clinic type ('vet' or 'dental')
 *     - in: query
 *       name: page
 *       type: number
 *       required: false
 *       description: select the page of pagination
 *     - in: query
 *       name: limit
 *       type: string
 *       required: false
 *       description: select the limit of items to be returned
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/search', (req: Request, res: Response) => ClinicController.search(req, res))

export default router

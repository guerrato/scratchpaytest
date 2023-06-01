import express, { Request, Response } from 'express'
import httpResponse from '../lib/responses'
import ClinicController from '../controllers/clinicController'
const router = express.Router()

/* GET clinic listing. */
router.get('/search', (req: Request, res: Response) => ClinicController.search(req, res))

export default router

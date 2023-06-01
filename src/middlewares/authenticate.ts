import { Request, Response, NextFunction } from 'express'
import httpResponse from '../lib/responses'

export const token = '5f8a3b76-4998-4e22-a3b7-84f22c9a12d3'

function authenticate(req: Request, res: Response, next: NextFunction) {
  // Check if the user is authenticated
  const token = req.headers['x-auth-token']

  if (token === token) {
    // User is authenticated
    next()
  } else {
    // User is not authenticated
    return res
      .status(401)
      .json(httpResponse({ error: 'Unauthenticated. For the test use the uuid: 5f8a3b76-4998-4e22-a3b7-84f22c9a12d3' }))
  }
}

export default authenticate

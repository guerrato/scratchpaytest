import request from 'supertest'
import app from '../src/app'
import { Request, Response } from 'express'
import { UserController, IUserController } from '../src/controllers/userController'

describe('UserController', () => {
  let userController: IUserController
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    userController = new UserController()
    req = {
      body: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('should return a not implemented response', () => {
    userController.notImplemented(res as Response)

    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'invalid method' })
  })

  it('should return a successful response for valid credentials', async () => {
    const res = await request(app).post('/user').send({
      username: 'user1',
      password: 'password1',
    })
    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      success: true,
      message: 'Use the token in data into x-auth-token for authenticated routes',
      data: '5f8a3b76-4998-4e22-a3b7-84f22c9a12d3',
    })
  })

  it('should return an error response for invalid credentials', async () => {
    const res = await request(app).post('/user').send({
      username: 'user3',
      password: 'password3',
    })

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ success: false, error: 'Invalid credentials' })
  })
})

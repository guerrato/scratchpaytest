import request from 'supertest'
import app from '../src/app'

describe('Basic API Integration Test', () => {
  it('should include "OK" in the response root endpoint', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ success: true, message: 'OK' })
  })

  it('should return "Endpoint not found" for unknown endpoints', async () => {
    const response = await request(app).get('/unknown')
    expect(response.status).toBe(404)
    expect(response.body).toEqual({ success: false, error: 'Endpoint not found' })
  })
})

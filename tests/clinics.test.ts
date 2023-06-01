import request from 'supertest'
import app from '../src/app'
import { Request, Response } from 'express'
import { UserController, IUserController } from '../src/controllers/userController'
import fs from 'fs'
import express from 'express'
import { searchClinic } from '../src/services/clinicService'
import { Clinic } from '../src/models/clinic'

function isTimeValid(from: string, to: string): boolean {
  const fromTime = new Date(`2023-06-01T${from}`)
  const toTime = new Date(`2023-06-01T${to}`)

  return toTime > fromTime
}

function isValidAvailability(timeA: string, timeB: string): boolean {
  const dateA = new Date(`2023-06-01T${timeA}`)
  const dateB = new Date(`2023-06-01T${timeB}`)

  return dateB >= dateA
}

describe('GET /clinic/search', () => {
  it('should return search results with pagination', async () => {
    const searchTerm = 'test'
    const page = 1
    const limit = 10

    const response = await request(app).get('/clinic/search').query({ q: searchTerm, page, limit })

    const { data } = response.body
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('results')
    expect(data).toHaveProperty('totalResults')
    expect(data).toHaveProperty('totalPages')
    expect(data).toHaveProperty('currentPage')
    expect(data).toHaveProperty('limit')
  })

  it('should return empty results with zero values', async () => {
    const searchTerm = 'nonexistent'
    const page = 1
    const limit = 10

    const response = await request(app).get('/clinic/search').query({ q: searchTerm, page, limit })

    expect(response.status).toBe(200)
    expect(response.body.data.results).toEqual([])
    expect(response.body.data.totalResults).toBe(0)
    expect(response.body.data.totalPages).toBe(0)
    expect(response.body.data.currentPage).toBe(1)
    expect(response.body.data.limit).toBe(10)
  })

  it('should return search results for "mayo clinic" with pagination', async () => {
    const searchTerm = 'mayo clinic'
    const page = 1
    const limit = 10

    const response = await request(app).get('/clinic/search').query({ q: searchTerm, page, limit })

    expect(response.status).toBe(200)
    expect(response.body.data.results).toEqual([
      {
        name: 'Mayo Clinic',
        stateName: 'Florida',
        availability: { from: '09:00', to: '20:00' },
        type: 'dental',
      },
    ])
    expect(response.body.data.totalResults).toBe(1)
    expect(response.body.data.totalPages).toBe(1)
    expect(response.body.data.currentPage).toBe(1)
    expect(response.body.data.limit).toBe(10)
  })

  it('should return search results for "MAYO CLINIC" with pagination', async () => {
    const searchTerm = 'oracle'
    const page = 1
    const limit = 10

    const response = await request(app).get('/clinic/search').query({ q: searchTerm, page, limit })

    expect(response.status).toBe(200)
    expect(response.body.data.results).toEqual([
      {
        name: 'Oracle Corp',
        availability: {
          from: '02:07',
          to: '23:31',
        },
        stateName: 'Rhode Island',
        type: 'vet',
      },
    ])
    expect(response.body.data.totalResults).toBe(1)
    expect(response.body.data.totalPages).toBe(1)
    expect(response.body.data.currentPage).toBe(1)
    expect(response.body.data.limit).toBe(10)
  })

  it('should return a 400 error with invalid type message', async () => {
    const type = 'invalid-type'
    const page = 1
    const limit = 10

    const response = await request(app).get('/clinic/search').query({ type, page, limit })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('Invalid type. It must be vet or dental')
  })

  it('should have correct name, stateName, and availability for each clinic', async () => {
    const searchTerm = 'mayo clinic'
    const page = 1
    const limit = 10

    const response = await request(app).get('/clinic/search').query({ q: searchTerm, page, limit })

    expect(response.status).toBe(200)
    expect(response.body.data.results).toEqual([
      {
        name: 'Mayo Clinic',
        stateName: 'Florida',
        availability: { from: '09:00', to: '20:00' },
        type: 'dental',
      },
    ])
    expect(response.body.data.totalResults).toBe(1)
    expect(response.body.data.totalPages).toBe(1)
    expect(response.body.data.currentPage).toBe(1)
    expect(response.body.data.limit).toBe(10)

    const [clinic] = response.body.data.results
    expect(clinic.name).toBeDefined()
    expect(typeof clinic.name).toBe('string')

    expect(clinic.stateName).toBeDefined()
    expect(typeof clinic.stateName).toBe('string')

    expect(clinic.availability).toBeDefined()
    expect(typeof clinic.availability).toBe('object')

    expect(clinic.availability.from).toBeDefined()
    expect(typeof clinic.availability.from).toBe('string')
    expect(clinic.availability.from).toMatch(/^\d{2}:\d{2}$/)

    expect(clinic.availability.to).toBeDefined()
    expect(typeof clinic.availability.to).toBe('string')
    expect(clinic.availability.to).toMatch(/^\d{2}:\d{2}$/)

    const { from, to } = clinic.availability
    expect(isTimeValid(from, to)).toBe(true)
  })

  it('should return 20 records of dental clinics with pagination', async () => {
    const type = 'dental'
    const page = 1
    const limit = 20

    const response = await request(app).get('/clinic/search').query({ type, page, limit })

    expect(response.status).toBe(200)
    expect(response.body.data.results.length).toBe(20)

    for (const clinic of response.body.data.results) {
      expect(clinic.type).toBe(type)
    }

    expect(response.body.data.totalResults).toBeGreaterThanOrEqual(20)
    expect(response.body.data.totalPages).toBeGreaterThanOrEqual(1)
    expect(response.body.data.currentPage).toBe(page)
    expect(response.body.data.limit).toBe(limit)
  })

  it('should return 20 records of vet clinics with pagination', async () => {
    const type = 'vet'
    const page = 1
    const limit = 20

    const response = await request(app).get('/clinic/search').query({ type, page, limit })

    expect(response.status).toBe(200)
    expect(response.body.data.results.length).toBe(20)

    for (const clinic of response.body.data.results) {
      expect(clinic.type).toBe(type)
    }

    expect(response.body.data.totalResults).toBeGreaterThanOrEqual(20)
    expect(response.body.data.totalPages).toBeGreaterThanOrEqual(1)
    expect(response.body.data.currentPage).toBe(page)
    expect(response.body.data.limit).toBe(limit)
  })

  it('should return clinics by state name', async () => {
    const state = 'South Carolina'
    const page = 1
    const limit = 10

    const response = await request(app).get('/clinic/search').query({ state, page, limit })

    expect(response.status).toBe(200)
    expect(response.body.data.results.length).toBeGreaterThan(0)

    for (const clinic of response.body.data.results) {
      expect(clinic.stateName).toEqual(expect.stringMatching(/South Carolina/i))
    }

    expect(response.body.data.totalResults).toBeGreaterThan(0)
    expect(response.body.data.totalPages).toBeGreaterThanOrEqual(1)
    expect(response.body.data.currentPage).toBe(page)
    expect(response.body.data.limit).toBe(limit)
  })

  it('should return clinics by state acronym', async () => {
    const state = 'FL'
    const page = 1
    const limit = 10

    const response = await request(app).get('/clinic/search').query({ state, page, limit })

    expect(response.status).toBe(200)
    expect(response.body.data.results.length).toBeGreaterThan(0)

    for (const clinic of response.body.data.results) {
      expect(clinic.stateName).toEqual(expect.stringMatching(/Florida/i))
    }

    expect(response.body.data.totalResults).toBeGreaterThan(0)
    expect(response.body.data.totalPages).toBeGreaterThanOrEqual(1)
    expect(response.body.data.currentPage).toBe(page)
    expect(response.body.data.limit).toBe(limit)
  })

  it('should return 400 error with invalid availability format message', async () => {
    const invalidFromFilter = '10' // Invalid availability.from format
    const page = 1
    const limit = 10

    const response = await request(app).get('/clinic/search').query({ from: invalidFromFilter, page, limit })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('Invalid "from" filter format. It must be in HH:mm format')
  })

  it('should return 400 error with invalid availability format message for "to" filter', async () => {
    const invalidToFilter = '20' // Invalid availability.to format
    const page = 1
    const limit = 10

    const response = await request(app).get('/clinic/search').query({ to: invalidToFilter, page, limit })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('Invalid "to" filter format. It must be in HH:mm format')
  })

  it('should return clinics with availability.from lower or equal to the filter', async () => {
    const fromFilter = '10:00' // Filter for availability.from
    const page = 1
    const limit = 200

    const response = await request(app).get('/clinic/search').query({ from: fromFilter, page, limit })

    expect(response.status).toBe(200)
    expect(response.body.data.results.length).toBeGreaterThan(0)

    for (const clinic of response.body.data.results) {
      const clinicFrom = clinic.availability.from
      expect(isValidAvailability(clinicFrom, fromFilter)).toBe(true)
    }

    expect(response.body.data.totalResults).toBeGreaterThan(0)
    expect(response.body.data.totalPages).toBeGreaterThanOrEqual(1)
    expect(response.body.data.currentPage).toBe(page)
    expect(response.body.data.limit).toBe(limit)
  })

  it('should return clinics with availability.to greater or equal to the filter', async () => {
    const toFilter = '20:00' // Filter for availability.to
    const page = 1
    const limit = 10

    const response = await request(app).get('/clinic/search').query({ to: toFilter, page, limit })

    expect(response.status).toBe(200)
    expect(response.body.data.results.length).toBeGreaterThan(0)

    for (const clinic of response.body.data.results) {
      const clinicTo = clinic.availability.to
      expect(isValidAvailability(toFilter, clinicTo)).toBe(true)
    }

    expect(response.body.data.totalResults).toBeGreaterThan(0)
    expect(response.body.data.totalPages).toBeGreaterThanOrEqual(1)
    expect(response.body.data.currentPage).toBe(page)
    expect(response.body.data.limit).toBe(limit)
  })
})

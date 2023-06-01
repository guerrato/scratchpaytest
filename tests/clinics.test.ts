import request from 'supertest'
import app from '../src/app'
import { Request, Response } from 'express'
import { UserController, IUserController } from '../src/controllers/userController'
import fs from 'fs'
import express from 'express'
import { searchClinic } from '../src/services/clinicService'
import { Clinic } from '../src/models/clinic'

/* describe('Clinic Endpoint', () => {
  let clinicList: Clinic[];

  beforeEach(() => {
    

  it('should have three clinics in the list', () => {
    expect(clinicList).toHaveLength(3);
  });

  it('should have correct name, stateName, and availability for each clinic', () => {
    clinicList.forEach((clinic) => {
      expect(clinic.name).toBeDefined();
      expect(typeof clinic.name).toBe('string');

      expect(clinic.stateName).toBeDefined();
      expect(typeof clinic.stateName).toBe('string');

      expect(clinic.availability).toBeDefined();
      expect(typeof clinic.availability).toBe('object');

      expect(clinic.availability.from).toBeDefined();
      expect(typeof clinic.availability.from).toBe('string');
      expect(clinic.availability.from).toMatch(/^\d{2}:\d{2}$/);

      expect(clinic.availability.to).toBeDefined();
      expect(typeof clinic.availability.to).toBe('string');
      expect(clinic.availability.to).toMatch(/^\d{2}:\d{2}$/);
      expect(clinic.availability.to).toBeGreaterThan(clinic.availability.from);
    });
  });
}); */

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
    expect(response.body.data.currentPage).toBe(0)
    expect(response.body.data.limit).toBe(0)
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
    const searchTerm = 'MAYO CLINIC'
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
})

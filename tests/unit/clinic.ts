import fs from 'fs'
import path from 'path'
import { searchClinic, SearchClinicProps, SearchResults } from '../../src/services/clinicService'

/* describe('searchClinic', () => {
  const mockClinicsFilePath = path.join(__dirname, '../__mock__/clinics.json')

  afterAll(() => {
    // Clean up the mock clinics file
    // fs.unlinkSync(mockClinicsFilePath)
  })

  it('should return paginated search results for a valid search term', async () => {
    const searchTerm = 'Clinic'
    const page = 2
    const limit = 5

    const expectedResults: SearchResults<any> = {
      data: [
        { name: 'Clinic 6', location: 'Location 6' },
        { name: 'Clinic 7', location: 'Location 7' },
        { name: 'Clinic 8', location: 'Location 8' },
        { name: 'Clinic 9', location: 'Location 9' },
        { name: 'Clinic 10', location: 'Location 10' },
      ],
      totalCount: 12,
      totalPages: 3,
      currentPage: 2,
      pageSize: 5,
    }

    const text = JSON.stringify([
      { name: 'Clinic 6', location: 'Location 6' },
      { name: 'Clinic 7', location: 'Location 7' },
      { name: 'Clinic 8', location: 'Location 8' },
      { name: 'Clinic 9', location: 'Location 9' },
      { name: 'Clinic 10', location: 'Location 10' },
    ])
    
    let test = ''
    if(text.includes(searchTerm)) {
      test = text
    }

    console.log({ test, database: mockClinicsFilePath, searchTerm, page, limit })

    const result = await searchClinic({ database: mockClinicsFilePath, searchTerm, page, limit })
    expect(result).toEqual(expectedResults)
  })

  it('should return all search results if the limit is greater than the total count', async () => {
    const searchTerm = 'Clinic'
    const page = 1
    const limit = 20

    const expectedResults: PaginationResult<any[]> = {
      data: [
        { name: 'Clinic 1', location: 'Location 1' },
        { name: 'Clinic 2', location: 'Location 2' },
        { name: 'Clinic 3', location: 'Location 3' },
        { name: 'Clinic 4', location: 'Location 4' },
        { name: 'Clinic 5', location: 'Location 5' },
        { name: 'Clinic 6', location: 'Location 6' },
        { name: 'Clinic 7', location: 'Location 7' },
        { name: 'Clinic 8', location: 'Location 8' },
        { name: 'Clinic 9', location: 'Location 9' },
        { name: 'Clinic 10', location: 'Location 10' },
        { name: 'Clinic 11', location: 'Location 11' },
        { name: 'Clinic 12', location: 'Location 12' },
      ],
      totalCount: 12,
      totalPages: 1,
      currentPage: 1,
      pageSize: 20,
    }

    const result = await searchClinic({ searchTerm, page, limit })
    expect(result).toEqual(expectedResults)
  })

  it('should return an empty array if the search term does not match', async () => {
    const searchTerm = 'Nonexistent'
    const page = 1
    const limit = 10

    const expectedResults: PaginationResult<any[]> = {
      data: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 10,
    }

    const result = await searchClinic({ searchTerm, page, limit })
    expect(result).toEqual(expectedResults)
  })

  it('should throw an error if an error occurs while reading the file', async () => {
    const searchTerm = 'Clinic'
    const page = 1
    const limit = 10

    // Mock the fs.createReadStream to throw an error
    jest.spyOn(fs, 'createReadStream').mockImplementation(() => {
      throw new Error('Mocked file read error')
    })

    await expect(searchClinic({ searchTerm, page, limit })).rejects.toThrow('Mocked file read error')

    jest.spyOn(fs, 'createReadStream').mockRestore()
  }) 
})*/

describe('searchClinic', () => {
  const mockedProps: SearchClinicProps = {
    searchTerm: 'Mayo Clinic',
    page: 1,
    limit: 5,
  }

  /* beforeAll(() => {
    // Set up the mocked file data
    ;(fs.createReadStream as jest.Mock).mockReturnValueOnce({
      on: jest.fn((event: string, callback: any) => {
        if (event === 'data') {
          callback(mockedFileData)
        } else if (event === 'end') {
          callback()
        }
      }),
    })
  }) */

  it('should search for clinics and return paginated results', async () => {
    const expectedResults: SearchResults = {
      results: [
        {
          name: 'Good Health Home',
          stateName: 'Alaska',
          availability: { from: '10:00', to: '19:30' },
          type: 'dental',
        },
        {
          name: 'Mayo Clinic',
          stateName: 'Florida',
          availability: { from: '09:00', to: '20:00' },
          type: 'dental',
        },
        {
          name: 'Hopkins Hospital Baltimore',
          stateName: 'Florida',
          availability: { from: '07:00', to: '22:00' },
          type: 'dental',
        },
      ],
      totalResults: 3,
      totalPages: 1,
      currentPage: 1,
      limit: 5,
    }

    const results = await searchClinic(mockedProps)
    expect(results).toEqual(expectedResults)
  })
})

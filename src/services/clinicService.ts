import fs from 'fs'
import path from 'path'
import { getStateNameByValue, stateNamesMap } from '../lib/stateMap'
import { Transform } from 'stream'
import { Clinic } from '../models/clinic'

export type SearchOptions = {
  searchTerm?: string
  state?: string
  from?: string
  to?: string
  type?: 'vet' | 'dental'
}

export type SearchClinicProps = {
  options?: SearchOptions
  page?: number
  limit?: number
}

export interface SearchResults {
  results: Clinic[]
  totalResults: number
  totalPages: number
  currentPage: number
  limit: number
}

const FILE_PATH = path.join(__dirname, '../database/clinics.json')

function formatData(data: any): Clinic {
  const { name, clinicName, stateName, stateCode, availability, opening, type } = data
  const clinic = {
    name: name ?? clinicName,
    availability: availability ?? opening,
    stateName: stateName ?? getStateNameByValue(stateCode),
    type,
  }

  return clinic
}

function isValidClinic(clinic: Clinic, searchOptions: SearchOptions): boolean {
  const { searchTerm, state, from, to, type } = searchOptions
  let include = true

  if (!clinic) return false

  //Filter by any term typed
  if (searchTerm) {
    if (!clinic.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      include = false
    }
  }

  // Filter by state
  if (state) {
    if (state.length > 2) {
      if (clinic.stateName.toLowerCase() !== state.toLowerCase()) {
        include = false
      } else {
        if (stateNamesMap[clinic.stateName].toLowerCase() !== state.toLowerCase()) {
          include = false
        }
      }
    }
  }

  // Filter by openning time
  if (from) {
    const availabilityFrom = clinic.availability.from
    const hour = parseInt(availabilityFrom.split(':')[0])
    const minute = parseInt(availabilityFrom.split(':')[1])

    const fromHour = parseInt(from.split(':')[0])
    const fromMinute = parseInt(from.split(':')[1])

    if (fromHour < hour) {
      include = false
    } else {
      if (fromHour === hour && fromMinute < minute) {
        include = false
      }
    }
  }

  // Filter by closing time
  if (to) {
    const availabilityTo = clinic.availability.to
    const hour = parseInt(availabilityTo.split(':')[0])
    const minute = parseInt(availabilityTo.split(':')[1])

    const toHour = parseInt(to.split(':')[0])
    const toMinute = parseInt(to.split(':')[1])

    if (toHour > hour) {
      include = false
    } else {
      if (toHour === hour && toMinute > minute) {
        include = false
      }
    }
  }

  // Filter by type
  if (type) {
    if (clinic.type !== type) {
      include = false
    }
  }

  return include
}

type JsonObject = { [key: string]: any }

export async function searchClinic(props: SearchClinicProps): Promise<SearchResults> {
  const { options, page = 1, limit = 10 } = props
  const results: Clinic[] = []
  let currentPage: Clinic[] = []
  let pageIndex = 0
  let partialJson = ''
  let totalResults = 0

  return new Promise<SearchResults>((resolve, reject) => {
    const readStream = fs.createReadStream(FILE_PATH, { encoding: 'utf8' })

    readStream.on('data', (chunk: string) => {
      const trimmedChunk = chunk.trim()
      partialJson += trimmedChunk

      try {
        const objects = parseJsonObjects(partialJson)
        let clinics: Clinic[] = objects.map(o => formatData(o))
        clinics = clinics.filter(c => isValidClinic(c, options ?? {}))
        currentPage.push(...clinics)
        totalResults += clinics.length

        while (currentPage.length >= limit) {
          if (pageIndex + 1 === page) {
            results.push(...currentPage.splice(0, limit))
          } else {
            currentPage.splice(0, limit)
          }
          pageIndex++
        }

        partialJson = '' // Reset the partial JSON
      } catch (error) {
        // Incomplete JSON, wait for more data
      }
    })

    readStream.on('end', () => {
      if (currentPage.length > 0 && pageIndex + 1 === page) {
        results.push(...currentPage)
      }

      resolve({
        results,
        totalResults,
        totalPages: Math.ceil(totalResults / limit),
        currentPage: page,
        limit,
      })
    })

    readStream.on('error', error => {
      reject(error)
    })
  })
}

/* export async function searchClinic(props: SearchClinicProps): Promise<SearchResults> {
  const { options, page = 1, limit = 10 } = props
  const results: Clinic[] = []
  let currentPage: Clinic[] = []
  let pageIndex = 0
  let partialJson = ''

  return new Promise<SearchResults>((resolve, reject) => {
    const readStream = fs.createReadStream(FILE_PATH, { encoding: 'utf8' })

    readStream.on('data', (chunk: string) => {
      const trimmedChunk = chunk.trim()
      partialJson += trimmedChunk

      try {
        const objects = parseJsonObjects(partialJson)
        let clinics: Clinic[] = objects.map(o => formatData(o))
        clinics = clinics.filter(c => isValidClinic(c, options ?? {}))
        currentPage.push(...clinics)

        while (currentPage.length >= limit) {
          if (pageIndex + 1 === page) {
            results.push(...currentPage.splice(0, limit))
          } else {
            currentPage.splice(0, limit)
          }
          pageIndex++
        }

        partialJson = '' // Reset the partial JSON
      } catch (error) {
        // Incomplete JSON, wait for more data
      }
    })

    readStream.on('end', () => {
      if (currentPage.length > 0 && pageIndex + 1 === page) {
        results.push(...currentPage)
      }

      resolve({
        results,
        totalResults: 0,
        totalPages: results.length > 0 ? pageIndex + 1 : 0,
        currentPage: page,
        limit,
      })
    })

    readStream.on('error', error => {
      reject(error)
    })
  })
} */

function parseJsonObjects(input: string): JsonObject[] {
  const objects: JsonObject[] = []
  let startIndex = 0
  let endIndex = -1

  while ((startIndex = input.indexOf('{', endIndex + 1)) !== -1) {
    endIndex = findMatchingClosingBrace(input, startIndex)
    if (endIndex === -1) {
      // Incomplete JSON object, wait for more data
      break
    }
    const jsonStr = input.slice(startIndex, endIndex + 1)
    try {
      const object = JSON.parse(jsonStr)
      objects.push(object)
    } catch (error) {
      // Invalid JSON object, skip
    }
  }

  return objects
}

function findMatchingClosingBrace(input: string, startIndex: number): number {
  let count = 0
  for (let i = startIndex; i < input.length; i++) {
    if (input[i] === '{') {
      count++
    } else if (input[i] === '}') {
      count--
      if (count === 0) {
        return i
      }
    }
  }
  return -1
}

/* readStream.on('end', () => {
      resolve({ results, totalResults: 0, totalPages: 0, currentPage: 0, limit: 0 })
    }) */

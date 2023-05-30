import { Response } from 'express'
import httpResponse, { HTTPResponse, ResponseContent } from '../src/lib/responses'

describe('httpResponse', () => {
  it('should return a successful response with data', () => {
    const response: ResponseContent<string> = {
      data: 'Hello World',
    }

    const expected: HTTPResponse<string> = {
      success: true,
      data: 'Hello World',
    }

    expect(httpResponse(response)).toEqual(expected)
  })

  it('should return a successful response with message', () => {
    const response: ResponseContent<string> = {
      message: 'Request completed successfully',
    }

    const expected: HTTPResponse<string> = {
      success: true,
      message: 'Request completed successfully',
    }

    expect(httpResponse(response)).toEqual(expected)
  })

  it('should return an error response', () => {
    const response: ResponseContent<string> = {
      error: 'Internal server error',
    }

    const expected: HTTPResponse<string> = {
      success: false,
      error: 'Internal server error',
    }

    expect(httpResponse(response)).toEqual(expected)
  })

  it('should return an error response when neither data, error, nor message is provided', () => {
    const response: ResponseContent<string> = {}

    const expected: HTTPResponse<string> = {
      success: false,
      message: 'data or error or message has to be filled in response',
    }

    expect(httpResponse(response)).toEqual(expected)
  })
})

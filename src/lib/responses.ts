import { Response } from 'express'

export type HTTPResponse<T> = {
  success: boolean
  message?: string
  data?: T | null | undefined
  error?: string
}

export type ResponseContent<T> = Omit<HTTPResponse<T>, 'success'>

const httpResponse = <T>(response: ResponseContent<T>): HTTPResponse<T> => {
  const { data, error, message } = response
  let success = true

  if (!data && !error && !message) {
    return {
      success: false,
      message: 'data or error or message has to be filled in response',
    }
  }

  if (error && error !== null) {
    success = false
  }

  return {
    success,
    message,
    data,
    error,
  }
}

export default httpResponse

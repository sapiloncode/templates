import { config } from '@src/config'
import { PATH_GENERAL_ERROR } from '@src/constants'
import { ErrorCode, HttpStatus } from '@src/types'
import axios, { AxiosError } from 'axios'
import urlJoin from 'url-join'

type WebMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export async function apiCall<T>(
  path: string,
  method: WebMethod = 'GET',
  body: unknown = null,
  params = {}
): Promise<T> {
  if (!config.apiBaseUri) {
    throw new Error('API base URI is not set')
  }
  const url = urlJoin(config.apiBaseUri, path)
  const headers: Record<string, string> = {}
  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  if (config.authToken) {
    headers['authorization'] = `Bearer ${config.authToken}`
  }

  try {
    const res = await axios(url, {
      ...params,
      method: method,
      headers: headers,
      data: body != null ? JSON.stringify(body) : undefined,
    })

    return res.data
  } catch (err) {
    const axiosError: AxiosError = err

    if (axiosError.message === 'Network Error') {
      window.location.href = `/${PATH_GENERAL_ERROR}?error=${ErrorCode.ECONNREFUSED}`
      return null
    } else if (axiosError.response?.status === HttpStatus.UNAUTHORIZED) {
      location.href = config.signinUrl
    } else if (axiosError.response?.data) {
      const data = axiosError.response.data
      const statusCode = (data as { statusCode: number | undefined }).statusCode
      if (statusCode === HttpStatus.UNAUTHORIZED) {
        location.href = config.signinUrl
      }
      throw data
    }
    console.error('api', err)
    throw err
  }
}

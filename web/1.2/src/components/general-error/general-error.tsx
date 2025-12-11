import { $t } from '@src/i18n'
import { ErrorCode } from '@src/types/http'
import queryString from 'query-string'
import React from 'react'
import { Icon } from '../icon/icon'

export const GeneralError: React.FC = () => {
  const params = queryString.parse(location.search)
  let { error } = params
  const { message } = params

  if (message == 'ECONNREFUSED') {
    error = ErrorCode.ECONNREFUSED
  }

  switch (error) {
    case ErrorCode.ECONNREFUSED:
      return (
        <div className="flex flex-col gap-4 h-screen w-screen items-center justify-center">
          <Icon icon="wifi_off" className="!text-8xl text-gray-700" />
          <p>Oops! error connecting to the server!</p>
          <a
            href="/"
            className="border border-gray-300 px-4 py-1 rounded-md hover:bg-gray-500 hover:border-white hover:text-white"
          >
            {$t.GO_BACK_HOME}
          </a>
        </div>
      )

    case ErrorCode.NOT_FOUND:
      return (
        <div className="flex flex-col gap-4 h-screen w-screen items-center justify-center text-red-500">
          <h1 className="text-8xl">404</h1>
          <p>{$t.ADDRESS_NOT_FOUND}</p>
          <a
            href="/"
            className="border border-gray-300 px-4 py-1 rounded-md hover:bg-white hover:border-white hover:text-black"
          >
            {$t.GO_BACK_HOME}
          </a>
        </div>
      )

    default:
      return (
        <div className="flex flex-col gap-4 h-screen w-screen items-center justify-center text-red-500">
          <h1>Oops</h1>
          <p>{message ? decodeURIComponent(String(message)) : $t.GENERAL_ERROR}</p>
          <a
            href="/"
            className="border border-gray-300 px-4 py-1 rounded-md hover:bg-white hover:border-white hover:text-black"
          >
            {$t.GO_BACK_HOME}
          </a>
        </div>
      )
  }
}

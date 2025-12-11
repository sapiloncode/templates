export enum HttpStatus {
  // 1xx — Informational
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,

  // 2xx — Success
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  // 4xx — Client Error
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,

  // 5xx — Server Error
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

export enum ErrorCode {
  ECONNREFUSED = 'ECONNREFUSED',
  NOT_FOUND = 'NOT_FOUND',
}

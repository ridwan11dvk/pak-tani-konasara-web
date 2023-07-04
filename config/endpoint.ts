export const VERSION = "v1"

/**
 * services
 */


export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL + '/' + VERSION


// user management
export const AUTH_API = {
  LOGIN: `${BASE_API_URL}/auth/login`,
  USERS: `${BASE_API_URL}/users`,
  CALLERS: `${BASE_API_URL}/callers`,
  ORDERS: `${BASE_API_URL}/orders`,
  CANDIDATES: `${BASE_API_URL}/candidates`,
  CALL_HISTORY: `${BASE_API_URL}/call-history`,
  CALL_LIST: `${BASE_API_URL}/call-list`,
  NOTIFICATION: `${BASE_API_URL}/notification`,
  PROFILE: `${BASE_API_URL}/profile`,
}

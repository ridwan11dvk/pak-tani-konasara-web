import { AUTH_API } from "@/config/endpoint"
import apiCall from "./apiCall"

export const loginService = async (payload: any) => {
    const res = await apiCall.post(`${AUTH_API.LOGIN}`, payload)
    return res.data
}

export const registerService = async (payload: any) => {
  const res = await apiCall.post(`${AUTH_API.REGISTER}`, payload)
  return res.data
}
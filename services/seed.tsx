import { AUTH_API } from "@/config/endpoint"
import apiCall from "./apiCall"
import { serialize } from "@/utils/helper"

export const getListSeed = async (payload: any) => {
    const res = await apiCall.get(`${AUTH_API.SEED}?${serialize(payload)}`)
    return res.data
}

export const postRequestSeed = async (payload: any) => {    
    const res = await apiCall.post(`${AUTH_API.REQUEST_SEED}`, payload)
    return res.data
}


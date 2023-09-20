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

export const getAllRequestSeedByAuthorId = async (id:any, payload: any) => {    

    const res = await apiCall.get(`${AUTH_API.REQUEST_SEED}/${id}?${serialize(payload)}`)
    return res.data
}

export const deleteRequestSeed = async (id: any) => {    
    const res = await apiCall.delete(`${AUTH_API.REQUEST_SEED}/${id}`)
    return res.data
}


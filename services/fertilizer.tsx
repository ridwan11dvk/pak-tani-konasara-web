import { AUTH_API } from "@/config/endpoint"
import apiCall from "./apiCall"
import { serialize } from "@/utils/helper"

export const getListFertilizer = async (payload: any) => {
    const res = await apiCall.get(`${AUTH_API.FERTILIZER}?${serialize(payload)}`)
    return res.data
}

export const postRequestFertilizer = async (payload: any) => {    
    const res = await apiCall.post(`${AUTH_API.REQUEST_FERTILIZER}`, payload)
    return res.data
}

export const putRequestFertilizer = async (id: any,payload: any) => {    
    const res = await apiCall.put(`${AUTH_API.REQUEST_FERTILIZER}/${id}`, payload)
    return res.data
}

export const getAllRequestFertilizerByAuthorId = async (id:any, payload: any) => {    

    const res = await apiCall.get(`${AUTH_API.REQUEST_FERTILIZER}/${id}?${serialize(payload)}`)
    return res.data
}

export const deleteRequestFertilizer = async (id: any) => {    
    const res = await apiCall.delete(`${AUTH_API.REQUEST_FERTILIZER}/${id}`)
    return res.data
}


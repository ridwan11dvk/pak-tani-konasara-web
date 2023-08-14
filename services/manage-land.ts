import { AUTH_API } from "@/config/endpoint"
import apiCall from "./apiCall"
import { serialize } from "@/utils/helper"

export const getLandService = async (payload: any) => {
    const res = await apiCall.get(`${AUTH_API.MANAGE_LAND}?${serialize(payload)}`)
    return res.data
}

export const getLandByAuthorIdService = async (payload: any, authorId: any) => {
    const res = await apiCall.get(`${AUTH_API.MANAGE_LAND}/${authorId}?${serialize(payload)}`)
    return res.data
}

export const postLandService = async (payload: any) => {    
    const res = await apiCall.post(`${AUTH_API.MANAGE_LAND}`, payload)
    return res.data
}

export const putLandService = async (payload: any, id: string) => {
    const res = await apiCall.put(`${AUTH_API.MANAGE_LAND}/${id}`, payload)
    return res.data
}

export const deleteLandService = async (id: string) => {
    const res = await apiCall.delete(`${AUTH_API.MANAGE_LAND}/${id}`)
    return res.data
}


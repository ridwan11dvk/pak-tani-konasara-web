import { AUTH_API } from "@/config/endpoint"
import apiCall from "./apiCall"
import { serialize } from "@/utils/helper"

export const getLandService = async (payload: any) => {
    const res = await apiCall.get(`${AUTH_API.MANAGE_LAND}?${serialize(payload)}`)
    return res.data
}

// export const userServiceByUserId = async (id: any, payload: any, ) => {
//     const res = await apiCall.get(`${AUTH_API.USERS}/list/${id}?${serialize(payload)}`)
//     return res.data
// }

// export const detailUserService = async (id: any) => {
//     const res = await apiCall.get(`${AUTH_API.USERS}/${id}`)
//     return res.data
// }


export const postLandService = async (payload: any) => {    
    const res = await apiCall.post(`${AUTH_API.MANAGE_LAND}`, payload)
    return res.data
}

export const putLandService = async (payload: any, id: string) => {
    const res = await apiCall.patch(`${AUTH_API.MANAGE_LAND}/${id}`, payload)
    return res.data
}

// export const patchUpdatePassword = async (id: string , payload: any) => {
//     const res = await apiCall.patch(`${AUTH_API.MANAGE_LAND}/update-password/${id}`, payload)
//     return res.data
// }

export const deleteLandService = async (id: string) => {
    const res = await apiCall.delete(`${AUTH_API.MANAGE_LAND}/${id}`)
    return res.data
}


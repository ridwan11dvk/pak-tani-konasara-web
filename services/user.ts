import { AUTH_API } from "@/config/endpoint"
import apiCall from "./apiCall"
import { serialize } from "@/utils/helper"
import { AddUserType } from "@/types/user"

export const userService = async (payload: any) => {
    const res = await apiCall.get(`${AUTH_API.USERS}?${serialize(payload)}`)
    return res.data
}

export const detailUserService = async (id: any) => {
    const res = await apiCall.get(`${AUTH_API.USERS}/${id}`)
    return res.data
}

export const callerService = async () => {
    const res = await apiCall.get(`${AUTH_API.CALLERS}?page=1&limit=1000`)
    return res.data
}

export const postUserService = async (payload: AddUserType) => {
    const res = await apiCall.post(`${AUTH_API.USERS}`, payload)
    return res.data
}

export const patchUserService = async (payload: AddUserType, id: string) => {
    const res = await apiCall.patch(`${AUTH_API.USERS}/${id}`, payload)
    return res.data
}

export const deleteUserService = async (id: string) => {
    const res = await apiCall.delete(`${AUTH_API.USERS}/${id}`)
    return res.data
}


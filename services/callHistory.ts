import { AUTH_API } from "@/config/endpoint"
import apiCall from "./apiCall"
import { serialize } from "@/utils/helper"

export const callHistoryService = async (payload: any, id: any) => {
    const res = await apiCall.get(`${AUTH_API.CALL_HISTORY}/${id}?${serialize(payload)}`)
    return res.data
}

export const deleteCallHistoryService = async (id: string) => {
    const res = await apiCall.delete(`${AUTH_API.CALL_HISTORY}/${id}`)
    return res.data
}

export const getAudioService = async (key: string) => {
    const res = await apiCall.get(`${AUTH_API.CALL_HISTORY}/audio/${key}`)
    return res.data
}
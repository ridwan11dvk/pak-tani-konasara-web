import { AUTH_API } from "@/config/endpoint"
import apiCall from "./apiCall"
import { serialize } from "@/utils/helper"
import { CandidateType, PatchCandidateType } from "@/types/candidate"

export const candidateService = async (payload: any) => {
    const res = await apiCall.get(`${AUTH_API.CANDIDATES}?${serialize(payload)}`)
    return res.data
}

export const candidateByUserIdService = async (id: any,payload: any) => {
    const res = await apiCall.get(`${AUTH_API.CANDIDATES}/user/${id}?${serialize(payload)}`)
    return res.data
}

export const detailCandidateService = async (id: any) => {
    const res = await apiCall.get(`${AUTH_API.CANDIDATES}/${id}`)
    return res.data
}

export const postCandidateService = async (payload: CandidateType) => {
    const res = await apiCall.post(`${AUTH_API.CANDIDATES}`, payload)
    return res.data
}

export const patchCandidateService = async (payload: PatchCandidateType) => {
    const res = await apiCall.patch(`${AUTH_API.CANDIDATES}/${payload.id}`, payload.body)
    return res.data
}

export const deleteCandidateService = async (id?: string) => {
    const res = await apiCall.delete(`${AUTH_API.CANDIDATES}/${id}`)
    return res.data
}
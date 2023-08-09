import { NotificationType } from "@/types/notification";
import apiCall from "./apiCall";
import { AUTH_API } from "@/config/endpoint";

export const postNotificationService = async (payload: NotificationType) => {
    const res = await apiCall.post(`${AUTH_API.NOTIFICATION}`, payload);
    return res.data;
  };
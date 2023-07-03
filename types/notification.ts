import { DefaultApiResponse } from "./general"

export type NotificationType = {
    id_user?: string, 
    title: string, 
    message: string, 
    to?: string, 
    path?: string
}

export type NotificationPostApiResponse = DefaultApiResponse & {
    data: NotificationType
}
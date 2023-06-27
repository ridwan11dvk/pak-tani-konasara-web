import { DefaultApiResponse, PaginationReponse } from "./general";

export type CallHistoryType = {
  _id: string;
  id_user: string;
  id_order: string;
  id_call_list: string;
  date: string;
  note: string;
  audio: string;
  createdAt: string;
  updatedAt: string;
};

export type CallHistoryApiResponseType = DefaultApiResponse &
  PaginationReponse & {
    data: CallHistoryType[];
  };

export type SingleCallHistoryApiResponseType = DefaultApiResponse & {
  data: CallHistoryType;
}

export type AudioType = {
  url: string;
};

export type AudioApiResponseType = DefaultApiResponse & {
    data: AudioType;
  };

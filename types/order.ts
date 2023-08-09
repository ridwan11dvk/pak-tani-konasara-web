import { UserDataInterface } from "@/hooks/useLogin";
import exp from "constants";

export type OrderType = {
  _id: string;
  id_user: string;
  title: string;
  order_date: string;
  finish_by_days: string;
  order_by: string;
  overview: string;
  detail: string;
  createdAt: string;
  updatedAt: string;
  call_list: CallType[];
  status: OrderStatusType;
  caller?: UserDataInterface
};

export type CallType = {
  createdAt?: string;
  email: string;
  id_caller?: string;
  id_candidate?: string;
  id_order?: string | string[];
  last_contact: string;
  name: string;
  phone_number: string;
  status: string;
  updatedAt?: string;
  _id?: string;
};

export type AddOrderType = {
  _id?: string;
  id_user?: string | string[];
  title?: string;
  order_date?: string;
  finish_by_days?: string;
  order_by?: string;
  overview?: string;
  detail?: string;
  caller?: UserDataInterface
};

export type PatchAddOrderType = {
  body: AddOrderType;
  id: string | string[];
};

export type PatchCallListType = {
  body: CallType;
  id?: string;
};

export type OrderStatusType = {
  no_call: number;
  positive: number;
  negative: number;
  need_follow_up: number;
  total_call: number;
};

export type OrderApiResponse = {
  status: boolean;
  message: string;
  data: OrderType[];
  page: string;
  limit: string;
  total: string;
  totalPages: string | number;
};

export type OrderApiDetailResponseType = {
  status: boolean;
  message: string;
  data: OrderType;
};

export type AddOrderApiResponseType = {
  status: true;
  message: string;
  data: OrderType;
};

export type SingleCallListApiResponseType = {
  status: true;
  message: string;
  data: CallType;
};

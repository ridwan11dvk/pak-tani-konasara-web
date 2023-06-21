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
  call_list: any[];
  status: OrderStatusType;
};

export type AddOrderType = {
  _id?: string;
  id_user?: string | string[];
  title: string;
  order_date: string;
  finish_by_days: string;
  order_by: string;
  overview: string;
  detail: string;
};

export type PatchAddOrderType = {
  body: AddOrderType
  id: string | string[]
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

export type AddOrderApiResponseType = {
  status: true;
  message: string;
  data: OrderType;
};

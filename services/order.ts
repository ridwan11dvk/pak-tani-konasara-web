import { AUTH_API } from "@/config/endpoint";
import apiCall from "./apiCall";
import { serialize } from "@/utils/helper";
import { AddOrderType } from "@/types/order";

export const orderService = async (payload: any) => {
  const res = await apiCall.get(`${AUTH_API.ORDERS}?${serialize(payload)}`);
  return res.data;
};

export const orderDetailService = async (id: string | string[]) => {
  const res = await apiCall.get(`${AUTH_API.ORDERS}/${id}`);
  return res.data;
};

export const orderByUserIdService = async (payload: any, userId: string | string[]) => {
  const res = await apiCall.get(
    `${AUTH_API.ORDERS}/user/${userId}?${serialize(payload)}`
  );
  return res.data;
};

export const postOrderService = async (payload: AddOrderType) => {
  const res = await apiCall.post(`${AUTH_API.ORDERS}`, payload);
  return res.data;
};

export const patchOrderService = async (payload: AddOrderType, id: string | string[]) => {
    const res = await apiCall.patch(`${AUTH_API.ORDERS}/${id}`, payload)
    return res.data
}

export const deleteOrderService = async (id: string) => {
    const res = await apiCall.delete(`${AUTH_API.ORDERS}/${id}`)
    return res.data
}

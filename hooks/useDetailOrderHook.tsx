import { orderDetailService } from "@/services/order";
import { OrderApiDetailResponseType } from "@/types/order";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export const ORDER_DETAIL_KEY = "order-detail-key";

export const useDetailOrderHook = () => {
    const { query } = useRouter()
    const id = query?.id || ""
    const { data, isLoading, refetch } = useFetchDetailOrder(id);

    return {
        data: data?.data,
    }
}

export const useFetchDetailOrder = (id: string | string[]) => {
    return useQuery<OrderApiDetailResponseType, AxiosError>([ORDER_DETAIL_KEY, id], () =>
        orderDetailService(id), {enabled: !!id}
    );
};


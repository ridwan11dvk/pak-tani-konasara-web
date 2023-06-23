import { orderDetailService } from "@/services/order";
import { OrderApiDetailResponseType } from "@/types/order";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export const callListColumns: any[] = [
    {
        key: "name",
        label: "Name",
    },
    // {
    //     key: "cell",
    //     label: "Status",
    //     render: (data: any) => {
    //         return StatusComponent(data?.row?.original)
    //     },
    // },
    {
        key: "email",
        label: "Email",
    },
    {
        key: "phone_number",
        label: "Phone Number",
    },
    {
        key: "last_contact",
        label: "Last Contact",
    }
];

export const ORDER_DETAIL_KEY = "order-detail-key";


export const useDetailOrderHook = () => {
    const { query } = useRouter()
    const id = query?.id || ""
    const { data, isLoading, refetch } = useFetchDetailOrder(id);
    
    return {
        detailOrder: data?.data,
        dataTable: data?.data?.call_list || [],
        callListColumns
    }
}

export const useFetchDetailOrder = (id: string | string[]) => {
    return useQuery<OrderApiDetailResponseType, AxiosError>([ORDER_DETAIL_KEY, id], () =>
        orderDetailService(id), {enabled: !!id}
    );
};


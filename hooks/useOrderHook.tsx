import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';
import { AiFillPhone, AiOutlineCheck, AiOutlineClose, AiOutlineQuestion } from 'react-icons/ai';
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AddOrderApiResponseType, AddOrderType, OrderApiResponse, OrderType, PatchAddOrderType } from '@/types/order';
import { deleteOrderService, orderByUserIdService, orderService, patchOrderService, postOrderService } from '@/services/order';
import { AxiosError } from 'axios';
import { defaultPerPage } from '@/utils/constant';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import useUserStore from '@/stores/useUser';
import { useHandlingHttpToast } from '@/utils/helper';
import { useRouter } from 'next/router';

export const orderColumns: any[] = [
    {
        key: "title",
        label: "Name",
    },
    {
        key: "cell",
        label: "Status",
        render: (data: any) => {
            return StatusComponent(data?.row?.original)
        },
    },
    {
        key: "cell",
        label: "Order Details",
        render: (data: any) => ViewCell(data?.row?.original),
    }
];

const schema = yup
    .object({
        title: yup.string().required(),
        order_date: yup.string().required(),
        finish_by_days: yup.string().required(),
        order_by: yup.string().required(),
        overview: yup.string().required(),
        detail: yup.string().required(),
    })
    .required();

export const useOrderHook = () => {
    const { query } = useRouter();
    const userId = query?.userId || '';
    const [selectedData, setSelectedData] = useState<OrderType | null>(
        null
    );
    const [params, setParams] = useState({
        page: 1,
        limit: defaultPerPage,
        search: "",
    });
    const { data: dataOrders, isLoading, refetch } = useFetchOrders(params)
    const { data: dataOrdersById, isLoading: isLoadingFetchById, refetch: refetchByUserId } = useFetchOrdersByUserId(params, userId)
    const mutationPost = usePostOrder();
    const mutationPatch = usePatchOrder();
    const mutationDelete = useDeleteOrder();
    const { userData } = useUserStore();
    const { successToast, errorToast } = useHandlingHttpToast();
    const queryClient = useQueryClient();

    const orderForm = useForm<AddOrderType>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (params.limit || params.page || params.search) {
            if (userId) {
                refetchByUserId()
            }
            refetch()
        }
    }, [params.page, params.limit, params.search]);

    const handleSelectedData = (data?: OrderType) => {
        if (data) {
            setSelectedData(data);
        } else {
            setSelectedData(null);
        }
    };

    const onSubmit = async (payload: AddOrderType): Promise<any> => {
        try {
            const cpPayload: AddOrderType = { ...payload, id_user: selectedData ? userData?._id : userId  };

            // Make the HTTP request to the backend server
            let response = null;
            if (!selectedData) {
                response = await mutationPost.mutateAsync(cpPayload);
            } else {
                delete cpPayload?._id
                response = await mutationPatch.mutateAsync({
                    body: cpPayload,
                    id: selectedData?._id,
                });
            }
            successToast(response?.message);
            handleSelectedData()
            if (userId) {
                refetchByUserId()
            } else {
                queryClient.invalidateQueries([ORDER_KEY]);
            }
            orderForm.reset();
            return response || null;
            // Additional logic for handling the response
        } catch (error: any) {
            // Show error toast notification
            errorToast(error);

            // Additional error handling logic
        }
    };

    const onDeleteOrder = async (id: string) => {
        try {
          const response = await mutationDelete.mutateAsync(id);
          
          successToast(response?.message);
          handleSelectedData()
          if (userId) {
            refetchByUserId()
        } else {
            queryClient.invalidateQueries([ORDER_KEY]);
        }
          return response || null;
          // Additional logic for handling the response
        } catch (error: any) {
          // Show error toast notification
          errorToast(error);
    
          // Additional error handling logic
        }
      }

    return ({
        dataOrders: dataOrdersById?.data ? dataOrdersById?.data || [] : dataOrders?.data || [],
        isLoadingGetOrders: isLoading || isLoadingFetchById,
        setQueryParams: setParams,
        params,
        totalPages: dataOrders?.totalPages || 0,
        orderForm,
        mutationPost,
        mutationPatch,
        onSubmit,
        selectedData,
        handleSelectedData,
        onDeleteOrder,
        mutationDelete
    })
}

export const ORDER_KEY = "order-key";

export const useFetchOrders = (params: any) => {
    return useQuery<OrderApiResponse, AxiosError>([ORDER_KEY, params], () =>
        orderService(params)
    );
};

export const useFetchOrdersByUserId = (params: any, userId: string | string[]) => {
    return useQuery<OrderApiResponse, AxiosError>([ORDER_KEY, params, userId], () =>
        orderByUserIdService(params, userId), { enabled: !!userId }
    );
};

export const usePostOrder = () => {
    return useMutation<AddOrderApiResponseType, AxiosError, AddOrderType>((data) =>
        postOrderService(data)
    );
};

export const usePatchOrder = () => {
    return useMutation<AddOrderApiResponseType, AxiosError, PatchAddOrderType>((data) =>
        patchOrderService(data?.body, data?.id)
    );
};

export const useDeleteOrder = () => {
    return useMutation<AddOrderApiResponseType, AxiosError, string>((id) =>
        deleteOrderService(id)
    );
};

export function ViewCell(value: any) {
    return <Button colorScheme='blue'>View</Button>
}

export function StatusComponent(value: OrderType) {
    return <Box>
        <Flex alignItems="center" gap={2}>
            <Icon boxSize={6} as={AiFillPhone} />
            <Text>{value?.status?.no_call || 0}</Text>
            <Icon boxSize={6} color="green" as={AiOutlineCheck} />
            <Text>{value?.status?.positive || 0}</Text>
        </Flex>
        <Flex alignItems="center" gap={2} pt={4}>
            <Icon boxSize={6} color="red" as={AiOutlineClose} />
            <Text>{value?.status?.negative || 0}</Text>
            <Icon boxSize={6} as={AiOutlineQuestion} />
            <Text>{value?.status?.need_follow_up || 0}</Text>
        </Flex>
    </Box>
}

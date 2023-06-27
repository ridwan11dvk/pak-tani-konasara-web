import { deleteCallListService, insertManyCandidateService, orderDetailService, patchCallListService } from "@/services/order";
import { AddOrderType, CallType, OrderApiDetailResponseType, PatchCallListType, SingleCallListApiResponseType } from "@/types/order";
import { ORDER_DETAIL_KEY, ORDER_STATUS, ROLE_STATUS, orderStatusOptions } from "@/utils/constant";
import { AxiosError } from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useFetchCandidates } from "./useCandidate";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InsertManyCandidateApiResponseType, InsertManyCandidateType } from "@/types/candidate";
import { useForm } from "react-hook-form";
import { serialize, useHandlingHttpToast } from "@/utils/helper";
import { usePatchOrder } from "./useOrderHook";
import { useFetchUsers } from "./useUserHook";
import { useState } from "react";
import { Button } from "@chakra-ui/react";

export const callListColumns: any[] = [
    {
        key: "name",
        label: "Name",
    },
    {
        key: "label_status",
        label: "Status"
    },
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
    },
    {
        key: "cell",
        label: "Detail",
        render: (data: any) => ViewCell(data?.row?.original)
    }
];

const schema = yup.object({
    id_candidates: yup.mixed().required().test({
        name: "id_candidates",
        message: "Please select at least one candidate",
        test: (value: any) => {
            return value?.length > 0;
        }
    })
}).required();

const schema2 = yup.object({
    status: yup.mixed().test({
        name: "status",
        message: "Please select status",
        test: (value: any) => {
            return value !== undefined || value !== null;
        }
    })
}).required();

const schema3 = yup.object({
    name: yup.string().required(),
    email: yup.string().required(),
    phone_number: yup.string().required(),
    last_contact: yup.string().required(),
    status: yup.string().required(),
}).required();

export const useDetailOrderHook = () => {
    const { query } = useRouter()
    const id = query?.id || ""
    const [selectedData, setSelectedData] = useState<CallType | null>(
        null
    );
    const { data, isLoading, refetch } = useFetchDetailOrder(id);
    const { data: dataCandidates, isLoading: isLoadingCandidate, refetch: refetchCandidates } = useFetchCandidates({ page: 1, limit: 1000, search: "" });
    const { data: dataUser, isLoading: isLoadingUser } = useFetchUsers({ page: 1, limit: 1000, search: "" });
    const mutationPost = usePostInsertManyCandidate()
    const mutationPatch = usePatchOrder()
    const mutationDelete = useDeleteCallList()
    const mutationPatchCallList = usePatchCallList()
    const { successToast, errorToast } = useHandlingHttpToast();
    const insertManyCandidateForm = useForm<InsertManyCandidateType>({
        resolver: yupResolver(schema),
        defaultValues: {
            id_candidates: [],
        },
    });

    const callerForm = useForm<any>({
        resolver: yupResolver(schema2),
        defaultValues: {
            caller: undefined,
        },
    });

    const callListForm = useForm<CallType>({
        resolver: yupResolver(schema3),
    });

    const handleSelectedData = (data?: CallType) => {
        if (data) {
            setSelectedData(data);
        } else {
            setSelectedData(null);
        }
    };

    const onSubmitInsertManyCandidate = async (data: InsertManyCandidateType) => {
        try {
            const cpPayload = { ...data, id_candidates: data?.id_candidates?.map((el) => el?._id), id_order: id }
            let response = null;
            response = await mutationPost.mutateAsync(cpPayload);

            refetch()
            successToast(response?.message);
            insertManyCandidateForm.reset();
            return response || null;
        } catch (error: AxiosError | any) {
            errorToast(error);
        }
    };

    const onSubmitCaller = async (payload: any) => {
        try {
            const cpPayload: AddOrderType = { 
                id_user: data?.data?.id_user,
                title: data?.data?.title,
                order_date: data?.data?.order_date,
                finish_by_days: data?.data?.finish_by_days,
                order_by: data?.data?.order_by,
                overview: data?.data?.overview,
                detail: data?.data?.detail,
                caller: {
                    name: payload?.caller?.name,
                    role: payload?.caller?.role,
                    email: payload?.caller?.email,
                }
            }

            const payloadData = {
                body: cpPayload,
                id: id
            }

            let response = null;
            response = await mutationPatch.mutateAsync(payloadData);

            refetch()
            successToast(response?.message);
            insertManyCandidateForm.reset();
            return response || null;
        }
        catch (error: AxiosError | any) {
            errorToast(error);
        }
    };

    const onDeleteCallList = async (id: string) => {
        try {
            const response = await mutationDelete.mutateAsync(id);

            successToast(response?.message);
            handleSelectedData()
            refetch()
            return response || null;
            // Additional logic for handling the response
        } catch (error: any) {
            // Show error toast notification
            errorToast(error);

            // Additional error handling logic
        }
    }

    const onSubmitEditCallList = async (payload: CallType): Promise<any> => {
        try {
            const cpPayload = { 
                ...payload,
                id_candidate: selectedData?.id_candidate,
                id_caller: selectedData?.id_caller,
                id_order: id,
            }

            let payloadBody = {
                body: cpPayload,
                id: selectedData?._id
            }

            const response = await mutationPatchCallList.mutateAsync(payloadBody);
            successToast(response?.message);
            callListForm.reset({});
            handleSelectedData()
            refetch()
            return response
        }
        catch (error: AxiosError | any) {
            errorToast(error);
        }
    };

    return {
        detailOrder: data?.data,
        dataTable: data?.data?.call_list?.length ? data?.data?.call_list?.map((el: CallType) => ({ ...el, 
            label_status: orderStatusOptions?.find(ele => ele?.value === el?.status)?.label || '',
            last_contact: moment(el.last_contact).isValid() ? moment(el.last_contact).format('YYYY-MM-DD') : el?.last_contact 
        })) : [],
        callListColumns,
        candidateOptions: dataCandidates?.data?.length ? dataCandidates?.data?.map((el) => ({ ...el, label: el?.name, value: el?._id })) : [],
        callerOptions: dataUser?.data?.length ? dataUser?.data?.filter((el) => el?.role === ROLE_STATUS.caller.value)?.map((ele) => ({...ele, value: ele?._id, label: ele?.name})) : [],
        isLoading: isLoading || isLoadingCandidate,
        onSubmit: onSubmitInsertManyCandidate,
        mutationPost,
        insertManyCandidateForm,
        onSubmitCaller,
        callerForm,
        mutationPatch,
        onDeleteCallList,
        mutationDelete,
        handleSelectedData,
        selectedData,
        onSubmitEditCallList,
        mutationPatchCallList,
        callListForm
    }
}

export const useFetchDetailOrder = (id: string | string[]) => {
    return useQuery<OrderApiDetailResponseType, AxiosError>([ORDER_DETAIL_KEY, id], () =>
        orderDetailService(id), { enabled: !!id }
    );
};

export const usePostInsertManyCandidate = () => {
    return useMutation<InsertManyCandidateApiResponseType, AxiosError, InsertManyCandidateType>((payload) =>
        insertManyCandidateService(payload)
    );
};

export const useDeleteCallList = () => {
    return useMutation<SingleCallListApiResponseType, AxiosError, string>((id) =>
        deleteCallListService(id)
    );
};

export const usePatchCallList = () => {
    return useMutation<SingleCallListApiResponseType, AxiosError, any>((payload) =>
        patchCallListService(payload?.id || '', payload.body)
    );
};

export function ViewCell(value: any) {
    const router = useRouter()
    return <Button colorScheme='blue' onClick={() => router.push(`/dashboard/order/call-history/${value._id}?${serialize({ name: value.name, phone_number: value.phone_number, email: value.email })}`)}>View</Button>
}


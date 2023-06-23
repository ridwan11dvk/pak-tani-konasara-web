import { candidateService, deleteCandidateService, patchCandidateService, postCandidateService } from "@/services/candidate";
import { CandidateApiResponseType, CandidatePostApiResponseType, CandidateType, PatchCandidateType } from "@/types/candidate";
import { defaultPerPage } from "@/utils/constant";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import useUserStore from "@/stores/useUser";
import { useHandlingHttpToast } from "@/utils/helper";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import moment from "moment";

export const candidateColumns: any[] = [
    {
        key: "name",
        label: "Name",
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
        key: "cell",
        label: "Detail",
        render: (data: any) => ViewCell(data?.row?.original),
    }
];

export const CANDIDATE_KEY = "candidate-key";

const schema = yup
    .object({
        name: yup.string().required(),
        email: yup.string().email().required(),
        phone_number: yup.string().required(),
    })
    .required();

export const useCandidate = () => {
    const { userData } = useUserStore()
    const { errorToast, successToast } = useHandlingHttpToast();
    const queryClient = useQueryClient()
    const [selectedData, setSelectedData] = useState<CandidateType | null>(
        null
    );
    const [params, setParams] = useState({
        page: 1,
        limit: defaultPerPage,
        search: "",
        startDate: moment().subtract(7, 'd').format('YYYY-MM-DD'),
        endDate: "",
    });

    const { data, isLoading, refetch } = useFetchCandidates(params);
    const mutationPost = usePostCandidate();
    const mutationPatch = usePatchCandidate();
    const mutationDelete = useDeleteOrder();

    useEffect(() => {
        if (params.limit || params.page || params.search) {
            refetch()
        }
    }, [
        params.page, 
        params.limit, 
        params.search
    ]);

    const candidateForm = useForm<CandidateType>({
        resolver: yupResolver(schema),
    });

    const handleSelectedData = (data?: CandidateType) => {
        if (data) {
            setSelectedData(data);
        } else {
            setSelectedData(null);
        }
    }

    const onSubmit = async (payload: CandidateType): Promise<any> => {
        try {
            const cpPayload: CandidateType = { ...payload, id_user: userData?._id };

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
            candidateForm.reset();
            queryClient.invalidateQueries([CANDIDATE_KEY]);
            successToast(response?.message);
            handleSelectedData()

            return response || null;
        } catch (error: any) {
            errorToast(error);
        }
    };

    const onDeleteCandidate = async (id: string) => {
        try {
            const response = await mutationDelete.mutateAsync(id);

            handleSelectedData()
            queryClient.invalidateQueries([CANDIDATE_KEY]);
            successToast(response?.message);

            return response || null;
            // Additional logic for handling the response
        } catch (error: any) {
            // Show error toast notification
            errorToast(error);

            // Additional error handling logic
        }
    }

    return {
        dataCandidates: data?.data || [],
        isLoading: isLoading || false,
        params,
        setParams,
        totalData: data?.total,
        totalPages: data?.totalPages,
        onSubmit,
        candidateForm,
        mutationPost,
        handleSelectedData,
        selectedData,
        onDeleteCandidate,
        mutationDelete
    }
}

export function ViewCell(value: any) {
    const router = useRouter()
    return <Button colorScheme='blue' onClick={() => router.push(`/dashboard/candidate/${value?._id}`)}>View</Button>
}

export const useFetchCandidates = (params: any) => {
    return useQuery<CandidateApiResponseType, AxiosError>([CANDIDATE_KEY, params], () =>
        candidateService(params)
    );
};

export const usePostCandidate = () => {
    return useMutation<CandidatePostApiResponseType, AxiosError, CandidateType>((data) =>
        postCandidateService(data)
    );
};

export const usePatchCandidate = () => {
    return useMutation<CandidatePostApiResponseType, AxiosError, PatchCandidateType>((data) =>
        patchCandidateService(data)
    );
};

export const useDeleteOrder = () => {
    return useMutation<CandidatePostApiResponseType, AxiosError, string>((id) =>
        deleteCandidateService(id)
    );
};
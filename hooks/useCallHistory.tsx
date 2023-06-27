import { detailCandidateService } from "@/services/candidate";
import { detailUserService } from "@/services/user";
import { DetailCandidateApiResponseType } from "@/types/candidate";
import { DetailUserApiResponse } from "@/types/user";
import { AUDIO_KEY, CALL_HISTORY_KEY, CANDIDATE_DETAIL_KEY, defaultPerPage } from "@/utils/constant";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";
import { use, useState } from "react";
import moment from "moment";
import { AudioApiResponseType, CallHistoryApiResponseType, CallHistoryType, SingleCallHistoryApiResponseType } from "@/types/callHistory";
import { callHistoryService, deleteCallHistoryService, getAudioService } from "@/services/callHistory";
import { Button, Text } from "@chakra-ui/react";
import { useHandlingHttpToast } from "@/utils/helper";

export const callHistoryColumns: any[] = [
    {
        key: "date",
        label: "Date",
    },
    {
        key: "createdAt",
        label: "Time",
    },
    {
        key: "note",
        label: "Note",
    },
    {
        key: "cell",
        label: "Audio",
        render: (data: any) => AudioCell(data?.row?.original)
    }
];



export const useCallHistory = () => {
    const [params, setParams] = useState({
        page: 1,
        limit: defaultPerPage,

    });
    const { query } = useRouter()
    const id = query?.id || ""
    const { data, isLoading, refetch } = useFetchCallHistories({ ...params, id });
    const { mutateAsync: onDelete, isLoading: isLoadingDelete } = useDeleteCallHistory();
    const { errorToast, successToast } = useHandlingHttpToast();
    const queryClient = useQueryClient()

    const onDeleteCallHistory = async (id: string) => {
        try {
            const response = await onDelete(id);

            queryClient.invalidateQueries([CALL_HISTORY_KEY]);
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
        dataCallHistories: data?.data?.map((el) => ({ ...el, createdAt: moment(el?.createdAt).format('HH:mm') })) || [],
        isLoading: isLoading || isLoadingDelete,
        onDeleteCallHistory,
        // dataTable: data?.data?.call_list || [],
        setParams,
        params,
        totalPage: data?.totalPages || 0,
        callHistoryColumns
    }
}

const AudioCell = (data: CallHistoryType) => {
    const { data: dataAudio } = useFetchAudio(data?.audio || '')    
    if (dataAudio?.data?.url) {
        return (
            <audio controls={true} >
                <source src={dataAudio?.data?.url} type="audio/mpeg" />
            </audio>

        )
    }

}

export const useFetchDetailCandidate = (id: string | string[]) => {
    return useQuery<DetailCandidateApiResponseType, AxiosError>([CANDIDATE_DETAIL_KEY, id], () =>
        detailCandidateService(id), { enabled: !!id }
    );
};



export const useFetchCallHistories = (params: any) => {
    return useQuery<CallHistoryApiResponseType, AxiosError>([CALL_HISTORY_KEY, params], () => {
        const paramsCp = { ...params }
        delete paramsCp.id
        return callHistoryService(paramsCp, params?.id)
    }, { enabled: !!params?.id }
    );
};

export const useDeleteCallHistory = () => {
    return useMutation<SingleCallHistoryApiResponseType, AxiosError, string>((id) => {
        return deleteCallHistoryService(id)
    });
};

export const useFetchAudio = (key: string) => {
    return useQuery<AudioApiResponseType>([AUDIO_KEY, key], () =>
        getAudioService(key), { enabled: !!key }
    );
}
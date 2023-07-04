import { postNotificationService } from "@/services/notification";
import { NotificationPostApiResponse, NotificationType } from "@/types/notification";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form"
import { useMutation } from "react-query";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFetchUsers } from "./useUserHook";
import { ROLE_STATUS } from "@/utils/constant";
import { useHandlingHttpToast } from "@/utils/helper";
import useUserStore from "@/stores/useUser";
import moment from "moment";


export const useNotification = () => {

    const schema = yup
        .object({
            title: yup.string().required(),
            message: yup.string().required(),
        })
        .required();

    const { data: dataUser, isLoading: isLoadingUsers } = useFetchUsers({
        startDate: moment().subtract(3, 'months').format('YYYY-MM-DD')
    })
    const { userData } = useUserStore()
    const { successToast, errorToast } = useHandlingHttpToast();
    const mutationPost = usePostNotification()
    const notificationForm = useForm<NotificationType>(
        {
            resolver: yupResolver(schema),
        }
    )

    const onSubmit = async (payload: NotificationType) => {
        try {
            const cpPayload = {...payload}
            cpPayload.id_user = userData?._id
            const data = await mutationPost.mutateAsync(cpPayload)
            successToast(data?.message);
            notificationForm.reset();
            // return data
        } catch (error: AxiosError | any) {
            errorToast(error?.response?.data?.message);
        }
    }


    return ({
        notificationForm,
        mutationPost,
        onSubmit,
        userOptions: dataUser?.data?.length ? [{label: 'All Users', value: ''},...dataUser?.data?.filter((el) => (el?.role === ROLE_STATUS.caller.value || el.role === ROLE_STATUS.user.value))?.map((ele) => ({...ele, value: ele?._id, label: ele?.name}))] : []
    })
}


export const usePostNotification = () => {
    return useMutation<NotificationPostApiResponse, AxiosError, NotificationType>((data) =>
        postNotificationService(data)
    );
};
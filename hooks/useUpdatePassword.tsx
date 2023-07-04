import { patchUpdatePassword } from "@/services/user";
import useUserStore from "@/stores/useUser";
import { DetailUserApiResponse, UpdatePasswordType, UserApiResponse } from "@/types/user";
import { useHandlingHttpToast } from "@/utils/helper";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as yup from "yup";


export const useUpdatePassword = () => {
    const schema = yup
        .object({
            old_password: yup.string().required('Old Password is required'),
            password: yup.string().required('Password is required'),
            password_confirmation: yup.string()
                .test('passwords-match', 'Password Confirmation must match with Password', function (value) {
                    return this.parent.password === value
                }).required(),
        })

    const mutationPassword = usePatchUpdatePassword()
    const { successToast, errorToast } = useHandlingHttpToast();
    const { userData } = useUserStore()
    const updatePasswordForm = useForm<UpdatePasswordType>({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (payload: UpdatePasswordType) => {
        let cpPayload = { ...payload }
        try {
            let body = {
                id: userData?._id,
                payload: cpPayload
            }
            const data = await mutationPassword.mutateAsync(body)
            successToast(data?.message)
            updatePasswordForm.reset()
            return data
        } catch (error: AxiosError | any) {
            errorToast(error)
            return error
        }
    }

    return ({
        mutationPassword,
        updatePasswordForm,
        onSubmit
    })

}

export const usePatchUpdatePassword = () => {
    return useMutation<DetailUserApiResponse, AxiosError, any>((data) =>
        patchUpdatePassword(data?.id, data?.payload)
    );
};
import useUserStore from "@/stores/useUser";
import { useFetchDetailUser, usePatchUser } from "./useUserHook";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AddUserType2 } from "@/types/user";
import { useEffect } from "react";
import { useHandlingHttpToast } from "@/utils/helper";

const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    role: yup.string().required(),
  })

export const useProfile = () => {
    const { userData } = useUserStore();
    const id =  userData?._id || ''
    const { data, refetch, isLoading } = useFetchDetailUser(id);
    const patchMutation = usePatchUser();
    const { successToast, errorToast } = useHandlingHttpToast();

    const userForm = useForm<AddUserType2>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (data) {
            userForm.reset({
                name: data?.data?.name,
                email: data?.data?.email,
                role: data?.data?.role,
            });
        }
    }, [data]);

    const onSubmit = async (payload: AddUserType2): Promise<any> => {
        try {
          const cpPayload = { ...payload };
          // Make the HTTP request to the backend server
          let response = null;
          
            response = await patchMutation.mutateAsync({
              body: cpPayload,
              id
            });
          successToast(response?.message);
          refetch()
          userForm.reset();
          return response || null;
          // Additional logic for handling the response
        } catch (error: any) {
          // Show error toast notification
          errorToast(error);
    
          // Additional error handling logic
        }
    };
      

    return {
        userForm,
        onSubmit,
        patchMutation,
        isLoading
    }
}

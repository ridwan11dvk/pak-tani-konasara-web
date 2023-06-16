import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { useHandlingHttpToast } from "@/utils/helper";
import { loginService } from "@/services/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useUserStore from "@/stores/useUser";
import { useRouter } from "next/router";

export type LoginFormInputs = {
  email: string;
  password: string;
};

export interface UserDataInterface {
  createdAt: string;
  email: string;
  name: string;
  role: string;
  updatedAt: string;
  _id: string;
  id_user_creator: string;
}

type LoginMutationResponse = {
  auth_key: string,
  data: UserDataInterface,
  message: string,
  status: boolean,
  // Define the response type from your backend, if applicable
};

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export const useLogin = () => {
  const { setToken, setUserData } = useUserStore()
  const { successToast, errorToast } = useHandlingHttpToast();
  const { replace } = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "admin@callnow.com",
      password: "Password123!",
    },
    resolver: yupResolver(schema),
  });

  const mutation = useMutation<
    LoginMutationResponse,
    AxiosError,
    LoginFormInputs
  >((data) => loginService(data));

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      // Make the HTTP request to the backend server
      const response = await mutation.mutateAsync(data);
      setToken(response?.auth_key || '')
      setUserData(response?.data || null)
      replace('/dashboard')
      successToast(response?.message);

      // Additional logic for handling the response
    } catch (error: any) {

      // Show error toast notification
      errorToast(error);

      // Additional error handling logic
    }
  };

  return {
    handleSubmit: handleSubmit(onSubmit),
    register,
    errors,
  };
};

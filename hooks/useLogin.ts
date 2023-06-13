import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { useHandlingHttpToast } from '@/utils/helper';
import { loginService } from '@/services/auth';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export type LoginFormInputs = {
  email: string;
  password: string;
};

type LoginMutationResponse = {
  data: {
    token: string;
  };
  // Define the response type from your backend, if applicable
};

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required()
});

export const useLogin = () => {
  const { successToast, errorToast } = useHandlingHttpToast();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: 'admin@callnow.com',
      password: 'Password123!'
    },
    resolver: yupResolver(schema)
  });

  const mutation = useMutation<LoginMutationResponse, AxiosError, LoginFormInputs>((data) =>
  loginService(data)
);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      // Make the HTTP request to the backend server
      const response = await mutation.mutateAsync(data);

      // Handle the response and perform further actions
      console.log(response.data);

      // Show success toast notification
      successToast();

      // Additional logic for handling the response
    } catch (error: any) {
      console.error(error);

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

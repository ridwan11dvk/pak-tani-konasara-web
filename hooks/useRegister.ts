import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { useHandlingHttpToast } from "@/utils/helper";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerService } from "@/services/auth";
import { useRouter } from "next/router";

export type RegistrationRequestType = {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role: string;
};

export type RegisterMutationResponse = {
  data: RegistrationRequestType;
  message: string;
  status: boolean;
  // Define the response type from your backend, if applicable
};

const schema = yup.object().shape({
  name: yup.string().required("Nama harus diisi"),
  email: yup.string().email("Format email salah").required("Email harus diisi"),
  password: yup
    .string()
    .required("Kata sandi harus diisi")
    .matches(
      /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{3,30}$/,
      "Kata sandi harus antara 3 dan 30 karakter dan mengandung setidaknya satu karakter khusus"
    ),
  password_confirmation: yup
    .string()
    .required("Konfirmasi kata sandi harus diisi")
    .oneOf([yup.ref("password")], "Konfirmasi kata sandi tidak cocok"),
});

export const useRegister = () => {
  const { successToast, errorToast } = useHandlingHttpToast();
  const mutationRegister = useRegisterMutation()
  const router = useRouter()
  const registerForm = useForm<any>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (payload: RegistrationRequestType): Promise<any> => {
    try {
        let cpPayload = {...payload}
        cpPayload.role = 'Petani'
        // Make the HTTP request to the backend server
        let response = null;

        response = await mutationRegister.mutateAsync(cpPayload);
        successToast(response?.message);
        setTimeout(() => {
            router.replace('/')
        },3000)
        return response || null;
        // Additional logic for handling the response
    } catch (error: any) {
        // Show error toast notification
        errorToast(error);

        // Additional error handling logic
    }
};

  return {
    registerForm,
    onSubmit,
    mutationRegister
  };
};

export const useRegisterMutation = () => {
  const mutation = useMutation<
    RegisterMutationResponse,
    AxiosError,
    RegistrationRequestType
  >((data) => registerService(data));
  return mutation;
};

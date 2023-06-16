import {
  deleteUserService,
  patchUserService,
  postUserService,
  userService,
} from "@/services/user";
import {
  UserApiResponse,
  AddUserType,
  PostUserApiResponse,
} from "@/types/user";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useHandlingHttpToast } from "@/utils/helper";
import useUserStore from "@/stores/useUser";
import { UserDataInterface } from "./useLogin";

const USERS_KEY = "users-key";

export const columnsUsers = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "role",
    label: "Role",
  },
];

const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    role: yup.string().required(),
  })
  .required();

export const useUserHook = () => {
  const [selectedData, setSelectedData] = useState<UserDataInterface | null>(
    null
  );

  const { userData } = useUserStore();
  const { successToast, errorToast } = useHandlingHttpToast();
  const queryClient = useQueryClient();
  const mutationPost = usePostUser();
  const mutationPatch = usePatchUser();
  const mutationDelete = useDeleteUser();
  const userForm = useForm<AddUserType>({
    resolver: yupResolver(schema),
  });

  const [params, setParams] = useState({
    page: 1,
    limit: 1,
    search: "",
  });

  // useEffect(() => {
  //   console.log('selectedData', selectedData)
  //   if(selectedData){
  //     userForm.reset({
  //       email: selectedData?.email,
  //       name: selectedData?.name,
  //       role: selectedData?.role
  //     })
  //   } else {
  //     userForm.reset()
  //   }
  // },[selectedData])

  const handleSelectedData = (data?: UserDataInterface) => {
    if (data) {
      setSelectedData(data);
    } else {
      setSelectedData(null);
    }
  };

  const onSubmit = async (payload: AddUserType) => {
    try {
      const cpPayload: AddUserType = { ...payload };

      // Make the HTTP request to the backend server
      let response = null;
      if (!selectedData) {
        cpPayload.password = "Password123!";
        cpPayload.password_confirmation = "Password123!";
        cpPayload.id_user_creator = userData?._id;
        response = await mutationPost.mutateAsync(cpPayload);
      } else {
        response = await mutationPatch.mutateAsync({
          body: cpPayload,
          id: selectedData?._id,
        });
      }
      successToast(response?.message);
      handleSelectedData()
      queryClient.invalidateQueries([USERS_KEY]);
      userForm.reset();
      return response || null;
      // Additional logic for handling the response
    } catch (error: any) {
      // Show error toast notification
      errorToast(error);

      // Additional error handling logic
    }
  };

  const onDeleteUser = async (id: string) => {
    try {
      const response = await mutationDelete.mutateAsync(id);
      
      successToast(response?.message);
      handleSelectedData()
      queryClient.invalidateQueries([USERS_KEY]);
      return response || null;
      // Additional logic for handling the response
    } catch (error: any) {
      // Show error toast notification
      errorToast(error);

      // Additional error handling logic
    }
  }

  const { data: dataUsers, isLoading } = useFetchUsers(params);
  return {
    totalData: dataUsers?.total,
    totalPages: dataUsers?.totalPages,
    dataUsers: dataUsers?.data || [],
    isLoadingUsers: isLoading,
    isLoadingForm: mutationPatch.isLoading || mutationPost.isLoading,
    isSuccessForm: mutationPatch.isSuccess || mutationPatch.isSuccess,
    mutationPost,
    columnsUsers,
    setParams,
    params,
    userForm,
    onSubmit: onSubmit,
    selectedData,
    handleSelectedData,
    onDeleteUser,
    isLoadingDelete: mutationDelete.isLoading,
    isSuccessDelete: mutationDelete.isSuccess ,
  };
};

export const useFetchUsers = (params: any) => {
  return useQuery<UserApiResponse, AxiosError>([USERS_KEY, params], () =>
    userService(params)
  );
};

export const usePostUser = () => {
  return useMutation<PostUserApiResponse, AxiosError, AddUserType>((data) =>
    postUserService(data)
  );
};

export const usePatchUser = () => {
  return useMutation<PostUserApiResponse, AxiosError, any>(
    (data: any) => patchUserService(data?.body, data?.id)
  );
};

export const useDeleteUser = () => {
  return useMutation<PostUserApiResponse, AxiosError, string>(
    (id: string) => deleteUserService(id)
  );
};

import {
  callerService,
  deleteUserService,
  detailUserService,
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
import { Resolver, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useHandlingHttpToast } from "@/utils/helper";
import useUserStore from "@/stores/useUser";
import { UserDataInterface } from "./useLogin";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { USERS_KEY, USER_DETAIL_KEY, defaultPerPage } from "@/utils/constant";
import moment from "moment";


export const columnsUsers: any[] = [
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
  {
    key: "cell",
    label: "Order",
    cell: (row: any) => CustomCell(row?.original),
  }
];

const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    role: yup.string().required(),
    password: yup.string().optional(),
    password_confirmation: yup.string()
    .test('passwords-match', 'Passwords must match', function(value){
      return this.parent.password === value
    }).optional(),
  })

export const useUserHook = () => {
  const [selectedData, setSelectedData] = useState<UserDataInterface | null>(
    null
  );
  const [params, setParams] = useState({
    page: 1,
    limit: defaultPerPage,
    search: "",
    startDate: moment().subtract(7, 'd').format('YYYY-MM-DD'),
    endDate: "",
  });

  const { userData } = useUserStore();
  const { successToast, errorToast } = useHandlingHttpToast();
  const queryClient = useQueryClient();
  const { data: dataUsers, isLoading, refetch } = useFetchUsers(params);
  const mutationPost = usePostUser();
  const mutationPatch = usePatchUser();
  const mutationDelete = useDeleteUser();
  const userForm = useForm<AddUserType>({
    resolver: yupResolver(schema),
  });



  useEffect(() => {
    if (
      // params.limit || 
      // params.page || 
      // params.search ||
      // params.startDate ||
      // params.endDate
      params
      ) {
      refetch()
    }
  }, [
    params
    // params.page, 
    // params.limit, 
    // params.search,
    // params.startDate,
    // params.endDate
  ]);

  const handleSelectedData = (data?: UserDataInterface) => {
    if (data) {
      setSelectedData(data);
    } else {
      setSelectedData(null);
    }
  };

  const onSubmit = async (payload: AddUserType): Promise<any> => {
    try {
      const cpPayload = { ...payload };
      if(!cpPayload.password) {
        delete cpPayload.password
      }
      if(!cpPayload.password_confirmation) {
        delete cpPayload.password_confirmation
      }
      // Make the HTTP request to the backend server
      let response = null;
      if (!selectedData) {
        // cpPayload.password = "Password123!";
        // cpPayload.password_confirmation = "Password123!";
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
      refetch();
      return response || null;
      // Additional logic for handling the response
    } catch (error: any) {
      // Show error toast notification
      errorToast(error);

      // Additional error handling logic
    }
  }


  return {
    totalData: dataUsers?.total,
    totalPages: dataUsers?.totalPages,
    dataUsers: dataUsers?.data?.map((item) => ({  ...item, cell: CustomCell })),
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

export function CustomCell(value: any) {
  return <Button as={Link} colorScheme="blue" href={`/dashboard/order?userId=${value?._id}`}>View</Button>
}

export const useFetchUsers = (params: any) => {
  return useQuery<UserApiResponse, AxiosError>([USERS_KEY, params], () =>
    userService(params)
  );
};

export const useFetchDetailUser = (id: string | string[]) => {
  return useQuery<PostUserApiResponse, AxiosError>([USER_DETAIL_KEY, id], () =>
      detailUserService(id), { enabled: !!id }
  );
};

export const useFetchCallers = () => {
  return useQuery<UserApiResponse, AxiosError>([USERS_KEY], () =>
    callerService()
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

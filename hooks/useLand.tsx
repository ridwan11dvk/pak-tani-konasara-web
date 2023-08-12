import {
    callerService,
    deleteUserService,
    detailUserService,
    patchUserService,
    postAccessLoginService,
    postUserService,
    userService,
    userServiceByUserId,
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
  import { LAND_KEY, ROLE_STATUS, USERS_BY_ID_KEY, USERS_KEY, USER_DETAIL_KEY, defaultPerPage } from "@/utils/constant";
  import moment from "moment";
import { getLandService, postLandService } from "@/services/manage-land";
  
  
  export const columnsLand: any[] = [
    {
      key: "nama",
      label: "Nama Lahan",
    },
    {
        key: "owner",
        label: "Pemilik",
      },
    {
      key: "luas",
      label: "Luas",
    },
    {
      key: "jenis",
      label: "Jenis Lahan",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "createdAt",
      label: "Tanggal di buat",
    }
  ];
  
  const schema = yup
    .object({
        nama: yup.string().required(),
        luas: yup.mixed().required(),
        keterangan: yup.string().required(),
        jenis: yup.string().required(),
        lokasi: yup.string().required(),
        status: yup.string().required(),
    })
  
  export const useLand = () => {
    const [selectedData, setSelectedData] = useState<UserDataInterface | null>(
      null
    );
    const [params, setParams] = useState({
      page: 1,
      limit: defaultPerPage,
      search: "",
      startDate: moment().subtract(7, 'd').format('YYYY-MM-DD'),
      endDate: "",
      status: "",
      sort: ''
    });
  
    const { userData } = useUserStore();
    const { successToast, errorToast } = useHandlingHttpToast();
    const queryClient = useQueryClient();
    const { data: dataLands, isLoading, refetch } = useFetchLands(params);
    const mutationPost = usePostLand();
    const mutationPatch = usePatchUser();
    const mutationDelete = useDeleteUser();
    const landForm = useForm({
      resolver: yupResolver(schema),
      defaultValues: {
        luas: ''
      }
    });
  
  
  
    useEffect(() => {
      if (
        params.limit || 
        params.page || 
        params.search ||
        params.startDate ||
        params.endDate ||
        params.status ||
        params.sort
        // params
      ) {
        refetch()
      }
    }, [
      // params
      params.page, 
      params.limit, 
      params.search,
      params.startDate,
      params.endDate,
      params.status, 
      params.sort
    ]);
  
    const handleSelectedData = (data?: UserDataInterface) => {
      if (data) {
        setSelectedData(data);
      } else {
        setSelectedData(null);
      }
    };
  
    const onSubmit = async (payload: any): Promise<any> => {
      try {
        const cpPayload = { ...payload };
        // Make the HTTP request to the backend server
        cpPayload.luas = payload?.luas ? parseFloat(payload?.luas) : ''
        cpPayload.authorId = userData?._id
        let response = null;
        if (!selectedData) {
          response = await mutationPost.mutateAsync(cpPayload);
        } else {
          response = await mutationPatch.mutateAsync({
            body: cpPayload,
            id: selectedData?._id,
          });
        }
        successToast(response?.message);
        handleSelectedData()
        queryClient.invalidateQueries([LAND_KEY]);
        landForm.reset();
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
        await refetch();
        return response || null;
        // Additional logic for handling the response
      } catch (error: any) {
        // Show error toast notification
        errorToast(error);
  
        // Additional error handling logic
      }
    }
  
  
    return {
      totalData: dataLands?.total,
      totalPages: dataLands?.totalPages,
      dataLands: dataLands?.data?.map((item: any) => ({ ...item, owner: item?.detail?.user?.name || '-' , luas: `${item?.luas} ha` , createdAt: moment(item?.createdAt || '').format('YYYY-MM-DD') })) ,
      isLoadingUsers: isLoading,
      isLoadingForm: mutationPatch.isLoading || mutationPost.isLoading,
      isSuccessForm: mutationPatch.isSuccess || mutationPatch.isSuccess,
      mutationPost,
      columnsLand,
      setParams,
      params,
      landForm,
      onSubmit: onSubmit,
      selectedData,
      handleSelectedData,
      onDeleteUser,
      isLoadingDelete: mutationDelete.isLoading,
      isSuccessDelete: mutationDelete.isSuccess,
      refetch
    };
  };
  
  export function CustomCell(value: any) {
    return <Button as={Link} colorScheme="blue" href={`/dashboard/order?userId=${value?._id}`}>View</Button>
  }
  
  export const useFetchLands = (params: any) => {
    return useQuery<any, AxiosError>([LAND_KEY, params], () =>
      getLandService(params)
    );
  };
  
  export const useFetchUserByUserId = (id: any, params: any) => {
    return useQuery<UserApiResponse, AxiosError>([USERS_BY_ID_KEY, params], () =>
      userServiceByUserId(id, params)
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
  
  export const usePostLand = () => {
    return useMutation<any, AxiosError, any>((data) =>
      postLandService(data)
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
  
  export const useAccessLoginUser = () => {
    return useMutation<PostUserApiResponse, AxiosError, any>(
      (payload) => postAccessLoginService(payload)
    );
  };
  
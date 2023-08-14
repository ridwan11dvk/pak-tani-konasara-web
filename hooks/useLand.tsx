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
import { LAND_BY_AUTHOR_ID, LAND_KEY, ROLE_STATUS, USERS_BY_ID_KEY, USERS_KEY, USER_DETAIL_KEY, defaultPerPage } from "@/utils/constant";
import moment from "moment";
import { deleteLandService, getLandByAuthorIdService, getLandService, postLandService, putLandService } from "@/services/manage-land";
import { useRouter } from "next/router";


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
  const { query } = useRouter()
  const authorId: any = query?.authorId || ''
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
  const { data: dataLandByIds, isLoading: isLoadingById, refetch: refetchById } = useFetchLandByAuthorIds(params, authorId);
  const mutationPost = usePostLand();
  const mutationPatch = usePutLand();
  const mutationDelete = useDeleteLand();
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

      // if (authorId) {
      refetchById()
      // } 
    }
  }, [
    // params
    params.page,
    params.limit,
    params.search,
    params.startDate,
    params.endDate,
    params.status,
    params.sort,
    authorId
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
      const cpPayload = {
        ...payload, detail: {
          user: userData
        }, history: {}
      };
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
      if (authorId) {
        queryClient.invalidateQueries([LAND_BY_AUTHOR_ID]);
      } else {
        queryClient.invalidateQueries([LAND_KEY]);
      }
      landForm.reset();
      return response || null;
      // Additional logic for handling the response
    } catch (error: any) {
      // Show error toast notification
      errorToast(error);

      // Additional error handling logic
    }
  };

  const onDelete = async (id: string) => {
    try {
      const response = await mutationDelete.mutateAsync(id);

      successToast(response?.message);
      handleSelectedData()
      if (authorId) {
        queryClient.invalidateQueries([LAND_BY_AUTHOR_ID]);
      } else {
        queryClient.invalidateQueries([LAND_KEY]);
      }
      return response || null;
      // Additional logic for handling the response
    } catch (error: any) {
      // Show error toast notification
      errorToast(error);

      // Additional error handling logic
    }
  }


  return {
    totalData: authorId ? dataLandByIds?.total : dataLands?.total,
    totalPages: authorId ? dataLandByIds?.totalPages : dataLands?.totalPages,
    dataLands: authorId ? dataLandByIds?.data?.map((item: any) => ({ ...item, owner: item?.detail?.user?.name || '-', luas: `${item?.luas} ha`, createdAt: moment(item?.createdAt || '').format('YYYY-MM-DD') })) : dataLands?.data?.map((item: any) => ({ ...item, owner: item?.detail?.user?.name || '-', luas: `${item?.luas} ha`, createdAt: moment(item?.createdAt || '').format('YYYY-MM-DD') })),
    isLoadingUsers: isLoading || isLoadingById,
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
    onDelete,
    isLoadingDelete: mutationDelete.isLoading,
    isSuccessDelete: mutationDelete.isSuccess,
    refetch: authorId ? refetchById : refetch
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

export const useFetchLandByAuthorIds = (params: any, authorId: any = '') => {
  return useQuery<any, AxiosError>([LAND_BY_AUTHOR_ID, params], () =>
    getLandByAuthorIdService(params, authorId), {
    enabled: !!authorId
  }
  );
};


export const usePostLand = () => {
  return useMutation<any, AxiosError, any>((data) =>
    postLandService(data)
  );
};

export const usePutLand = () => {
  return useMutation<any, AxiosError, any>(
    (data: any) => putLandService(data?.body, data?.id)
  );
};

export const useDeleteLand = () => {
  return useMutation<any, AxiosError, string>(
    (id: string) => deleteLandService(id)
  );
};


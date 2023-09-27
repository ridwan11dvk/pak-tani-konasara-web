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
import { Button, useToast } from "@chakra-ui/react";
import Link from "next/link";
import {
  LIST_REQUEST_FERTILIZER_BY_AUTHOR_ID,
  LIST_FERTILIZER,
  defaultPerPage,
} from "@/utils/constant";
import moment from "moment";
import {
  deleteLandService,
  getLandByAuthorIdService,
  getLandService,
  postLandService,
  putLandService,
} from "@/services/manage-land";
import { useRouter } from "next/router";
import {
  deleteRequestSeed,
  getAllRequestSeedByAuthorId,
  getListSeed,
  postRequestSeed,
} from "@/services/seed";
import { useFetchLandByAuthorIds } from "./useLand";
import {
  deleteRequestFertilizer,
  getAllRequestFertilizerByAuthorId,
  getListFertilizer,
  postRequestFertilizer,
  putRequestFertilizer,
} from "@/services/fertilizer";

export const columnReqFertilizer: any[] = [
  {
    key: "nama",
    label: "Nama Pupuk",
  },
  {
    key: "stok",
    label: "Stok",
  },
  {
    key: "kategori",
    label: "Kategori",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "deskripsi",
    label: "Deskripsi",
  },
];

const schema = yup.object({
  jumlah: yup.string().required("Jumlah pupuk harus diisi"),
  detail: yup.mixed().required("Lahan harus diisi"),
  jenis: yup.string().required("Jenis pupuk harus diisi"),
});

export const useRequestFertilizer = () => {
  const { query } = useRouter();
  const authorId: any = query?.authorId || "";
  const [selectedData, setSelectedData] = useState<any>(null);
  const [params, setParams] = useState({
    page: 1,
    limit: defaultPerPage,
    search: "",
    startDate: "2023-01-01",
    endDate: "",
    status: "",
    sort: "",
  });

  const { userData } = useUserStore();
  const toast = useToast();
  const { successToast, errorToast } = useHandlingHttpToast();
  const queryClient = useQueryClient();
  const { data: dataFertilizers, isLoading, refetch } = useFetchFertilizers(params);
  const {
    data: dataLandByIds,
    isLoading: isLoadingById,
    refetch: refetchById,
  } = useFetchLandByAuthorIds(params, authorId);
  const mutationPost = usePostRequestFertilizer();
  const mutationPatch = usePutRequestFertilizer();
  const mutationDelete = useDeleteRequestFertilizer();
  const requestFertilizerForm = useForm({
    resolver: yupResolver(schema),
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
      refetch();

      // if (authorId) {
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
    authorId,
  ]);

  const handleSelectedData = (data?: UserDataInterface) => {
    if (data) {
      setSelectedData(data);
    } else {
      setSelectedData(null);
    }
  };

  const onSubmit = async (payload: any): Promise<any> => {
    if (selectedData?.stok < payload?.jumlah) {
      return toast({
        title: "Error",
        description: "Jumlah Pupuk Diminta Melebihi Stok Pupuk",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    try {
      const cpPayload = {
        ...payload,
        authorDetail: userData,
        authorId: userData?._id,
        namaBarang: selectedData?.nama,
        barangId: selectedData?._id,
        barangDetail: selectedData,
        status: "Diproses",
      };
      // Make the HTTP request to the backend server
      let response = null;
      // if (!selectedData) {
      response = await mutationPost.mutateAsync(cpPayload);
      // }
      // else {
      //     response = await mutationPatch.mutateAsync({
      //         body: cpPayload,
      //         id: selectedData?._id,
      //     });
      // }
      successToast(response?.message);
      handleSelectedData();
      // if (authorId) {
      //     queryClient.invalidateQueries([LAND_BY_AUTHOR_ID]);
      // } else {
      queryClient.invalidateQueries([LIST_FERTILIZER]);
      // }
      requestFertilizerForm.reset();
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
      handleSelectedData();
      queryClient.invalidateQueries([LIST_REQUEST_FERTILIZER_BY_AUTHOR_ID]);
      return response || null;
      // Additional logic for handling the response
    } catch (error: any) {
      // Show error toast notification
      errorToast(error);

      // Additional error handling logic
    }
  };

  return {
    totalData: dataFertilizers?.total,
    totalPages: dataFertilizers?.totalPages,
    landOptions:
      dataLandByIds?.data?.map((el: any) => ({
        ...el,
        value: el?._id,
        label: el?.nama || "-",
      })) || [],
    dataFertilizers: dataFertilizers?.data?.map((item: any) => ({
      ...item,
      createdAt: moment(item?.createdAt || "").format("YYYY-MM-DD"),
    })),
    isLoadingUsers: isLoading,
    isLoadingForm: mutationPatch.isLoading || mutationPost.isLoading,
    isSuccessForm: mutationPatch.isSuccess || mutationPatch.isSuccess,
    mutationPost,
    columnReqFertilizer,
    setParams,
    params,
    requestFertilizerForm,
    onSubmit: onSubmit,
    selectedData,
    handleSelectedData,
    onDelete,
    isLoadingDelete: mutationDelete.isLoading,
    isSuccessDelete: mutationDelete.isSuccess,
    refetch: refetch,
  };
};

export function CustomCell(value: any) {
  return (
    <Button
      as={Link}
      colorScheme="blue"
      href={`/dashboard/order?userId=${value?._id}`}
    >
      View
    </Button>
  );
}

export const useFetchFertilizers = (params: any) => {
  return useQuery<any, AxiosError>(
    [LIST_FERTILIZER, params],
    () => getListFertilizer(params),
    {}
  );
};

export const useFetchRequestFertilizerByIds = (authorId: any, params: any) => {
  return useQuery<any, AxiosError>(
    [LIST_REQUEST_FERTILIZER_BY_AUTHOR_ID, params],
    () => getAllRequestFertilizerByAuthorId(authorId, params)
    // {
    //   enabled: !!authorId,
    // }
  );
};

export const usePostRequestFertilizer = () => {
  return useMutation<any, AxiosError, any>((data) =>
    postRequestFertilizer(data)
  );
};

export const usePutRequestFertilizer = () => {
  return useMutation<any, AxiosError, any>((data: any) =>
    putRequestFertilizer(data?.id, data?.body)
  );
};

export const useDeleteRequestFertilizer = () => {
  return useMutation<any, AxiosError, string>((id: string) =>
    deleteRequestFertilizer(id)
  );
};

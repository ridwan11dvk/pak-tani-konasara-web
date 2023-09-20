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
  LAND_BY_AUTHOR_ID,
  LAND_KEY,
  LIST_REQUEST_SEED_BY_AUTHOR_ID,
  LIST_SEED,
  ROLE_STATUS,
  USERS_BY_ID_KEY,
  USERS_KEY,
  USER_DETAIL_KEY,
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

export const columnsLand: any[] = [
  {
    key: "nama",
    label: "Nama Bibit",
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
];

// {
//     "authorId" : "64c78a74697cc55c42978329",
//     "authorDetail" : {
//         "_id": "64c78a74697cc55c42978329",
//         "id_user_creator": "64c7762e356a524cde338079",
//         "name": "Muhammad Multazam",
//         "email": "multazamsttm@gmail.com",
//         "role": "Petani",
//         "status": "approved",
//         "createdAt": "2023-07-31T10:18:28.866Z",
//         "updatedAt": "2023-07-31T23:49:28.257Z"
//     },
//     "jenis" : "bibit",
//     "namaBarang" : "Bibit Padi Umbul Jaya",
//     "jumlah" : "10",
//     "barangId" : "64cc44b0b11dee53d0ca904a",
//     "barangDetail" : {
//         "_id": "64cc44b0b11dee53d0ca904a",
//         "authorId": "64c78a74697cc55c42978329",
//         "nama": "Bibit Padi Umbul Jaya",
//         "stok": "100",
//         "deskripsi": "Benih padi unggulan dari kabupaten konawe utara",
//         "harga": "175000",
//         "kategori": "Padi",
//         "status": "habis",
//         "detail": {
//             "dummy": "data bibit go",
//             "photo": "98712tgbhasjdasd.png"
//         },
//         "createdAt": "2023-08-04T00:22:08.065Z",
//         "updatedAt": "2023-08-04T00:23:14.786Z"
//     },
//     "status" : "Diproses",
//     "keterangan" : "Saya membutuhkan bibit tersebut untuk lahan saya",
//     "detail" : {
//         "other" : "other data"
//     }
// }

const schema = yup.object({
  jumlah: yup.string().required("Jumlah bibit harus diisi"),
  detail: yup.mixed().required("Lahan harus diisi"),
  jenis: yup.string().required("Jenis bibit harus diisi"),
});

export const useRequestSeed = () => {
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
  const { data: dataSeeds, isLoading, refetch } = useFetchSeeds(params);
  const {
    data: dataLandByIds,
    isLoading: isLoadingById,
    refetch: refetchById,
  } = useFetchLandByAuthorIds(params, authorId);
  const mutationPost = usePostRequestSeed();
  const mutationPatch = usePutLand();
  const mutationDelete = useDeleteRequestSeed();
  const requestSeedForm = useForm({
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
    if(selectedData?.stok < payload?.jumlah) {
      return toast({
        title: "Error",
        description: 'Jumlah Bibit Diminta Melebihi Stok Bibit',
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
      queryClient.invalidateQueries([LIST_SEED]);
      // }
      requestSeedForm.reset();
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
      queryClient.invalidateQueries([LIST_REQUEST_SEED_BY_AUTHOR_ID]);
      return response || null;
      // Additional logic for handling the response
    } catch (error: any) {
      // Show error toast notification
      errorToast(error);

      // Additional error handling logic
    }
  };

  return {
    totalData: dataSeeds?.total,
    totalPages: dataSeeds?.totalPages,
    landOptions:
      dataLandByIds?.data?.map((el: any) => ({
        ...el,
        value: el?._id,
        label: el?.nama || "-",
      })) || [],
    dataSeeds: dataSeeds?.data?.map((item: any) => ({
      ...item,
      owner: item?.detail?.user?.name || "-",
      luas: `${item?.luas} ha`,
      createdAt: moment(item?.createdAt || "").format("YYYY-MM-DD"),
    })),
    isLoadingUsers: isLoading,
    isLoadingForm: mutationPatch.isLoading || mutationPost.isLoading,
    isSuccessForm: mutationPatch.isSuccess || mutationPatch.isSuccess,
    mutationPost,
    columnsLand,
    setParams,
    params,
    requestSeedForm,
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

export const useFetchSeeds = (params: any) => {
  return useQuery<any, AxiosError>(
    [LIST_SEED, params],
    () => getListSeed(params),
    {}
  );
};

export const useFetchRequestSeedByIds = (authorId: any, params: any) => {
  return useQuery<any, AxiosError>(
    [LIST_REQUEST_SEED_BY_AUTHOR_ID, params],
    () => getAllRequestSeedByAuthorId(authorId, params)
    // {
    //   enabled: !!authorId,
    // }
  );
};

export const usePostRequestSeed = () => {
  return useMutation<any, AxiosError, any>((data) => postRequestSeed(data));
};

export const usePutLand = () => {
  return useMutation<any, AxiosError, any>((data: any) =>
    putLandService(data?.body, data?.id)
  );
};

export const useDeleteRequestSeed = () => {
  return useMutation<any, AxiosError, string>((id: string) =>
    deleteRequestSeed(id)
  );
};

import Table from "@/components/Table";
import {
  useDeleteRequestSeed,
  useFetchRequestSeedByIds,
} from "@/hooks/useRequestSeed";
import { useAccessLoginUser } from "@/hooks/useUserHook";
import { useHandlingHttpToast } from "@/utils/helper";
import {
  Box,
  FormControl,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Button,
  Flex,
  FormLabel,
  FormErrorMessage,
  Input,
  Spinner,
  useMediaQuery,
  SimpleGrid,
  GridItem,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack,
  InputGroup,
  Icon,
  InputRightElement,
  useDisclosure,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { BsSearch } from "react-icons/bs";
import { UseMutationResult, useQueryClient } from "react-query";
import Select from "react-select";
import { setTokenSourceMapRange } from "typescript";
import { useDebounce } from "use-debounce";
import CancelRequestSeedModall from "./CancelRequestSeedModal";
import { LIST_REQUEST_SEED_BY_AUTHOR_ID } from "@/utils/constant";

interface ModalInterface {
  isOpen: boolean;
  onClose: () => void;
  authorId?: string;
}

export default function ProceessedSeedModal({
  isOpen,
  onClose,
  authorId,
}: ModalInterface) {
  const columnSeed: any[] = [
    {
      key: "namaBarang",
      label: "Nama Lahan",
    },
    {
      key: "jumlah",
      label: "Jumlah",
    },
    {
      key: "Kategori",
      label: "kategori",
    },
    {
      key: "status",
      label: "Status",
    },
  ];

  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [params, setParams] = useState({
    startDate: moment().subtract(7, "d").format("YYYY-MM-DD"),
    endDate: "",
    search: "",
  });

  const { data, isError, isFetching, isLoading, refetch } =
    useFetchRequestSeedByIds(authorId || "", params);
  const {
    isOpen: isOpenCancel,
    onClose: onCloseCancel,
    onOpen: onOpenCancel,
  } = useDisclosure();
  const [search, setSearch] = useState("");
  const [value] = useDebounce(search, 800);
  const [selectedData, setSelectedData] = useState<any>(null);
  const { successToast, errorToast } = useHandlingHttpToast();
  const queryClient = useQueryClient();
  const mutationDelete = useDeleteRequestSeed();

  useEffect(() => {
    setParams({ ...params, search: value });
  }, [value]);

  useEffect(() => {
    if (
      params.search ||
      params.startDate ||
      params.endDate
      // params
    ) {
      refetch();

      // if (authorId) {
      // }
    }
  }, [
    // params
    params,
    authorId,
  ]);

  const handleSelectedData = (data?: any) => {
    if (data) {
      setSelectedData(data);
    } else {
      setSelectedData(null);
    }
  };

  const onDelete = async (id: string) => {
    try {
      const response = await mutationDelete.mutateAsync(id);

      successToast(response?.message);
      handleSelectedData();
      queryClient.invalidateQueries([LIST_REQUEST_SEED_BY_AUTHOR_ID]);
      onCloseCancel();
      return response || null;
      // Additional logic for handling the response
    } catch (error: any) {
      // Show error toast notification
      errorToast(error);

      // Additional error handling logic
    }
  };

  const renderAction = (data: any) => {
    return (
      <HStack gap={4}>
        <Button
          onClick={() => {
            setSelectedData(data);
            onOpenCancel();
          }}
        >
          {/* <Icon as={BsPlus} color={"black"} /> */}
          Batal Permintaan
        </Button>
        {/* <Button onClick={() => {
                    handleSelectedData(data)
                    onOpenDelete()
                }}>
                    <Icon as={BsTrash3} />
                </Button> */}
      </HStack>
    );
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      size={isMobile ? "sm" : "xl"}
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent minW={isMobile ? "auto" : "800px"}>
        <ModalHeader>
          <Flex justifyContent="center">Daftar Permintaan Bibit Di proses</Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <Box>
            <VStack gap={4} alignItems="start" minW={"full"} p={4}>
              <SimpleGrid minW={"full"} columns={2} gap={4}>
                <GridItem>
                  <FormControl mb={4}>
                    <FormLabel>Tanggal mulai</FormLabel>
                    <Input
                      value={params.startDate}
                      onChange={(e) =>
                        setParams({ ...params, startDate: e.target.value })
                      }
                      bgColor="white"
                      placeholder="Select Date"
                      type="date"
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl mb={4}>
                    <FormLabel>Tanggal akhir</FormLabel>
                    <Input
                      value={params.endDate}
                      onChange={(e) =>
                        setParams({ ...params, endDate: e.target.value })
                      }
                      bgColor="white"
                      placeholder="Select Date"
                      type="date"
                    />
                  </FormControl>
                </GridItem>
              </SimpleGrid>
              <InputGroup>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari Request Bibit"
                  backgroundColor="white"
                />
                <InputRightElement>
                  <Icon as={BsSearch} />
                </InputRightElement>
              </InputGroup>
            </VStack>
            <Table
              columns={columnSeed}
              isLoading={isFetching || isLoading}
              data={
                data?.data?.map((el: any) => {
                  return { ...el, kategori: el?.barangDetail?.kategori || "-" };
                }) || []
              }
              actionButton={true}
              actionMenu={renderAction}
              isSorting={true}
              setQueryParams={setParams}
              queryParams={params}
              totalPages={data?.totalPages || 0}
            />
          </Box>
        </ModalBody>
      </ModalContent>
      <CancelRequestSeedModall
        isOpen={isOpenCancel}
        onClose={onCloseCancel}
        selectedData={selectedData}
        onDelete={onDelete}
        mutationDelete={mutationDelete}
      />
    </Modal>
  );
}

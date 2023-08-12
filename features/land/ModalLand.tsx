import { useAccessLoginUser } from "@/hooks/useUserHook";
import { AddUserType, PostUserApiResponse } from "@/types/user";
import { USERS_KEY } from "@/utils/constant";
import { useHandlingHttpToast } from "@/utils/helper";
import { roleOptions, statusOptions } from "@/utils/options";
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
    NumberInputField
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { UseMutationResult, useQueryClient } from "react-query";
import Select from 'react-select';


interface ModalInterface {
    isOpen: boolean;
    onClose: () => void;
    landForm: UseFormReturn<any>
    mutationPost: UseMutationResult<any, AxiosError, any>
    onSubmit: (payload: any) => Promise<any | undefined>
    handleSelectedData: (data?: any) => void
    selectedData: any | null
    isLoadingForm: boolean
    isSuccessForm: boolean
    refetch: () => void
}

export default function ModalLand({
    isOpen,
    onClose,
    landForm,
    onSubmit,
    mutationPost,
    handleSelectedData,
    isLoadingForm,
    isSuccessForm,
    selectedData,
    refetch
}: ModalInterface) {
    const [isMobile] = useMediaQuery('(max-width: 768px)')
    const { successToast, errorToast } = useHandlingHttpToast();
    const { register, setValue, watch, formState, handleSubmit, reset } = landForm
    const mutationPostAccessLogin = useAccessLoginUser()
    const queryClient = useQueryClient();

    const errors: any = formState.errors

    useEffect(() => {
        if (isSuccessForm) {
            onClose()
        }
    }, [isSuccessForm])


    return (
        <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={() => {
                reset()
                handleSelectedData()
                !isLoadingForm && onClose()
            }}
            size={isMobile ? 'sm' : "xl"}
            scrollBehavior="inside"
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent="center">
                        {selectedData ? 'Ubah Lahan' : 'Tambah Lahan'}
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>
                    <Box as={'form'} onSubmit={handleSubmit(async (payload) => {
                        const res = await onSubmit(payload)
                        if (res?.data) {
                            onClose()
                        }
                    })} method="POST">
                        <FormControl mb={4} isInvalid={errors?.nama?.message ? true : false}>
                            <FormLabel>Nama Lahan</FormLabel>
                            <Input type="text" {...register('nama')} />
                            <FormErrorMessage>{errors.nama && errors.nama.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mb={4} isInvalid={errors?.luas?.message ? true : false}>
                            <FormLabel>Luas (ha)</FormLabel>
                            <NumberInput>
                            <NumberInputField  {...register('luas')} />
                            </NumberInput>
                            <FormErrorMessage>{errors.luas && errors.luas.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mb={4} isInvalid={errors?.keterangan?.message ? true : false}>
                            <FormLabel>Keterangan</FormLabel>
                            <Input type="text" {...register('keterangan')} />
                            <FormErrorMessage>{errors.keterangan && errors.keterangan.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mb={4} isInvalid={errors?.jenis?.message ? true : false}>
                            <FormLabel>Jenis Lahan</FormLabel>
                            <Input type="text" {...register('jenis')} />
                            <FormErrorMessage>{errors.jenis && errors.jenis.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mb={4} isInvalid={errors?.lokasi?.message ? true : false}>
                            <FormLabel>Lokasi Lahan</FormLabel>
                            <Input type="text" {...register('lokasi')} />
                            <FormErrorMessage>{errors.lokasi && errors.lokasi.message}</FormErrorMessage>
                        </FormControl>
                        <SimpleGrid columns={isMobile ? 4 : 3} gap={2}>
                            <GridItem colSpan={isMobile ? 4 : 2}>
                                <FormControl isInvalid={errors?.role?.message ? true : false}>
                                    <FormLabel>Status Lahan</FormLabel>
                                    <Select
                                        options={statusOptions}
                                        menuPosition={'fixed'}
                                        placeholder="Pilih Opsi"
                                        {...register('status')}
                                        onChange={(val) => setValue('status', val?.value)}
                                        value={statusOptions?.find((el) => el?.value === watch('status'))}
                                    />
                                    <FormErrorMessage>{errors.role && errors.role.message}</FormErrorMessage>
                                </FormControl>
                            </GridItem>
                            <GridItem colSpan={4} gap={2}>

                                <Button colorScheme={'red'} color={"white"} mt={8} onClick={onClose} isDisabled={isLoadingForm}>
                                    {
                                        isLoadingForm &&
                                        <Spinner size="xs" />

                                    }
                                    Batal
                                </Button>
                                <Button ml={4} px={4} minW="10px" type="submit" colorScheme="green" mt={8} isDisabled={isLoadingForm}>
                                    {
                                        isLoadingForm ?
                                            <Spinner size="xs" />
                                            :
                                            'Simpan Data Lahan'
                                    }
                                </Button>
                                {/* </GridItem> */}
                            </GridItem>
                        </SimpleGrid>

                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
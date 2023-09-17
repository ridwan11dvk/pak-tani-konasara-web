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
    NumberInputField,
    Textarea
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { UseMutationResult, useQueryClient } from "react-query";
import Select from 'react-select';
import { setTokenSourceMapRange } from "typescript";


interface ModalInterface {
    isOpen: boolean;
    onClose: () => void;
    requestSeedForm: UseFormReturn<any>
    mutationPost: UseMutationResult<any, AxiosError, any>
    onSubmit: (payload: any) => Promise<any | undefined>
    handleSelectedData: (data?: any) => void
    selectedData: any | null
    selectedDataEdit?: any | null
    isLoadingForm: boolean
    isSuccessForm: boolean
    refetch: () => void
    landOptions: any[]
}

export default function RequestSeedModal({
    isOpen,
    onClose,
    requestSeedForm,
    onSubmit,
    mutationPost,
    handleSelectedData,
    isLoadingForm,
    isSuccessForm,
    selectedData,
    refetch,
    landOptions,
    selectedDataEdit
}: ModalInterface) {
    console.log('selectedData', selectedData)
    // nsms bibit
    // setTokenSourceMapRangekategori
    // deskripsi
    const [isMobile] = useMediaQuery('(max-width: 768px)')
    const { successToast, errorToast } = useHandlingHttpToast();
    const { register, setValue, watch, formState, handleSubmit, reset } = requestSeedForm
    const mutationPostAccessLogin = useAccessLoginUser()

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
                        {selectedDataEdit ? 'Ubah Permintaan' : 'Buat Permintaan'}
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
                        <Text fontWeight={"semibold"}>Nama Bibit: {selectedData?.nama || '-'}</Text>
                        <Text fontWeight={"semibold"}>Stok : {selectedData?.stok || '-'}</Text>
                        <Text fontWeight={"semibold"}>Deskripsi: {selectedData?.deskripsi || '-'}</Text>
                        <FormControl pt={4} mb={4} isInvalid={errors?.jumlah?.message ? true : false}>
                            <FormLabel>Jumlah Bibit Diminta</FormLabel>
                            <Input type="number" {...register('jumlah')} />
                            <FormErrorMessage>{errors?.jumlah && errors?.jumlah?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl pt={4} mb={4} isInvalid={errors?.jenis?.message ? true : false}>
                            <FormLabel>Jenis Bibit</FormLabel>
                            <Input {...register('jenis')} />
                            <FormErrorMessage>{errors?.jenis && errors?.jenis?.message}</FormErrorMessage>
                        </FormControl>
                        {/* <SimpleGrid columns={isMobile ? 4 : 3} gap={2}>
                            <GridItem colSpan={isMobile ? 4 : 2}> */}
                                <FormControl isInvalid={errors?.detail?.message ? true : false}>
                                    <FormLabel>Lahan</FormLabel>
                                    <Select
                                        options={landOptions}
                                        menuPosition={'fixed'}
                                        placeholder="Pilih Opsi"
                                        {...register('detail')}
                                        onChange={(val) => setValue('detail', val)}
                                        value={watch('status')}
                                    />
                                    <FormErrorMessage>{errors?.detail && errors?.detail?.message}</FormErrorMessage>
                                </FormControl>
                                <FormControl pt={4} mb={4} isInvalid={errors?.lokasi?.message ? true : false}>
                            <FormLabel>Keterangan (Opsional)</FormLabel>
                            <Textarea {...register('keterangan')} />
                            <FormErrorMessage>{errors?.keterangan && errors?.keterangan?.message}</FormErrorMessage>
                        </FormControl>
                            {/* </GridItem> */}
                            
                            {/* <GridItem colSpan={4} gap={2}> */}

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
                                            'Kirim Permintaan'
                                    }
                                </Button>
                                {/* </GridItem> */}
                            {/* </GridItem> */}
                        {/* </SimpleGrid> */}
                        
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
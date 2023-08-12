import { UserDataInterface } from "@/hooks/useLogin";
import { useAccessLoginUser } from "@/hooks/useUserHook";
import { AddUserType, PostUserApiResponse } from "@/types/user";
import { USERS_KEY } from "@/utils/constant";
import { useHandlingHttpToast } from "@/utils/helper";
import { roleOptions } from "@/utils/options";
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
    GridItem
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { UseMutationResult, useQueryClient } from "react-query";
import Select from 'react-select';


interface ModalInterface {
    isOpen: boolean;
    onClose: () => void;
    userForm: UseFormReturn<AddUserType>
    mutationPost: UseMutationResult<PostUserApiResponse, AxiosError, AddUserType>
    onSubmit: (payload: AddUserType) => Promise<PostUserApiResponse | undefined>
    handleSelectedData: (data?: UserDataInterface) => void
    selectedData: UserDataInterface | null
    isLoadingForm: boolean
    isSuccessForm: boolean
    refetch: () => void
}

export default function ModalUser({
    isOpen,
    onClose,
    userForm,
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
    const { register, setValue, watch, formState: { errors }, handleSubmit, reset } = userForm
    const mutationPostAccessLogin = useAccessLoginUser()
    const queryClient = useQueryClient();
    useEffect(() => {
        if (isSuccessForm) {
            onClose()
        }
    }, [isSuccessForm])

    const handleAccessLogin = async (data: any) => {
        try {
            const cpPayload: any = {
                id_user: data?._id,
                status: data?.status === 'rejected' || data?.status === 'request' ? 'approved' : 'rejected'
            };
            // Make the HTTP request to the backend server
            let response = null;
            response = await mutationPostAccessLogin.mutateAsync(cpPayload);
            successToast(response?.message);
            handleSelectedData()
            queryClient.invalidateQueries([USERS_KEY]);
            refetch()
            userForm.reset();
            onClose()
            return response || null;
            // Additional logic for handling the response
        } catch (error: any) {
            // Show error toast notification
            errorToast(error);

            // Additional error handling logic
        }
    }


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
                        {selectedData ? 'Ubah Pengguna' : 'Tambah Pengguna'}
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
                        <FormControl id="email" mb={4} isInvalid={errors?.name?.message ? true : false}>
                            <FormLabel>Nama</FormLabel>
                            <Input type="text" {...register('name')} />
                            <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl id="email" mb={4} isInvalid={errors?.email?.message ? true : false}>
                            <FormLabel>Email</FormLabel>
                            <Input type="text" {...register('email')} />
                            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                        </FormControl>
                        {
                            !selectedData && (
                                <>
                                    <FormControl id="email" mb={4} isInvalid={errors?.password?.message ? true : false}>
                                        <FormLabel>Kata sandi</FormLabel>
                                        <Input type="password" {...register('password', { required: selectedData ? false : true })} />
                                        <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl id="password_confirmation" mb={4} isInvalid={errors?.password_confirmation?.message ? true : false}>
                                        <FormLabel>Konfirmasi Kata sandi</FormLabel>
                                        <Input type="password" {...register('password_confirmation', { required: selectedData ? false : true })} />
                                        <FormErrorMessage>{errors.password_confirmation && errors.password_confirmation.message}</FormErrorMessage>
                                    </FormControl>
                                </>
                            )
                        }
                        <SimpleGrid columns={isMobile ? 4 : 3} gap={2}>
                            <GridItem colSpan={isMobile ? 4 : 2}>
                                <FormControl maxW="200px" isInvalid={errors?.role?.message ? true : false}>
                                    <FormLabel>Peranan</FormLabel>
                                    <Select
                                        options={roleOptions}
                                        menuPosition={'fixed'}
                                        placeholder="Pilih Opsi"
                                        {...register('role')}
                                        onChange={(val) => setValue('role', val?.value)}
                                        value={roleOptions?.find((el) => el?.value === watch('role'))}
                                    />
                                    <FormErrorMessage>{errors.role && errors.role.message}</FormErrorMessage>
                                </FormControl>
                            </GridItem>
                            <GridItem  colSpan={4} gap={2}>
                                {/* <GridItem display={isMobile ? "flex" : ''} justifyContent={"space-between"}> */}
                                {
                                    selectedData?.status === 'rejected' ?
                                        <Button colorScheme="blue" mt={8} onClick={() => selectedData ? handleAccessLogin(selectedData) : onClose()} isDisabled={mutationPostAccessLogin.isLoading || isLoadingForm}>
                                            {
                                                mutationPostAccessLogin.isLoading || isLoadingForm &&
                                                <Spinner size="xs" />

                                            }
                                            {selectedData ? 'Buka akses login' : 'Batal'}
                                        </Button>
                                        : selectedData?.status === 'approved' ?
                                            <Button colorScheme="red" mt={8} onClick={() => selectedData ? handleAccessLogin(selectedData) : onClose()} isDisabled={mutationPostAccessLogin.isLoading || isLoadingForm}>
                                                {
                                                    mutationPostAccessLogin.isLoading || isLoadingForm &&
                                                    <Spinner size="xs" />

                                                }
                                                {selectedData ? 'Tutup akses login' : 'Batal'}
                                            </Button>
                                            :
                                            <Button colorScheme={!selectedData ? 'red' : "blue"} color={"white"} mt={8} onClick={() => selectedData ? handleAccessLogin(selectedData) : onClose()} isDisabled={mutationPostAccessLogin.isLoading || isLoadingForm}>
                                                {
                                                    mutationPostAccessLogin.isLoading || isLoadingForm &&
                                                    <Spinner size="xs" />

                                                }
                                                {selectedData ? 'Konfirmasi permintaan' : 'Batal'}
                                            </Button>
                                }

                            {/* </GridItem>
                            <GridItem> */}
                                <Button ml={4} px={4} minW="10px" type="submit" colorScheme="green" mt={8} isDisabled={mutationPostAccessLogin.isLoading || isLoadingForm}>
                                    {
                                        mutationPostAccessLogin.isLoading || isLoadingForm ?
                                            <Spinner size="xs" />
                                            :
                                            'Ubah'
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
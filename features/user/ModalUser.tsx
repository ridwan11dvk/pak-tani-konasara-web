import { UserDataInterface } from "@/hooks/useLogin";
import { AddUserType, PostUserApiResponse } from "@/types/user";
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
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { UseMutationResult } from "react-query";
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
    selectedData
}: ModalInterface) {

    const { register, setValue, watch, formState: { errors }, handleSubmit, reset } = userForm
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
            size="xl"
            scrollBehavior="inside"
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent="center">
                        {selectedData ? 'Edit User' : 'New User'}
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
                            <FormLabel>Name</FormLabel>
                            <Input type="text" {...register('name')} />
                            <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl id="email" mb={4} isInvalid={errors?.email?.message ? true : false}>
                            <FormLabel>Email address</FormLabel>
                            <Input type="text" {...register('email')} />
                            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                        </FormControl>
                        {
                            !selectedData && (
                                <>
                                    <FormControl id="email" mb={4} isInvalid={errors?.password?.message ? true : false}>
                                        <FormLabel>Password</FormLabel>
                                        <Input type="password" {...register('password', { required: selectedData ? false : true })} />
                                        <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl id="password_confirmation" mb={4} isInvalid={errors?.password_confirmation?.message ? true : false}>
                                        <FormLabel>Password Confirmation</FormLabel>
                                        <Input type="password" {...register('password_confirmation', { required: selectedData ? false : true })} />
                                        <FormErrorMessage>{errors.password_confirmation && errors.password_confirmation.message}</FormErrorMessage>
                                    </FormControl>
                                </>
                            )
                        }
                        <HStack alignItems="center" justifyContent="space-between">
                            <FormControl maxW="200px" isInvalid={errors?.role?.message ? true : false}>
                                <FormLabel>Role</FormLabel>
                                <Select
                                    options={roleOptions}
                                    menuPosition={'fixed'}
                                    {...register('role')}
                                    onChange={(val) => setValue('role', val?.value)}
                                    value={roleOptions?.find((el) => el?.value === watch('role'))}
                                />
                                <FormErrorMessage>{errors.role && errors.role.message}</FormErrorMessage>
                            </FormControl>
                            <HStack>
                                <Button colorScheme="red" mt={8} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" colorScheme="green" mt={8} isDisabled={isLoadingForm}>
                                    {
                                        isLoadingForm ?
                                            <Spinner size="xs" />
                                            :
                                            'Confirm'
                                    }
                                </Button>
                            </HStack>
                        </HStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
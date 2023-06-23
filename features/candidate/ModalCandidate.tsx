import { UserDataInterface } from "@/hooks/useLogin";
import { CandidatePostApiResponseType, CandidateType } from "@/types/candidate";
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
import { UseFormReturn } from "react-hook-form";
import { UseMutationResult } from "react-query";


interface ModalInterface {
    isOpen: boolean;
    onClose: () => void;
    candidateForm: UseFormReturn<CandidateType>
    mutationPost: UseMutationResult<CandidatePostApiResponseType, AxiosError, CandidateType>
    onSubmit: (payload: CandidateType) => Promise<CandidatePostApiResponseType | undefined>
    handleSelectedData: (data?: CandidateType) => void
}

export default function ModalUser({
    isOpen,
    onClose,
    candidateForm,
    onSubmit,
    mutationPost,
    handleSelectedData,
}: ModalInterface) {

    const { register, setValue, watch, formState: { errors }, handleSubmit, reset } = candidateForm

    return (
        <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={() => {
                reset()
                handleSelectedData()
                !mutationPost.isLoading && onClose()
            }}
            size="xl"
            scrollBehavior="inside"
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent="center">
                        New Candidate
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
                        <FormControl isInvalid={errors?.phone_number?.message ? true : false}>
                            <FormLabel>Phone Number</FormLabel>
                            <Input type="number" {...register('phone_number')} />
                            <FormErrorMessage>{errors.phone_number && errors.phone_number.message}</FormErrorMessage>
                        </FormControl>
                        <HStack alignItems="center" justifyContent="space-between">
                            <Button colorScheme="blue" mt={8} onClick={onClose}>
                                Import From Excel
                            </Button>
                            <HStack>
                                <Button colorScheme="red" mt={8} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" colorScheme="green" mt={8} isDisabled={mutationPost.isLoading}>
                                    {
                                        mutationPost.isLoading ?
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
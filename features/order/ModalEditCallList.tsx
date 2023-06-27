import { UserDataInterface } from "@/hooks/useLogin";
import { SingleCallHistoryApiResponseType } from "@/types/callHistory";
import { InsertManyCandidateApiResponseType, InsertManyCandidateType } from "@/types/candidate";
import { SelectOptionType } from "@/types/form";
import { AddOrderApiResponseType, AddOrderType, CallType, OrderType, PatchAddOrderType, PatchCallListType } from "@/types/order";
import { AddUserType, PostUserApiResponse } from "@/types/user";
import { orderStatusOptions } from "@/utils/constant";
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
    Textarea,
    VStack,
} from "@chakra-ui/react";
import { Axios, AxiosError } from "axios";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { UseMutationResult } from "react-query";
import Select from 'react-select';


interface ModalInterface {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<CallType>
    mutationPatch: UseMutationResult<any>
    onSubmit: (payload: any) => Promise<any>
}

export default function ModalEditCallList({
    isOpen,
    onClose,
    form,
    onSubmit,
    mutationPatch,
}: ModalInterface) {

    const { register, setValue, formState: { errors }, handleSubmit, reset, watch } = form

    return (
        <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={() => {
                reset({})
                !mutationPatch.isLoading && onClose()
            }}
            size="xl"
            scrollBehavior="inside"
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent="center">
                        Edit Call List
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
                        <VStack>
                            <FormControl isInvalid={errors?.name?.message ? true : false}>
                                <FormLabel>Title</FormLabel>
                                <Input type="text" {...register('name')} />
                                <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors?.email?.message ? true : false}>
                                <FormLabel>Email</FormLabel>
                                <Input type="text" {...register('email')} />
                                <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors?.phone_number?.message ? true : false}>
                                <FormLabel>Phone Number</FormLabel>
                                <Input type="text" {...register('phone_number')} />
                                <FormErrorMessage>{errors.phone_number && errors.phone_number.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl mb={4} isInvalid={errors?.last_contact?.message ? true : false}>
                                <FormLabel>Order Date</FormLabel>
                                <Input
                                    placeholder="Select Date"
                                    type="date"
                                    {...register('last_contact')}
                                />
                                {/* <Input type="text" {...register('last_contact')} /> */}
                                <FormErrorMessage>{errors.last_contact && errors.last_contact.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors?.status?.message ? true : false}>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    options={orderStatusOptions}
                                    menuPosition={'fixed'}
                                    {...register('status')}
                                    onChange={(val: any) => setValue('status', val?.value)}
                                    value={orderStatusOptions.find((item) => item.value === watch('status'))}
                                    placeholder="Please select status"
                                />
                                <FormErrorMessage>{errors?.status && errors?.status?.message}</FormErrorMessage>
                            </FormControl>
                        </VStack>
                        <HStack alignItems="center" justifyContent="end">
                            <HStack>
                                <Button colorScheme="red" mt={8} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" colorScheme="green" mt={8} isDisabled={mutationPatch.isLoading}>
                                    {
                                        mutationPatch.isLoading ?
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
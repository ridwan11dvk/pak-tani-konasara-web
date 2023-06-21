import { UserDataInterface } from "@/hooks/useLogin";
import { AddOrderApiResponseType, AddOrderType, OrderType, PatchAddOrderType } from "@/types/order";
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
    Textarea,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { UseMutationResult } from "react-query";
import Select from 'react-select';


interface ModalInterface {
    isOpen: boolean;
    onClose: () => void;
    orderForm: UseFormReturn<AddOrderType>
    mutationPost: UseMutationResult<AddOrderApiResponseType, AxiosError, AddOrderType>
    mutationPatch: UseMutationResult<AddOrderApiResponseType, AxiosError, PatchAddOrderType>
    onSubmit: (payload: AddOrderType) => Promise<any>
    handleSelectedData?: (data?: OrderType) => void
}

export default function ModalAddOrder({
    isOpen,
    onClose,
    orderForm,
    onSubmit,
    mutationPost,
    handleSelectedData,
    mutationPatch
}: ModalInterface) {

    const { register, setValue, watch, formState: { errors }, handleSubmit, reset } = orderForm

    return (
        <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={() => {
                reset({})
                handleSelectedData?.()
                !mutationPost.isLoading || !mutationPatch.isLoading && onClose()
            }}
            size="xl"
            scrollBehavior="inside"
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent="center">
                        New Order
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose}/>
                <ModalBody>
                    <Box as={'form'} onSubmit={handleSubmit(async (payload) => {
                        const res = await onSubmit(payload)
                        if (res?.data) {
                            onClose()
                        }
                    })} method="POST">
                        <FormControl mb={4} isInvalid={errors?.title?.message ? true : false}>
                            <FormLabel>Title</FormLabel>
                            <Input type="text" {...register('title')} />
                            <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mb={4} isInvalid={errors?.order_date?.message ? true : false}>
                            <FormLabel>Order Date</FormLabel>
                            <Input
                                placeholder="Select Date"
                                type="date"
                                {...register('order_date')}
                            />
                            {/* <Input type="text" {...register('order_date')} /> */}
                            <FormErrorMessage>{errors.order_date && errors.order_date.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mb={4} isInvalid={errors?.finish_by_days?.message ? true : false}>
                            <FormLabel>Finish By (Days)</FormLabel>
                            <Input
                                placeholder=""
                                type="number"
                                {...register('finish_by_days')}
                            />
                            {/* <Input type="text" {...register('order_date')} /> */}
                            <FormErrorMessage>{errors.finish_by_days && errors.finish_by_days.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mb={4} isInvalid={errors?.order_by?.message ? true : false}>
                            <FormLabel>Ordered By</FormLabel>
                            <Input type="text" {...register('order_by')} />
                            <FormErrorMessage>{errors.order_by && errors.order_by.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mb={4} isInvalid={errors?.overview?.message ? true : false}>
                            <FormLabel>Overview</FormLabel>
                            <Textarea {...register('overview')} />
                            <FormErrorMessage>{errors.overview && errors.overview.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mb={4} isInvalid={errors?.detail?.message ? true : false}>
                            <FormLabel>Details</FormLabel>
                            <Textarea {...register('detail')} />
                            <FormErrorMessage>{errors.detail && errors.detail.message}</FormErrorMessage>
                        </FormControl>
                        <HStack alignItems="center" justifyContent="end">
                            <HStack>
                                <Button colorScheme="red" mt={8} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" colorScheme="green" mt={8} isDisabled={mutationPost.isLoading || mutationPatch.isLoading}>
                                    {
                                        mutationPost.isLoading || mutationPatch.isLoading ?
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
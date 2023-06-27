import { UserDataInterface } from "@/hooks/useLogin";
import { InsertManyCandidateApiResponseType, InsertManyCandidateType } from "@/types/candidate";
import { SelectOptionType } from "@/types/form";
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
import { Axios, AxiosError } from "axios";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { UseMutationResult } from "react-query";
import Select from 'react-select';


interface ModalInterface {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<AddOrderType>
    mutationPatch: UseMutationResult<AddOrderApiResponseType, AxiosError, any>
    onSubmit: (payload: any) => Promise<any>
    callerOptions?: any[]
}

export default function ModalAssignCaller({
    isOpen,
    onClose,
    form,
    onSubmit,
    mutationPatch,
    callerOptions
}: ModalInterface) {

    const { register, setValue, formState: { errors }, handleSubmit, reset } = form

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
                        Assign Caller
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
                        <FormControl isInvalid={errors?.caller?.message ? true : false}>
                                <FormLabel>Caller</FormLabel>
                                <Select
                                    options={callerOptions}
                                    menuPosition={'fixed'}
                                    {...register('caller')}
                                    onChange={(val: any) => setValue('caller', val)}
                                    placeholder="Please select caller"
                                />
                                <FormErrorMessage>{errors?.caller && errors?.caller?.message}</FormErrorMessage>
                            </FormControl>
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
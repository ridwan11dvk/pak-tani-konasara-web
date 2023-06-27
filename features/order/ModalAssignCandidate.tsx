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
import { AxiosError } from "axios";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { UseMutationResult } from "react-query";
import Select from 'react-select';


interface ModalInterface {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<InsertManyCandidateType>
    mutationPost: UseMutationResult<InsertManyCandidateApiResponseType, AxiosError, InsertManyCandidateType>
    onSubmit: (payload: InsertManyCandidateType) => Promise<any>
    candidateOptions?: any[]
}

export default function ModalAssignCandidate({
    isOpen,
    onClose,
    form,
    onSubmit,
    mutationPost,
    candidateOptions
}: ModalInterface) {

    const { register, setValue, formState: { errors }, handleSubmit, reset } = form

    return (
        <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={() => {
                reset({})
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
                        Assign Candidate
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
                        <FormControl isInvalid={errors?.id_candidates?.message ? true : false}>
                                <FormLabel>Candidates</FormLabel>
                                <Select
                                    options={candidateOptions}
                                    menuPosition={'fixed'}
                                    {...register('id_candidates')}
                                    onChange={(val: any) => setValue('id_candidates', val)}
                                    placeholder="Please Select at least 1 candidate"
                                    isMulti
                                />
                                <FormErrorMessage>{errors.id_candidates && errors.id_candidates.message}</FormErrorMessage>
                            </FormControl>
                        <HStack alignItems="center" justifyContent="end">
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
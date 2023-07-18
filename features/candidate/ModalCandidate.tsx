import { useMultiPostCandidate } from "@/hooks/useCandidate";
import { UserDataInterface } from "@/hooks/useLogin";
import useUserStore from "@/stores/useUser";
import { CandidatePostApiResponseType, CandidateType } from "@/types/candidate";
import { AddUserType, PostUserApiResponse } from "@/types/user";
import { CANDIDATE_KEY } from "@/utils/constant";
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
    useToast,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    ModalFooter,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { ChangeEvent, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { UseMutationResult, useQueryClient } from "react-query";

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
    const { errorToast, successToast } = useHandlingHttpToast();
    const { userData } = useUserStore()
    const toast = useToast()
    const { register, setValue, watch, formState: { errors }, handleSubmit, reset } = candidateForm;
    const [dataExcel, setDataExcel] = useState<any[]>([]);
    const multiCreateCandidateMutation = useMultiPostCandidate()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient()

    const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];
        if (!selectedFile) {
            // User cancelled the file selection
            return;
        }
        const { name, type } = selectedFile;
        if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            // Handle file type validation
            onClose()
            toast({
                title: "Error",
                description: 'Invalid file type. Only XLSX files are supported.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            try {
                const xlsx = await import('xlsx');
                const workbook = xlsx.read(data, { type: 'array' });
                // Get the first sheet name
                const sheetName = workbook.SheetNames[0];

                // Get the worksheet data
                const worksheet = workbook.Sheets[sheetName];

                // Get header names from cells A1, B1, and C1
                const headerA1 = worksheet['A1'] ? worksheet['A1'].v : undefined;
                const headerB1 = worksheet['B1'] ? worksheet['B1'].v : undefined;
                const headerC1 = worksheet['C1'] ? worksheet['C1'].v : undefined;
                if (headerB1 !== 'Candidate Name' && headerC1 !== 'Phone Number') {
                    onClose()
                    toast({
                        title: "Error",
                        description: 'Your file is not on the right format document',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    })
                    return;
                }

                // Create an array to hold the data
                const dataArray = [];

                // Loop through the worksheet starting from the second row (A2, B2, C2, etc.)
                // to skip the header row
                for (let rowNum = 2; ; rowNum++) {
                    const cellA = worksheet['A' + rowNum];
                    const cellB = worksheet['B' + rowNum];
                    const cellC = worksheet['C' + rowNum];

                    // Stop the loop if any of the cells in the row are empty
                    if (!cellA && !cellB && !cellC) {
                        break;
                    }

                    // Get the values from the cells
                    const valueA = cellA ? cellA.v : '';
                    const valueB = cellB ? cellB.v : '';
                    const valueC = cellC ? cellC.v : '';
                    let valuePhoneC = ''

                    const trimmedValueC = valueC?.toString?.()?.trim?.();
                    if (trimmedValueC?.includes?.(',') || trimmedValueC?.includes?.('\n')) {
                        valuePhoneC = trimmedValueC?.split?.(/,|\n/)?.[0];
                    }

                    // Push the row data into the dataArray
                    dataArray.push({
                        id_user: userData?._id,
                        name: valueB,
                        email: '-',
                        phone_number: parseInt(trimmedValueC?.replace?.(/\D/g, ''), 10)
                    });
                }
                setDataExcel(dataArray);
                // Process the workbook data as needed (e.g., extract sheet data)
                // ...
            } catch (error) {
                onClose()
                toast({
                    title: "Error",
                    description: 'Error selecting/uploading file:',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
                console.error('Error loading xlsx:', error);
            }
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const onSubmitMultiCreateCandidate = async () => {
        try {
            const response = await multiCreateCandidateMutation.mutateAsync(dataExcel)
            if (response) {
                
                setDataExcel([])
                onClose()
                queryClient.invalidateQueries([CANDIDATE_KEY]);
                successToast('Success submit all candidate')
            }
        }
        catch (err: any) {
            errorToast(err)
        }
    }


    return (
        <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={() => {
                reset();
                handleSelectedData();
                !mutationPost.isLoading && onClose();
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
                <ModalBody >
                    {
                        dataExcel?.length > 0 ? (
                            <Box>
                                <TableContainer>
                                    <Table variant='striped'>

                                        <Thead>
                                            <Tr>
                                                <Th>Name</Th>
                                                <Th>Email</Th>
                                                <Th>Phone</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {
                                                dataExcel?.map?.((item, index) => {
                                                    return (
                                                        <Tr key={index}>
                                                            <Td>{item?.name}</Td>
                                                            <Td>{item?.email}</Td>
                                                            <Td>{item?.phone_number}</Td>
                                                        </Tr>

                                                    )
                                                })
                                            }

                                        </Tbody>

                                    </Table>
                                </TableContainer>
                            </Box>
                        ) : (
                            <Box as="form" onSubmit={handleSubmit(async (payload) => {
                                const res = await onSubmit(payload);
                                if (res?.data) {
                                    onClose();
                                }
                            })} method="POST">
                                <FormControl id="name" mb={4} isInvalid={errors?.name?.message ? true : false}>
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
                                    <Button colorScheme="blue" mt={8} onClick={() => fileInputRef.current?.click()}>
                                        Import From Excel
                                    </Button>
                                    <HStack>
                                        <Button colorScheme="red" mt={8} onClick={onClose}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" colorScheme="green" mt={8} isDisabled={mutationPost.isLoading}>
                                            {mutationPost.isLoading ? (
                                                <Spinner size="xs" />
                                            ) : (
                                                'Confirm'
                                            )}
                                        </Button>
                                    </HStack>
                                </HStack>
                            </Box>
                        )}
                </ModalBody>
                {
                    dataExcel?.length > 0 && (
                        <ModalFooter justifyContent={"center"}>
                            <Button colorScheme="blue" isDisabled={multiCreateCandidateMutation.isLoading} onClick={onSubmitMultiCreateCandidate} mr={4}>
                                {multiCreateCandidateMutation.isLoading ? (
                                    <Spinner size="xs" />
                                ) : (
                                    'Submit'
                                )}
                            </Button><Button colorScheme="red" onClick={onClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    )
                }
            </ModalContent>
            <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileSelection}
                accept=".xls, .xlsx"
            />
        </Modal>
    );
}

import { CandidateType } from "@/types/candidate";
import {
    Box,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Button,
    Flex,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";


interface ModalInterface {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (id: string) => void
    isLoadingDelete: boolean
    isSuccessDelete: boolean
    selectedData: CandidateType | null
}

export default function ModalDeleteCandidate({
    isOpen,
    onClose,
    isLoadingDelete,
    onDelete,
    isSuccessDelete,
    selectedData
}: ModalInterface) {

    useEffect(() => {
        if (isSuccessDelete) {
            onClose()
        }
    }, [isSuccessDelete])

    return (
        <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={() => {
                !isLoadingDelete && onClose()
            }}
            size="xl"
            scrollBehavior="inside"
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent="center">
                       
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose}/>
                <ModalBody>
                    <VStack justifyContent="center">
                        <Text fontSize="2xl" fontWeight={"600"}>Are you sure to delete</Text>
                        <Text fontSize="2xl" fontWeight={"600"}>{selectedData?.name}</Text>
                        <HStack gap={10}>
                            <Button colorScheme="red" mt={8} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={() => selectedData?._id && onDelete(selectedData?._id)} colorScheme="green" mt={8} isDisabled={isLoadingDelete}>
                                {
                                    isLoadingDelete ?
                                        <Spinner size="xs" />
                                        :
                                        'Confirm'
                                }
                            </Button>
                        </HStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
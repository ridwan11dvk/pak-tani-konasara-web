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
    useMediaQuery,
} from "@chakra-ui/react";
import { useEffect } from "react";


interface ModalInterface {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (id: string) => void
    isLoadingDelete: boolean
    isSuccessDelete: boolean
    selectedData: any | null
}

export default function ModalDeleteLand({
    isOpen,
    onClose,
    isLoadingDelete,
    onDelete,
    isSuccessDelete,
    selectedData
}: ModalInterface) {
    const [isMobile] = useMediaQuery('(max-width: 768px)')
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
            size={isMobile ? 'sm' :"xl"}
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
                        <Text fontSize="2xl" fontWeight={"600"}>Apakah anda yakin ingin menghapus ?</Text>
                        <Text fontSize="2xl" fontWeight={"600"}>{selectedData?.nama}</Text>
                        <HStack gap={10}>
                            <Button colorScheme="red" mt={8} onClick={onClose}>
                                Batal
                            </Button>
                            <Button type="button" onClick={() => selectedData?._id && onDelete(selectedData?._id)} colorScheme="green" mt={8} isDisabled={isLoadingDelete}>
                                {
                                    isLoadingDelete ?
                                        <Spinner size="xs" />
                                        :
                                        'Ya'
                                }
                            </Button>
                        </HStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
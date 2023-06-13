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
    Input,
    Select
} from "@chakra-ui/react";


interface ModalInterface {
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalUser({
    isOpen,
    onClose,
}: ModalInterface) {

    return (
        <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={onClose}
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
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="email" mb={4}>
                        <FormLabel>Name</FormLabel>
                        <Input type="text" />
                    </FormControl>
                    <FormControl id="email" mb={4}>
                        <FormLabel>Email address</FormLabel>
                        <Input type="text" />
                    </FormControl>
                    <HStack alignItems="center" justifyContent="space-between">
                        <FormControl maxW="100px">
                        <FormLabel>Role</FormLabel>
                        <Select placeholder='Select option'>
                            <option value='option1'>Admin</option>
                            <option value='option2'>User</option>
                        </Select>
                        </FormControl>
                        <HStack>
                        <Button colorScheme="red" mt={8}>
                            Cancel
                        </Button>
                        <Button colorScheme="green" mt={8}>
                            Confirm
                        </Button>
                        </HStack>
                    </HStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
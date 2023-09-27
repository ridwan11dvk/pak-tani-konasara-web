import React from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Button,
  Flex,
  ModalFooter,
  Divider,
  Spinner,
} from "@chakra-ui/react";

export default function CancelRequestSeedModall({
  isOpen,
  onClose,
  selectedData,
  onDelete,
  mutationDelete,
}: any) {
  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={() => {
        onClose?.();
      }}
      size="md"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent minW="800px" px="10px">
        <ModalHeader>
          <Text>Peringatan</Text>
          <ModalCloseButton pt={3} />
          <Divider />
        </ModalHeader>

        <ModalBody>
          <Flex justifyContent="center" gap={2}>
            <Text fontWeight="bold" fontSize="lg">
              Apakah anda yakin ingin membatalkan permintaan pupuk{" "}
              {`"${selectedData?.namaBarang || ""}"`} ?
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Flex justifyContent="center" minW="full" gap={4}>
            <Button
              onClick={() => {
                onClose?.();
              }}
              alignSelf="center"
            >
              {"Tutup"}
            </Button>
            <Button
              minW={"100px"}
              colorScheme="red"
              onClick={() => {
                onDelete?.(selectedData?._id);
              }}
              alignSelf="center"
            >
              {mutationDelete?.isLoading ? <Spinner size="xs" /> : "Ya"}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

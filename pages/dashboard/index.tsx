import Layout from '@/components/Layout';
import ModalUser from '@/features/user/ModalUser';
import {
  Box, Button, FormControl, Icon, Input, InputGroup, InputRightAddon, Text, VStack, Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { BsSearch, BsPencil, BsTrash3 } from 'react-icons/bs'

const DashboardPage = (): JSX.Element => {

  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <Layout>
      <Box p={"50px"}>
        <VStack gap={8} alignItems="start" minW="full">
          <Button colorScheme='green' onClick={onOpen}>
            New User
          </Button>
          <TableContainer borderWidth={1} minW="full" borderRadius={4}>
            <Table variant='unstyled'>
              <Thead>
                <Tr>
                  <Th isNumeric>ID</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Action</Th>
                  <Th>Order</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Th isNumeric>1</Th>
                  <Th>Test</Th>
                  <Th>Test@mail.com</Th>
                  <Th>Admin</Th>
                  <Th minW="100px">
                    <HStack gap={4} >
                      <Button>
                        <Icon as={BsPencil} />
                      </Button>
                      <Button>
                        <Icon as={BsTrash3} />
                      </Button>
                    </HStack>
                  </Th>
                  <Th>
                    <Button backgroundColor="blue.400" color="white">View</Button>
                  </Th>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>

      </Box>
      <ModalUser
      isOpen={isOpen}
      onClose={onClose}
      />
    </Layout>
  );
};

export default DashboardPage;

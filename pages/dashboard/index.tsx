import Layout from '@/components/Layout';
import ModalUser from '@/features/user/ModalUser';
import { useUserHook } from '@/hooks/useUserHook.tsx';
import {
  Box, Button, FormControl, Icon, Input, InputGroup, InputRightAddon, Text, VStack,
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
import Table from "@/components/Table";
import { BsPencil, BsTrash3, BsEyeFill, BsSearch } from 'react-icons/bs'
import { UserDataInterface } from '@/hooks/useLogin';
import ModalDeleteUser from '@/features/user/ModalDeleteUser';

const DashboardPage = (): JSX.Element => {

  const {
    dataUsers,
    columnsUsers,
    setParams,
    totalPages,
    params,
    isLoadingUsers,
    userForm,
    onSubmit,
    mutationPost,
    selectedData,
    handleSelectedData,
    isLoadingForm,
    isSuccessForm,
    onDeleteUser,
    isLoadingDelete,
    isSuccessDelete
  } = useUserHook()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { isOpen: isOpenDelete, onClose: onCloseDelete, onOpen: onOpenDelete } = useDisclosure()


  const renderAction = (data: UserDataInterface) => {
    return (
      <HStack gap={4} >
        <Button onClick={() => {
          onOpen()
          userForm.setValue('name', data.name)
          userForm.setValue('email', data.email)
          userForm.setValue('role', data.role)
          handleSelectedData(data)
        }}>
          <Icon as={BsPencil} />
        </Button>
        <Button onClick={() => {
          handleSelectedData(data)
          onOpenDelete()
        }}>
          <Icon as={BsTrash3} />
        </Button>
      </HStack>
    )
  }

  return (
    <Layout>
      <Box p={"50px"}>
        <VStack gap={8} alignItems="start" minW="full">
          {/* If you add the size prop to `InputGroup`, it'll pass it to all its children. */}
          <InputGroup size='md' >
            <Input value={params.search} onChange={(e) => setParams({ ...params, search: e.target.value })} placeholder='Search' backgroundColor="white" />
            <InputRightAddon backgroundColor="white">
              <Icon as={BsSearch} />
            </InputRightAddon>
          </InputGroup>
          <Button colorScheme='green' onClick={() => {
            onOpen()
            userForm.reset()
          }}>
            New User
          </Button>
          <Table
            columns={columnsUsers}
            isLoading={isLoadingUsers}
            data={dataUsers || []}
            actionButton={true}
            actionMenu={renderAction}
            isSorting={true}
            setQueryParams={setParams}
            queryParams={params}
            totalPages={totalPages}
          />
        </VStack>

      </Box>
      <ModalUser
        onSubmit={onSubmit}
        userForm={userForm}
        isOpen={isOpen}
        handleSelectedData={handleSelectedData}
        onClose={onClose}
        mutationPost={mutationPost}
        isLoadingForm={isLoadingForm}
        isSuccessForm={isSuccessForm}
      />
      <ModalDeleteUser
        onDelete={onDeleteUser}
        isLoadingDelete={isLoadingDelete}
        isSuccessDelete={isSuccessDelete}
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        selectedData={selectedData}
      />
    </Layout>
  );
};

export default DashboardPage;

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
  FormLabel,
} from '@chakra-ui/react';
import Table from "@/components/Table";
import { BsPencil, BsTrash3, BsEyeFill, BsSearch } from 'react-icons/bs'
import { UserDataInterface } from '@/hooks/useLogin';
import ModalDeleteUser from '@/features/user/ModalDeleteUser';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

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

  const [search, setSearch] = useState('')
  const [value] = useDebounce(search, 800)

  useEffect(() => {
    setParams((prev) => ({ ...prev, search: value }))
  }, [value])


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
    <>
      <Head>
        <title>User Page</title>
      </Head>
      <Layout>
        <Box p={"50px"}>
          <VStack gap={8} alignItems="start" minW="full">
            {/* If you add the size prop to `InputGroup`, it'll pass it to all its children. */}
            <InputGroup size='md' >
              <Input value={params.search} onChange={(e) => setSearch(e.target.value)}
                placeholder='Search' backgroundColor="white"
              />
              <InputRightAddon backgroundColor="white">
                <Icon as={BsSearch} />
              </InputRightAddon>
            </InputGroup>
            <HStack gap={4}>
              <FormControl mb={4}>
                <FormLabel>Start Date</FormLabel>
                <Input

                  value={params.startDate}
                  onChange={(e) => setParams({ ...params, startDate: e.target.value })}
                  bgColor="white"
                  placeholder="Select Date"
                  type="date"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>End Date</FormLabel>
                <Input
                  value={params.endDate}
                  onChange={(e) => setParams({ ...params, endDate: e.target.value })}
                  bgColor="white"
                  placeholder="Select Date"
                  type="date"
                />
              </FormControl>
            </HStack>

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
    </>
  );
};

export default DashboardPage;

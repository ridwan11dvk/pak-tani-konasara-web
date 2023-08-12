import Layout from '@/components/Layout';
import ModalUser from '@/features/user/ModalUser';
import { useUserHook } from '@/hooks/useUserHook.tsx';
import {
  Box, Button, FormControl, Icon, Input, InputGroup, InputRightElement, Text, VStack,
  HStack,
  useDisclosure,
  FormLabel,
  Flex,
  useMediaQuery,
  SimpleGrid,
  GridItem,
} from '@chakra-ui/react';
import Table from "@/components/Table";
import { BsPencil, BsTrash3, BsEyeFill, BsSearch } from 'react-icons/bs'
import { UserDataInterface } from '@/hooks/useLogin';
import ModalDeleteUser from '@/features/user/ModalDeleteUser';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';


const UserPage = (): JSX.Element => {
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
    isSuccessDelete,
    refetch
  } = useUserHook()

  const { isOpen, onClose, onOpen } = useDisclosure()
  const { isOpen: isOpenDelete, onClose: onCloseDelete, onOpen: onOpenDelete } = useDisclosure()
  const [isMobile] = useMediaQuery('(max-width: 768px)')
  const [search, setSearch] = useState('')
  const [value] = useDebounce(search, 800)

  useEffect(() => {
    setParams({ ...params, search: value })
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
        <title>Management Pengguna - Pak Tani Konasara</title>
      </Head>
      <Layout menuName='Management User'>
        <Box p={isMobile ? 4: 8} overflowX={"auto"}>
          <VStack gap={8} alignItems="start">
            <InputGroup >
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder='Cari Pengguna' backgroundColor="white"
              />
              <InputRightElement >
                <Icon as={BsSearch} />
              </InputRightElement>
            </InputGroup>
            <SimpleGrid columns={2} gap={4}>
              <GridItem>
                <FormControl mb={4}>
                  <FormLabel>Tanggal mulai</FormLabel>
                  <Input

                    value={params.startDate}
                    onChange={(e) => setParams({ ...params, startDate: e.target.value })}
                    bgColor="white"
                    placeholder="Select Date"
                    type="date"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl mb={4}>
                  <FormLabel>Tanggal akhir</FormLabel>
                  <Input
                    value={params.endDate}
                    onChange={(e) => setParams({ ...params, endDate: e.target.value })}
                    bgColor="white"
                    placeholder="Select Date"
                    type="date"
                  />
                </FormControl></GridItem>
            </SimpleGrid>

            <Button colorScheme='green' onClick={() => {
              onOpen()
              userForm.reset()
            }}>
              Tambah Pengguna
            </Button>
            <Box>
              <Text pb={2}>Filter berdasarkan</Text>
              <SimpleGrid columns={isMobile ? 2 : 5} gap={4}>
                <Button colorScheme='red' onClick={() => {
                  setParams({ ...params, status: 'rejected' })
                }}>
                  Ditolak
                </Button>
                <Button colorScheme='green' onClick={() => {
                  setParams({ ...params, status: 'approved' })
                }}>
                  Disetujui
                </Button>
                <Button colorScheme='orange' onClick={() => {
                  setParams({ ...params, status: 'request' })
                }}>
                  Menunggu Konfirmasi
                </Button>
                <Button colorScheme='blue' onClick={() => {
                  setParams({ ...params, sort: 'desc' })
                }}>
                  Terbaru
                </Button>
                <Button colorScheme='teal' onClick={() => {
                  setParams({ ...params, sort: 'asc' })
                }}>
                  Lama
                </Button>
              </SimpleGrid>
            </Box>
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

          <ModalUser
            onSubmit={onSubmit}
            userForm={userForm}
            isOpen={isOpen}
            handleSelectedData={handleSelectedData}
            onClose={onClose}
            mutationPost={mutationPost}
            isLoadingForm={isLoadingForm}
            isSuccessForm={isSuccessForm}
            selectedData={selectedData}
            refetch={refetch}
          />
          <ModalDeleteUser
            onDelete={onDeleteUser}
            isLoadingDelete={isLoadingDelete}
            isSuccessDelete={isSuccessDelete}
            isOpen={isOpenDelete}
            onClose={onCloseDelete}
            selectedData={selectedData}
          />
        </Box>
      </Layout>
    </>
  )
}

export default UserPage
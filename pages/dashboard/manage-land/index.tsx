import Layout from '@/components/Layout';
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
import ModalDeleteUser from '@/features/user/ModalDeleteUser';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useLand } from '@/hooks/useLand';
import ModalLand from '@/features/land/ModalLand';


const ManageLandPage = (): JSX.Element => {
  const {
    dataLands,
    columnsLand,
    setParams,
    totalPages,
    params,
    isLoadingUsers,
    landForm,
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
  } = useLand()

  const { isOpen, onClose, onOpen } = useDisclosure()
  const { isOpen: isOpenDelete, onClose: onCloseDelete, onOpen: onOpenDelete } = useDisclosure()
  const [isMobile] = useMediaQuery('(max-width: 768px)')
  const [search, setSearch] = useState('')
  const [value] = useDebounce(search, 800)

  useEffect(() => {
    setParams({ ...params, search: value })
  }, [value])


  const renderAction = (data: any) => {
    return (
      <HStack gap={4} >
        <Button onClick={() => {
          onOpen()
          landForm.setValue('nama', data?.nama)
          landForm.setValue('status', data?.status)
          landForm.setValue('keterangan', data?.keterangan)
          landForm.setValue('jenis', data?.jenis)
          landForm.setValue('lokasi', data?.lokasi)
          landForm.setValue('luas', data?.luas)
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
        <title>Management Lahan - Pak Tani Konasara</title>
      </Head>
      <Layout menuName='Management Lahan'>
        <Box p={isMobile ? 4: 8} overflowX={"auto"}>
          <VStack gap={8} alignItems="start">
            <InputGroup >
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder='Cari Lahan' backgroundColor="white"
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
              landForm.reset()
            }}>
              Tambah Lahan
            </Button>
            <Box>
              <Text pb={2}>Filter berdasarkan</Text>
              <SimpleGrid columns={isMobile ? 2 : 5} gap={4}>
                <Button colorScheme='red' onClick={() => {
                  setParams({ ...params, status: 'Non-Aktif' })
                }}>
                  Non-Aktif
                </Button>
                <Button colorScheme='green' onClick={() => {
                  setParams({ ...params, status: 'Aktif' })
                }}>
                  Aktif
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
              columns={columnsLand}
              isLoading={isLoadingUsers}
              data={dataLands || []}
              actionButton={true}
              actionMenu={renderAction}
              isSorting={true}
              setQueryParams={setParams}
              queryParams={params}
              totalPages={totalPages}
            />
          </VStack>

           <ModalLand
            onSubmit={onSubmit}
            landForm={landForm}
            isOpen={isOpen}
            handleSelectedData={handleSelectedData}
            onClose={onClose}
            mutationPost={mutationPost}
            isLoadingForm={isLoadingForm}
            isSuccessForm={isSuccessForm}
            selectedData={selectedData}
            refetch={refetch}
          />
          {/*<ModalDeleteUser
            onDelete={onDeleteUser}
            isLoadingDelete={isLoadingDelete}
            isSuccessDelete={isSuccessDelete}
            isOpen={isOpenDelete}
            onClose={onCloseDelete}
            selectedData={selectedData}
          /> */}
        </Box>
      </Layout>
    </>
  )
}

export default ManageLandPage
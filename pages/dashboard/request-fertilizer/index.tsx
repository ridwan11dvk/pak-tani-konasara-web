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
import { BsPencil, BsTrash3, BsEyeFill, BsSearch, BsCheck2Circle, BsPlus } from 'react-icons/bs'
import { IoLeafOutline } from 'react-icons/io5'
import ModalDeleteUser from '@/features/user/ModalDeleteUser';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useLand } from '@/hooks/useLand';
import ModalLand from '@/features/land/ModalLand';

import ModalDeleteLand from '@/features/land/ModalDeleteLand';
import { useRequestSeed } from '@/hooks/useRequestSeed';
import RequestSeedModal from '@/features/seed/RequestSeedModal';
import ProceessedSeedModal from '@/features/seed/ProcessedSeedModal';
import { useRouter } from 'next/router';
import ApprovedRequestModal from '@/features/fertilizer/ApprovedRequestModal';
import { useRequestFertilizer } from '@/hooks/useRequestFertilizer';
import RequestFertilizerModal from '@/features/fertilizer/RequestFertilizerModal';
import ProceessedFertilizerModal from '@/features/fertilizer/ProcessedFertilizerModal';


const RequestFertilizer = (): JSX.Element => {
    const { query } = useRouter()
    const {
        dataFertilizers,
        columnReqFertilizer,
        setParams,
        totalPages,
        params,
        isLoadingUsers,
        requestFertilizerForm,
        onSubmit,
        mutationPost,
        selectedData,
        handleSelectedData,
        isLoadingForm,
        isSuccessForm,
        onDelete,
        isLoadingDelete,
        isSuccessDelete,
        refetch,
        landOptions,
    } = useRequestFertilizer()

    const { isOpen, onClose, onOpen } = useDisclosure()
    const { isOpen: isOpenDelete, onClose: onCloseDelete, onOpen: onOpenDelete } = useDisclosure()
    const { isOpen: isOpenProcessed, onClose: onCloseProcessed, onOpen: onOpenProcessed } = useDisclosure()
    const { isOpen: isOpenApproved, onClose: onCloseApproved, onOpen: onOpenApproved } = useDisclosure()
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
                    // landForm.setValue('nama', data?.nama)
                    // landForm.setValue('status', data?.status)
                    // landForm.setValue('keterangan', data?.keterangan)
                    // landForm.setValue('jenis', data?.jenis)
                    // landForm.setValue('lokasi', data?.lokasi)
                    // landForm.setValue('luas', data?.luas)
                    handleSelectedData(data)
                }}>
                    <Icon as={BsPlus} color={"black"} />
                    Pupuk
                </Button>
                {/* <Button onClick={() => {
                    handleSelectedData(data)
                    onOpenDelete()
                }}>
                    <Icon as={BsTrash3} />
                </Button> */}
            </HStack>
        )
    }


    return (
        <>
            <Head>
                <title>Permintaan Pupuk - Pak Tani Konasara</title>
            </Head>
            <Layout menuName='Permintaan Pupuk'>
                <Box p={isMobile ? 4 : 8} overflowX={"auto"}>
                    <VStack gap={8} alignItems="start">
                        <InputGroup >
                            <Input value={search} onChange={(e) => setSearch(e.target.value)}
                                placeholder='Cari Pupuk' backgroundColor="white"
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

                        {/* <Button colorScheme='green' onClick={() => {
              onOpen()
              landForm.reset()
            }}>
              Tambah Lahan
            </Button> */}
                        <Box>
                            {/* <Text pb={2}>Filter berdasarkan</Text> */}
                            <SimpleGrid columns={isMobile ? 2 : 5} gap={4}>
                                <Button colorScheme='blue' gap={2} onClick={() => {
                                    onOpenProcessed()
                                }}>
                                    <Icon as={IoLeafOutline} />
                                    Diproses
                                </Button>
                                <Button colorScheme='green' gap={2} onClick={() => {
                                    onOpenApproved()
                                }}>
                                    <Icon as={BsCheck2Circle} />
                                    Diterima
                                </Button>
                            </SimpleGrid>
                        </Box>
                        <Table
                            columns={columnReqFertilizer}
                            isLoading={isLoadingUsers}
                            data={dataFertilizers || []}
                            actionButton={true}
                            actionMenu={renderAction}
                            isSorting={true}
                            setQueryParams={setParams}
                            queryParams={params}
                            totalPages={totalPages}
                        />
                    </VStack>

                    <RequestFertilizerModal
                        onSubmit={onSubmit}
                        requestFertilizerForm={requestFertilizerForm}
                        isOpen={isOpen}
                        handleSelectedData={handleSelectedData}
                        onClose={onClose}
                        mutationPost={mutationPost}
                        isLoadingForm={isLoadingForm}
                        isSuccessForm={isSuccessForm}
                        selectedData={selectedData}
                        refetch={refetch}
                        landOptions={landOptions}
                    />
                    <ModalDeleteLand
                        onDelete={onDelete}
                        isLoadingDelete={isLoadingDelete}
                        isSuccessDelete={isSuccessDelete}
                        isOpen={isOpenDelete}
                        onClose={onCloseDelete}
                        selectedData={selectedData}
                    />
                    <ProceessedFertilizerModal
                        isOpen={isOpenProcessed}
                        onClose={onCloseProcessed}
                        authorId={query?.authorId as string || ''}
                    />
                    <ApprovedRequestModal
                        isOpen={isOpenApproved}
                        onClose={onCloseApproved}
                    />
                </Box>
            </Layout>
        </>
    )
}

export default RequestFertilizer
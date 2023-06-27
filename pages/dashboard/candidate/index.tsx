import Layout from '@/components/Layout';
import ModalCandidate from '@/features/candidate/ModalCandidate';
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
import { candidateColumns, useCandidate } from '@/hooks/useCandidate';
import { CandidateType } from '@/types/candidate';
import ModalDeleteCandidate from '@/features/candidate/ModalDeleteCandidate';
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from 'react';

const CandidatePage = (): JSX.Element => {

  const {
    dataCandidates,
    setParams,
    totalPages,
    params,
    isLoading,
    candidateForm,
    onSubmit,
    mutationPost,
    selectedData,
    handleSelectedData,
    onDeleteCandidate,
    mutationDelete
    // isLoadingForm,
    // isSuccessForm,
    // onDeleteUser,
    // isLoadingDelete,
    // isSuccessDelete
  } = useCandidate()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { isOpen: isOpenDelete, onClose: onCloseDelete, onOpen: onOpenDelete } = useDisclosure()
  const [search, setSearch] = useState('')
  const [value] = useDebounce(search, 800)

  useEffect(() => {
    setParams((prev) => ({ ...prev, search: value }))
  }, [value])

  const renderAction = (data: CandidateType) => {
    return (
      <HStack gap={4} >
        <Button onClick={() => {
          onOpen()
          candidateForm.setValue('name', data.name)
          candidateForm.setValue('email', data.email)
          candidateForm.setValue('phone_number', data.phone_number)
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
        <title>Candidate Page</title>
      </Head>
      <Layout>
        <Box p={"50px"}>
          <VStack gap={8} alignItems="start" minW="full">
            {/* If you add the size prop to `InputGroup`, it'll pass it to all its children. */}
            <InputGroup size='md' >
              <Input
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                // onChange={(e) => 
                //   setParams({ ...params, search: e.target.value })
                // }
                backgroundColor="white"
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
            <HStack justifyContent="space-between" minW="full" spacing={4}>
              <Button colorScheme='green' onClick={() => {
                onOpen()
                candidateForm.reset()
              }}>
                New Candidate
              </Button>
              {/* <Button colorScheme='blue' onClick={() => {
                // onOpen()
                // userForm.reset()
              }}>
                Export to Excel
              </Button> */}
            </HStack>
            
            <Table
              columns={candidateColumns}
              isLoading={isLoading}
              data={dataCandidates}
              actionButton={true}
              actionMenu={renderAction}
              isSorting={true}
              setQueryParams={setParams}
              queryParams={params}
              totalPages={totalPages}
            />
          </VStack>

        </Box>
        <ModalCandidate
          onSubmit={onSubmit}
          candidateForm={candidateForm}
          isOpen={isOpen}
          handleSelectedData={handleSelectedData}
          onClose={onClose}
          mutationPost={mutationPost}
        />
        <ModalDeleteCandidate
        onDelete={onDeleteCandidate}
        isLoadingDelete={mutationDelete.isLoading}
        isSuccessDelete={mutationDelete.isSuccess}
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        selectedData={selectedData}
      />
      </Layout>
    </>
  );
};

export default CandidatePage;

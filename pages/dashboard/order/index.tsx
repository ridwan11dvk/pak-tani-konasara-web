import Layout from '@/components/Layout';
import ModalUser from '@/features/user/ModalUser';
import { useOrderHook, orderColumns } from '@/hooks/useOrderHook';
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
import { BsPencil, BsTrash3, BsSearch } from 'react-icons/bs'
import { UserDataInterface } from '@/hooks/useLogin';
import ModalDeleteUser from '@/features/user/ModalDeleteUser';
import { OrderType } from '@/types/order';
import ModalAddOrder from '@/features/order/ModalAddOrder';
import ModalDeleteOrder from '@/features/order/ModalDeleteOrder';
import Head from 'next/head';

const DashboardPage = (): JSX.Element => {

  const {
    dataOrders,
    isLoadingGetOrders,
    setQueryParams,
    params,
    totalPages,
    mutationPost,
    onSubmit,
    orderForm,
    selectedData,
    handleSelectedData,
    mutationPatch,
    onDeleteOrder,
    mutationDelete,
  } = useOrderHook()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { isOpen: isOpenDelete, onClose: onCloseDelete, onOpen: onOpenDelete } = useDisclosure()

  const renderAction = (data: OrderType) => {
    return (
      <HStack gap={4} >
        <Button onClick={() => {
          onOpen()
          orderForm.reset({
            title: data.title,
            order_by: data.order_by,
            order_date: data.order_date,
            overview: data.overview,
            finish_by_days: data.finish_by_days,
            detail: data.detail,
          })
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
        <title>Order Page</title>
      </Head>

      <Layout>
        <Box p={"50px"}>
          <VStack gap={8} alignItems="start" minW="full">
            {/* If you add the size prop to `InputGroup`, it'll pass it to all its children. */}
            <InputGroup size='md' >
              <Input
                value={params.search}
                onChange={(e) => setQueryParams({ ...params, search: e.target.value })}
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
                  onChange={(e) => setQueryParams({ ...params, startDate: e.target.value })}
                  bgColor="white"
                  placeholder="Select Date"
                  type="date"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>End Date</FormLabel>
                <Input
                  value={params.endDate}
                  onChange={(e) => setQueryParams({ ...params, endDate: e.target.value })}
                  bgColor="white"
                  placeholder="Select Date"
                  type="date"
                />
              </FormControl>
            </HStack>
            <Button colorScheme='green' onClick={() => {
              orderForm.reset({})
              onOpen()
            }}>
              New Order
            </Button>
            
            <Table
              columns={orderColumns}
              isLoading={isLoadingGetOrders}
              data={dataOrders || []}
              actionButton={true}
              actionMenu={renderAction}
              isSorting={true}
              setQueryParams={setQueryParams}
              queryParams={params}
              totalPages={totalPages}
            />
          </VStack>

        </Box>
        <ModalAddOrder
          onSubmit={onSubmit}
          orderForm={orderForm}
          isOpen={isOpen}
          handleSelectedData={handleSelectedData}
          onClose={onClose}
          mutationPost={mutationPost}
          mutationPatch={mutationPatch}
        // isLoadingForm={isLoadingForm}
        // isSuccessForm={isSuccessForm}
        />
        <ModalDeleteOrder
          onDelete={onDeleteOrder}
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

export default DashboardPage;

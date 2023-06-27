import Layout from "@/components/Layout"
import Table from "@/components/Table"
import ModalDeleteCandidate from "@/features/candidate/ModalDeleteCandidate"
import ModalAssignCaller from "@/features/order/ModalAssignCaller"
import ModalAssignCandidate from "@/features/order/ModalAssignCandidate"
import ModalDeleteCallList from "@/features/order/ModalDeleteCallList"
import ModalEditCallList from "@/features/order/ModalEditCallList"
import { useDetailOrderHook } from "@/hooks/useDetailOrderHook"
import { CallType } from "@/types/order"
import { serialize } from "@/utils/helper"
import { Box, InputGroup, Input, InputRightAddon, Icon, Button, VStack, Text, Divider, HStack, useDisclosure } from "@chakra-ui/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { BsEye, BsEyeFill, BsPencil, BsSearch, BsTrash3 } from "react-icons/bs"

const DetailOrder = () => {
    const {
        dataTable,
        detailOrder,
        callListColumns,
        insertManyCandidateForm,
        onSubmit,
        mutationPost,
        isLoading,
        candidateOptions,
        onSubmitCaller,
        mutationPatch,
        callerForm,
        callerOptions,
        selectedData,
        handleSelectedData,
        mutationDelete,
        onDeleteCallList,
        callListForm,
        mutationPatchCallList,
        onSubmitEditCallList,
    } = useDetailOrderHook()

    const { push } = useRouter()

    const {
        isOpen: isOpenInsertMany,
        onClose: onCloseInsertMany,
        onOpen: onOpenInsertMany
    } = useDisclosure()

    const {
        isOpen: isOpenAssignCaller,
        onClose: onCloseAssignCaller,
        onOpen: onOpenAssignCaller
    } = useDisclosure()

    const {
        isOpen: isOpenDeleteCallList,
        onClose: onCloseDeleteCallList,
        onOpen: onOpenDeleteCallList
    } = useDisclosure()

    const {
        isOpen: isOpenEditCallList,
        onClose: onCloseEditCallList,
        onOpen: onOpenEditCallList
    } = useDisclosure()

    const renderAction = (data: CallType) => {
        return (
            <HStack gap={4} >
                <Button onClick={() => {
                    handleSelectedData(data)
                    callListForm.setValue('name', data?.name)
                    callListForm.setValue('phone_number', data?.phone_number)
                    callListForm.setValue('email', data?.email)
                    callListForm.setValue('last_contact', data?.last_contact)
                    callListForm.setValue('status', data?.status)
                    onOpenEditCallList()
                }}>
                    <Icon as={BsEyeFill} />
                </Button>
                <Button onClick={() => {
                    handleSelectedData(data)
                    onOpenDeleteCallList()
                }}>
                    <Icon as={BsTrash3} />
                </Button>
            </HStack>
        )
    }

    return (
        <>
            <Head>
                <title>Detail Order</title>
            </Head>
            <Layout>
                <Box p={10} sx={{ w: '100%' }}>
                    <VStack gap={8} alignItems="start" w="full" >
                        {/* <InputGroup size='md' >
                            <Input
                                // value={params.search} 
                                // onChange={(e) => setQueryParams({ ...params, search: e.target.value })} 
                                placeholder='Search' backgroundColor="white"
                            />
                            <InputRightAddon backgroundColor="white">
                                <Icon as={BsSearch} />
                            </InputRightAddon>
                        </InputGroup> */}
                        <Button colorScheme='green' onClick={() => {
                            // orderForm.reset({})
                            onOpenInsertMany()
                        }}>
                            Assign Candidate
                        </Button>
                        <Button colorScheme='green' onClick={() => {
                            // orderForm.reset({})
                            onOpenAssignCaller()
                        }}>
                            Assign Caller
                        </Button>
                        <VStack gap={2} alignItems="start" w="full" >
                            <Text fontSize="3xl">{detailOrder?.title}</Text>
                            <Text fontSize="xl">Assigned To: {detailOrder?.caller?.name || '-'}</Text>
                            <Box as={VStack} minW="full" gap={2} borderWidth={1} borderColor={"black"} alignItems={"start"}>
                                <Text alignSelf="center" fontSize="2xl" fontWeight="bold">Overview</Text>
                                <Divider borderColor={"gray"} />
                                <Text pl={2}>{detailOrder?.overview}</Text>
                                <Divider borderWidth={1} />
                                <Text alignSelf="center" fontSize="2xl" fontWeight="bold">Detail</Text>
                                <Divider borderColor={"gray"} />
                                <Text pl={2}>{detailOrder?.detail}</Text>
                            </Box>
                        </VStack>
                        <Table
                            columns={callListColumns}
                            isLoading={false}
                            data={dataTable}
                            actionButton={true}
                            actionMenu={renderAction}
                            isSorting={true}
                            isShowPagination={false}
                        />
                    </VStack>

                </Box>
            </Layout>
            <ModalAssignCandidate
                isOpen={isOpenInsertMany}
                onClose={onCloseInsertMany}
                onSubmit={onSubmit}
                form={insertManyCandidateForm}
                mutationPost={mutationPost}
                candidateOptions={candidateOptions}
            />
            <ModalAssignCaller
                isOpen={isOpenAssignCaller}
                onClose={onCloseAssignCaller}
                onSubmit={onSubmitCaller}
                form={callerForm}
                mutationPatch={mutationPatch}
                callerOptions={callerOptions}
            />
            <ModalDeleteCallList
                isOpen={isOpenDeleteCallList}
                onClose={onCloseDeleteCallList}
                onDelete={onDeleteCallList}
                selectedData={selectedData}
                isLoadingDelete={mutationDelete.isLoading}
                isSuccessDelete={mutationDelete.isSuccess}
            />
            <ModalEditCallList
            isOpen={isOpenEditCallList}
            onClose={onCloseEditCallList}
            onSubmit={onSubmitEditCallList}
            form={callListForm}
            mutationPatch={mutationPatchCallList}
            />
        </>
    )
}

export default DetailOrder
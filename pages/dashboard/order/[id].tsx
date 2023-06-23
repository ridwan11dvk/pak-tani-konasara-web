import Layout from "@/components/Layout"
import Table from "@/components/Table"
import { useDetailOrderHook } from "@/hooks/useDetailOrderHook"
import { Box, InputGroup, Input, InputRightAddon, Icon, Button, VStack, Text, Divider } from "@chakra-ui/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { BsSearch } from "react-icons/bs"

const DetailOrder = () => {
    const { dataTable, detailOrder, callListColumns } = useDetailOrderHook()
    return (
        <>
            <Head>
                <title>Detail Order</title>
            </Head>
            <Layout>
                <Box p={10} sx={{ w: '100%' }}>
                    <VStack gap={8} alignItems="start" w="full" >
                        <InputGroup size='md' >
                            <Input
                                // value={params.search} 
                                // onChange={(e) => setQueryParams({ ...params, search: e.target.value })} 
                                placeholder='Search' backgroundColor="white"
                            />
                            <InputRightAddon backgroundColor="white">
                                <Icon as={BsSearch} />
                            </InputRightAddon>
                        </InputGroup>
                        <Button colorScheme='green' onClick={() => {
                            // orderForm.reset({})
                            // onOpen()
                        }}>
                            New Contact
                        </Button>
                        <VStack gap={2} alignItems="start" w="full" >
                            <Text fontSize="3xl">{detailOrder?.title}</Text>
                            <Text fontSize="xl">Assigned To: {detailOrder?.order_by}</Text>
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
                            // actionButton={true}
                            // actionMenu={renderAction}
                            isSorting={true}
                            // setQueryParams={setParams}
                            // queryParams={params}
                            // totalPages={totalPages}
                        />
                    </VStack>

                </Box>
            </Layout>
        </>
    )
}

export default DetailOrder
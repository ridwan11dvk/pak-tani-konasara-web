import Layout from "@/components/Layout"
import Table from "@/components/Table"
import { useCallHistory } from "@/hooks/useCallHistory"
import { CallHistoryType } from "@/types/callHistory"
import { Box, InputGroup, Input, InputRightAddon, Icon, Button, VStack, Text, Divider, FormControl, FormLabel, Flex, HStack } from "@chakra-ui/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { BsSearch, BsTrash3 } from "react-icons/bs"
import Select from 'react-select'

const CallHistory = () => {
    const { query } = useRouter()
    const name = query?.name || '-'
    const phone_number = query?.phone_number || '-'
    const email = query?.email || '-'
    const {
        dataCallHistories,
        callHistoryColumns,
        isLoading,
        onDeleteCallHistory,
        params,
        setParams,
        totalPage,
    } = useCallHistory()

    const renderAction = (data: CallHistoryType) => {
        return (
            <HStack gap={4} >
                <Button onClick={() => {
                    onDeleteCallHistory(data?._id)
                }}>
                    <Icon as={BsTrash3} />
                </Button>
            </HStack>
        )
    }

    return (
        <>
            <Head>
                <title>Call History</title>
            </Head>
            <Layout>
                <Flex direction="column" w="100%" justifyContent="center" alignItems="center">
                    <VStack p={10} gap={8} justifyContent="center" w="80%">
                        <FormControl id="email">
                            <FormLabel>Name</FormLabel>
                            <Input disabled bgColor="white" type="text" value={name} />
                        </FormControl>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input disabled bgColor="white" type="text" value={email} />
                        </FormControl>
                        <FormControl id="email">
                            <FormLabel>Phone Number</FormLabel>
                            <Input disabled bgColor="white" type="text" value={phone_number} />
                        </FormControl>
                    </VStack>
                    <VStack justifyContent="center" w="80%">
                        <Table
                            columns={callHistoryColumns}
                            isLoading={isLoading}
                            data={dataCallHistories || []}
                            actionButton={true}
                            actionMenu={renderAction}
                            isSorting={true}
                            setQueryParams={setParams}
                            queryParams={params}
                            totalPages={totalPage}
                        />
                    </VStack>
                </Flex>
            </Layout>
        </>
    )
}

export default CallHistory
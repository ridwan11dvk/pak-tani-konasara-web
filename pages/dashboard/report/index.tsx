import Layout from '@/components/Layout'
import { useReport } from '@/hooks/useReport'
import { serialize } from '@/utils/helper'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { Text, Flex, Tabs, TabList, Tab, TabPanel, TabPanels, HStack, VStack, Icon } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { AiOutlineQuestion } from 'react-icons/ai'

const Report = () => {

    const {
        tabIndex,
        setTabIndex,
        callPositiveArr,
        callNegativeArr,
        callFollowUpArr,
    } = useReport()

    const router = useRouter()

    return (
        <>
            <Head>
                <title>Report Page</title>
            </Head>
            <Layout>
                <Flex w="full" justifyContent="center" alignItems="center" pt={4}>
                    <Tabs minW="300px" isFitted
                        onChange={(index) => setTabIndex(index)}
                    >
                        <TabList>
                            <Tab>Positive</Tab>
                            <Tab>Negative</Tab>
                            <Tab>Follow Up</Tab>
                        </TabList>

                        <TabPanels minW="500px" >
                            <TabPanel>
                                <VStack minW="full">
                                    {callPositiveArr?.length ? callPositiveArr?.map((call, index) => {
                                        console.log(call)
                                        return <HStack sx={{
                                            cursor: 'pointer'
                                        }} onClick={() => router.push(`/dashboard/order/call-history/${call._id}?${serialize({ name: call.name, phone_number: call.phone_number, email: call.email, id_order: call.id_order })}`)} key={index} minW="full" borderWidth={1} borderRadius="md" p={4} bgColor="white">
                                            <CheckIcon boxSize={10} color="green" />
                                            <VStack alignItems="start" pl={4} w="full">
                                                <Text>{call?.name}</Text>
                                                <Text>{call?.phone_number}</Text>
                                                <Text>{call?.email}</Text>
                                                <Text>Order UID : {call?.id_order}</Text>
                                                <Text alignSelf="end">Last Contact: {call?.last_contact}</Text>
                                            </VStack>

                                        </HStack>
                                    }) : <Text>No Data</Text>}
                                </VStack>
                            </TabPanel>
                            <TabPanel>
                                <VStack minW="full">
                                    {callNegativeArr?.length ? callNegativeArr?.map((call, index) => {
                                        return <HStack sx={{
                                            cursor: 'pointer'
                                        }} onClick={() => router.push(`/dashboard/order/call-history/${call._id}?${serialize({ name: call.name, phone_number: call.phone_number, email: call.email, id_order: call.id_order })}`)} key={index} minW="full" borderWidth={1} borderRadius="md" p={4} bgColor="white">
                                            <CloseIcon boxSize={10} color="red" />
                                            <VStack alignItems="start" pl={4} w="full">
                                                <Text>{call?.name}</Text>
                                                <Text>{call?.phone_number}</Text>
                                                <Text>{call?.email}</Text>
                                                <Text>Order UID : {call?.id_order}</Text>
                                                <Text alignSelf="end">Last Contact: {call?.last_contact}</Text>
                                            </VStack>

                                        </HStack>
                                    }) : <Text>No Data</Text>}
                                </VStack>
                            </TabPanel>
                            <TabPanel>
                                <VStack minW="full">
                                    {callFollowUpArr?.length ? callFollowUpArr?.map((call, index) => {
                                        return <HStack sx={{
                                            cursor: 'pointer'
                                        }} onClick={() => router.push(`/dashboard/order/call-history/${call._id}?${serialize({ name: call.name, phone_number: call.phone_number, email: call.email, id_order: call.id_order })}`)} key={index} minW="full" borderWidth={1} borderRadius="md" p={4} bgColor="white">
                                            <Icon as={AiOutlineQuestion} boxSize={12} color="black" />
                                            <VStack alignItems="start" pl={4} w="full">
                                                <Text>{call?.name}</Text>
                                                <Text>{call?.phone_number}</Text>
                                                <Text>{call?.email}</Text>
                                                <Text>Order UID : {call?.id_order}</Text>
                                                <Text alignSelf="end">Last Contact: {call?.last_contact}</Text>
                                            </VStack>

                                        </HStack>
                                    }) : <Text>No Data</Text>}
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Flex>
            </Layout>
        </>
    )
}

export default Report
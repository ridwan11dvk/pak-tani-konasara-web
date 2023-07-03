import Layout from '@/components/Layout'
import { useNotification } from '@/hooks/useNotification'
import { Flex, Text, VStack, FormControl, FormLabel, Input, FormErrorMessage, Textarea, Box, Button, Spinner } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
import Select from 'react-select'

const Notification = () => {
    const { userOptions, notificationForm, mutationPost, onSubmit } = useNotification()

    const { register, handleSubmit, formState: { errors }, setValue } = notificationForm

    return (
        <>
            <Head>
                <title>Notification Service</title>
            </Head>
            <Layout>
                <Flex p={4} direction="column" gap={4} minW="full" justifyContent="center" alignItems="center">
                    <VStack as="form" minW="700px" onSubmit={handleSubmit(onSubmit)} >
                        <FormControl mb={4} isInvalid={errors?.title?.message ? true : false}>
                            <FormLabel>Title</FormLabel>
                            <Input
                                placeholder="Enter Title"
                                type="text"
                                {...register('title')}
                                bgColor="white"
                            />
                            {/* <Input type="text" {...register('title')} /> */}
                            <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mb={4} isInvalid={errors?.message?.message ? true : false}>
                            <FormLabel>Message</FormLabel>
                            <Textarea
                                placeholder="Enter Message"
                                {...register('message')}
                                bgColor="white"
                            />
                            {/* <Input type="text" {...register('message')} /> */}
                            <FormErrorMessage>{errors.message && errors.message.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors?.to?.message ? true : false}>
                            <FormLabel>To</FormLabel>
                            <Select
                                options={userOptions}
                                menuPosition={'fixed'}
                                defaultValue={{ label: 'All Users', value: '' }}
                                {...register('to')}
                                onChange={(val: any) => setValue('to', val?.value)}
                                value={userOptions?.find((el) => el?.value === notificationForm?.watch('to'))}
                                placeholder="Please select to"
                            />
                            <FormErrorMessage>{errors?.to && errors?.to?.message}</FormErrorMessage>
                        </FormControl>
                        <Button alignSelf="start" type="submit" colorScheme="green" mt={8} isDisabled={mutationPost.isLoading}>
                                    {
                                        mutationPost.isLoading ?
                                            <Spinner size="xs" />
                                            :
                                            'Submit'
                                    }
                                </Button>
                    </VStack>
                </Flex>
            </Layout>
        </>
    )
}

export default Notification
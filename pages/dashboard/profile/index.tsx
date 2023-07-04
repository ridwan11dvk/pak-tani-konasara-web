import Layout from '@/components/Layout'
import { useProfile } from '@/hooks/useProfile'
import { roleOptions } from '@/utils/options'
import {
  Text,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  HStack,
  VStack,
  Button,
  Spinner,
  Flex,
} from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
import Select from 'react-select'

const Profile = () => {
  const {
    userForm,
    onSubmit,
    patchMutation,
    isLoading,
  } = useProfile()

  const { register, handleSubmit, formState: { errors }, watch } = userForm

  return (
    <>
      <Head>
        <title>Profile Page</title>
      </Head>
      <Layout>
        <Flex justifyContent="center" alignItems="center" mb={4} w="full">
          <VStack minW="600px" pt={8} as={'form'} onSubmit={handleSubmit(onSubmit)} method="POST">
            <FormControl id="email" mb={4} isInvalid={errors?.name?.message ? true : false}>
              <FormLabel>Name</FormLabel>
              <Input bgColor="white" type="text" {...register('name')} />
              <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
            </FormControl>
            <FormControl id="email" mb={4} isInvalid={errors?.email?.message ? true : false}>
              <FormLabel>Email address</FormLabel>
              <Input bgColor="white" type="text" {...register('email')} />
              <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors?.role?.message ? true : false}>
              <FormLabel>Role</FormLabel>
              <Select

                isDisabled={true}
                menuPosition={'fixed'}
                {...register('role')}
                value={roleOptions?.find((el) => el?.value === watch('role'))}
              />
              <FormErrorMessage>{errors.role && errors.role.message}</FormErrorMessage>
            </FormControl>
            <Button alignSelf="start" type="submit" colorScheme="green" mt={8} isDisabled={patchMutation.isLoading}>
              {
                patchMutation.isLoading ?
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

export default Profile
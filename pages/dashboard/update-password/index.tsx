import Layout from '@/components/Layout'
import { useProfile } from '@/hooks/useProfile'
import { useUpdatePassword } from '@/hooks/useUpdatePassword'
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
    Skeleton,
    InputGroup,
    InputRightAddon,
    Icon,
} from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
import Select from 'react-select'

import { HiEye, HiEyeOff } from 'react-icons/hi'

const UpdatePassword = () => {
    const {
        updatePasswordForm,
        onSubmit,
        mutationPassword,
    } = useUpdatePassword()

    const { register, handleSubmit, formState: { errors }, watch } = updatePasswordForm

    const [showOldPassword, setShowOldPassword] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

    const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword)
    const handleClickShowPassword = () => setShowPassword(!showPassword)
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

    return (
        <>
            <Head>
                <title>Update Password</title>
            </Head>
            <Layout>
                <Flex justifyContent="center" alignItems="center" mb={4} w="full">
                    <VStack minW="600px" pt={8} as={'form'} onSubmit={handleSubmit(onSubmit)} method="POST">
                        <Text alignSelf="start" pb={4} fontSize="20px" fontWeight="bold">Update Password</Text>
                        <FormControl id="email" mb={4} isInvalid={errors?.old_password?.message ? true : false}>
                            <FormLabel>Old Password</FormLabel>
                            <InputGroup>
                                <Input bgColor="white" placeholder='Enter Old Password' type={showOldPassword ? "text" : "password"} {...register('old_password')} />
                                <InputRightAddon bgColor="white">
                                    <Icon as={showOldPassword ? HiEye : HiEyeOff} onClick={handleClickShowOldPassword} />
                                </InputRightAddon>
                            </InputGroup>
                            <FormErrorMessage>{errors.old_password && errors.old_password.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mb={4} isInvalid={errors?.password?.message ? true : false}>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input bgColor="white" placeholder='Enter New Password' type={showPassword ? "text" : "password"} {...register('password')} />
                                <InputRightAddon bgColor="white">
                                    <Icon as={showPassword ? HiEye : HiEyeOff} onClick={handleClickShowPassword} />
                                </InputRightAddon>
                            </InputGroup>
                            <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mb={4} isInvalid={errors?.password_confirmation?.message ? true : false}>
                            <FormLabel>Password Confirmation</FormLabel>
                            <InputGroup>
                            <Input bgColor="white" placeholder='Enter Password Confirmation' type={showConfirmPassword ? "text" : "password"} {...register('password_confirmation')} />
                            <InputRightAddon bgColor="white">
                                    <Icon as={showConfirmPassword ? HiEye : HiEyeOff} onClick={handleClickShowConfirmPassword} />
                                </InputRightAddon>
                            </InputGroup>
                            <FormErrorMessage>{errors.password_confirmation && errors.password_confirmation.message}</FormErrorMessage>
                        </FormControl>

                        <Button alignSelf="start" type="submit" colorScheme="green" mt={8} isDisabled={mutationPassword.isLoading}>
                            {
                                mutationPassword.isLoading ?
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

export default UpdatePassword
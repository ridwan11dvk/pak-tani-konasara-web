import { useRegister } from "@/hooks/useRegister";
import { Box, Button, Center, FormControl, FormErrorMessage, FormLabel, Input, InputLeftElement, Spinner, Stack, Text, InputGroup, Icon, InputRightElement, Checkbox } from '@chakra-ui/react';
import Head from "next/head"
import Image from "next/image"
import { useState } from "react";
import { BsEnvelope } from 'react-icons/bs';
import { FaEye, FaLock } from 'react-icons/fa';
import { SuccessColor } from '@/utils/constant';
import { AiFillEye, AiFillEyeInvisible, AiOutlineUser } from 'react-icons/ai';
import Link from "next/link";

const RegisterPage = (): JSX.Element => {
  const { registerForm, onSubmit, mutationRegister } = useRegister();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = registerForm
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleShowPasswordConfirmation = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation)
  }

  const handleIsChecked = () => {
    setIsChecked(!isChecked)
  }

  const errorObj: any = errors

  return (
    <>
      <Head>
        <title>Daftar - Pak Tani Konasara</title>
      </Head>
      <Center h="100vh">
        <Box p={8} mx="auto" maxW="md" borderRadius="md" boxShadow="md" display="flex" flexDir="column" alignItems="center">
          <Image src="/pak-tani.png" width={200} height={200} alt='' />
          <Text fontSize="3xl" fontWeight="bold" mb={4} textAlign="center">
            BUAT AKUN BARU PETANI
          </Text>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <Box display={"flex"} flexDir="column" gap={4}>
              <Box>
                <FormControl isInvalid={errorObj?.name ? true : false}>
                  <FormLabel>Nama </FormLabel>
                  <InputGroup>
                    <InputLeftElement >
                      <Icon as={AiOutlineUser} />
                    </InputLeftElement>
                    <Input isInvalid={errorObj?.name ? true : false} type="text" placeholder='Masukkan nama anda' {...register('name')} />
                  </InputGroup>
                  <FormErrorMessage>{errorObj?.name?.message}</FormErrorMessage>
                </FormControl>
              </Box>
              <Box>
                <FormControl isInvalid={errorObj?.email ? true : false}>
                  <FormLabel>Email </FormLabel>
                  <InputGroup>
                    <InputLeftElement >
                      <Icon as={BsEnvelope} />
                    </InputLeftElement>
                    <Input isInvalid={errorObj?.email ? true : false} type="text" placeholder='Masukkan email anda' {...register('email')} />
                  </InputGroup>
                  <FormErrorMessage>{errorObj?.email?.message}</FormErrorMessage>
                </FormControl>
              </Box>
              <Box>
                <FormControl isInvalid={errorObj?.password ? true : false}>
                  <FormLabel>Kata Sandi</FormLabel>
                  <InputGroup>
                    <InputLeftElement >
                      <Icon as={FaLock} />
                    </InputLeftElement>
                    <Input placeholder='Masukkan kata sandi anda' isInvalid={errorObj?.password ? true : false} type={showPassword ? "text" : "password"} {...register('password', { required: 'Password harus diisi', minLength: { value: 8, message: 'Minimal password 8 karakter' } })} />
                    <InputRightElement >
                      <Icon style={{ cursor: 'pointer' }} as={showPassword ? AiFillEyeInvisible : AiFillEye} boxSize={5} onClick={handleShowPassword} />
                    </InputRightElement>
                  </InputGroup>
                  {
                    errorObj?.password?.message &&
                    <FormErrorMessage>{errorObj?.password?.message || ''}</FormErrorMessage>
                  }
                </FormControl>
              </Box>
              <Box>
                <FormControl isInvalid={errorObj?.password_confirmation ? true : false}>
                  <FormLabel>Konfirmasi kata sandi</FormLabel>
                  <InputGroup>
                    <InputLeftElement >
                      <Icon as={FaLock} />
                    </InputLeftElement>
                    <Input placeholder='Masukkan konfirmasi kata sandi anda' isInvalid={errorObj?.password_confirmation ? true : false} type={showPasswordConfirmation ? "text" : "password"} {...register('password_confirmation')} />
                    <InputRightElement >
                      <Icon style={{ cursor: 'pointer' }} as={showPasswordConfirmation ? AiFillEyeInvisible : AiFillEye} boxSize={5} onClick={handleShowPasswordConfirmation} />
                    </InputRightElement>
                  </InputGroup>
                  {
                    errorObj?.password_confirmation?.message &&
                    <FormErrorMessage>{errorObj?.password_confirmation?.message || ''}</FormErrorMessage>
                  }
                </FormControl>
              </Box>
              <Box display={'flex'} alignItems={"center"} gap={4}>
                <Checkbox isChecked={isChecked} onChange={handleIsChecked}></Checkbox>
                <Box pt={6}>
                  <Text>Saya menyetujui semua kebijakan privasi pada aplikasi ini</Text>
                  <Link passHref href={'https://doc-hosting.flycricket.io/pak-tani-konasara-privacy-policy/f24f6d1e-7e47-4b92-8f80-1daf5cbaca83/privacy'} legacyBehavior>
                  <a style={{fontWeight:'bold', textDecorationLine:'underline'}} target="_blank" rel="noopener noreferrer">Periksa Kebijakan Privasi</a>
                  
                  </Link>
                </Box>
              </Box>
            </Box>

            <Button backgroundColor={SuccessColor} color="white" width="full" type="submit" mt={4} isDisabled={mutationRegister.isLoading || !isChecked}>
              {
                mutationRegister.isLoading ?
                  <Spinner size="xs" />
                  :
                  <>
                    <Text ml={2}>DAFTAR</Text>
                  </>
              }
            </Button>
          </form>
        </Box>
      </Center>
    </>
  )

}

export default RegisterPage
import { Box, Button, Center, FormControl, FormErrorMessage, FormLabel, Input, InputLeftElement, Spinner, Stack, Text, InputGroup, Icon, InputRightElement } from '@chakra-ui/react';
import { useLogin } from '../hooks/useLogin';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { BsEnvelope } from 'react-icons/bs';
import { FaEye, FaLock } from 'react-icons/fa';
import { SuccessColor } from '@/utils/constant';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useState } from 'react';
import { CiLogin } from 'react-icons/ci';

const LoginPage = (): JSX.Element => {
  const { handleSubmit, register, errors, mutation } = useLogin();
  const [showPassword, setShowPassword] = useState(false)

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <Head>
        <title>Login - Pak Tani Konasara</title>
      </Head>
      <Center h="100vh">
        <Box p={8} mx="auto" maxW="md" borderRadius="md" boxShadow="md" display="flex" flexDir="column" alignItems="center">
          <Image src="/pak-tani.png" width={200} height={200} alt='' />
          <Text fontSize="3xl" fontWeight="bold" mb={4} textAlign="center">
            AKSES LOGIN
          </Text>
          <Text fontSize="3xl" fontWeight="bold" mb={4} textAlign="center">
            PAK TANI KONASARA
          </Text>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Box display={"flex"} flexDir="column" gap={4}>
              <Box>
                <FormControl isInvalid={errors?.email ? true : false}>
                <FormLabel>Email </FormLabel>
                <InputGroup>
                  <InputLeftElement >
                    <Icon as={BsEnvelope} />
                  </InputLeftElement>
                  <Input isInvalid={errors?.email ? true : false} type="text" placeholder='Masukkan email anda' {...register('email', { required: 'Email harus diisi', pattern: { value: /^\S+@\S+$/i, message: 'Format email salah' } })} />
                </InputGroup>
                <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                </FormControl>
              </Box>
              <Box>
                <FormControl isInvalid={errors?.password ? true : false}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement >
                    <Icon as={FaLock} />
                  </InputLeftElement>
                  <Input placeholder='Masukkan password anda' isInvalid={errors?.password ? true : false} type={showPassword ? "text" : "password"} {...register('password', { required: 'Password harus diisi', minLength: { value: 8, message: 'Minimal password 8 karakter' } })} />
                  <InputRightElement >
                    <Icon style={{cursor:'pointer'}} as={showPassword ? AiFillEyeInvisible : AiFillEye} boxSize={5} onClick={handleShowPassword} />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                </FormControl>
              </Box>
            </Box>
            <Button backgroundColor={SuccessColor} color="white" width="full" type="submit" mt={4} isDisabled={mutation.isLoading}>
              {
                mutation.isLoading ?
                  <Spinner size="xs" />
                  :
                  <>
                  <Icon as ={CiLogin} boxSize={6}/>
                  <Text ml={2}>Login</Text>
                  </>
              }
            </Button>
            <Text pt={4} textAlign="center">Tidak memiliku akun?</Text>
            <Text textAlign="center"> silahkan melakukan pendaftaran di bawah ini </Text>
            <Box display="flex" justifyContent="center" pt={4}>
              <Link href={'/register'}>
            <Text as='u' fontWeight="bold" textAlign="center" >DAFTAR DI SINI</Text>
            </Link>
            </Box>
          </form>
        </Box>
      </Center >
    </>
  );
};

export default LoginPage;

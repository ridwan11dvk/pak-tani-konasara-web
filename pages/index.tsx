import { Box, Button, Center, FormControl, FormErrorMessage, FormLabel, Input, Stack, Text } from '@chakra-ui/react';
import { useLogin } from '../hooks/useLogin';
import Head from 'next/head';
import Link from 'next/link';

const LoginPage = (): JSX.Element => {
  const { handleSubmit, register, errors } = useLogin();

  return (
    <>
      <Head>
        <title>Login Page</title>
      </Head>
      <Center h="100vh">
        <Box p={4} mx="auto" maxW="md" borderRadius="md" boxShadow="md">
          <Text fontSize="3xl" fontWeight="bold" mb={4} textAlign="center">
            NP Solution Call Now CMS
          </Text>
          <form onSubmit={handleSubmit}>
            <FormControl id="email" mb={4} isInvalid={errors?.email ? true : false}>
              <FormLabel>Email address</FormLabel>
              <Input type="text" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' } })} />
              <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
            </FormControl>
            <FormControl id="password" mb={4} isInvalid={errors?.password ? true : false}>
              <FormLabel>Password</FormLabel>
              <Input type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters long' } })} />
              <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
            </FormControl>
            <Stack direction="row" justify="end" align="end">
              <Button colorScheme="blue" type="submit">
                {/* <Link href="/dashboard"> */}
                Sign In
                {/* </Link> */}
              </Button>
            </Stack>
          </form>
        </Box>
      </Center>
    </>
  );
};

export default LoginPage;

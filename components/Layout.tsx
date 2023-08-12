import useUserStore from '@/stores/useUser';
import { SuccessColor } from '@/utils/constant';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, Icon, Text, Menu, MenuButton, MenuList, MenuItem, IconButton, useMediaQuery } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CiLogout, CiUser, CiLock } from 'react-icons/ci'
import { FaLock, FaUser } from 'react-icons/fa'

interface LayoutProps {
  children: React.ReactNode;
  menuName?: string
}

const menus: any[] = [
  { name: 'User', path: '/dashboard', type: 'user' },
  { name: 'Order', path: '/dashboard/order', type: 'order' },
  { name: 'Candidate', path: '/dashboard/candidate', type: 'candidate' },
  { name: 'Report', path: '/dashboard/report', type: 'report' },
  { name: 'Notification', path: '/dashboard/notification', type: 'notification' },
]

const Layout: React.FC<LayoutProps> = ({ children,  menuName="Pak Tani Konasara"}): JSX.Element => {
  const { asPath, replace, basePath } = useRouter()
  const { removeUserState } = useUserStore()
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  const logout = () => {
    removeUserState()
    replace('/')
  }

  return (
    <Box minHeight="100vh" maxW={isMobile ? '768px' : 'auto'} minW={'full'}>
      <Box bg="gray.100">
        {/* Header */}
        <Box p={4} minW="full" bgColor={SuccessColor} sx={{ color: 'white' }}>
          <Flex justifyContent="space-between" alignItems="center">
            <HStack gap={4}>
              <Link href={"/dashboard"}>
                <Image alt='' src={"/pak-tani.png"} width={50} height={50}/>
              </Link>
              <Text mr={4} fontSize="xl" fontWeight="bold">{menuName}</Text>
              {/* {menus.map((menu, index) => {
                return <Text
                  as={Link}
                  href={menu.path}
                  fontWeight={asPath?.includes(menu.type) || asPath === '/dashboard' && menu.type === 'user' ? 'bold' : 'normal'}
                  color={asPath?.includes(menu.type) || asPath === '/dashboard' && menu.type === 'user' ? 'white' : '#bfbfbf'} key={index}>
                  {menu.name}</Text>
              })} */}
            </HStack>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label='Options'
                bgColor="white"
                icon={<HamburgerIcon />}
                variant='outline'
              />
              <MenuList>
                {/* <MenuItem as={Link} href="/dashboard/profile" color="black" sx={{ cursor: 'pointer' }}>
                  <Icon color="black" as={CiUser} boxSize={6} />
                  <Text pl={2}>Profile</Text>
                </MenuItem>
                <MenuItem as={Link} href="/dashboard/update-password" color="black" sx={{ cursor: 'pointer' }}>
                  <Icon color="black" as={CiLock} boxSize={6} />
                  <Text pl={2}>Update Password</Text>
                </MenuItem> */}
                <MenuItem as={HStack} onClick={logout} color="red" sx={{ cursor: 'pointer' }}>
                  <Icon color="red" as={CiLogout} boxSize={6} />
                  <Text pl={1}>Logout</Text>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Box>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

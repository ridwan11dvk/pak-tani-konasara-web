import useUserStore from '@/stores/useUser';
import { Box, Button, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CiLogout } from 'react-icons/ci'
import { FaUser } from 'react-icons/fa'

interface LayoutProps {
  children: React.ReactNode;
}

const menus: any[] = [
  { name: 'User', path: '/dashboard', type: 'user' },
  { name: 'Profile', path: '/dashboard/profile', type: 'profile' },
  { name: 'Order', path: '/dashboard/order', type: 'order' },
  { name: 'Candidate', path: '/dashboard/candidate', type: 'candidate' },
  { name: 'Report', path: '/dashboard/report', type: 'report' },
  { name: 'Notification', path: '/dashboard/notification', type: 'notification' },
]

const Layout: React.FC<LayoutProps> = ({ children }): JSX.Element => {
  const { asPath, replace, basePath } = useRouter()
  const { removeUserState } = useUserStore()

  const logout = () => {
    removeUserState()
    replace('/')
  }

  return (
    <Box display="flex" minHeight="100vh">
      <Box flex="4" bg="gray.100">
        {/* Header */}
        <Box p={4} minW="full" bgColor="blue.400" sx={{ color: 'white' }}>
          <Flex justifyContent="space-between" alignItems="center">
            <HStack gap={4}>
              <Text as={Link} href={"/dashboard"} mr={4} fontSize="xl" fontWeight="bold">CallNow CMS</Text>
              {menus.map((menu, index) => {
                return <Text
                  as={Link}
                  href={menu.path}
                  fontWeight={asPath?.includes(menu.type) || asPath === '/dashboard' && menu.type === 'user' ? 'bold' : 'normal'}
                  color={asPath?.includes(menu.type) || asPath === '/dashboard' && menu.type === 'user' ? 'white' : '#bfbfbf'} key={index}>
                  {menu.name}</Text>
              })}
            </HStack>
              <Icon onClick={logout} as={CiLogout} boxSize={6} sx={{ cursor: 'pointer' }} />
          </Flex>
        </Box>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;


import {
  Box, Button, Icon, Input, InputGroup, InputRightElement, Text, VStack,
  useDisclosure,
  Divider,
  SimpleGrid,
  GridItem,
  useMediaQuery,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { DangerColorTransparent, InfoColorTransparent, PrimaryColorTransparent, PurpleColorTransparent, SuccessColor, SuccessColorTransparent, WarningColorTransparent } from '@/utils/constant';
import useUserStore from '@/stores/useUser';
import { FaCloudSunRain, FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { BsSearch } from 'react-icons/bs';

const DashboardPage = (): JSX.Element => {


  const { replace, push } = useRouter()

  const { userData, removeUserState } = useUserStore()
  const logout = () => {
    removeUserState()
    replace('/')
  }
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  const [search, setSearch] = useState('')
  const [value] = useDebounce(search, 800)




  // const renderAction = (data: UserDataInterface) => {
  //   return (
  //     <HStack gap={4} >
  //       <Button onClick={() => {
  //         onOpen()
  //         userForm.setValue('name', data.name)
  //         userForm.setValue('email', data.email)
  //         userForm.setValue('role', data.role)
  //         handleSelectedData(data)
  //       }}>
  //         <Icon as={BsPencil} />
  //       </Button>
  //       <Button onClick={() => {
  //         handleSelectedData(data)
  //         onOpenDelete()
  //       }}>
  //         <Icon as={BsTrash3} />
  //       </Button>
  //     </HStack>
  //   )
  // }

  return (
    <>
      <Head>
        <title>Dashboard - Pak Tani Konasara</title>
      </Head>
      {/* <Layout> */}
      <Box display={"flex"} justifyContent="center" h="100vh" py='2%' backgroundColor={"white"}>
        <Box w='100%' maxW="768px" p={isMobile ? 4 : 0} display={"flex"} flexDir="column" gap={4} backgroundColor={"white"}>
          <Box display={'flex'} alignItems={'center'} gap={4}>
            <Icon as={FaUserCircle} boxSize={6} />
            <Text as="u" fontWeight="bold" >Hai, {userData?.name || ''}</Text>

          </Box>

          <Box p={4} w='100%' bgGradient={`linear(to-r, #a7f3d0 ,${SuccessColor})`} borderRadius="md" display={'flex'} flexDir={'row'}>
            <Box display={"flex"} flexDir={"column"} w='100%' gap={2}>
              <Text fontWeight="bold" fontSize={"lg"}>Pak Tani Konasara</Text>
              <Text>Program Pengembangan Kebun Pekarangan (PPKP)</Text>
              <Divider borderColor={"black"} />
              <Box display={"flex"} gap={2} alignItems={"center"}>
                <Icon as={HiOutlineLocationMarker} />
                <Text>Kabupaten Konawe Utara</Text>
              </Box>
              <Box display={"flex"} flexDir={"column"} w='60%' gap={2} >
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Icon as={FaCloudSunRain} boxSize={6} />
                  <Text fontWeight={"bold"} fontSize={"lg"}>28&#176;C</Text>
                </Box>
                <Text>Hujan Panas</Text>
                <Box gap={4} display={"flex"} flexDir={isMobile ? "column" : 'row'}>
                  <Box>
                    <Text fontWeight={"bold"}>76%</Text>
                    <Text>Kelembaban</Text>

                  </Box>
                  <Box>
                    <Text fontWeight={"bold"}>1014 hPa</Text>
                    <Text>Tekanan Udara</Text>

                  </Box>
                </Box>

              </Box>
            </Box>
            <Box display={"flex"} flexDir={"column"} justifyContent={"center"} w='80%' alignItems={"center"}>
              <Box p={4} backgroundColor="white" borderRadius="xl" display={'flex'} flexDir={"column"} justifyContent={"center"} gap={4}>
                <Image src={'/pak-tani.png'} height={100} width={100} alt='' />
                <Button onClick={logout} colorScheme='red' height="30px">Logout</Button>
              </Box>

            </Box>
          </Box>
          <InputGroup size='md' >
            <Input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder='Cari nama bibit dalam gudang' backgroundColor="white"
            />
            <InputRightElement >
              <Icon as={BsSearch} />
            </InputRightElement>
          </InputGroup>
          {
            (userData?.role === 'superadmin' || userData?.role === 'Super Admin') &&
            <Box p={2}>
              <SimpleGrid columns={4} gap={4}>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} borderRadius={"full"} >
                    <Box onClick={() => push('/dashboard/user')} boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={DangerColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/boy.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Pengguna</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={SuccessColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/infotani.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Kotak Bibit</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={PrimaryColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/permintaan_bibit.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Permintaan Bibit</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={InfoColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/pupuk.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Pupuk</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={InfoColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/permintaanPupuk.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Permintaan Pupuk</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box onClick={() => push(`/dashboard/manage-land`)} boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={PrimaryColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/land.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Kelola Lahan </Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={SuccessColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/statistics.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Monitoring </Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={PrimaryColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/kelola_produk.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Hasil Panen</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={PrimaryColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/smart-farm.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Warehouse</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={InfoColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/toko_tani.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>E-Commerce</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={SuccessColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/growing-plant.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Tes Tanah</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={InfoColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/penyiraman.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Penyiraman Cerdas</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={PurpleColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/nitrogenicon.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Tes Kadar Nitrogen</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={DangerColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/caterpillar.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Pendeteksi Hama</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={InfoColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/weather-app.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Cuaca</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={PrimaryColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/soil.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Pemetaan</Text>
                  </Box>
                </GridItem>
              </SimpleGrid>
            </Box>
          }

          {
            userData?.role === 'Admin Gudang' &&
            <Box p={2}>
              <SimpleGrid columns={4} gap={4}>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={DangerColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/infotani.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Kelola Bibit</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={SuccessColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/permintaan_bibit.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Permintaan Bibit</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={WarningColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/pupuk.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Kelola Pupuk</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={InfoColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/permintaanPupuk.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Permintaan Pupuk</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={PrimaryColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/kelola_produk.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Hasil Panen</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={SuccessColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/fotopetani.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Uji Kualitas</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={InfoColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/toko_tani.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Produk Pertanian</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={WarningColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/penyiraman.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Penyiraman Cerdas</Text>
                  </Box>
                </GridItem>
              </SimpleGrid>
            </Box>
          }

          {
            userData?.role === 'Petani' &&
            <Box p={2}>
              <SimpleGrid columns={4} gap={4}>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box onClick={() => push(`/dashboard/manage-land?authorId=${userData?._id}`)} boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={PrimaryColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/land.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Kelola Lahan </Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={InfoColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/permintaan_bibit.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Permintaan Bibit</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={SuccessColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/permintaanPupuk.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Permintaan Pupuk</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={InfoColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/statistics.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Laporan</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={SuccessColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/kelola_produk.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Hasil Panen</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={InfoColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/penyiraman.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Penyiraman Cerdas</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={PurpleColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/nitrogenicon.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Tes Kadar Nitrogen</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box display={"flex"} justifyContent={"center"} flexDir={"column"} alignItems={"center"} >
                    <Box boxShadow="base" style={{ cursor: 'pointer' }} backgroundColor={DangerColorTransparent} borderRadius="full" p={4}>
                      <Image src={'/icon/caterpillar.png'} height={30} width={30} alt='' />
                    </Box>
                    <Text textAlign={"center"} fontSize={14} pt={2}>Pendeteksi Hama</Text>
                  </Box>
                </GridItem>
              </SimpleGrid>
            </Box>
          }

          {
            userData?.role === 'Petani' &&
            <Box p={4} display={"flex"} justifyContent="space-between" gap={2}>
              <Box display={"flex"} gap={2} flexDir={"column"} justifyContent="center" alignItems={"center"} cursor={"pointer"}>
                <Box p={2} boxShadow={"base"} borderRadius="lg">
                  <Image src={'/icon/smart-farm.png'} height={100} width={100} alt='' />
                </Box>
                <Text>Warehouse</Text>
              </Box>
              <Box display={"flex"} gap={2} flexDir={"column"} justifyContent="center" alignItems={"center"} cursor={"pointer"}>
                <Box p={2} boxShadow={"base"} borderRadius="lg">
                  <Image src={'/icon/toko_tani.png'} height={100} width={100} alt='' />
                </Box>
                <Text>E-Commerce</Text>
              </Box>
              <Box display={"flex"} gap={2} flexDir={"column"} justifyContent="center" alignItems={"center"} cursor={"pointer"}>
                <Box p={2} boxShadow={"base"} borderRadius="lg">
                  <Image src={'/icon/growing-plant.png'} height={100} width={100} alt='' />
                </Box>
                <Text>Tes Tanah</Text>
              </Box>
            </Box>
          }

{
            userData?.role === 'Admin Gudang' &&
            <Box p={4} display={"flex"} justifyContent="space-between" gap={2}>
              <Box display={"flex"} gap={2} flexDir={"column"} justifyContent="center" alignItems={"center"} cursor={"pointer"}>
                <Box p={2} boxShadow={"base"} borderRadius="lg">
                  <Image src={'/icon/smart-farm.png'} height={100} width={100} alt='' />
                </Box>
                <Text>Warehouse</Text>
              </Box>
              <Box display={"flex"} gap={2} flexDir={"column"} justifyContent="center" alignItems={"center"} cursor={"pointer"}>
                <Box p={2} boxShadow={"base"} borderRadius="lg">
                  <Image src={'/icon/toko_tani.png'} height={100} width={100} alt='' />
                </Box>
                <Text>E-Commerce</Text>
              </Box>
            </Box>
          }

        </Box>
      </Box>
    </>
  );
};

export default DashboardPage;

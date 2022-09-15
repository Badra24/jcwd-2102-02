import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Image,
  Icon,
  InputRightElement,
  Input,
  InputGroup,
  InputLeftElement,
  AvatarBadge,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { FiShoppingCart } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { SearchInput } from './SearchInput';
import { useDispatch, useSelector } from 'react-redux';
import { css } from '@emotion/react';

export default function Simple() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const cartSelector = useSelector((state) => state.cartReducer);
  const filter = useSelector((state) => state.filterReducer);

  return (
    <>
      <Box
        px={4}
        align="center"
        bg="white"
        border={'1px'}
        borderColor={'gray.200'}
      >
        <Flex
          id="box_navbar"
          alignItems={'center'}
          justifyContent={'space-between'}
          alignContent="center"
          // w="1440px"
          // h="96px"

          px={'30px'}
          sx={{
            maxW: '1440px',
            height: '96px',
            left: '0px',
            top: '0px',
          }}
        >
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Image
              alt={'Logo Image'}
              src={'/assets/image/MedicareHorizontalLogo.png'}
              // maxWidth="32"
              onClick={() => router.push('/home')}
              cursor="pointer"
            />
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              <NextLink fontSize="bold" href="/">
                <Button
                  bg="white"
                  style={
                    router.pathname == '/'
                      ? {
                          textDecoration: 'none',
                          borderBottomWidth: '4px',
                          borderBottomColor: 'teal',
                        }
                      : { textDecoration: 'none' }
                  }
                  _hover={{
                    borderBottomWidth: '4px',
                    borderBottomColor: 'teal',
                  }}
                  borderRadius={0}
                  h="75px"
                  leftIcon={<Image src="assets/Icon/Home.png" />}
                  onClick={() => {
                    dispatch({ type: 'UNSET_FILTER' });
                    console.log(filter);
                  }}
                >
                  Home{' '}
                </Button>
              </NextLink>
              <NextLink fontSize="bold" href="">
                <Button
                  bg="white"
                  style={
                    router.pathname == '/upload-prescription'
                      ? {
                          textDecoration: 'none',
                          borderBottomWidth: '4px',
                          borderBottomColor: 'teal',
                        }
                      : { textDecoration: 'none' }
                  }
                  _hover={{
                    borderBottomWidth: '4px',
                    borderBottomColor: 'teal',
                  }}
                  borderRadius={0}
                  h="75px"
                  leftIcon={<Image src="/assets/Icon/UploadRecipt.png" />}
                >
                  Upload Prescription
                </Button>
              </NextLink>
              <NextLink fontSize="bold" href="/">
                <Button
                  bg="white"
                  style={
                    router.pathname == '/payment-confirmation'
                      ? {
                          textDecoration: 'none',
                          borderBottomWidth: '4px',
                          borderBottomColor: 'teal',
                        }
                      : { textDecoration: 'none' }
                  }
                  _hover={{
                    borderBottomWidth: '4px',
                    borderBottomColor: 'teal',
                  }}
                  borderRadius={0}
                  h="75px"
                  leftIcon={<Image src="/assets/Icon/PaymentRecipt.png" />}
                >
                  Payment Confirmation
                </Button>
              </NextLink>
            </HStack>
          </HStack>
          <Flex alignItems={'center'} gap={6}>
            <SearchInput maxW="406px" />

            {/* Cart Icon */}
            <NextLink href="/cart">
              <IconButton
                bg="white"
                size="xl"
                aria-label="open menu"
                p="0px"
                _active={{ bg: 'white' }}
                _hover={{ bg: 'white' }}
                icon={
                  <>
                    <Avatar icon={<FiShoppingCart />} bg="white">
                      {cartSelector.total_cart <= 0 ? (
                        <></>
                      ) : (
                        <AvatarBadge
                          boxSize="1.5rem"
                          bg={'teal.400'}
                          color="white"
                          p="4px"
                          fontSize={'0.7rem'}
                        >
                          {cartSelector.total_cart}
                        </AvatarBadge>
                      )}
                    </Avatar>
                  </>
                }
              />
            </NextLink>

            <Menu placement="bottom-end">
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
              </MenuButton>
              <MenuList>
                <NextLink fontSize="bold" href="/setting">
                  <MenuItem>My Profile</MenuItem>
                </NextLink>
                <NextLink href="/transaction">
                  <MenuItem>Transaaction</MenuItem>
                </NextLink>
                <MenuItem>Help&Support</MenuItem>
                <MenuItem>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <Link>Home</Link>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}

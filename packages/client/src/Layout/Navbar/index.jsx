import { ReactNode, useEffect } from 'react';
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
  useDisclosure,
  Stack,
  AvatarBadge,
  useToast,
  Modal,
  Icon,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { FiShoppingCart } from 'react-icons/fi';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { SearchInput } from './SearchInput';
import { useDispatch, useSelector } from 'react-redux';
import Logo1 from '../../public/Assets/image/MedicareHorizontalLogo.png';
import Home from '../../public/Assets/Icon/Home.png';
import jsCookie from 'js-cookie';
import Router from 'next/router';
import NextImage from 'next/image';
import { UploadPrescription } from '../../Component/User/Prescription/UploadPrescription';
import SwitchForm from '../../Component/User/Authentication/SwitchForm';
import { BsArrowRightCircle } from 'react-icons/bs';

export default function Simple() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const cartSelector = useSelector((state) => state.cartReducer);
  const authSelector = useSelector((state) => state.authReducer);
  const filter = useSelector((state) => state.filterReducer);

  const {
    isOpen: isOpenSignup,
    onOpen: onOpenSignup,
    onClose: onCloseSignup,
  } = useDisclosure();

  const handleLogout = () => {
    try {
      jsCookie.remove('auth_token');
      dispatch({
        type: 'AUTH_LOGOUT',
      });
      toast({
        title: 'User Logout',
        status: 'success',
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box
        px={{ base: 0, md: 4 }}
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
          px={'30px'}
          sx={{
            maxW: '1920px',
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
            <Box maxW="200px" cursor="pointer">
              <NextLink fontSize="bold" href="/">
                <NextImage alt={'Logo Image'} src={Logo1} />
              </NextLink>
            </Box>
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
                  leftIcon={<NextImage src={Home} />}
                  onClick={() => {
                    dispatch({ type: 'UNSET_FILTER' });
                    console.log(filter);
                  }}
                >
                  Home{' '}
                </Button>
              </NextLink>
              {authSelector.id ? <UploadPrescription /> : <></>}
            </HStack>
          </HStack>
          <Flex alignItems={'center'} gap={6}>
            <SearchInput maxW="406px" />
            {authSelector.id ? (
              <>
                <Button
                  bg="white"
                  size="xl"
                  aria-label="open menu"
                  p="0px"
                  _active={{ bg: 'white' }}
                  _hover={{ bg: 'white' }}
                  onClick={() => {
                    router.push('/cart');
                  }}
                >
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
                </Button>

                <Menu placement="bottom-end">
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    size="sm"
                  >
                    <Avatar size={'sm'} src={authSelector.image_url} />
                  </MenuButton>
                  <MenuList>
                    <NextLink fontSize="bold" href="/setting">
                      <MenuItem>My Profile</MenuItem>
                    </NextLink>
                    <NextLink href="/transaction">
                      <MenuItem>Transaaction</MenuItem>
                    </NextLink>
                    <MenuItem>Help&Support</MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleLogout();
                      }}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  colorScheme={'teal'}
                  variant={'outline'}
                  px={'1.3rem'}
                  gap={2}
                  onClick={onOpenSignup}
                >
                  <Icon boxsSize="3" as={BsArrowRightCircle} /> Sign in{' '}
                </Button>
                <Modal
                  isOpen={isOpenSignup}
                  onClose={onCloseSignup}
                  size="sm"
                  bg="transparent"
                >
                  <SwitchForm />
                </Modal>
              </>
            )}
            {/* Cart Icon */}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
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
                  leftIcon={<NextImage src={Home} />}
                  onClick={() => {
                    dispatch({ type: 'UNSET_FILTER' });
                    console.log(filter);
                  }}
                >
                  Home{' '}
                </Button>
              </NextLink>
              {authSelector.id ? <UploadPrescription /> : <></>}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}

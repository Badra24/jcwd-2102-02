import {
  Box,
  Text,
  Stack,
  Heading,
  Button,
  InputGroup,
  Icon,
  FormHelperText,
  Progress,
  InputRightAddon,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@chakra-ui/react';
import { useState } from 'react';
import Image from 'next/image';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { axiosInstance } from '../../../lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import qs from 'qs';

export default function ChangePassForm() {
  const [passwordView, setPasswordView] = useState(false);
  const [passwordViewRep, setPasswordViewRep] = useState(false);
  const userSelector = useSelector((state) => state.authReducer);
  const router = useRouter();
  const {
    isOpen: isOpenChangePass,
    onOpen: onOpenChangePass,
    onClose: onCloseChangePass,
  } = useDisclosure();

  const formik = useFormik({
    initialValues: {
      oldpassword: '',
      password: '',
      repassword: '',
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password should be of minimum 8 characters length')
        .matches(
          /\w*[a-z]\w*/,
          'Must contain min 8 Characters, UPPERCASE, lowercase, number and special character',
        ) // lower
        .matches(
          /\w*[A-Z]\w*/,
          'Must contain min 8 Characters, UPPERCASE, lowercase, number and special character',
        ) // upper
        .matches(
          /\d/,
          'Must contain min 8 Characters, UPPERCASE, lowercase, number and special character',
        ) //must have number
        .matches(
          /[!@#$%^&*()\-_"=+{}; :,<.>]/,
          'Must contain min 8 Characters, UPPERCASE, lowercase, number and special character',
        ), //special char
      repassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Confirm password is required'),
    }),
    validateOnChange: false,
    onSubmit: async () => {
      const { password, oldpassword } = formik.values;
      try {
        let body = {
          password: password,
          oldpassword: oldpassword,
        };
        const res = await axiosInstance.patch(
          `/users/editPassword/${userSelector.id}`,
          qs.stringify(body),
        );
        console.log(res);

        router.push('/');
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <>
      <Button colorScheme={'teal'} onClick={onOpenChangePass}>
        Change Password
      </Button>
      {/* ---------- Change Password form ---------- */}
      <Modal
        isOpen={isOpenChangePass}
        onClose={onCloseChangePass}
        size="lg"
        bg="transparent"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack
              display="flex"
              minH="450px"
              maxW={'500px'}
              justifyContent={'center'}
              boxShadow="md"
              bg="transparent"
              borderWidth="1px"
              borderRadius="3"
              rounded={'15'}
            >
              {/* ---------- Head Change Password Tittle ---------- */}
              <Stack display="flex" align={'center'} mt={'10px'} mb={'0'}>
                <Heading fontSize={'2xl'} color={'#4A5568'}>
                  Change Password
                </Heading>
                <Text>Input your new Password</Text>
              </Stack>

              <Stack align={'center'}>
                <Box m={'20px'} width={'300px'}>
                  {/* ---------- Password Input ---------- */}
                  <FormControl
                    id="oldpassword"
                    marginTop={'20px'}
                    isInvalid={formik.errors.oldpassword}
                  >
                    <InputGroup>
                      <Input
                        required
                        className="inputRePass"
                        maxLength={'30'}
                        type={passwordViewRep ? 'text' : 'password'}
                        onChange={(event) =>
                          formik.setFieldValue(
                            'oldpassword',
                            event.target.value,
                          )
                        }
                      />
                      <FormLabel className="labelRePass">
                        &nbsp; oldPassword &nbsp;
                      </FormLabel>
                      <InputRightAddon>
                        <Icon
                          fontSize="xl"
                          onClick={() => setPasswordViewRep(!passwordViewRep)}
                          as={passwordViewRep ? IoMdEye : IoMdEyeOff}
                          sx={{ _hover: { cursor: 'pointer' } }}
                        />
                      </InputRightAddon>
                    </InputGroup>
                    <FormHelperText color="red">
                      {formik.errors.oldpassword}
                    </FormHelperText>
                  </FormControl>
                  <FormControl
                    id="password"
                    marginTop={'20px'}
                    mb={'7px'}
                    isInvalid={formik.errors.password}
                  >
                    <InputGroup>
                      <Input
                        required
                        className="inputPass"
                        maxLength={'30'}
                        type={passwordView ? 'text' : 'password'}
                        onChange={(event) =>
                          formik.setFieldValue('password', event.target.value)
                        }
                      />
                      <FormLabel className="labelPass">
                        &nbsp; Password &nbsp;
                      </FormLabel>
                      <InputRightAddon>
                        <Icon
                          fontSize="xl"
                          onClick={() => setPasswordView(!passwordView)}
                          as={passwordView ? IoMdEye : IoMdEyeOff}
                          sx={{ _hover: { cursor: 'pointer' } }}
                        />
                      </InputRightAddon>
                    </InputGroup>
                    {formik.values.password.length > 7 &&
                    formik.values.password.match(
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                    ) ? (
                      <>
                        <Progress value={100} size="xs" colorScheme="green" />
                        <Text fontWeight="semibold" color="green">
                          Strong
                        </Text>
                      </>
                    ) : formik.values.password.length > 5 &&
                      formik.values.password.match(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])/,
                      ) ? (
                      <>
                        <Progress value={75} size="xs" colorScheme="yellow" />
                        <Text fontWeight="semibold" color="#dbe300">
                          Medium
                        </Text>
                      </>
                    ) : formik.values.password.length > 4 &&
                      formik.values.password.match(
                        /^(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
                      ) ? (
                      <>
                        <Progress value={50} size="xs" colorScheme="red" />
                        <Text fontWeight="semibold" color="orange">
                          Weak
                        </Text>
                      </>
                    ) : formik.values.password.length > 0 &&
                      formik.values.password.match(/^(?=.*[a-z])/) ? (
                      <>
                        <Progress value={25} size="xs" colorScheme="red" />
                        <Text fontWeight="semibold" color="red">
                          Very weak
                        </Text>
                      </>
                    ) : (
                      <></>
                    )}
                    <FormHelperText color="red">
                      {formik.errors.password}
                    </FormHelperText>
                  </FormControl>

                  {/* ---------- Sec Password Input ---------- */}
                  <FormControl
                    id="repassword"
                    marginTop={'20px'}
                    isInvalid={formik.errors.repassword}
                  >
                    <InputGroup>
                      <Input
                        required
                        className="inputRePass"
                        maxLength={'30'}
                        type={passwordViewRep ? 'text' : 'password'}
                        onChange={(event) =>
                          formik.setFieldValue('repassword', event.target.value)
                        }
                      />
                      <FormLabel className="labelRePass">
                        &nbsp; Repeat Password &nbsp;
                      </FormLabel>
                      <InputRightAddon>
                        <Icon
                          fontSize="xl"
                          onClick={() => setPasswordViewRep(!passwordViewRep)}
                          as={passwordViewRep ? IoMdEye : IoMdEyeOff}
                          sx={{ _hover: { cursor: 'pointer' } }}
                        />
                      </InputRightAddon>
                    </InputGroup>
                    <FormHelperText color="red">
                      {formik.errors.repassword}
                    </FormHelperText>
                  </FormControl>
                </Box>
              </Stack>
              <Box>
                <Button
                  onClick={formik.handleSubmit}
                  colorScheme="twitter"
                  mb={'20px'}
                  ml={'20px'}
                >
                  Change Password
                </Button>
                {/* bgColor='#33bbff' */}
              </Box>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

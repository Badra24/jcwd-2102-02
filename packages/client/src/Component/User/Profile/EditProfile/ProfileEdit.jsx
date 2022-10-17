import React from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Spacer,
  Input,
  Stack,
  Flex,
  Box,
  RadioGroup,
  Radio,
  useToast,
  Text,
  FormHelperText,
  InputGroup,
  Icon,
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../../../lib/api';

import * as Yup from 'yup';
import qs from 'qs';

import { AvatarEdit } from './AvatarEdit';
import { ConfirmationDialogue } from '../../Dialogue/ConfirmationDialogue';
import { GoVerified } from 'react-icons/go';
import ChangePassForm from '../../Authentication/ChangepassForm';

const ProfileEdit = () => {
  const renderSelector = useSelector((state) => state.renderReducer);
  const authSelector = useSelector((state) => state.authReducer);

  const toast = useToast();
  const router = useRouter();
  const dispatch = useDispatch();

  const { full_name, username, email, image_url, phone, birth_date, gender } =
    authSelector;
  const [genderValue, setGenderValue] = useState(gender);

  const formik = useFormik({
    initialValues: {
      full_name,
      username,
      phone,
      birth_date,
      email,
      gender,
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required('email required')
        .email('Email invalid')
        .min(6, 'Email minimum length 6'),
      username: Yup.string()
        .required('Username required')
        .min(8, 'Username min 8 characters')
        .trim('Username must not include spaces')
        .max(16, 'Maximum username length 16'),
      full_name: Yup.string()
        .required('Full Name required')
        .min(6, 'Username min 6 characters')
        .max(30, 'Maximum username length 30'),
      phone: Yup.string()
        .required('Must be only digits')
        .matches(/^\d+$/, 'Must be only digits')
        .min(9, 'Minimum number is 9')
        .max(13, 'Maximum number is 13'),
    }),
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: async () => {
      try {
        const res = await axiosInstance.patch(
          `/users/${authSelector.id}`,
          formik.values,
        );
        console.log('res');
        console.log(res);

        if (res.status != 200) {
          const errors = res.response.data.error.messages.errors[0].message;
          toast({
            title: errors,
            status: 'error',
            isClosable: true,
          });
          return;
        }
        dispatch({
          type: 'FETCH_DATA',
          payload: {
            value: !renderSelector.value,
          },
        });
        toast({
          title: 'User Updated',
          status: 'success',
          isClosable: true,
        });
      } catch (error) {
        console.log(error);
        toast({
          title: `Error `,
          status: 'error',
          isClosable: true,
        });
      }

      formik.setSubmitting(false);
    },
  });

  const sendVerification = async () => {
    const body = qs.stringify({
      id: authSelector?.id,
      email: authSelector?.email,
      username: authSelector?.username,
    });
    try {
      const res = await axiosInstance.post('/users/verifysend', body);

      toast({
        title: 'Check the email',
        status: 'success',
        isClosable: 'true',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    if (
      formik.errors.phone ||
      formik.errors.email ||
      formik.errors.username ||
      formik.errors.full_name ||
      formik.errors.phone
    ) {
      toast({
        title: `Error `,
        status: 'error',
        isClosable: true,
      });
      return;
    }
    formik.setFieldValue('gender', genderValue);
    formik.handleSubmit();
  };

  useEffect(() => {
    !authSelector.id ? router.push('/') : null;
  }, [authSelector]);

  return (
    <>
      {/* {authSelector.id ? ( */}
      <>
        <AvatarEdit image_url={image_url} />
        <Box w="full" p={10} fontSize="xl">
          <Flex gap={8}>
            <Text>Account Information</Text>
            {!authSelector.is_verified ? (
              <Button onClick={sendVerification} colorScheme={'teal'}>
                Send Verification
              </Button>
            ) : (
              <Icon as={GoVerified} />
            )}
            <ChangePassForm />
          </Flex>
          <FormControl py={2} id="full_name" display="flex">
            <FormLabel w="30%">Name</FormLabel>
            <InputGroup display={'block'}>
              <Input
                id="full_name"
                defaultValue={full_name}
                placeholder="Name"
                _placeholder={{ color: 'gray.500' }}
                type="text"
                onChange={(e) => {
                  formik.setFieldValue('full_name', e.target.value);
                }}
              />
              <FormHelperText display="block" mx={2} color="red.500">
                {formik.errors.full_name}
              </FormHelperText>
            </InputGroup>
          </FormControl>
          <FormControl py={2} id="username" display="flex">
            <FormLabel w="30%">Username</FormLabel>
            <InputGroup display={'block'}>
              <Input
                id="username"
                defaultValue={username}
                placeholder="Username"
                _placeholder={{ color: 'gray.500' }}
                type="text"
                onChange={(e) => {
                  formik.setFieldValue('username', e.target.value);
                }}
              />
              <FormHelperText display="block" mx={2} color="red.500">
                {formik.errors.username}
              </FormHelperText>
            </InputGroup>
          </FormControl>
          <FormControl py={2} display="flex">
            <FormLabel w="30%">Email</FormLabel>
            <InputGroup display={'block'}>
              <Input
                id="email"
                defaultValue={email}
                placeholder="your-email@example.com"
                _placeholder={{ color: 'gray.500' }}
                type="email"
                onChange={(e) => {
                  formik.setFieldValue('email', e.target.value);
                }}
              />
              <FormHelperText display="block" mx={2} color="red.500">
                {formik.errors.email}
              </FormHelperText>
            </InputGroup>
          </FormControl>
          <FormControl py={2} display="flex">
            <FormLabel w="30%">Phone Number</FormLabel>
            <InputGroup display={'block'}>
              <Input
                id="phone"
                defaultValue={phone}
                placeholder="08xxxxxxxxxx"
                _placeholder={{ color: 'gray.500' }}
                type="number"
                onChange={(e) => {
                  formik.setFieldValue('phone', e.target.value);
                }}
              />
              <FormHelperText display="block" mx={2} color="red.500">
                {formik.errors.phone}
              </FormHelperText>
            </InputGroup>
          </FormControl>
          <FormControl py={2} display="flex">
            <FormLabel w="30%">Birth Date</FormLabel>
            <InputGroup display={'block'}>
              <Input
                id="birth_date"
                defaultValue={birth_date}
                _placeholder={{ color: 'gray.500' }}
                type="date"
                onChange={(e) => {
                  formik.setFieldValue('birth_date', e.target.value);
                }}
              />
              <FormHelperText display="block" mx={2} color="red.500">
                {formik.errors.birth_date}
              </FormHelperText>
            </InputGroup>
          </FormControl>
          <FormControl py={2} id="gender" display="flex">
            <FormLabel w="30%">Gender </FormLabel>
            <RadioGroup
              onChange={(value) => {
                setGenderValue(value);
              }}
            >
              <Stack direction="row">
                <Radio colorScheme={'teal'} value="male">
                  Male
                </Radio>
                <Radio colorScheme={'teal'} value="female">
                  Female
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <Flex>
            <Spacer />
            {/* <Button colorScheme={'teal'} onClick={handleSubmit}>
              Save Chaange
            </Button> */}
            <ConfirmationDialogue
              name={'Save Change'}
              desc={'change your profile?'}
              func={handleSubmit}
            />
          </Flex>
        </Box>
      </>
      {/* ) : (
        <></>
      )} */}
    </>
  );
};

export default ProfileEdit;

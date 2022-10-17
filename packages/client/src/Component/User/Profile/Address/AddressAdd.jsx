import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Box,
  useToast,
  useDisclosure,
  Modal,
  Spacer,
  ModalOverlay,
  ModalContent,
  Flex,
} from '@chakra-ui/react';

import { Select } from 'chakra-react-select';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../../../lib/api';
import { selectProvince } from '../../../../lib/rajaOngkir/masterRajaOngkir';
import { masterRajaOngkir } from '../../../../lib/rajaOngkir/masterRajaOngkir';

const AddresAdd = (props) => {
  const [selectCityValue, setSelectCityValue] = useState([]);
  const [addressData, setAddressData] = useState();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();
  const renderSelector = useSelector((state) => state.renderReducer);
  const authSelector = useSelector((state) => state.authReducer);

  const formik = useFormik({
    initialValues: {
      id_user: 0,
      address: '',
      city: '',
      province: '',
      postal_code: '',
    },
    onSubmit: async () => {
      try {
        const res = await axiosInstance.post(
          `/address/${authSelector.id}`,
          formik.values,
        );
        console.log(formik.values);
        dispatch({
          type: 'FETCH_DATA',
          payload: {
            value: !renderSelector.value,
          },
        });
        console.log(renderSelector);
        console.log(res);
        if (res.status != 200) {
          throw new Error(res.message);
        }
        toast({
          title: 'Address added',
          status: 'success',
          isClosable: true,
        });
        onToggle();
      } catch (err) {
        toast({
          title: `Error ${err}`,
          status: 'error',
          isClosable: true,
        });
      }
    },
  });

  const handleSubmit = () => {
    try {
      formik.setFieldValue('city', addressData.value);
      formik.setFieldValue('province', addressData.province);
      formik.setFieldValue('postal_code', addressData.postal_code);
      formik.setFieldValue('city_id', addressData.city_id);
      formik.handleSubmit();
    } catch (error) {
      toast({
        title: `Add Address Failed, please fill the data correctly`,
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button
        colorScheme={'teal'}
        onClick={() => {
          onToggle();
        }}
      >
        Add Address
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <Stack
            spacing={4}
            bg={useColorModeValue('white', 'gray.700')}
            p={6}
            rounded={'xl'}
          >
            <Box display="flex" alignItems="center" py={2}>
              <Heading pl={2}>Add Address</Heading>
            </Box>

            <FormControl id="address" isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                placeholder="ex: Perumahan Cendana, Jl Melati 1 No.14, Kelapa Dua"
                _placeholder={{ color: 'gray.500' }}
                type="text"
                onChange={(e) => {
                  formik.setFieldValue('address', e.target.value);
                }}
              />
            </FormControl>
            <FormControl id="province" isRequired>
              <FormLabel mt={4}>Province</FormLabel>
              <Select
                id="province"
                isRequired
                options={selectProvince}
                onChange={(v) => {
                  setSelectCityValue(masterRajaOngkir[v.value]);
                }}
              />
            </FormControl>
            <FormControl id="city" isRequired>
              <FormLabel>City</FormLabel>
              <Select
                id="city"
                options={selectCityValue || { value: '', label: '' }}
                onChange={(v) => {
                  setAddressData(v);
                  document.querySelector('#postal_code').value = v.postal_code;
                }}
              />
            </FormControl>
            <FormControl id="postal_code" isRequired>
              <FormLabel>Postal Code</FormLabel>
              <Input
                placeholder="ex: 15810"
                _placeholder={{ color: 'gray.500' }}
                type="text"
                onChange={(e) => {
                  formik.setFieldValue('postal_code', e.target.value);
                }}
              />
            </FormControl>
            <Spacer />
            <Flex
              spacing={6}
              direction={['column', 'row']}
              justifyContent="center"
              gap={4}
            >
              <Button
                colorScheme={'teal'}
                variant="outline"
                w="full"
                onClick={onToggle}
              >
                Cancel
              </Button>

              <Button colorScheme={'teal'} w="full" onClick={handleSubmit}>
                Submit
              </Button>
            </Flex>
          </Stack>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddresAdd;

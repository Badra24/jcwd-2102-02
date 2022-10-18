import React from 'react';
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
} from '@chakra-ui/react';

import { AiOutlineEdit } from 'react-icons/ai';
import { Select } from 'chakra-react-select';
import { useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../../../lib/api';
import { selectProvince } from '../../../../lib/rajaOngkir/masterRajaOngkir';
import { masterRajaOngkir } from '../../../../lib/rajaOngkir/masterRajaOngkir';

const AddressEdit = ({ id }) => {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const [selectCityValue, setSelectCityValue] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const addressSelector = useSelector((state) => state.addressReducer);

  const renderSelector = useSelector((state) => state.renderReducer);

  const formik = useFormik({
    initialValues: {
      address: '',
      city: '',
      province: '',
      postal_code: '',
      city_id: 0,
    },
    onSubmit: async () => {
      try {
        const res = await axiosInstance.patch(`/address/${id}`, formik.values);
        console.log('formik.values');
        console.log(formik.values);
        dispatch({
          type: 'FETCH_DATA',
          payload: {
            value: !renderSelector.value,
          },
        });
        if (res.status != 200) {
          throw new Error(res.message);
        }
        toast({
          title: 'Address edited',
          status: 'success',
          isClosable: true,
        });
        dispatch({ type: 'UNSET_ADDRESS' });
      } catch (err) {
        toast({
          title: `Error ${err}`,
          status: 'error',
          isClosable: true,
        });
      }
    },
  });

  const fetchEditData = async () => {
    try {
      const res = await axiosInstance.get(`/address/${id}`);
      const data = res.data.result[0];
      console.log(data);
      console.log(id);
      setAddressData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    if (isChange && addressData.value) {
      formik.setFieldValue('city', addressData.value);
      console.log('true');
    } else if (!isChange) {
      console.log('false');
      formik.setFieldValue('city', addressData.city);
    } else {
      toast({
        title: `You've chaange your province, please change your city`,
        status: 'error',
        isClosable: true,
      });
      return;
    }

    formik.setFieldValue('address', document.querySelector('#address').value);
    formik.setFieldValue('province', addressData.province);
    formik.setFieldValue('postal_code', addressData.postal_code);
    formik.setFieldValue('city_id', addressData.city_id);
    formik.handleSubmit();
    onToggle();
    setAddressData([]);
  };

  return (
    <>
      <Box
        fontSize={'2xl'}
        cursor="pointer"
        mt={2}
        onClick={() => {
          onToggle();
          fetchEditData();
        }}
      >
        <AiOutlineEdit />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <>
          <ModalOverlay />
          <ModalContent>
            <Stack
              spacing={4}
              bg={useColorModeValue('white', 'gray.700')}
              p={6}
              rounded={'xl'}
            >
              <Box display="flex" alignItems="center" py={2}>
                <Heading pl={2}>Edit Address </Heading>
              </Box>

              {addressData.id ? (
                <>
                  <FormControl id="address">
                    <FormLabel>Address</FormLabel>
                    <Input
                      defaultValue={addressData.address}
                      placeholder="ex: Perumahan Cendana, Jl Melati 1 No.14, Kelapa Dua"
                      _placeholder={{ color: 'gray.500' }}
                      type="text"
                      onChange={(e) => {
                        formik.setFieldValue('address', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormControl id="province">
                    <FormLabel mt={4}>Province</FormLabel>
                    <Select
                      placeholder={addressData.province}
                      id="province"
                      instanceId="province-value-select"
                      options={selectProvince}
                      onChange={(v) => {
                        setSelectCityValue(masterRajaOngkir[v.value]);
                        setIsChange(!isChange);
                      }}
                    />
                  </FormControl>
                  <FormControl id="city">
                    <FormLabel>City</FormLabel>
                    <Select
                      id="city"
                      placeholder={addressData.city}
                      options={selectCityValue || { value: '', label: '' }}
                      onChange={(v) => {
                        setAddressData({ ...addressData, ...v });
                        console.log(v);
                        document.querySelector('#postal_code').value =
                          v.postal_code;
                      }}
                    />
                  </FormControl>
                  <FormControl id="postal_code">
                    <FormLabel>Postal Code</FormLabel>
                    <Input
                      placeholder={addressData.postal_code}
                      _placeholder={{ color: 'black' }}
                      type="text"
                      isDisabled
                      onChange={(e) => {
                        formik.setFieldValue('postal_code', e.target.value);
                      }}
                    />
                  </FormControl>
                </>
              ) : (
                <></>
              )}

              <Spacer />
              <Stack spacing={6} direction={['column', 'row']}>
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
              </Stack>
            </Stack>
          </ModalContent>
        </>
      </Modal>
    </>
  );
};

export default AddressEdit;

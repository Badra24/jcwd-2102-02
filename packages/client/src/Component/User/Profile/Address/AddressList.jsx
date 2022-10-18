import React from 'react';
import {
  Stack,
  Text,
  Box,
  Spacer,
  useToast,
  Flex,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../../../lib/api';
import { FiTrash } from 'react-icons/fi';
import AddressEdit from './AddressEdit';
import AddresAdd from './AddressAdd';
import { ConfirmationDialogue } from '../../Dialogue/ConfirmationDialogue';

export const AddressList = () => {
  const toast = useToast();

  const [addressData, setAddressData] = useState([]);
  const dispatch = useDispatch();

  const renderSelector = useSelector((state) => state.renderReducer);
  const authSelector = useSelector((state) => state.authReducer);

  const handleDelete = async (params) => {
    try {
      const res = await axiosInstance.patch(`/address/${params}`, {
        is_deleted: 'deleted',
      });
      toast({
        title: 'Address Deleted',
        status: 'success',
        isClosable: true,
      });
      fetchAddress();
    } catch (err) {
      const error = err.response.data.message;
      if (
        error ==
        'SequelizeForeignKeyConstraintError: Cannot delete or update a parent row: a foreign key constraint fails (`jcwd2102_group3`.`users`, CONSTRAINT `Users_default_address_foreign_idx` FOREIGN KEY (`default_address`) REFERENCES `addresses` (`id`))'
      ) {
        toast({
          title: `Can not delete default Address`,
          status: 'error',
          isClosable: true,
        });
        return;
      }
      toast({
        title: `Error ${err}`,
        status: 'error',
        isClosable: true,
      });
    }
  };

  const editDefaultAddress = async (params) => {
    try {
      const res = await axiosInstance.patch(
        `users/${authSelector.id}/address/${params}`,
      );
      const message = res.data.message;
      toast({
        title: message,
        status: 'success',
        isClosable: true,
      });
      dispatch({
        type: 'AUTH_LOGIN',
        payload: {
          ...authSelector,
          default_address: params,
        },
      });
      dispatch({ type: 'FETCH_DATA' });
      console.log(authSelector);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAddress = async () => {
    try {
      const res = await axiosInstance.get(`/address/user/${authSelector.id}`);
      const data = res.data.result;
      setAddressData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, [renderSelector]);

  return (
    <>
      <SimpleGrid columns={{ base: 2 }} gap={8} px={4}>
        {addressData?.map((val, idx) => {
          return (
            <Box
              p={8}
              border="1px"
              rounded="lg"
              borderColor={'gray.200'}
              fontSize={'md'}
              key={idx}
              _hover={{ borderColor: 'teal.400', borderWidth: '1px' }}
            >
              <Text fontWeight={'bold'} pt={2}>
                Address {idx + 1}
              </Text>
              <Stack>
                <Text>
                  {val.address}, {val.city}, {val.province}
                </Text>
                <Text>{val.postal_code}</Text>
              </Stack>
              <Box display="flex" gap={2}>
                <Badge
                  pt="4px"
                  rounded={'lg'}
                  mt={2}
                  cursor="pointer"
                  colorScheme={
                    val.id == authSelector.default_address ? 'teal' : 'gray'
                  }
                  onClick={() => {
                    editDefaultAddress(val.id);
                    console.log(authSelector.default_address);
                  }}
                >
                  Default
                </Badge>
                <Spacer />
                <AddressEdit id={val.id} />
                <ConfirmationDialogue
                  name={'Delete Address'}
                  color1="none"
                  color2="red"
                  func={handleDelete}
                  id={val.id}
                  icon={<FiTrash />}
                  color={'red'}
                />
              </Box>
            </Box>
          );
        })}
      </SimpleGrid>
      <Flex m={8}>
        <Spacer />
        {/* ADD Address */}
        <AddresAdd />
      </Flex>
    </>
  );
};

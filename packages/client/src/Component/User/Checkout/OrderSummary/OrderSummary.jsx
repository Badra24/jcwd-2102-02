import { Box, Flex, Spacer, Text, useToast } from '@chakra-ui/react';
import Router from 'next/router';
import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../../../lib/api';
import { ConfirmationDialogue } from '../../Dialogue/ConfirmationDialogue';

export const OrderSummary = ({ cartData }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const addressSelector = useSelector((state) => state.addressReducer);
  const userSelector = useSelector((state) => state.authReducer);
  const grandTotal = parseInt(cartData.total_price) + addressSelector.cost;

  const { total_item, total_price, id_user, User, Product_Carts } = cartData;
  const { cost, service, description, etd, courier } = addressSelector;

  const addOrder = async () => {
    const orderData = {
      total_item,
      total_price,
      id_user,
      id_address: User.default_address,
      courier,
      cost,
      service,
      description,
      etd,
      Product_Carts,
      status: 'Waiting For Payment',
    };

    try {
      const res = await axiosInstance.post(`/order`, orderData);
      const data = res.data.result;
      console.log(data);

      dispatch({
        type: 'SET_ORDER_ID',
        payload: {
          order_id: data.id,
        },
      });
      dispatch({
        type: 'UNSET_COURIER',
      });
      toast({
        title: 'Order made!',
        status: 'success',
        isClosable: true,
      });

      Router.push(`/invoice/${data.no_invoice}`);
    } catch (error) {
      console.log(error);
    }
  };

  const checkOut = () => {
    if (!userSelector.default_address) {
      toast({
        title: 'Please Select Address',
        status: 'warning',
        isClosable: true,
      });
      return;
    }
    if (!addressSelector.courier) {
      toast({
        title: 'Please Select Courier',
        status: 'warning',
        isClosable: true,
      });
      return;
    }
    console.log(addressSelector);
    addOrder();
  };

  useEffect(() => {
    dispatch({
      type: 'UNSET_COURIER',
    });
  }, []);

  return (
    <Box
      h="300px"
      rounded="xl"
      textAlign={'start'}
      p="1rem"
      align="center"
      bg="white"
      ml="1rem"
    >
      <Text fontSize={'1.2rem'} fontWeight="bold">
        Order Summary
      </Text>
      <Flex h="20%" align="center">
        <Text>{total_item} Items</Text>
        <Spacer />
        <Text>Rp. {parseInt(total_price)?.toLocaleString('id-ID')}</Text>
      </Flex>
      <Flex h="20%" align="center" borderBottom={'4px'} borderColor="gray.200">
        <Text> Delivery Fee</Text>
        <Spacer />
        <Text>Rp. {cost?.toLocaleString('id-ID')}</Text>
      </Flex>
      <Flex h="30%" align="center" borderColor="gray.200">
        <Text>Grand Total</Text>
        <Spacer />
        <Text>Rp. {grandTotal?.toLocaleString('id-ID')}</Text>
      </Flex>
      <Box align="center">
        <ConfirmationDialogue
          func={checkOut}
          name={'Checkout'}
          desc={'checkout?'}
        />
      </Box>
    </Box>
  );
};

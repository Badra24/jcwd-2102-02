import { Box, Button, Heading, HStack, Image, Text } from '@chakra-ui/react';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../../lib/api';
import { OrderDetail } from './OrderDetail';
import { OrderSummary } from './OrderSummary';
import { PaymentInstruction } from './PaymentInstruction';
import { Shipping } from './Shipping';
import Logo from '../../../public/Assets/image/MedicareHorizontalLogo.png';
import checkMark from '../../../public/Assets/image/checkmark.png';
import NextImage from 'next/image';

export const InvoiceContainer = ({ invoice }) => {
  const [orderData, setOrderData] = useState();
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.authReducer);
  const cartSelector = useSelector((state) => state.cartReducer);
  const fetchOrder = async () => {
    try {
      const res = await axiosInstance.get(
        `/order/${userSelector.id}/invoice/${invoice}`,
      );
      const data = res.data.result;
      console.log('res');
      console.log(res);

      console.log('invoice data');
      console.log(invoice);
      console.log(data);
      setOrderData(data);

      dispatch({
        type: 'UNSET_CART',
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [invoice]);

  return (
    <>
      {orderData ? (
        <>
          {orderData.id_user == userSelector.id ? (
            <>
              <Box p="2rem">
                <Box maxW="1440px" mx="auto" p="2rem" shadow="lg">
                  <Box>
                    <Heading mb="5rem">
                      <NextImage alt={'Logo Image'} src={Logo} />
                      <Box w="full" align="center">
                        <NextImage alt={'checkMark'} src={checkMark} />
                        <Text fontSize={'3xl'}>Thankyou</Text>
                        <Text fontSize={'3xl'}>
                          Your Order Has Been Recived!
                        </Text>
                      </Box>
                    </Heading>

                    <OrderSummary data={orderData} />
                    <PaymentInstruction />
                    <Shipping data={orderData} />
                    <OrderDetail data={orderData} />
                  </Box>

                  <HStack mx="auto" gap="2rem" w="70%" py="2rem">
                    <Button
                      w="full"
                      colorScheme={'teal'}
                      variant="outline"
                      onClick={() => {
                        console.log('Cancel');
                      }}
                    >
                      Cancel Order
                    </Button>
                    <Button
                      w="full"
                      colorScheme={'teal'}
                      onClick={() => {
                        Router.push(`/transaction`);
                      }}
                    >
                      See Transaction
                    </Button>
                  </HStack>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Box maxW="1440px" mx="auto" p="2rem" shadow="lg" h="80vh">
                <Heading textAlign={'center'} color={'teal'} mt="5rem">
                  Invalid Credential
                </Heading>
              </Box>
            </>
          )}
        </>
      ) : (
        <>
          <Box maxW="1440px" mx="auto" p="2rem" shadow="lg" h="100vh"></Box>
        </>
      )}
    </>
  );
};

import { Box, Button, Flex, Spacer, Text, useToast } from '@chakra-ui/react';
import Router from 'next/router';
import React from 'react';

export const CartSummary = ({ params, cartData }) => {
  const toast = useToast();

  const hadnleCheckout = () => {
    if (!cartData.Product_Carts.length) {
      toast({
        title: 'No Item in Cart',
        status: 'error',
        isClosabale: true,
      });
      return;
    }
    Router.push('/checkout');
  };
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
      <Flex h="40%" align="center" borderBottom={'4px'} borderColor="gray.200">
        <Text>{cartData.total_item} Items</Text>
        <Spacer />
        <Text>
          Rp. {parseInt(cartData.total_price)?.toLocaleString('id-ID')}
        </Text>
      </Flex>
      <Flex h="30%" align="center" borderColor="gray.200">
        <Text>Grand Total</Text>
        <Spacer />
        <Text>
          Rp. {parseInt(cartData.total_price)?.toLocaleString('id-ID')}
        </Text>
      </Flex>
      <Box align="center">
        <Button
          colorScheme={'teal'}
          onClick={() => {
            hadnleCheckout();
          }}
        >
          Check Out
        </Button>
      </Box>
    </Box>
  );
};

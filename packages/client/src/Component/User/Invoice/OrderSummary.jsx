import { Box, Flex, Spacer, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';

export const OrderSummary = ({ data }) => {
  useEffect(() => {
    console.log(data);
  }, []);

  return (
    <>
      {data ? (
        <Box>
          <Text fontSize={'24px'} fontWeight={'bold'} ml="4rem">
            Order Summary
          </Text>
          <Flex rounded="lg" mx="4rem" my="2rem">
            <Flex w="50%" py="2rem" direction="column" gap="1rem">
              <Text>Order Number</Text>
              <Text>Payment Method</Text>
              <Text>Price To Pay</Text>
              <Text>Pay Before</Text>
            </Flex>
            <Flex
              w="full"
              p="2rem"
              direction="column"
              gap="1rem"
              border={'1px'}
              rounded="xl"
              borderColor="gray.400"
            >
              <Text>{data.no_invoice}</Text>
              <Text>BCA Trasnfer</Text>
              <Text>Rp. {data.total_payment?.toLocaleString('id-ID')}</Text>
              <Text>Pay Before</Text>
            </Flex>
          </Flex>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

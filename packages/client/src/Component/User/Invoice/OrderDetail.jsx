import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Spacer,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React from 'react';

export const OrderDetail = ({ data }) => {
  return (
    <>
      {data ? (
        <>
          <Flex direction="column" mx="4rem" my="2rem">
            <Text fontSize={'24px'} fontWeight={'bold'} mb="2rem">
              Order Detail
            </Text>
            <TableContainer>
              <Table variant="simple" fontSize="sm">
                <Thead>
                  <Tr>
                    <Th fontSize={'bold'}>Product Name</Th>
                    <Th fontSize={'bold'}>Type</Th>
                    <Th fontSize={'bold'}>Price</Th>
                    <Th fontSize={'bold'}>Qty</Th>
                    <Th fontSize={'bold'}>Total Price</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.Product_Orders ? (
                    data.Product_Orders.map((val, idx) => {
                      return (
                        <Tr key={idx}>
                          <Td>
                            <Flex align="center" gap={6}>
                              {' '}
                              <Image
                                src={val.Product?.img_product}
                                border={'1px'}
                                maxH="200px"
                                borderColor="gray.400"
                                rounded="lg"
                              />
                              <Text>{val.Product?.name}</Text>
                            </Flex>
                          </Td>
                          <Td>{val.type}</Td>
                          <Td>
                            Rp.
                            {val.Product?.Product_Stock?.selling_price?.toLocaleString(
                              'id-ID',
                            )}
                          </Td>
                          <Td>{val.quantity} </Td>
                          <Td>
                            Rp.
                            {(
                              val.Product?.Product_Stock?.selling_price *
                              val.quantity
                            ).toLocaleString('id-ID')}
                          </Td>
                        </Tr>
                      );
                    })
                  ) : (
                    <>
                      <Spinner />
                    </>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Flex>

          <Flex mx="4rem" my="2rem">
            <Stack
              border="1px"
              borderColor={'gray.400'}
              rounded="lg"
              marginLeft={'auto'}
              w="300px"
              p="1rem"
              spacing={'1rem'}
            >
              <Flex align="center" h="50%">
                <Text> Subtotal</Text>
                <Spacer />
                <Text>Rp. {data.total_price?.toLocaleString('id-ID')}</Text>
              </Flex>
              <Flex
                h="50%"
                align="center"
                borderBottom={'4px'}
                borderColor="gray.200"
              >
                <Text> Delivery Fee</Text>
                <Spacer />
                <Text>Rp. {data.shipping_cost?.toLocaleString('id-ID')}</Text>
              </Flex>
              <Flex align="center" h="50%">
                <Text> Grand Total</Text>
                <Spacer />
                <Text>Rp. {data.total_payment?.toLocaleString('id-ID')}</Text>
              </Flex>
            </Stack>
          </Flex>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

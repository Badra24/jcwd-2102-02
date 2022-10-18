import {
  Box,
  Flex,
  Spacer,
  Text,
  useToast,
  Badge,
  Checkbox,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
} from '@chakra-ui/react';

import React from 'react';
import moment from 'moment';

import { axiosInstance } from '../../../lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { PrescriptionCopy } from '../PrescriptionCopy/PrescriptionCopy';
import { PaymentReceipt } from '../../User/Transcation/PaymentReceipt';
import { ConfirmationDialogue } from '../../User/Dialogue/ConfirmationDialogue';

export const OrderList = ({ data }) => {
  const toast = useToast();
  const dispatch = useDispatch();

  const transactionSelector = useSelector((state) => state.transactionReducer);
  const handleEditStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`/order/status/${id}`, { status });
      toast({
        title: `Transaction ${status}`,
        status: 'success',
        isClosable: true,
      });
      dispatch({
        type: 'SET_TRANSACTION_FILTER',
        payload: {
          ...transactionSelector,
          render: !transactionSelector.render,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createProductHistory = async (id) => {
    try {
      const res = await axiosInstance.post(`/product_history/${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {data ? (
        data.map((val, idx) => {
          return (
            <div key={idx}>
              <Box my="1rem" bg="white" w="full" rounded="lg" shadow="md">
                {/* Header */}
                <Flex borderBottom={'2px'} borderColor={'gray.200'} p="1rem">
                  <Checkbox>
                    {val.status} ({moment(val.createdAt).format('LL')})
                  </Checkbox>
                  <Spacer />

                  {/* VALIDATION */}
                  {(() => {
                    if (val.status == 'Validation' || val.status == 'Payment') {
                      return (
                        <>
                          <Text mr="1rem">Accept Before</Text>
                          <Box>
                            <Badge colorScheme={'purple'}>
                              {moment(val.createdAt)
                                .add(1, 'days')
                                .format('LLL')}
                            </Badge>
                          </Box>
                        </>
                      );
                    } else {
                      return (
                        <Box>
                          <Badge colorScheme={'purple'}>{val.status}</Badge>
                        </Box>
                      );
                    }
                  })()}
                  {/* VALIDATION */}
                </Flex>
                {/* End Of Header */}

                <Flex>
                  <Box w="full">
                    <Flex>
                      <Box
                        w="280px"
                        borderRight={'2px'}
                        borderColor="gray.200"
                        p="1rem"
                      >
                        <Text fontWeight={'bold'}>Customer</Text>
                        <Text fontSize="sm">{val.User?.full_name}</Text>
                        <Text fontSize="sm">
                          {val.Address?.address}, {val.Address?.city},{' '}
                          {val.Address?.province}, {val.Address?.postal_code}{' '}
                        </Text>
                        <Text fontWeight={'bold'} mt="1rem">
                          Order Number
                        </Text>
                        <Text>#{val.no_invoice}</Text>
                        <Text fontWeight={'bold'} mt="1rem">
                          Shipment
                        </Text>
                        <Text>
                          {val.Expedition?.description} -{' '}
                          {val.Expedition?.courier}
                        </Text>
                      </Box>
                      {val.status == 'Prescription' ? (
                        <>
                          {/* ORDER DETAIL */}
                          <Box>
                            <TableContainer>
                              <Table variant="simple" fontSize="sm">
                                <Thead>
                                  <Tr>
                                    <Th>Product Name</Th>
                                    <Th>Type</Th>
                                    <Th>QTY</Th>
                                    <Th>Availability</Th>
                                    <Th>Price</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  <Tr>
                                    <Td>Doctors Prescription</Td>
                                    <Td>Prescription</Td>
                                  </Tr>
                                </Tbody>
                              </Table>
                            </TableContainer>
                            <PrescriptionCopy data={val} />
                          </Box>
                          {/* ORDER DETAIL END */}
                        </>
                      ) : (
                        <>
                          {/* ORDER DETAIL */}
                          <Box overflowY={'auto'} maxH="250px">
                            <TableContainer>
                              <Table variant="simple" fontSize="sm">
                                <Thead>
                                  <Tr>
                                    <Th>Product Name</Th>
                                    <Th>Type</Th>
                                    <Th>QTY</Th>
                                    <Th>Availability</Th>
                                    <Th>Price</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {val.Product_Orders.map((v, i) => {
                                    return (
                                      <Tr key={i}>
                                        <Td>{v.Product?.name}</Td>
                                        <Td>{v.type}</Td>
                                        <Td>
                                          {v.quantity}{' '}
                                          {
                                            v.Product?.Product_Stock
                                              ?.primary_unit
                                          }
                                        </Td>
                                        <Td>
                                          {
                                            v.Product?.Product_Stock
                                              ?.primary_stock
                                          }{' '}
                                          {
                                            v.Product?.Product_Stock
                                              ?.primary_unit
                                          }
                                          {' Remains'}
                                        </Td>
                                        <Td>
                                          Rp.
                                          {v.Product?.Product_Stock?.selling_price?.toLocaleString(
                                            'id-ID',
                                          )}
                                        </Td>
                                      </Tr>
                                    );
                                  })}
                                </Tbody>
                              </Table>
                            </TableContainer>
                          </Box>
                          {/* ORDER DETAIL END */}
                        </>
                      )}
                    </Flex>
                  </Box>
                </Flex>
                <Flex bg="gray.200" px="1rem" py="0.3rem">
                  <Text fontWeight="bold">Total</Text>
                  <Spacer />
                  <Text fontWeight="bold">
                    Rp{val.total_payment?.toLocaleString('id-ID')}
                  </Text>
                </Flex>
                <Flex bg="white" p="1rem" gap={4}>
                  {(() => {
                    if (
                      val.status == 'Payment' ||
                      val.status == 'Waiting For Payment' ||
                      val.status == 'Process' ||
                      val.status == 'Validation'
                    ) {
                      return (
                        <ConfirmationDialogue
                          name={'Decline Order'}
                          desc={'decline this order?'}
                          func={handleEditStatus}
                          id={val.id}
                          variant={'outline'}
                          param={'Canceled'}
                          size="sm"
                        />
                      );
                    }
                  })()}
                  <Spacer />
                  {val.status != 'Waiting For Payment' ? (
                    <PaymentReceipt
                      image={val.payment_receipt}
                      role="Admin"
                      status={val.status}
                      id={val.id}
                    />
                  ) : (
                    <></>
                  )}

                  {(() => {
                    if (
                      val.status == 'Payment' ||
                      val.status == 'Waiting For Payment' ||
                      val.status == 'Validation'
                    ) {
                      return (
                        <ConfirmationDialogue
                          name={'Process Order'}
                          desc={'process this order?'}
                          func={handleEditStatus}
                          func2={createProductHistory}
                          id={val.id}
                          param={'Process'}
                          size="sm"
                          isDisabled={val.status == 'Validation' ? false : true}
                        />
                      );
                    } else if (val.status == 'Process') {
                      return (
                        <ConfirmationDialogue
                          name={'Send Order'}
                          desc={'send this order?'}
                          func={handleEditStatus}
                          id={val.id}
                          param={'Shipment'}
                          size="sm"
                        />
                      );
                    }
                  })()}
                </Flex>
              </Box>
            </div>
          );
        })
      ) : (
        <></>
      )}
    </>
  );
};

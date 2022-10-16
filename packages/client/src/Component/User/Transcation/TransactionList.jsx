import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Image,
  Spacer,
  Spinner,
  Text,
  useToast,
  useDisclosure,
  Badge,
} from '@chakra-ui/react';

import React from 'react';
import { ProgressStep } from './ProgressStep';
import { TransactionOrderDetail } from './TransactionOrderDetail';
import { TransactionPaymentDetail } from './TransactionPaymentDetail';
import Router from 'next/router';
import { ConfirmationDialogue } from '../Dialogue/ConfirmationDialogue';

import { PaymentReceipt } from './PaymentReceipt';
import { axiosInstance } from '../../../lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { PaymentUpload } from '../Payment/PaymentUpload';

export const TransactionList = ({ data }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

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

  return (
    <>
      {data ? (
        data.map((val, idx) => {
          return (
            <div key={idx}>
              <Box
                maxW="1920px"
                mx="auto"
                my="1rem"
                p="2rem"
                border="1px"
                rounded="lg"
                borderColor="gray.300"
              >
                {val.id}
                {/* PRESCRIPTION */}
                {val.status == 'Prescription' ? (
                  <Flex>
                    <Image
                      src={val.prescription}
                      maxH="400px"
                      minW="400px"
                      border="1px"
                      borderColor={'gray.300'}
                      rounded="lg"
                      fit={'contain'}
                    />
                    <Box mx="1rem" w="full">
                      <Flex>
                        <Text fontSize={'20px'} fontWeight={'700'} mb="1rem">
                          Order By Prescription
                        </Text>
                        <Spacer />
                        <Box>
                          <Badge colorScheme={'purple'}>
                            Wait admin to copy the prescription
                          </Badge>
                        </Box>
                      </Flex>
                      <Grid
                        templateColumns="repeat(4, 1fr)"
                        gap="1rem"
                        w="full"
                      >
                        <GridItem colSpan={4}>
                          {/* STEP */}
                          <ProgressStep status={val.status} />
                        </GridItem>
                        <GridItem colSpan={2} p="1rem">
                          {/* Order Detail */}
                          <TransactionOrderDetail data={val} />
                        </GridItem>
                        <GridItem colSpan={2} p="1rem">
                          {/* Payment Detail */}
                          <TransactionPaymentDetail data={val} />
                        </GridItem>
                      </Grid>
                      <Flex>
                        <Spacer />
                        {val.status == 'Canceled' ? (
                          ''
                        ) : (
                          <ConfirmationDialogue
                            name={'Cancel Order'}
                            desc={'complete this order?'}
                            color1="red"
                            color2="red"
                            func={handleEditStatus}
                            id={val.id}
                            param={'Canceled'}
                          />
                        )}
                      </Flex>
                    </Box>
                  </Flex>
                ) : (
                  <Flex>
                    <Flex
                      gap="1rem"
                      direction={'column'}
                      maxW="600px"
                      maxH="400px"
                      overflowY={'auto'}
                    >
                      {val.Product_Orders.map((v, i) => {
                        return (
                          <div key={i}>
                            <Box
                              p="1rem"
                              border="1px"
                              borderColor={'gray.300'}
                              rounded="lg"
                            >
                              <Grid templateColumns="repeat(4, 1fr)" gap="1rem">
                                <GridItem colSpan={1}>
                                  <Image src={v.Product?.img_product} />
                                </GridItem>
                                <GridItem colSpan={3}>
                                  <Flex
                                    direction={'column'}
                                    ml="1rem"
                                    fontSize={'sm'}
                                  >
                                    <Text fontWeight={'700'}>
                                      Name: {v.Product?.name}
                                    </Text>
                                    <Box>
                                      Type:
                                      <Badge
                                        colorScheme={
                                          v.type == 'Chemical Raw'
                                            ? 'blue'
                                            : 'teal'
                                        }
                                      >
                                        {v.type}
                                      </Badge>
                                    </Box>
                                    <Text>
                                      Price:{' '}
                                      {v.type == 'Medicine'
                                        ? 'Rp.' +
                                          v.Product?.Product_Stock?.selling_price.toLocaleString(
                                            'id-ID',
                                          )
                                        : 'Rp.' +
                                          v.Product?.Product_Stock?.secondary_price.toLocaleString(
                                            'id-ID',
                                          )}
                                    </Text>
                                    <Text>Amount: {v.quantity} items</Text>
                                    <Text fontWeight={'700'}>
                                      Total : Rp.
                                      {(
                                        v.Product?.Product_Stock
                                          ?.selling_price * v.quantity
                                      ).toLocaleString('id-ID')}
                                    </Text>
                                  </Flex>
                                </GridItem>
                              </Grid>
                            </Box>
                          </div>
                        );
                      })}
                    </Flex>
                    <Box w="full" px="1rem">
                      <Box display="flex">
                        <Text fontSize={'20px'} fontWeight={'700'} mb="1rem">
                          Order Detail
                        </Text>
                      </Box>
                      <Grid templateColumns="repeat(4, 1fr)" gap="1rem">
                        <GridItem colSpan={4}>
                          {/* STEP */}
                          <ProgressStep status={val.status} />
                        </GridItem>
                        <GridItem colSpan={2} p="1rem">
                          {/* Order Detail */}
                          <TransactionOrderDetail data={val} />
                        </GridItem>
                        <GridItem colSpan={2} p="1rem">
                          {/* Payment Detail */}
                          <TransactionPaymentDetail data={val} />
                        </GridItem>
                      </Grid>
                      <Flex gap="0.5rem">
                        <Button
                          colorScheme={'teal'}
                          variant="link"
                          onClick={() => {
                            Router.push(`/invoice/${val.no_invoice}`);
                          }}
                        >
                          Invoice
                        </Button>
                        <Spacer />
                        {val.status == 'Process' ? (
                          ''
                        ) : val.status == 'Shipment' ? (
                          ''
                        ) : val.status == 'Completed' ? (
                          ''
                        ) : val.status == 'Canceled' ? (
                          ''
                        ) : (
                          <ConfirmationDialogue
                            name={'Cancel Order'}
                            desc={'complete this order?'}
                            color1="red"
                            color2="red"
                            func={handleEditStatus}
                            id={val.id}
                            param={'Canceled'}
                          />
                        )}

                        {val.payment_receipt == null ? (
                          val.status != 'Canceled' ? (
                            <PaymentUpload id={val.id} />
                          ) : (
                            <></>
                          )
                        ) : (
                          <>
                            {val.status == 'Completed' ? (
                              ''
                            ) : val.payment_receipt == null ? (
                              ''
                            ) : val.status == 'Payment' ? (
                              ''
                            ) : val.status == 'Validation' ? (
                              ''
                            ) : val.status == 'Canceled' ? (
                              ''
                            ) : val.status == 'Process' ? (
                              ''
                            ) : (
                              <ConfirmationDialogue
                                name={'Order Recived'}
                                desc={'complete this order?'}
                                func={handleEditStatus}
                                id={val.id}
                                param={'Completed'}
                              />
                            )}
                            <PaymentReceipt image={val.payment_receipt} />
                          </>
                        )}
                      </Flex>
                    </Box>
                  </Flex>
                )}
              </Box>
              {/* Ini */}
            </div>
          );
        })
      ) : (
        <Center>
          <Spinner />
        </Center>
      )}
    </>
  );
};

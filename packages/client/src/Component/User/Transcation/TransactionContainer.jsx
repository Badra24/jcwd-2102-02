import { Box, Button, Flex, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../../lib/api';
import { TransactionHeader } from './TransactionHeader';
import { TransactionList } from './TransactionList';

export const TransactionContainer = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [dataTransaction, setTrasnsactionData] = useState();
  const [totalTransaction, setTotalTransaction] = useState(0);
  const authSelector = useSelector((state) => state.authReducer);
  const transactionSelector = useSelector((state) => state.transactionReducer);

  const fetchTransaction = async () => {
    try {
      const res = await axiosInstance.get(`/order/${authSelector.id}`, {
        params: { ...transactionSelector, limit: 4 },
      });
      const data = res.data.result;
      console.log(data);
      console.log('data');
      console.log(res.data.status);
      setTrasnsactionData(data);
      setTotalTransaction(res.data.totalOrder);
    } catch (error) {
      console.log(error);
    }
  };
  const handlePaging = (v) => {
    dispatch({
      type: 'SET_TRANSACTION_FILTER',
      payload: {
        ...transactionSelector,
        offset: transactionSelector.offset + v,
      },
    });
  };

  useEffect(() => {
    if (authSelector.id) {
      fetchTransaction();
    }

    !authSelector.id ? router.push('/') : null;
  }, [authSelector, transactionSelector]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'UNSET_TRANSACTION_FILTER',
      });
    };
  }, []);

  return (
    <Box mx="2rem">
      <TransactionHeader />
      <TransactionList data={dataTransaction} />
      <Flex justify={'center'} gap="2rem" my="1rem">
        <Button
          colorScheme={'teal'}
          variant="outline"
          minW={'6rem'}
          isDisabled={transactionSelector.offset <= 0 ? true : false}
          onClick={() => {
            handlePaging(-4);
          }}
        >
          Previous
        </Button>
        <Button
          colorScheme={'teal'}
          minW={'6rem'}
          isDisabled={
            transactionSelector.offset >= totalTransaction - 4 ? true : false
          }
          onClick={() => {
            handlePaging(4);
          }}
        >
          Next
        </Button>
      </Flex>
    </Box>
    // </Box>
  );
};

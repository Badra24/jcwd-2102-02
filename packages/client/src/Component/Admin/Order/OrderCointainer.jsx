import { Box, Heading, Flex, Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../lib/api';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { OrderFilter } from './OrderFilter';
import { OrderList } from './OrderList.jsx';
import SideBar from '../sidebar/sidebar';

export const OrderCointainer = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [dataTransaction, setTrasnsactionData] = useState();
  const [totalTransaction, setTotalTransaction] = useState(0);
  const authSelector = useSelector((state) => state.authReducer);
  const transactionSelector = useSelector((state) => state.transactionReducer);
  const render = useSelector((state) => state.renderReducer);

  useEffect(() => {
    if (authSelector?.role === 'admin') {
    } else {
      router.push('/');
    }
  }, [authSelector?.role === 'admin']);

  const fetchTransaction = async () => {
    try {
      const res = await axiosInstance.get(`/order`, {
        params: { ...transactionSelector, limit: 4 },
      });
      const data = res.data.result;
      setTrasnsactionData(data);
      setTotalTransaction(res.data.totalOrder);
      console.log(data);
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

    console.log(transactionSelector);
  }, [authSelector, transactionSelector, render]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'UNSET_TRANSACTION_FILTER',
      });
    };
  }, []);
  return (
    <Flex maxW="1920px" mt="0.2rem" bg="#FAF5FF">
      {/* <Box w="270px" border="2px" borderColor={'gray.200'} bg="white" h="90vh">
        sidebar
      </Box> */}
      <SideBar />
      <Box>
        <Box m="1rem" overflow={'auto'} flexWrap={'wrap'}>
          <Heading fontSize={'20px'}>Order List</Heading>
          <OrderFilter />
          <OrderList data={dataTransaction} />
          <Box bg="blue"></Box>
        </Box>

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
    </Flex>
  );
};

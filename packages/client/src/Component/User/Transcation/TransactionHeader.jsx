import React, { useState } from 'react';
import { Box, Button, Center, Flex, SimpleGrid } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { FilterTransaction } from './FilterTransaction';

import { TransactionOption } from '../../../lib/TransactionFilter';

export const TransactionHeader = () => {
  const dispatch = useDispatch();

  const transactionSelector = useSelector((state) => state.transactionReducer);
  const data = TransactionOption.status;

  const handleClick = (params) => {
    if (params == 'All') {
      dispatch({
        type: 'UNSET_TRANSACTION_FILTER',
      });
      return;
    }
    dispatch({
      type: 'SET_TRANSACTION_FILTER',
      payload: {
        ...transactionSelector,
        status: params,
      },
    });
  };

  return (
    <Box maxW="1920px" mx="auto">
      <Center>
        <Box height={'60px'} columns={{ base: 1, md: 3, lg: 5 }}>
          {/* ON Going */}
          {data.map((val, idx) => {
            return (
              <Button
                background="white"
                borderRadius={0}
                h="full"
                fontSize="18px"
                fontWeight={'bold'}
                minW="100px"
                style={
                  transactionSelector.status == val
                    ? {
                        textDecoration: 'none',
                        borderBottomWidth: '4px',
                        borderBottomColor: 'teal',
                      }
                    : transactionSelector.status == '' && idx == 0
                    ? {
                        textDecoration: 'none',
                        borderBottomWidth: '4px',
                        borderBottomColor: 'teal',
                      }
                    : { textDecoration: 'none' }
                }
                _hover={{
                  borderBottomWidth: '4px',
                  borderBottomColor: 'teal',
                }}
                onClick={() => {
                  handleClick(val);
                }}
              >
                {val}
              </Button>
            );
          })}
        </Box>
      </Center>
      <FilterTransaction />
    </Box>
  );
};

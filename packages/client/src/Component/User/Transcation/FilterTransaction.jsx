import React, { useState } from 'react';
import { Box, Button, Flex, Input, Spacer, Text } from '@chakra-ui/react';

import { Select } from 'chakra-react-select';
import { useDispatch, useSelector } from 'react-redux';

import { DateFilter } from '../../DateFilter';
import { BiReset } from 'react-icons/bi';
import { TransactionOption } from '../../../lib/TransactionFilter';

export const FilterTransaction = () => {
  const dispatch = useDispatch();
  const transactionSelector = useSelector((state) => state.transactionReducer);

  const handleFilter = (v) => {
    dispatch({
      type: 'SET_TRANSACTION_FILTER',
      payload: {
        ...transactionSelector,
        ...v,
        offset: 0,
      },
    });
  };

  return (
    <>
      <Flex
        p="1rem"
        align={'center'}
        gap={4}
        borderTop="4px"
        borderColor={'gray.200'}
        wrap="wrap"
      >
        <Box minW={'16rem'} shadow="md">
          <Select
            options={TransactionOption.sort}
            placeholder="Sort By"
            focusBorderColor="teal.400"
            colorScheme="purple"
            size="sm"
            onChange={(v) => {
              handleFilter(v);
            }}
          />
        </Box>
        <Box minW={'16rem'} shadow="md">
          <Input
            shadow="md"
            size="sm"
            _placeholder={{ color: 'gray.500' }}
            placeholder="Invoice"
            type="text"
            onChange={(e) => {
              handleFilter({ no_invoice: e.target.value });
              console.log(e.target.value);
            }}
          />
        </Box>
        <DateFilter />
        <Spacer />
        <Button
          size="sm"
          onClick={() => {
            dispatch({
              type: 'UNSET_TRANSACTION_FILTER',
            });
            console.log(transactionSelector);
          }}
        >
          <BiReset />
        </Button>
      </Flex>
    </>
  );
};

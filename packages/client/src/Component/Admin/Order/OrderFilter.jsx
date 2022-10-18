import React from 'react';
import {
  Box,
  Flex,
  Input,
  Spacer,
  Text,
  Center,
  Button,
  Checkbox,
} from '@chakra-ui/react';

import { Select } from 'chakra-react-select';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionOption } from '../../../lib/TransactionFilter';
import { DateFilter } from '../../DateFilter';
import { BiReset } from 'react-icons/bi';

export const OrderFilter = () => {
  const dispatch = useDispatch();

  const transactionSelector = useSelector((state) => state.transactionReducer);
  const data = [
    'All Order',
    'New Order',
    'Waiting For Validation',
    'Process',
    'Shipment',
    'Completed',
    'Prescription',
    'Canceled',
  ];
  const handleClick = (params) => {
    if (params == 'All Order') {
      dispatch({
        type: 'UNSET_TRANSACTION_FILTER',
      });
      return;
    }
    dispatch({
      type: 'SET_TRANSACTION_FILTER',
      payload: {
        ...transactionSelector,
        status:
          params == 'New Order'
            ? 'Waiting For Payment'
            : params == 'Waiting For Validation'
            ? ['Payment', 'Validation']
            : params,
      },
      offset: 0,
    });
  };

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
      <Box my="1rem" bg="white" rounded="lg" p="1rem" shadow="md">
        <Center>
          <Box height={'60px'} columns={{ base: 1, md: 3, lg: 5 }}>
            {/* ON Going */}
            {data.map((val, idx) => {
              return (
                <Button
                  background="white"
                  borderRadius={0}
                  h="full"
                  fontSize="14px"
                  minW="100px"
                  color={'gray.400'}
                  key={idx}
                  style={(() => {
                    if (
                      transactionSelector.status == val ||
                      (transactionSelector.status == '' && idx == 0) ||
                      (transactionSelector.status == 'Waiting For Payment' &&
                        idx == 1) ||
                      (transactionSelector.status == 'Payment,Validation' &&
                        idx == 2)
                    ) {
                      return {
                        textDecoration: 'none',
                        borderBottomWidth: '2px',
                        borderBottomColor: '#805AD5',
                        color: '#805AD5',
                      };
                    }
                  })()}
                  _hover={{
                    borderBottomWidth: '2px',
                    borderBottomColor: '#805AD5',
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
        <Flex
          p="1rem"
          align={'center'}
          gap={4}
          borderTop="4px"
          borderColor={'gray.200'}
        >
          <Box minW={'16rem'} shadow="md">
            <Input
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
          <Box minW={'16rem'} shadow="md">
            <Select
              size="sm"
              options={TransactionOption.sort}
              placeholder="Sort By"
              focusBorderColor="teal.400"
              colorScheme="purple"
              instanceId="filter-value-select"
              onChange={(v) => {
                handleFilter(v);
              }}
            />
          </Box>
          {/* <Text>From :</Text> */}
          <DateFilter />
          <Spacer />
          <Button
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
      </Box>
      <Flex p="1rem" gap={4}>
        <Checkbox>Select All</Checkbox>

        <Button colorScheme={'teal'} size="sm">
          Process Selected Orders
        </Button>
        <Button variant={'outline'} colorScheme={'teal'} size="sm">
          Decline Selected Orders
        </Button>
      </Flex>
    </>
  );
};

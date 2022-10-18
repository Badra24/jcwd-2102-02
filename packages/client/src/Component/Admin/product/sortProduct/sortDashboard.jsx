import {
  Flex,
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Icon,
  Text,
  Center,
  CheckboxGroup,
  Checkbox,
  Stack,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';

import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import { BsFilterLeft } from 'react-icons/bs';
import { sortOptions } from '../../../../lib/option2';

export default function sortProduct() {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filterReducer);

  return (
    <>
      <Flex flexWrap={'wrap'} justifyContent={'center'}>
        <Box>
          <Box w="200px" m="10px" boxShadow="md" bg="white" borderRadius="5px">
            <Box h="40px" borderTopRadius="10px" bg="#009B90">
              <Center h="40px">
                <Icon boxSize="6" as={BsFilterLeft} color="white" />
                <Text mx="10px" fontWeight="bold" color="white">
                  Sort
                </Text>
              </Center>
            </Box>
            <Box
              maxW={'14rem'}
              mt="1rem"
              mr={'auto'}
              shadow="md"
              justifyContent={'center'}
            >
              <Select
                options={sortOptions}
                placeholder="Sort By..."
                focusBorderColor="teal.400"
                colorScheme="purple"
                onChange={(v) => {
                  console.log('filter history');
                  console.log(v);
                  dispatch({
                    type: 'SET_FILTER',
                    payload: {
                      ...filter,
                      ...v,
                      banner: false,
                    },
                  });
                  console.log(filter);
                  console.log(sortOptions);
                }}
              />
              {/* <option value='Lainnya'>Nama A-Z</option>
                <option value='Laki-laki'>Nama Z-A</option>
                <option value='Perempuan'>Harga Tertinggi</option>
                <option value='Perempuan'>Harga Terendah</option> */}
              {/* </Select> */}
            </Box>
          </Box>
        </Box>
      </Flex>
    </>
  );
}

import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

export const SearchInput = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [state, setState] = useState();
  const filter = useSelector((state) => state.filterReducer);
  return (
    <InputGroup display={{ base: 'none', md: 'block' }}>
      <InputLeftElement color="gray.400">
        <FaSearch />
      </InputLeftElement>
      <Input
        focusBorderColor="teal.400"
        placeholder="Search for medicine"
        value={state}
        defaultValue={state}
        onChange={(e) => {
          setState(e.target.value);
        }}
      />
      <InputRightElement
        width="4.5rem"
        px={2}
        color={'white'}
        onClick={() => {
          router.push('/');
          dispatch({
            type: 'SET_FILTER',
            payload: {
              banner: false,
              filter: state,
              offset: 0,
            },
          });
          console.log(state);
        }}
        cursor="pointer"
        bg="teal.400"
        _hover={{ bg: 'teal.500' }}
        borderRightRadius="md"
      >
        Search
      </InputRightElement>
    </InputGroup>
  );
};

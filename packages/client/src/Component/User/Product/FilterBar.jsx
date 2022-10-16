import {
  Box,
  Checkbox,
  CheckboxGroup,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilterInput } from './FilterInput';
import Router from 'next/router';

export const FilterBar = ({ data }) => {
  const [checked, setChecked] = useState(false);
  const filter = useSelector((state) => state.filterReducer);

  const dispatch = useDispatch();
  const cat = () => {
    let temp = [];
    data.map((val) => {
      temp.push(val.category);
    });
    return temp;
  };

  const handleClick = (param, val) => {
    const category = filter.category;
    const category1 = [...filter.category];
    category1.splice(category1.indexOf(val), 1);
    if (param == 'add') {
      dispatch({
        type: 'SET_FILTER',
        payload: {
          category: [...filter.category, val],
          banner: false,
          offset: 0,
        },
      });
    } else if (param == 'all') {
      dispatch({
        type: 'SET_FILTER',
        payload: {
          category: val,
          banner: false,
          offset: 0,
        },
      });
    } else {
      dispatch({
        type: 'SET_FILTER',
        payload: {
          category: category1,
          banner: false,
          offset: 0,
        },
      });
    }
  };

  return (
    <>
      <Box
        minW={{ md: '14rem', lg: '18rem' }}
        m={{ base: '0.5rem', md: '2.5rem' }}
      >
        <Box shadow="md">
          <FilterInput />
        </Box>
        <Box
          border="2px"
          borderColor={'teal.500'}
          borderRadius="lg"
          mt={{ base: 0, md: '1rem' }}
          display={{ base: 'none', md: 'block' }}
        >
          <CheckboxGroup colorScheme={'teal'}>
            <Box
              bg="teal.400"
              display={'flex'}
              justifyContent="space-between"
              py={4}
              px={6}
              color="gray.200"
              fontWeight={'500'}
            >
              <Checkbox
                // isChecked={checked}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleClick('all', cat());
                    setChecked(true);
                  } else {
                    handleClick('all', []);
                    setChecked(false);
                  }
                }}
              >
                Select All
              </Checkbox>
              <Text
                cursor="pointer"
                onClick={() => {
                  handleClick('all', []);
                  setChecked(false);
                }}
              >
                Clear
              </Text>
            </Box>
            <Box h="25rem" overflowY={'auto'}>
              <Stack py={4} px={6} gap={4}>
                {data ? (
                  data.map((val, idx) => {
                    return (
                      <Checkbox
                        key={idx}
                        // isChecked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleClick('add', val.category);
                          } else {
                            handleClick('reduce', val.category);
                          }
                        }}
                      >
                        {val.category}
                      </Checkbox>
                    );
                  })
                ) : (
                  <Spinner />
                )}
              </Stack>
            </Box>
          </CheckboxGroup>
        </Box>
      </Box>
    </>
  );
};

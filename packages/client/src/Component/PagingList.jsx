import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const PagingList = ({ totalItem, offset }) => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filterReducer);

  // const handleClick = (task) => {
  //   let param = task;
  //   let offset = 0;
  //   if (param == 'next') {
  //     offset = filter.offset + 9;
  //   } else if (param == 'previous') {
  //     offset = filter.offset - 9;
  //   }
  //   if (offset <= 0) {
  //     offset = 0;
  //   }
  //   dispatch({
  //     type: 'SET_FILTER',
  //     payload: {
  //       ...filter,
  //       offset,
  //     },
  //   });
  // };
  const handlePaging = (v) => {
    dispatch({
      type: 'SET_FILTER',
      payload: {
        ...filter,
        offset: filter.offset + v,
      },
    });
    console.log(filter);
  };
  return (
    // <Box gap="1.5rem" display={'flex'} my="auto">
    //   <Image src="/assets/icon/arrow/left2.png" style={sxImage} />
    //   <Image
    //     src="/assets/icon/arrow/left1.png"
    //     style={sxImage}
    //     onClick={() => {
    //       handleClick('previous');
    //       console.log(filter);
    //     }}
    //   />

    //   <Box mb="8px" display="flex" gap="1rem" fontSize={'sm'}>
    //     <Text cursor="pointer">1</Text>
    //     <Text cursor="pointer">2</Text>
    //     <Text cursor="pointer">3</Text>
    //     <Text cursor="pointer">4</Text>
    //     <Text cursor="pointer">...</Text>
    //     <Text cursor="pointer">10</Text>
    //   </Box>
    //   <Image
    //     src="/assets/icon/arrow/right1.png"
    //     style={sxImage}
    //     onClick={() => {
    //       handleClick('next');
    //       console.log(filter);
    //     }}
    //   />
    //   <Image src="/assets/icon/arrow/right2.png" style={sxImage} />
    // </Box>
    <Flex justify={'center'} gap="2rem">
      <Button
        colorScheme={'teal'}
        variant="outline"
        minW={'6rem'}
        isDisabled={offset <= 0 ? true : false}
        onClick={() => {
          handlePaging(-9);
        }}
      >
        Previous
      </Button>
      <Button
        colorScheme={'teal'}
        minW={'6rem'}
        isDisabled={offset >= totalItem - 9 ? true : false}
        onClick={() => {
          handlePaging(9);
        }}
      >
        Next
      </Button>
    </Flex>
  );
};

// const sxImage = {
//   height: '18px',
//   width: '8px',
//   paddingTop: '5px',
//   cursor: 'pointer',
// };

import {
  Box,
  Heading,
  Text,
  HStack,
  Spacer,
  useToast,
  Button,
  Image,
} from '@chakra-ui/react';
import React from 'react';
import { FiTrash } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInput } from './NumberInput';
import { axiosInstance } from '../../../lib/api';

export const CartList = ({ cartData }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const cartSelector = useSelector((state) => state.cartReducer);

  const handleDelete = async (id_product_cart) => {
    try {
      const res = await axiosInstance.delete(`cart/user/${id_product_cart}`);
      const message = res.data.message;
      toast({
        title: message,
        status: 'success',
        isClosable: true,
      });
      dispatch({
        type: 'SET_CART',
        payload: {
          ...cartSelector,
          render: !cartSelector.render,
        },
      });

      //   Router.reload(window.location.pathname);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box rounded={'xl'} bg="white">
        <Heading textAlign={'start'} px="2rem" pt="2rem" fontSize={'24px'}>
          Items
        </Heading>
        {cartData.Product_Carts ? (
          cartData.Product_Carts.map((val, idx) => {
            return (
              <div key={idx}>
                <Box
                  display={{ sm: 'block', md: 'flex' }}
                  p="2rem"
                  borderBottom="4px"
                  borderColor={'gray.200'}
                >
                  <Box
                    borderColor={'gray.200'}
                    borderWidth={'2px'}
                    rounded={'lg'}
                  >
                    <Image src={val.Product?.img_product} mx="auto" />
                  </Box>
                  <Box mx={{ sm: 'auto', md: '2rem' }}>
                    <Text m="1rem" fontWeight={'bold'} fontSize="xl">
                      {val.Product.name}
                    </Text>
                    <Text m="1rem" fontWeight={'bold'} fontSize="xl">
                      {val.quantity}
                    </Text>
                    <Text m="1rem">
                      Rp.{' '}
                      {val.Product?.Product_Stock?.selling_price?.toLocaleString(
                        'id-ID',
                      )}
                    </Text>
                  </Box>
                  <Spacer />
                  <HStack spacing={'2rem'}>
                    <NumberInput
                      quantity={val.quantity}
                      id_product={val.Product.id}
                      totalItem={cartData.total_item}
                    />
                    <Box
                      fontSize={'xl'}
                      color="red"
                      cursor="pointer"
                      onClick={() => {
                        handleDelete(val.id);
                      }}
                    >
                      <FiTrash />
                    </Box>
                  </HStack>
                </Box>
              </div>
            );
          })
        ) : (
          <Box p="2rem" bg="gray.200">
            <Text>No items in cart</Text>
          </Box>
        )}
      </Box>
    </>
  );
};

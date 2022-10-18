import { Box, Flex, Heading } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CartList } from '../Component/User/Cart/CartList';
import { CartSummary } from '../Component/User/Cart/CartSummary';
import { Layout } from '../Layout';
import { axiosInstance } from '../lib/api';

const cart = () => {
  const [cartData, setCartData] = useState([]);
  const dispatch = useDispatch();
  const cartSelector = useSelector((state) => state.cartReducer);
  const authSelector = useSelector((state) => state.authReducer);
  const fetchCartData = async () => {
    try {
      const res = await axiosInstance.get(`/cart/user/${authSelector.id}`);
      const data = res.data.result;
      console.log(data);
      setCartData(data);

      dispatch({
        type: 'SET_CART',
        payload: {
          ...cartSelector,
          total_cart: data.total_item,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [cartSelector.render]);
  return (
    <Layout>
      <Box align="center" bg="gray.100">
        <Box maxW="1920px" px="2rem">
          <Heading textAlign={'start'} pt="2rem" pb="1rem" fontSize={'32px'}>
            Shopping Cart
          </Heading>
          <Flex display={{ sm: 'block', md: 'flex' }}>
            <Box textAlign={'start'} rounded="lg" w={{ md: '75%' }}>
              <CartList cartData={cartData} />
            </Box>
            <Box w={{ md: '25%' }}>
              <CartSummary cartData={cartData} />
            </Box>
          </Flex>
        </Box>
      </Box>
    </Layout>
  );
};

export default cart;

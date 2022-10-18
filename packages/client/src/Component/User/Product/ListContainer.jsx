import { Box, SimpleGrid, Center } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import React, { useState } from 'react';
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../../lib/api';
import { sortOptions } from '../../../lib/options';
import { ProductCardSkleton } from '../../../lib/Skleton/ProductCardSkleton';
import { ProductCard } from './ProductCard';
import { PagingList } from '../../PagingList';
import { FilterBar } from './FilterBar';

export const ProductListContainer = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState();
  const [stateProduct, setStateProduct] = useState(0);
  const [categoryData, setCategoryData] = useState();
  const filter = useSelector((state) => state.filterReducer);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get(`product`, {
        params: filter,
      });
      const data = res.data.result;
      setProducts(data.products);
      setStateProduct({
        totalProduct: res.data.totalProduct,
        offset: data.offset,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await axiosInstance.get(`category`);
      const data = res.data.result;
      setCategoryData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    console.log('filter');
    console.log(filter);
  }, [filter]);
  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <Box px={4} align="center">
      <Box maxW={'1920px'} borderColor="white" display={{ md: 'flex' }}>
        {/* Side Bar */}
        <FilterBar data={categoryData} />
        {/* End of Side Bar */}
        <Box>
          <Box
            maxW={{ base: 'full', md: '15rem' }}
            mt={{ base: 0, md: '2.5rem' }}
            mr={'auto'}
            shadow="md"
          >
            <Select
              options={sortOptions}
              placeholder="Sort By..."
              focusBorderColor="teal.400"
              colorScheme="purple"
              instanceId="filter-value-select"
              onChange={(v) => {
                dispatch({
                  type: 'SET_FILTER',
                  payload: {
                    ...filter,
                    ...v,
                    banner: false,
                  },
                });
                console.log(filter);
              }}
            />
          </Box>

          <SimpleGrid
            columns={{ base: 2, md: 3 }}
            justifyContent={'space-between'}
            spacing={{ base: 2, md: 24 }}
            w="full"
            px={4}
            my="2rem"
          >
            {/* Product Card */}

            {products ? (
              products.map((val) => {
                return (
                  <ProductCard
                    name={val.name}
                    price={val.Product_Stock?.selling_price}
                    key={val.id}
                    id={val.id}
                    image={val.img_product}
                  />
                );
              })
            ) : (
              <ProductCardSkleton />
            )}
          </SimpleGrid>

          {/* Pagination */}
          <Center p="1rem">
            <PagingList
              totalItem={stateProduct.totalProduct}
              offset={stateProduct.offset}
            />
          </Center>
        </Box>
      </Box>
    </Box>
  );
};

// export async function getServerSideProps(context) {
//   const filter = useSelector((state) => state.filterReducer);
//   const res = await axios.get(`http://localhost:3333/api/v1/product`, {
//     params: filter,
//   });

//   return {
//     props: {
//       products: res.data.result,
//     },
//   };
// }

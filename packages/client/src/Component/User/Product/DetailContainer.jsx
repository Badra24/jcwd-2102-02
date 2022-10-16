import { Box, Stack, Text, Image, Heading } from '@chakra-ui/react';

import React, { useState } from 'react';

import { AddToCartButton } from '../Cart/AddToCartButton';

export const ProductDetailContainer = ({ val }) => {
  return (
    <Box px={4} align="center">
      <Box
        maxW={'1920px'}
        borderColor="white"
        display={{ md: 'block' }}
        p={'2.5rem'}
      >
        <Stack spacing={4}>
          <Heading textAlign={'start'} mb={4}>
            {val.Product?.name}
          </Heading>

          <Stack direction={'row'} align="center">
            <Image src={val.Product?.img_product} w="45%" />
            <Text textAlign={'start'} p="4rem">
              {val.purpose} Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Laudantium nihil quaerat fugit illo exercitationem illum
              voluptate molestias possimus eum! Autem!
            </Text>
            <Box h="60%" w="30%" shadow="lg" p={6} rounded="xl">
              <Stack spacing={'2rem'} pt={'1rem'}>
                <Text>Rp. {val.Product?.price.toLocaleString('id-ID')}</Text>
                <AddToCartButton id_product={val.Product.id} />
              </Stack>
            </Box>
          </Stack>
          <Box textAlign={'start'} w="full" display={'flex'}>
            <Stack mr="20%">
              <Text fontSize="1.2rem" fontWeight={'bold'} pt={'2rem'}>
                Deskripsi Produk
              </Text>

              <Text
                fontSize={'1.2rem'}
                fontWeight={'600'}
                color="teal"
                pt="1rem"
              >
                Indication
              </Text>
              <Text>
                {val.indication} Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Nesciunt quaerat quam illum dicta amet veniam
                ducimus doloribus! Hic non dolorum deleniti quibusdam rem rerum
                cupiditate ex labore, ratione facere ducimus harum nisi minus,
                provident et nesciunt. Vel eius fugiat sed?{' '}
              </Text>
              <Text
                fontSize={'1.2rem'}
                fontWeight={'600'}
                color="teal"
                pt="1rem"
              >
                Compotition
              </Text>
              <Text>
                {val.compotition} Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Eaque quos quibusdam blanditiis quasi eligendi
                expedita officia, non autem nobis modi ducimus cum ea ratione
                voluptatem, explicabo nemo, inventore voluptate! Eveniet id
                magni deserunt dolores vel?
              </Text>
              <Text
                fontSize={'1.2rem'}
                fontWeight={'600'}
                color="teal"
                pt="1rem"
              >
                How to use
              </Text>
              <Text>{val.how_to_use} Lorem ipsum dolor sit amet.</Text>
              <Text
                fontSize={'1.2rem'}
                fontWeight={'600'}
                color="teal"
                pt="1rem"
              >
                Side effect
              </Text>
              <Text>
                {val.side_effects} Lorem ipsum dolor sit amet consectetur,
                adipisicing elit. Quas magni, aut fugiat sequi provident saepe
                dolorem rerum earum voluptas totam deserunt molestias aliquam
                debitis animi porro beatae iste quod accusamus. Pariatur
                sapiente natus illum. Doloribus culpa voluptas cumque accusamus!
                Itaque.
              </Text>
              <Text
                fontSize={'1.2rem'}
                fontWeight={'600'}
                color="teal"
                pt="1rem"
              >
                Warning
              </Text>
              <Text>
                {val.caution} Lorem ipsum dolor sit amet consectetur,
                adipisicing elit. Amet, aliquid incidunt? Voluptas perspiciatis
                minima alias? Unde animi accusantium accusamus consequatur, ipsa
                molestias hic sequi voluptate?
              </Text>
              <Text
                fontSize={'1.2rem'}
                fontWeight={'600'}
                color="teal"
                pt="1rem"
              >
                Contradictory
              </Text>
              <Text>
                {val.contradictory} Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Eveniet distinctio earum eum, maxime
                voluptatem architecto.
              </Text>
              <Text
                fontSize={'1.2rem'}
                fontWeight={'600'}
                color="teal"
                pt="1rem"
              >
                How to save
              </Text>
              <Text>{val.how_to_save} Lorem ipsum dolor sit amet.</Text>
              <Text
                fontSize={'1.2rem'}
                fontWeight={'600'}
                color="teal"
                pt="1rem"
              >
                Content
              </Text>
              <Text>{val.packaging}</Text>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

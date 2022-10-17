import { Box, Flex, Spacer, Text, Image, Stack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import logojne from '../../../public/Assets/image/courier/jnelogo.png';
import logopos from '../../../public/Assets/image/courier/poslogo.png';
import logotiki from '../../../public/Assets/image/courier/tikilogo.png';
import NextImage from 'next/image';

export const Shipping = ({ data }) => {
  useEffect(() => {
    console.log(data);
  }, []);

  return (
    <>
      {data ? (
        <Box>
          <Text fontSize={'24px'} fontWeight={'bold'} ml="4rem">
            Shipping
          </Text>
          <Flex rounded="lg" mx="4rem" my="2rem">
            <Flex w="50%" py="2rem" direction="column" gap="1rem">
              <Text>Ship to</Text>
            </Flex>
            <Flex
              w="full"
              p="2rem"
              direction="column"
              gap="1rem"
              border={'1px'}
              rounded="xl"
              borderColor="gray.400"
            >
              <Stack direction={'row'}>
                <Text fontWeight={'bold'} pt={2} minW={'5rem'}>
                  To
                </Text>
                <Text fontWeight={'bold'} pt={2} fontSize="1.1rem">
                  {data.User?.full_name}
                </Text>
              </Stack>
              <Stack direction={'row'}>
                <Text fontWeight={'bold'} pt={2} minW={'5rem'}>
                  Address
                </Text>
                <Text pt={2}>
                  {data.Address?.address}, {data.Address?.city},{' '}
                  {data.Address?.province}, Indonesia,{' '}
                  {data.Address?.postal_code}
                </Text>
              </Stack>
              <Stack direction={'row'}>
                <Text fontWeight={'bold'} pt={2} minW={'5rem'}>
                  Phone
                </Text>
                <Text pt={2}>{data.User?.phone}</Text>
              </Stack>
            </Flex>
          </Flex>
          <Flex rounded="lg" mx="4rem" my="2rem">
            <Flex w="50%" py="2rem" direction="column" gap="1rem">
              <Text>Ship With</Text>
            </Flex>
            <Flex
              w="full"
              p="2rem"
              direction="column"
              gap="1rem"
              border={'1px'}
              rounded="xl"
              borderColor="gray.400"
            >
              <Flex align={'center'}>
                <Box w="6rem">
                  {data.Expedition?.courier == 'jne' ? (
                    <NextImage alt={'courier logo'} src={logojne} />
                  ) : data.Expedition?.courier == 'pos' ? (
                    <NextImage alt={'courier logo'} src={logopos} />
                  ) : data.Expedition?.courier == 'tiki' ? (
                    <NextImage alt={'courier logo'} src={logotiki} />
                  ) : (
                    ''
                  )}
                </Box>

                <Flex direction={'column'} ml="2rem">
                  <Text>{data.Expedition?.description}</Text>
                  <Text fontWeight="bold">
                    Will be arrive in {data.Expedition?.estimation_time}
                  </Text>
                </Flex>
                <Spacer />
                <Flex direction={'column'}>
                  <Text fontWeight={'bold'}>{data.Expedition?.service}</Text>
                  <Text>
                    Rp. {data.Expedition?.cost?.toLocaleString('id-ID')}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

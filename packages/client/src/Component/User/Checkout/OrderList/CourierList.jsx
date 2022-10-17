import React, { useState } from 'react';
import {
  Box,
  AccordionPanel,
  AccordionIcon,
  AccordionItem,
  AccordionButton,
  Accordion,
  Text,
  Image,
  Spacer,
  useToast,
  Flex,
} from '@chakra-ui/react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import NextImage from 'next/image';
import logojne from '../../../../public/Assets/image/courier/jnelogo.png';
import logopos from '../../../../public/Assets/image/courier/poslogo.png';
import logotiki from '../../../../public/Assets/image/courier/tikilogo.png';

const courier = [
  { code: 'jne', name: 'Jalur Nugraha Ekakurir (JNE)' },
  { code: 'tiki', name: 'Citra Van Titipan Kilat (TIKI)' },
  { code: 'pos', name: 'POS Indonesia (POS)' },
];

export const CourierList = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [rajaOngkir, setRajaOngkir] = useState([]);
  const [courierImage, setCourierImage] = useState('');
  const addressSelector = useSelector((state) => state.addressReducer);

  const fetchRajaOngkir = async (params) => {
    setCourierImage(params);
    if (!addressSelector.id) {
      console.log(addressSelector);
      return toast({
        title: 'Select Your Address',
        status: 'warning',
        isClosable: true,
      });
    }
    console.log(addressSelector);
    try {
      const res = await axios.post(
        `https://api.rajaongkir.com/starter/cost`,
        {
          destination: addressSelector.city_id,
          courier: params,
          origin: 151,
          weight: 1000,
        },
        { headers: { key: '0e29b3cb4f74364cf38c45d5d71ad96e' } },
      );
      const rajaOngkirData = res.data.rajaongkir.results[0];
      console.log('fetch raja ongkir');
      console.log(rajaOngkirData);
      setRajaOngkir(rajaOngkirData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Accordion allowToggle borderColor="white">
        <AccordionItem>
          <h2>
            <AccordionButton
              bg="teal.500"
              _hover={{ bg: 'teal' }}
              color="white"
              rounded="lg"
            >
              <Box flex="1" textAlign="center" color="white">
                Select Courier
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel p="0px">
            {courier.map((val, idx) => {
              return (
                <div key={idx}>
                  <Accordion>
                    <AccordionButton
                      border="2px"
                      borderColor={'gray.300'}
                      _hover={{ borderColor: 'teal.400' }}
                      rounded="lg"
                      fontSize={'sm'}
                      onClick={() => {
                        fetchRajaOngkir(val.code);
                        console.log('fetch');
                      }}
                    >
                      <Text>{val.name}</Text>
                    </AccordionButton>
                  </Accordion>
                </div>
              );
            })}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Box rounded="lg">
        {rajaOngkir.costs ? (
          rajaOngkir.costs.map((val, idx) => {
            return (
              <div key={idx}>
                <Box
                  border="2px"
                  rounded="lg"
                  p="1rem"
                  borderColor={
                    addressSelector.service == val.service
                      ? 'teal.500'
                      : 'gray.200'
                  }
                  fontSize="sm"
                  onClick={() => {
                    dispatch({
                      type: 'SET_COURIER',
                      ...addressSelector,
                      payload: {
                        courier: rajaOngkir.code,
                        cost: val.cost[0].value,
                        description: val.description,
                        service: val.service,
                        etd: val.cost[0].etd,
                        description: val.description,
                      },
                    });
                    console.log(addressSelector);
                  }}
                >
                  <Flex>
                    <Box maxW="50px">
                      {courierImage == 'jne' ? (
                        <NextImage alt={'courier logo'} src={logojne} />
                      ) : courierImage == 'pos' ? (
                        <NextImage alt={'courier logo'} src={logopos} />
                      ) : courierImage == 'tiki' ? (
                        <NextImage alt={'courier logo'} src={logotiki} />
                      ) : (
                        ''
                      )}
                    </Box>
                    {/* <Image src={courierImage} h="3rem" w="4rem" /> */}
                    <Flex direction={'column'} ml="1rem">
                      <Text>{val.description}</Text>
                      <Text fontSize={'xs'} fontWeight="bold">
                        Will be arrive in {val.cost[0].etd}
                      </Text>
                    </Flex>
                    <Spacer />
                    <Flex direction={'column'}>
                      <Text fontWeight={'bold'}>{val.service}</Text>
                      <Text>
                        Rp. {val.cost[0].value?.toLocaleString('id-ID')}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </Box>
    </>
  );
};

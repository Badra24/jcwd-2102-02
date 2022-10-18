import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import React from 'react';
import banner from '../public/Assets/image/banner_1.png';
import step1 from '../public/Assets/image/step1.png';
import step2 from '../public/Assets/image/step2.png';
import step3 from '../public/Assets/image/step3.png';
import Image from 'next/image';

export const Banner = () => {
  return (
    <Box align="center" display={{ base: 'none', md: 'block' }}>
      <Box maxW={'1920px'}>
        <Image src={banner} layout="responsive" />
        <Text
          fontSize={{ sm: 'md', md: 'lg', lg: '3xl' }}
          fontWeight={600}
          my={{ base: 2, sm: 4, md: 6 }}
        >
          Order Prescription in 3 Steps
        </Text>
        <SimpleGrid columns={{ base: 3 }}>
          <Box>
            <Box
              width={{ sm: '120px', md: '1500px', lg: '200px' }}
              height={{ sm: '120px', md: '150px', lg: '200px' }}
            >
              <Image src={step1} layout="responsive" />
            </Box>
            <Text
              p={10}
              display={{ sm: 'none', lg: 'flex' }}
              fontSize={{
                base: '6px',
                sm: '8px',
                md: '12px',
                lg: '16px',
                xl: '20px',
              }}
            >
              Upload your prescription item(s) and sign up to register your
              personal details if you don't have an account
            </Text>
          </Box>
          <Box>
            <Box
              width={{ sm: '120px', md: '1500px', lg: '200px' }}
              height={{ sm: '120px', md: '150px', lg: '200px' }}
            >
              <Image src={step2} layout="responsive" />
            </Box>
            <Text
              p={10}
              display={{ sm: 'none', lg: 'flex' }}
              fontSize={{
                base: '6px',
                sm: '8px',
                md: '12px',
                lg: '16px',
                xl: '20px',
              }}
            >
              Our pharmacists will check and validate your uploaded prescription
            </Text>
          </Box>
          <Box>
            <Box
              width={{ sm: '120px', md: '1500px', lg: '200px' }}
              height={{ sm: '120px', md: '150px', lg: '200px' }}
            >
              <Image src={step3} layout="responsive" />
            </Box>
            <Text
              p={10}
              display={{ sm: 'none', lg: 'flex' }}
              fontSize={{
                base: '6px',
                sm: '8px',
                md: '12px',
                lg: '16px',
                xl: '20px',
              }}
            >
              We will let you know when it's ready or on the way - ot's that
              easy
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

/* eslint-disable react/no-unescaped-entities */
import { Text, Box, Spacer, Flex } from '@chakra-ui/react';

import { Layout } from '../Layout';
import { BreadCrumb } from '../Component/BreadCrumb';
import { AddressList } from '../Component/User/Profile/Address/AddressList';
import ProfileEdit from '../Component/User/Profile/EditProfile/ProfileEdit';

const Setting = () => {
  return (
    <>
      <Layout>
        <BreadCrumb
          data={[
            ['#', 'Profile'],
            ['#', 'Account&Address'],
          ]}
        />
        <Flex w="1440px" mx="auto" px="128px">
          {/* Profile Picture */}
          {/* Edit Profile */}
          <ProfileEdit />
        </Flex>
        {/* Address */}
        <Flex w="1440px" p={10} mx="auto" fontSize="xl">
          <Box w="280px" />
          <Box w="full" px={24} py={8}>
            <hr />
            <Text my={12}>Address Information</Text>
            <AddressList />
          </Box>
        </Flex>
            
        <Spacer />
      </Layout>
    </>
  );
};

export default Setting;

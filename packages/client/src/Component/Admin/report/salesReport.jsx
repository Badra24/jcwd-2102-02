import React, { useState, useEffect } from 'react';
import {
  Flex,
  Heading,
  Avatar,
  AvatarGroup,
  Text,
  Icon,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  Link,
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import {
  FiHome,
  FiPieChart,
  FiDollarSign,
  FiBox,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiCreditCard,
  FiSearch,
  FiBell,
} from 'react-icons/fi';
import { axiosInstance } from '../../../lib/api';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import MyChart from '../cart/MyChart';
import { DateFilter } from '../../DateFilter';
export default function Dashboard() {
  const filter = useSelector((state) => state.filterReducer);
  const userSelector = useSelector((state) => state.authReducer);
  const dateFilter = useSelector((state) => state.transactionReducer);

  const [display, changeDisplay] = useState('hide');
  const [value, changeValue] = useState(1);

  const [sales, setSales] = useState([0]);

  async function getSales() {
    await axiosInstance
      .get('/order', {
        params: { ...filter, ...dateFilter },
      })
      .then((res) => {
        const report = res.data.result;
        setSales([...report]);
        console.log(res.data.result);
      });
  }

  useEffect(() => {
    getSales();
    console.log('filter');
  }, [filter, dateFilter]);

  return (
    <>
      <Flex
        h={[null, null, '100vh']}
        // maxW="3000px"
        flexDir={['column', 'column', 'row']}
        overflow="hidden"
      >
        {/* Column 2 */}
        <Flex
          w={['100%', '100%', '60%', '60%', '55%']}
          p="3%"
          flexDir="column"
          overflow="auto"
          minH="100vh"
        >
          <Heading fontWeight="normal" mb={4} letterSpacing="tight">
            Welcome back,{' '}
            <Flex display="inline-flex" fontWeight="bold">
              {userSelector.full_name}
            </Flex>
          </Heading>
          <Text color="gray" fontSize="sm">
            My Balance
          </Text>
          <Text fontWeight="bold" fontSize="2xl">
            $5,750.20
          </Text>

          <MyChart />

          <Flex justifyContent="space-between" mt={8}>
            <Flex align="flex-end">
              <Heading as="h2" size="lg" letterSpacing="tight">
                Sales Report
              </Heading>
            </Flex>
            <Button>
              <DateFilter />
            </Button>
          </Flex>
          <Flex flexDir="column">
            <Flex overflow="auto">
              <Table variant="unstyled" mt={4}>
                <Thead>
                  <Tr color="gray">
                    <Th>Invoice</Th>
                    <Th>Date</Th>
                    <Th>User</Th>
                    <Th>Phone Number</Th>
                    <Th>Product</Th>
                    <Th>Total Payment</Th>
                    <Th isNumeric>quantity</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sales?.map((sales, index) => (
                    <>
                      {sales.status == 'Completed' ? (
                        sales.Product_Orders?.map((val, index) => (
                          <Tr>
                            <Td>{sales.no_invoice}</Td>
                            <Td>
                              {moment(sales.createdAt).format('YYYY-MM-DD')}
                            </Td>
                            <Td>
                              <Flex align="center">
                                <Flex flexDir="column">
                                  <Heading size="sm" letterSpacing="tight">
                                    {sales.User?.full_name}
                                  </Heading>
                                </Flex>
                              </Flex>
                            </Td>
                            <Td>{sales.User?.phone}</Td>
                            <Td>
                              <Flex align="center">
                                <Flex flexDir="column">
                                  <Heading size="sm" letterSpacing="tight">
                                    {val?.Product?.name}
                                  </Heading>
                                </Flex>
                              </Flex>
                            </Td>
                            <Td>{sales.total_payment}</Td>
                            <Td>
                              <Heading size="sm"> {val.quantity} </Heading>
                            </Td>

                            <Td>
                              <Heading size="sm" color={'green'}>
                                {sales.status}
                              </Heading>
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <></>
                      )}
                    </>
                  ))}
                </Tbody>
              </Table>
            </Flex>
            <Flex align="center">
              <Divider />
            </Flex>
          </Flex>
        </Flex>

        {/* Column 3 */}
        <Flex
          w={['100%', '100%', '30%']}
          bgColor="transparent"
          p="3%"
          flexDir="column"
          overflow="auto"
          minW={[null, null, '300px', '300px', '400px']}
        >
          <Flex alignContent="center">
            <InputGroup
              bgColor="#fff"
              mb={4}
              border="none"
              borderColor="#fff"
              borderRadius="10px"
              mr={2}
            >
              <InputLeftElement
                pointerEvents="none"
                children={<FiSearch color="gray" />}
              />
              <Input type="number" placeholder="Search" borderRadius="10px" />
            </InputGroup>
            <IconButton
              icon={<FiBell />}
              fontSize="sm"
              bgColor="#fff"
              borderRadius="50%"
              p="10px"
            />
            <Flex
              w={30}
              h={25}
              bgColor="#B57295"
              borderRadius="50%"
              color="#fff"
              align="center"
              justify="center"
              ml="-3"
              mt="-2"
              zIndex="100"
              fontSize="xs"
            >
              2
            </Flex>
          </Flex>
          <Heading letterSpacing="tight">My Cards</Heading>
          {value == 1 && (
            <Box
              borderRadius="25px"
              mt={4}
              w="100%"
              h="200px"
              bgGradient="linear(to-t, #B57295, #29259A)"
            >
              <Flex
                p="1em"
                color="#fff"
                flexDir="column"
                h="100%"
                justify="space-between"
              >
                <Flex justify="space-between" w="100%" align="flex-start">
                  <Flex flexDir="column">
                    <Text color="gray.400">Current Balance</Text>
                    <Text fontWeight="bold" fontSize="xl">
                      $5,750.20
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <Icon mr={2} as={FiCreditCard} />
                    <Text>Rise.</Text>
                  </Flex>
                </Flex>
                <Text mb={4}>**** **** **** 1289</Text>
                <Flex align="flex-end" justify="space-between">
                  <Flex>
                    <Flex flexDir="column" mr={4}>
                      <Text textTransform="uppercase" fontSize="xs">
                        Valid Thru
                      </Text>
                      <Text fontSize="lg">12/23</Text>
                    </Flex>
                    <Flex flexDir="column">
                      <Text textTransform="uppercase" fontSize="xs">
                        CVV
                      </Text>
                      <Text fontSize="lg">***</Text>
                    </Flex>
                  </Flex>
                  <Icon as={FiCreditCard} />
                </Flex>
              </Flex>
            </Box>
          )}
          {value == 2 && (
            <Box
              borderRadius="25px"
              mt={4}
              w="100%"
              h="200px"
              bgGradient="linear(to-t, yellow.300, blue.500)"
            >
              <Flex
                p="1em"
                color="#fff"
                flexDir="column"
                h="100%"
                justify="space-between"
              >
                <Flex justify="space-between" w="100%" align="flex-start">
                  <Flex flexDir="column">
                    <Text color="gray.400">Current Balance</Text>
                    <Text fontWeight="bold" fontSize="xl">
                      $350.00
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <Icon mr={2} as={FiCreditCard} />
                    <Text>Rise.</Text>
                  </Flex>
                </Flex>
                <Text mb={4}>**** **** **** 8956</Text>
                <Flex align="flex-end" justify="space-between">
                  <Flex>
                    <Flex flexDir="column" mr={4}>
                      <Text textTransform="uppercase" fontSize="xs">
                        Valid Thru
                      </Text>
                      <Text fontSize="lg">9/24</Text>
                    </Flex>
                    <Flex flexDir="column">
                      <Text textTransform="uppercase" fontSize="xs">
                        CVV
                      </Text>
                      <Text fontSize="lg">***</Text>
                    </Flex>
                  </Flex>
                  <Icon as={FiCreditCard} />
                </Flex>
              </Flex>
            </Box>
          )}
          {value == 3 && (
            <Box
              borderRadius="25px"
              mt={4}
              w="100%"
              h="200px"
              bgGradient="linear(to-t, orange.300, pink.600)"
            >
              <Flex
                p="1em"
                color="#fff"
                flexDir="column"
                h="100%"
                justify="space-between"
              >
                <Flex justify="space-between" w="100%" align="flex-start">
                  <Flex flexDir="column">
                    <Text color="gray.400">Current Balance</Text>
                    <Text fontWeight="bold" fontSize="xl">
                      $2,150.72
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <Icon mr={2} as={FiCreditCard} />
                    <Text>Rise.</Text>
                  </Flex>
                </Flex>
                <Text mb={4}>**** **** **** 8353</Text>
                <Flex align="flex-end" justify="space-between">
                  <Flex>
                    <Flex flexDir="column" mr={4}>
                      <Text textTransform="uppercase" fontSize="xs">
                        Valid Thru
                      </Text>
                      <Text fontSize="lg">11/22</Text>
                    </Flex>
                    <Flex flexDir="column">
                      <Text textTransform="uppercase" fontSize="xs">
                        CVV
                      </Text>
                      <Text fontSize="lg">***</Text>
                    </Flex>
                  </Flex>
                  <Icon as={FiCreditCard} />
                </Flex>
              </Flex>
            </Box>
          )}
          <Flex justifyContent="center" mt={2}>
            <Button
              bgColor={value == 1 ? 'gray.600' : 'gray.400'}
              size="xs"
              mx={1}
              onClick={() => changeValue(1)}
            />
            <Button
              bgColor={value == 2 ? 'gray.600' : 'gray.400'}
              size="xs"
              mx={1}
              onClick={() => changeValue(2)}
            />
            <Button
              bgColor={value == 3 ? 'gray.600' : 'gray.400'}
              size="xs"
              mx={1}
              onClick={() => changeValue(3)}
            />
          </Flex>
          <Flex flexDir="column" my={4}>
            <Flex justify="space-between" mb={2}>
              <Text>Balance</Text>
              <Text fontWeight="bold">$140.42</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Credit Limit</Text>
              <Text fontWeight="bold">$150.00</Text>
            </Flex>
          </Flex>
          <Heading letterSpacing="tight" size="md" my={4}>
            Send money to
          </Heading>
          <Flex>
            <AvatarGroup size="md" max={3}>
              <Avatar src="https://i.pinimg.com/564x/bb/84/e8/bb84e8891c5b8aea249381b5d7c936e5.jpg" />
              <Avatar src="https://i.pinimg.com/564x/bb/84/e8/bb84e8891c5b8aea249381b5d7c936e5.jpg" />
              <Avatar src="https://i.pinimg.com/564x/bb/84/e8/bb84e8891c5b8aea249381b5d7c936e5.jpg" />
              <Avatar src="https://i.pinimg.com/564x/bb/84/e8/bb84e8891c5b8aea249381b5d7c936e5.jpg" />
              <Avatar src="https://i.pinimg.com/564x/bb/84/e8/bb84e8891c5b8aea249381b5d7c936e5.jpg" />
            </AvatarGroup>
            <Avatar icon={<FiPlus />} ml={2} color="#fff" bgColor="gray.300" />
          </Flex>
          <Text color="gray" mt={10} mb={2}>
            Card number
          </Text>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<FiCreditCard color="gray.700" />}
            />
            <Input type="number" placeholder="xxxx xxxx xxxx xxxx" />
          </InputGroup>
          <Text color="gray" mt={4} mb={2}>
            Sum
          </Text>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<FiDollarSign color="gray.700" />}
            />
            <Input type="number" placeholder="130.00" />
          </InputGroup>
          <Button
            mt={4}
            bgColor="blackAlpha.900"
            color="#fff"
            p={7}
            borderRadius={15}
          >
            Send money
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

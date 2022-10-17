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
import { FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { axiosInstance } from '../../../../lib/api';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { DateFilter } from '../../../DateFilter';

export default function Dashboard() {
  const [history, setHistory] = useState([0]);
  const filter = useSelector((state) => state.filterReducer);
  const dateFilter = useSelector((state) => state.transactionReducer);

  async function getHistory() {
    await axiosInstance
      .get('/product_history', {
        params: { ...filter, dateFilter },
      })
      .then((res) => {
        console.log(res);
        const story = res.data.result.product_histories;
        console.log('sotort');
        console.log(story);
        setHistory(story);
      });
  }

  useEffect(() => {
    getHistory();
  }, [filter, dateFilter]);

  return (
    <Flex
      h={[null, null, '100vh']}
      maxW="3000px"
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
          Product,{' '}
          <Flex display="inline-flex" fontWeight="bold">
            History
          </Flex>
        </Heading>
        <Text color="gray" fontSize="sm">
          Admin
        </Text>
        <Text fontWeight="bold" fontSize="2xl">
          $1,1
        </Text>
        <Flex justifyContent="space-between" mt={8}>
          <Flex align="flex-end">
            <Heading as="h2" size="lg" letterSpacing="tight">
              Product History
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
                  <Th>Date</Th>
                  <Th>Product</Th>
                  <Th>Unit</Th>
                  <Th isNumeric>Qty</Th>
                  <Th>Type</Th>
                  <Th>status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {history?.map((history, index) => (
                  <Tr key={history.id}>
                    <Td>{moment(history.createdAt).format('YYYY-MM-DD')}</Td>
                    <Td>
                      <Flex align="center">
                        <Flex flexDir="column">
                          <Heading size="sm" letterSpacing="tight">
                            {history.product}
                          </Heading>
                        </Flex>
                      </Flex>
                    </Td>
                    <Td>
                      <Flex align="center">
                        <Flex flexDir="column">
                          <Heading size="sm" letterSpacing="tight">
                            {history.unit}
                          </Heading>
                        </Flex>
                      </Flex>
                    </Td>
                    <Td>{history.quantity}</Td>
                    <Td>
                      <Flex align="center">
                        <Flex flexDir="column">
                          <Heading size="sm" letterSpacing="tight">
                            {history.type}
                          </Heading>
                        </Flex>
                      </Flex>
                    </Td>
                    <Td>
                      <Flex align="center">
                        <Flex flexDir="column">
                          <Heading size="sm" letterSpacing="tight">
                            {history.status}{' '}
                          </Heading>
                        </Flex>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Flex>
          <Flex align="center"></Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

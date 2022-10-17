import React from 'react';

import {
  chakra,
  Box,
  Flex,
  SimpleGrid,
  VisuallyHidden,
  GridItem,
  Button,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  Input,
  Textarea,
  FormHelperText,
  Avatar,
  Icon,
  Divider,
  Select,
  Text,
  useToast,
  Checkbox,
} from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';
import { useFormik } from 'formik';
import { useState, UseEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { axiosInstance } from '../../../../lib/api';
import AddStock from '../stock/addstock/addStock';
import AddProductCategory from '../product_category/Create';
import AddDescription from '../description/addProdactdescription';
export default function App(props) {
  const toast = useToast();
  const inputFileRef = useRef(null);
  const userSelector = useSelector((state) => state.authReducer);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataProduct, setDataproduct] = useState([]);

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      code: '',
      price: '',
    },
    onSubmit: async () => {
      const formData = new FormData();
      const { name, code, price } = formik.values;

      formData.append('name', name);
      formData.append('code', code);
      formData.append('price', price);
      formData.append('img_product', selectedFile);

      try {
        await axiosInstance.post('/product/create', formData).then((res) => {
          const data = res.data.result;
          console.log(res);

          setDataproduct(data);
          toast({
            title: 'Product has been added',
            status: 'success',
            isClosable: true,
          });
        });
      } catch (err) {
        console.log(err);

        toast({
          title: 'Error',
          status: 'error',
          isClosable: true,
        });
      }
    },
  });

  return (
    <Box
      bg="transparent"
      _dark={{
        bg: '#111',
      }}
      p={10}
    >
      <Box>
        <SimpleGrid
          display={{
            base: 'initial',
            md: 'grid',
          }}
          columns={{
            md: 3,
          }}
          spacing={{
            md: 6,
          }}
        >
          <GridItem
            colSpan={{
              md: 1,
            }}
          >
            <Box px={[4, 0]}>
              <Heading fontSize="lg" fontWeight="md" lineHeight="6">
                Add New Product
              </Heading>
              <Text
                mt={1}
                fontSize="sm"
                color="gray.600"
                _dark={{
                  color: 'gray.400',
                }}
              ></Text>
            </Box>
            <Box mb="20px" mt="10px">
              <Button>
                <AddStock id={dataProduct.id} />
              </Button>
            </Box>
            <Box  mb="20px" mt="10px">
              <Button>
                <AddDescription val={dataProduct.id} />
              </Button>
            </Box>

            <Box  mb="20px" mt="10px">
              <Button>
                <AddProductCategory idProcat={dataProduct.id} />
              </Button>
            </Box>
          </GridItem>
          <GridItem
            mt={[5, null, 0]}
            colSpan={{
              md: 2,
            }}
          >
            <chakra.form
              method="POST"
              shadow="base"
              rounded={[null, 'md']}
              overflow={{
                sm: 'hidden',
              }}
            >
              <Stack
                px={4}
                py={5}
                bg="white"
                _dark={{
                  bg: '#141517',
                }}
                spacing={6}
                p={{
                  sm: 6,
                }}
              >
                <SimpleGrid columns={3} spacing={6}>
                  <FormControl as={GridItem} colSpan={[6, 4]}>
                    <FormLabel
                      htmlFor="email_address"
                      fontSize="sm"
                      fontWeight="md"
                      color="gray.700"
                      _dark={{
                        color: 'gray.50',
                      }}
                    >
                      Product Name
                    </FormLabel>
                    <Input
                      type="text"
                      name="email_address"
                      id="email_address"
                      autoComplete="email"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      onChange={(e) => {
                        formik.setFieldValue('name', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormControl as={GridItem} colSpan={[6, 4]}>
                    <FormLabel
                      htmlFor="email_address"
                      fontSize="sm"
                      fontWeight="md"
                      color="gray.700"
                      _dark={{
                        color: 'gray.50',
                      }}
                    >
                      Product code
                    </FormLabel>
                    <Input
                      type="number"
                      placeholder="003"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      onChange={(e) => {
                        formik.setFieldValue('code', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormControl as={GridItem} colSpan={[3, 2]}>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="md"
                      color="gray.700"
                      _dark={{
                        color: 'gray.50',
                      }}
                    >
                      Price
                    </FormLabel>
                    <InputGroup size="sm">
                      <InputLeftAddon
                        bg="gray.50"
                        _dark={{
                          bg: 'gray.800',
                        }}
                        color="gray.500"
                        rounded="md"
                      >
                        RP
                      </InputLeftAddon>
                      <Input
                        type="number"
                        placeholder="123.900"
                        focusBorderColor="brand.400"
                        rounded="md"
                        onChange={(e) => {
                          formik.setFieldValue('price', e.target.value);
                        }}
                      />
                    </InputGroup>
                  </FormControl>
                </SimpleGrid>

                <div>
                  <FormControl id="email" mt={1}>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="md"
                      color="gray.700"
                      _dark={{
                        color: 'gray.50',
                      }}
                    >
                      Product details
                    </FormLabel>
                    <Textarea
                      placeholder="description product"
                      mt={1}
                      rows={3}
                      shadow="sm"
                      focusBorderColor="brand.400"
                      fontSize={{
                        sm: 'sm',
                      }}
                    />
                  </FormControl>
                </div>

                <FormControl>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    _dark={{
                      color: 'gray.50',
                    }}
                  >
                    Image
                  </FormLabel>
                  <Flex alignItems="center" mt={1}>
                    <Avatar
                      boxSize={12}
                      bg="gray.100"
                      _dark={{
                        bg: 'gray.800',
                      }}
                      icon={
                        <Icon
                          as={FaUser}
                          boxSize={9}
                          mt={3}
                          rounded="full"
                          color="gray.300"
                          _dark={{
                            color: 'gray.700',
                          }}
                        />
                      }
                    />
                    <Button
                      ml={5}
                      variant="outline"
                      size="sm"
                      fontWeight="medium"
                      _focus={{
                        shadow: 'none',
                      }}
                    >
                      Change
                    </Button>
                  </Flex>
                </FormControl>

                <FormControl>
                  <Flex
                    mt={1}
                    justify="center"
                    px={6}
                    pt={5}
                    pb={6}
                    borderWidth={2}
                    _dark={{
                      color: 'gray.500',
                    }}
                    borderStyle="dashed"
                    rounded="md"
                  >
                    <Stack spacing={1} textAlign="center">
                      <Icon
                        mx="auto"
                        boxSize={12}
                        color="gray.400"
                        _dark={{
                          color: 'gray.500',
                        }}
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Icon>
                      <Flex
                        fontSize="sm"
                        color="gray.600"
                        _dark={{
                          color: 'gray.400',
                        }}
                        alignItems="baseline"
                      >
                        <chakra.label
                          htmlFor="file-upload"
                          cursor="pointer"
                          rounded="md"
                          fontSize="md"
                          color="brand.600"
                          _dark={{
                            color: 'brand.200',
                          }}
                          pos="relative"
                          _hover={{
                            color: 'brand.400',
                            _dark: {
                              color: 'brand.300',
                            },
                          }}
                        >
                          <span>Upload a file</span>
                          <VisuallyHidden>
                            <Input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              onChange={handleFile}
                              ref={inputFileRef}
                            />
                          </VisuallyHidden>
                        </chakra.label>
                        <Text pl={1}>or drag and drop</Text>
                      </Flex>
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        _dark={{
                          color: 'gray.50',
                        }}
                      >
                        PNG, JPG, GIF up to 10MB
                      </Text>
                      <Button
                        colorScheme={'blue'}
                        onClick={() => inputFileRef.current.click()}
                      >
                        Upload Image
                      </Button>
                    </Stack>
                  </Flex>
                </FormControl>
              </Stack>
              <Box
                px={{
                  base: 4,
                  sm: 6,
                }}
                py={3}
                bg="gray.50"
                _dark={{
                  bg: '#121212',
                }}
                textAlign="right"
              >
                <Button
                  type="submit"
                  colorScheme="twitter"
                  _focus={{
                    shadow: '',
                  }}
                  fontWeight="md"
                  onClick={formik.handleSubmit}
                >
                  Save
                </Button>
              </Box>
            </chakra.form>
          </GridItem>
        </SimpleGrid>
      </Box>

      <Divider
        my="5"
        borderColor="gray.300"
        _dark={{
          borderColor: 'whiteAlpha.300',
        }}
        visibility={{
          base: 'hidden',
          sm: 'visible',
        }}
      />
    </Box>
  );
}

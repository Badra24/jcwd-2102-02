import {
  Box,
  Flex,
  Text,
  chakra,
  Button,
  Icon,
  VisuallyHidden,
  useDisclosure,
  Menu,
  MenuItem,
  useToast,
  Textarea,
  ModalBody,
  FormLabel,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Input,
  Stack,
  FormControl,
  ModalOverlay,
  Modal,
  Image,
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { axiosInstance } from '../../../../lib/api';
import { useFormik } from 'formik';
import { FiEdit } from 'react-icons/fi';
import qs from 'qs';

export default function UpdateTabel(props) {
  const { idUp, upName, upPrice, upCode, upImage } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const autoReducer = useSelector((state) => state.renderReducer);
  const dispatch = useDispatch();
  const inputFileRef = useRef(null);
  const userSelector = useSelector((state) => state.authReducer);
  const toast = useToast();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const formik = useFormik({
    initialValues: {
      name: upName,
      code: upCode,
      price: upPrice,
      id: userSelector.id,
    },

    validateOnChange: false,
    onSubmit: async () => {
      const formData = new FormData();
      const { name, code, price } = formik.values;

      formData.append('name', name);
      formData.append('code', code);
      formData.append('price', price);
      formData.append('user_id', userSelector.id);
      formData.append('img_product', selectedFile);

      try {
        await axiosInstance
          .patch(`/product/update/ ${idUp} `, formData)
          .then(() => {
            dispatch({
              type: 'FETCH_DATA',
              payload: {
                value: !autoReducer.value,
              },
            });

            toast({
              title: `Sucess`,
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
    <>
      <Button
        focusBorderColor="black"
        color="#00A8B5"
        ml="10px"
        onClick={onOpen}
      >
        <Icon as={FiEdit} />
      </Button>
      <Menu>
        <MenuItem>
          <Text fontWeight="semibold"></Text>
        </MenuItem>
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay
            bg="blackAlpha.300"
            backdropFilter="blur(10px) hue-rotate(90deg)"
          />

          <ModalContent>
            <ModalHeader>Update Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Box display="flex" flexWrap="wrap" justifyContent="space-evenly">
                <Box maxW="400px" maxH="350px" objectFit="fill">
                  <Image
                    src={`${upImage}`}
                    w="400px"
                    h="350px"
                    objectFit="cover"
                    rounded={5}
                  />
                </Box>

                <Box mt="10px">
                  <FormControl>
                    <FormLabel>name {formik.values.name}</FormLabel>

                    <Textarea
                      placeholder="name"
                      maxLength="2000"
                      w="400px"
                      h="150px"
                      onChange={(e) => {
                        formik.setFieldValue('name', e.target.value);
                      }}
                      defaultValue={upName}
                    />
                  </FormControl>

                  <FormControl mt="10px">
                    <FormLabel>code {formik.values.code}</FormLabel>
                    <Input
                      placeholder="code"
                      maxLength="2000"
                      w="400px"
                      onChange={(e) => {
                        formik.setFieldValue('code', e.target.value);
                      }}
                      defaultValue={upCode}
                    />
                  </FormControl>

                  <FormControl mt="10px">
                    <FormLabel>price{formik.values.price}</FormLabel>
                    <Input
                      placeholder="price"
                      maxLength="2000"
                      w="400px"
                      onChange={(e) => {
                        formik.setFieldValue('price', e.target.value);
                      }}
                      defaultValue={upPrice}
                    />
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
                  <Box mt={'17px'} justifyContent="flex-end">
                    <Button
                      mr={3}
                      colorScheme="twitter"
                      onClick={() => {
                        async function submit() {
                          await formik.handleSubmit();
                          onClose();
                        }
                        submit();
                      }}
                    >
                      Update product
                    </Button>
                  </Box>
                </Box>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Menu>
    </>
  );
}

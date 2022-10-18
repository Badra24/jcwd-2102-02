import {
    Box, Flex, Text, Divider, Button, Icon, Tooltip, useDisclosure, ModalFooter
    , useToast, Modal, ModalBody, ModalOverlay, ModalContent, ModalHeader,
    ModalCloseButton, Input, Stack, FormControl, FormHelperText, Link
  } from "@chakra-ui/react";
  import { useState, useEffect } from 'react';
  import { FaTrashAlt, FaEdit } from "react-icons/fa";
  import { IoCloseSharp } from "react-icons/io5";
  import { IoIosSave } from "react-icons/io";
  import moment from 'moment';
  import { useDispatch, useSelector } from 'react-redux';
  import { axiosInstance } from "../../../../lib/api";
  import { useFormik } from "formik";
  import qs from 'qs';
  import * as Yup from "yup";
  
  export default function deletTabel(props) {
    
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const { tbname, tbcode, tbimg_url, tbprice, tbUserId, tbId,tbDate  } = props
    const userSelector = useSelector((state) => state.auth)
    const autoReducer = useSelector((state) => state.renderReducer)

    const toast = useToast();
    const [editInput, setEditInput] = useState(false)
  
    // -------------------- Delete Comment Post -------------------- //
    async function deleteProduct() {
      try {
       
        await axiosInstance.delete("/product/delete" + tbId)
        dispatch({
          type: 'FETCH_DATA',
          payload: {
            value: !autoReducer.value,
          },
        });
        toast({
          title: "Succes",
          description: "Succes deleting product",
          status: "success",
          isClosable: true,
        })
      } catch (err) {
        console.log(err);
      }
    }
    // -------------------- Edit Comment Post -------------------- //
    const formik = useFormik({
      initialValues: {
        name:'',
        code :'',
        price:'',
        id: userSelector.id,
 
      },
      
      validateOnChange: false,
      onSubmit: async () => {
        const formData = new FormData()
        const { name, code , price } = formik.values

        formData.append("name", name)
        formData.append("code", code)
        formData.append("price", price)
        formData.append("user_id", userSelector.id)
        formData.append("img_product", selectedFile)

        try {
         let body = {
            name,
            price,
            code,
            img_product,
         }
          await axiosInstance.patch("/product/update" + tbId, qs.stringify(body)).then(() => {
            setEditInput(false)
            
            toast({
              title: `product has been edit`,
              status: "success",
              isClosable: true,
            })
          })
        } catch (err) {
          console.log(err);
        }
      }
    })
  
    return (
      <>
        <Divider />
        <Box display='flex' justifyContent='space-between'>
          
          <Box mt='5px'>
           
            <Modal isOpen={isOpenDelete} onClose={onCloseDelete} size='xs'>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Delete Comment</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Box justifyContent={'space-between'}>
                    <Text>Are you sure want to delete this comment?</Text>
                  </Box>
                </ModalBody>
                <ModalFooter pt='5px'>
                  <Button colorScheme='blue' mr={3} onClick={onCloseDelete}>
                    Close
                  </Button>
                  <Button mr={3} colorScheme='red' onClick={() => {
                    async function submit() {
                      await deleteProduct();
                      onCloseDelete();
                    }
                    submit()
                  }}>
                    Delete
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </Box>
      </>
    );
  };
  
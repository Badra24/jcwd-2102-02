import { Flex, Spinner, Button, Text, Link, Icon, Box, Center } from '@chakra-ui/react'
import { axiosInstance } from "../../lib/api"
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from "react";
import { AiOutlineHome } from "react-icons/ai";
import Image from 'next/image'
import invalidToken from '../../assets/imgs/invalid.gif'
import ForgetPassForm from "../../Component/User/Authentication/ForgetPassForm"
import Page from "../../Component/User/Authentication/Tag"

export default function changePass() {
  const [verified, setVerified] = useState(false)
  const router = useRouter()
  const { restoken } = router.query
  const url = "https://jcwd210202.purwadhikabootcamp.com/://localhost:3000" + router.pathname; 



  useEffect(() => {
    async function checkToken() {
      // console.log(restoken);
      const res = await axiosInstance.post("/users/resetPass/" + restoken)
      console.log(res);
      if (res.data) {
        const success = res.data.success
        console.log(success)
        setVerified(success)
      }
    }
 checkToken() 
  }, [router.isReady])


  return (
    <>
      <Page title={"Reset Password"} description={"Reset password form"}
        url={url} type="website">
        <Flex minH={'80vh'} minW='480px' justifyContent={'center'} padding={'30px'}>
          {router.isReady? 
            <>
              {verified ? <ForgetPassForm /> :
                <Box align="center">
                  <Image src={invalidToken} width='460px' height='460px' />
                  <Text fontSize='5xl'>Invalid Token</Text>
                  <Link href='/' style={{ textDecoration: "none" }}>
                    <Button colorScheme='green' href='/home'> <Icon boxSize='6' as={AiOutlineHome} mr='5px' />
                      <Text >Back To Home</Text> </Button>
                  </Link>
                </Box>}
            </>
            :
            <>
              < Spinner thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl' /> &nbsp; loading...
            </>
          }
        </Flex>
      </Page>
    </>
  )
}
import { Box, Flex } from '@chakra-ui/react';
import SideBar from '../../Component/Admin/sidebar/sidebar';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SalesReport from '../../Component/Admin/report/salesReport';
import ProductHistory from '../../Component/Admin/product/product_history/productHistory';
import SortProduct from '../../Component/Admin/product/sortProduct/sortDashboard';
import AdminNavBar from '../../Component/Admin/adminNavbar/AdminNavBar';
export default function dashboard() {
  const router = useRouter();
  const userSelector = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (userSelector?.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/');
    }
  }, [userSelector?.role === 'admin']);

  return (
    <>
      <AdminNavBar />
      <Flex bgGradient="linear(to-tr, #ffffff 50%, #ffffff  )">
        <SideBar />
        <Box>
          <Flex flexWrap={'wrap'} p="30px">
            <SortProduct />
          </Flex>
          <Flex mt={8}>
            <SalesReport />
            <ProductHistory />
          </Flex>
        </Box>
      </Flex>
    </>
  );
}

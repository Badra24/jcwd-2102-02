import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Icon,
  Switch,
  Checkbox,
  Box,
  Image,
  Button,
  TabsDescendantsProvider,
  Flex,
} from '@chakra-ui/react';
import { FaSort } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import UpdateTabel from './updateTabel';
import { axiosInstance } from '../../../../lib/api';
import DeletProduct from '../DeleteProduct';
import UpdateStock from '../stock/updateStock/updateStock';
import ProductCat from '../product_category/product_category';
import UpdateCategory from './../category/UpdateCat2';
import DeletStock from '../stock/deletStock/deletStock';
import ConverterStock from '../../unit/unitConverter/unitConverter';
import moment from 'moment';
import { PagingList } from '../../../PagingList';

export default function productTabel(props) {
  const [product, setProduct] = useState([0]);
  const filter = useSelector((state) => state.filterReducer);
  const autoReducer = useSelector((state) => state.renderReducer);
  const [stateProduct, setStateProduct] = useState(0);

  async function getProduct() {
    await axiosInstance
      .get('/product', {
        params: filter,
      })
      .then((res) => {
        const data = res.data.result.products;
        setProduct([...data]);

        setStateProduct({
          totalProduct: res.data.totalProduct,
          offset: res.data.result.offset,
        });
        console.log(res.data.result.products);
      });
  }

  useEffect(() => {
    getProduct();
  }, [filter, autoReducer.value]);
  return (
    <>
      <TableContainer rounded={'lg'}>
        <Table variant="simple">
          <TableCaption>Product List </TableCaption>
          <Thead>
            <Tr bg={'#E1E1F7'}>
              <Th>
                <Checkbox></Checkbox>
              </Th>
              <Th>
                ID
                <Icon as={FaSort} />
              </Th>
              <Th>
                Date
                <Icon as={FaSort} />
              </Th>
              <Th>
                Product name
                <Icon as={FaSort} />
              </Th>
              <Th>
                Product code
                <Icon as={FaSort} />
              </Th>
              <Th isNumeric>
                product Image
                <Icon as={FaSort} />
              </Th>
              <Th isNumeric>
                product Price
                <Icon as={FaSort} />
              </Th>
              <Th isNumeric>
                capital price
                <Icon as={FaSort} />
              </Th>
              <Th isNumeric>
                profit
                <Icon as={FaSort} />
              </Th>
              <Th isNumeric>
                selling price
                <Icon as={FaSort} />
              </Th>
              <Th isNumeric>
                sold_qty
                <Icon as={FaSort} />
              </Th>
              <Th isNumeric>
                Primary Stock
                <Icon as={FaSort} />
              </Th>
              <Th isNumeric>
                Primary Unit
                <Icon as={FaSort} />
              </Th>
              <Th isNumeric>
                Secondary Stock
                <Icon as={FaSort} />
              </Th>
              <Th isNumeric>
                Secondary Stock
                <Icon as={FaSort} />
              </Th>
              <Th isNumeric>
                Unit Convertion
                <Icon as={FaSort} />
              </Th>
              <Th isNumeric>
                Categories
                <Icon as={FaSort} />
              </Th>
              <Th>Status</Th>
              <Th>Converter unit</Th>
              <Th>Update product</Th>
              <Th>Update product categories</Th>
              <Th>Update Stock</Th>
              <Th>Delet Stock</Th>
              <Th>Delete Product</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* <Tr>
                <Td>
                {renderProductList()}

                </Td>
              </Tr> */}
            {product?.map((product, index) => (
              <Tr key={product.id}>
                <Td>
                  <Checkbox></Checkbox>
                </Td>
                <Td>{product.id}</Td>
                <Td>{moment(product.createdAt).format('YYYY-MM-DD')}</Td>
                <Td>{product.name}</Td>
                <Td>{product.code} </Td>
                <Td>
                  <Image
                    src={`${product.img_product}`}
                    w="90px"
                    h="90px"
                    objectFit="cover"
                    rounded={5}
                  />
                </Td>
                <Td>Rp.{product.price?.toLocaleString('id-ID')}</Td>
                <Td>
                  RP.
                  {product.Product_Stock?.capital_price?.toLocaleString(
                    'id-ID',
                  )}
                </Td>
                <Td>
                  RP.{product.Product_Stock?.profit?.toLocaleString('id-ID')}
                </Td>
                <Td>
                  Rp.
                  {product.Product_Stock?.selling_price?.toLocaleString(
                    'id-ID',
                  )}
                </Td>
                <Td>
                  {product.Product_Stock?.sold_qty?.toLocaleString('id-ID')}
                </Td>
                <Td>
                  {product.Product_Stock?.primary_stock?.toLocaleString(
                    'id-ID',
                  )}
                </Td>
                <Td>
                  {product.Product_Stock?.primary_unit?.toLocaleString('id-ID')}
                </Td>
                <Td>
                  {product.Product_Stock?.secondary_stock?.toLocaleString(
                    'id-ID',
                  )}
                </Td>
                <Td>
                  {product.Product_Stock?.secondary_unit?.toLocaleString(
                    'id-ID',
                  )}
                </Td>
                <Td>
                  {product.Product_Stock?.unit_convertion?.toLocaleString(
                    'id-ID',
                  )}
                </Td>

                <Td>
                  {' '}
                  {product.Categories?.map((val, index) =>
                    index == product.Categories.length - 1 ? (
                      <Button>
                        <UpdateCategory idCat={val.id} tbCat={val.category} />
                      </Button>
                    ) : (
                      <Button justifyContent={'center'}>
                        <UpdateCategory idCat={val.id} tbCat={val.category} />
                      </Button>
                    ),
                  )}
                </Td>

                <Td>
                  <Switch colorScheme="teal" size="md" />
                </Td>
                <Td>
                  <ConverterStock
                    idConvert={product.Product_Stock?.id}
                    conPrimary={product.Product_Stock?.primary_stock}
                    conSecondary={product.Product_Stock?.secondary_stock}
                  />
                </Td>
                <Td>
                  <UpdateTabel
                    idUp={product.id}
                    upName={product.name}
                    upCode={product.code}
                    upPrice={product.price?.toLocaleString('id-ID')}
                    upImage={product.img_product}
                  />
                </Td>
                <Td>
                  <Button>
                    <ProductCat
                      // idProCat={val.id}
                      // idCetPro={val.id_categpory}
                      idPro={product.id}
                      catlist={product.Categories}
                    />
                  </Button>
                </Td>
                <Td>
                  <UpdateStock
                    idUpStock={product.Product_Stock?.id}
                    upCapital={product.Product_Stock?.capital_price}
                    upProfit={product.Product_Stock?.profit}
                    upSold_qty={product.Product_Stock?.sold_qty}
                    upStock={product.Product_Stock?.primary_stock}
                    upSelling={product.Product_Stock?.selling_price}
                    upStockunit={product.Product_Stock?.primary_unit}
                  />
                </Td>
                <Td>
                  <DeletStock idDElstock={product.Product_Stock?.id} />
                </Td>
                <Td>
                  <DeletProduct idDEl={product.id} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex justify="center">
        <PagingList
          totalItem={stateProduct.totalProduct}
          offset={stateProduct.offset}
        />
      </Flex>
    </>
  );
}

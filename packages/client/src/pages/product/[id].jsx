import React from 'react';

import HeadPage from '../../Layout/Head';
import { BreadCrumb } from '../../Component/BreadCrumb';
import { Layout } from '../../Layout';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { ProductDetailContainer } from '../../Component/User/Product/DetailContainer';

const ProductDetail = ({ val }) => {
  const router = useRouter();
  const url = `https://jcwd210202.purwadhikabootcamp.com${router.pathname}`;
  const filter = useSelector((state) => state.filterReducer);
  console.log(val);

  return (
    <Layout>
      <HeadPage
        title={`Medicure || ${val.name}`}
        //   description={dataPost?.caption}
        image={val.Product?.img_product}
        url={url}
        type="website"
      />
      <BreadCrumb
        data={
          filter.category
            ? [
                ['#', 'Homepage'],
                ['#', filter.category],
                ['#', val.name],
              ]
            : [
                ['#', 'Homepage'],
                ['#', val.name],
              ]
        }
      />
      <ProductDetailContainer val={val} />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  const res = await axios.get(
    `https://jcwd210202api.purwadhikabootcamp.com/api/v1/product/${id}/description`,
    // `http://localhost:3333/api/v1/product/${id}/description`,
  );
  // const res = await axios.get(
  //   `/api/v1/product/${id}/description`,
  // );

  return {
    props: {
      val: res.data.result,
    },
  };
}

export default ProductDetail;

import fs from 'fs/promises';
import path from 'path';
import React from 'react';
import { Fragment } from 'react/cjs/react.production.min';

const ProductDetail = (props) => {
  if (!props.product) {
    return <p>Loading...</p>;
  }
  return (
    <Fragment>
      <h1>{props.product.title}</h1>
      <p>{props.product.description}</p>
    </Fragment>
  );
};

const getData = async () => {
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  return data;
};

export const getStaticProps = async (context) => {
  const { params } = context;
  const productId = params.id;
  const data = await getData();

  const product = data.products.find((product) => product.id === productId);
  console.log(product);

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: product,
    },
  };
};

export const getStaticPaths = async () => {
  const data = await getData();

  const ids = data.products.map((product) => product.id);
  const pathsWithParams = ids.map((id) => ({ params: { id: id } }));

  return {
    paths: pathsWithParams,
    fallback: true,

    // If fallback false, all pages needs to be pre generated
    // If fallback true, loading state needs to be handled
    // If fallback 'blocking', page waits for its content
  };
};

export default ProductDetail;

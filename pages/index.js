import fs from 'fs/promises';
import Link from 'next/link';
import path from 'path';

function HomePage(props) {
  return (
    <ul>
      {props.products.map((product) => {
        return (
          <li key={product.id}>
            <Link href={`/products/${product.id}`}>{product.title}</Link>
          </li>
        );
      })}
    </ul>
  );
}

export const getStaticProps = async (context) => {
  console.log('regenerating');
  console.log(context);
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  if (!data) {
    return {
      redirect: {
        destination: '/no-data',
      },
    };
  }

  if (data.products.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      products: data.products,
    },
    revalidate: 100,
  };
};

export default HomePage;

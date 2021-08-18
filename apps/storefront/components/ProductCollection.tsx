import React, { useState } from 'react';
import Link from 'next/link';
import {
  useProductsQuery,
} from '../generated/graphql';

function Products() {
  const [before, setBefore] = useState('');
  const [after, setAfter] = useState('');
  const { loading, error, data } = useProductsQuery({
    variables: { after, before }
  });
  // const { loading, error, data } = useFilterProductsQuery({
  //   variables: {
  //     filter: { search: 'T-Shirt' },
  //     sortBy: {
  //       field: ProductOrderField.Name,
  //       direction: OrderDirection.Desc
  //     }
  //   }
  // });

  // const { loading, error, data } = useProductByIdQuery({ variables: { id: 'UHJvZHVjdDoxMTE=' } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  if (data) {
    const latestProducts = data.products?.edges || [];

    return (
      <div>
        <ul role="list" className="grid gap-4 grid-cols-4">
          {latestProducts?.length > 0 &&
            latestProducts.map(
              ({ node: { id, name, thumbnail, category, variants = [], pricing } }) => (
                <li key={id} className="relative bg-white">
                  <Link href={`/products/${id}`}>
                    <a>
                      <img src={thumbnail?.url} alt="" />
                      <div className="p-2 border-gray-100 border-t">
                        <p className="block text-lg text-gray-900 truncate">{name}</p>
                        <p className="block text-sm font-medium text-gray-500">{category?.name}</p>
                      </div>
                      <div className="p-2 border-gray-100 border-t">
                        Variants: {variants?.map(variant => `${variant?.name} `)}
                      </div>
                      <div className="p-2 border-gray-100 border-t">
                        Prices: {pricing?.priceRange?.start?.gross.amount} - {pricing?.priceRange?.stop?.gross.amount}
                      </div>
                    </a>
                  </Link>
                </li>
              ),
            )}
        </ul>
        <a href="#" onClick={() => setBefore(latestProducts[0].cursor || '')}>Prev</a>
        <a href="#" onClick={() => setAfter(latestProducts[latestProducts.length - 1].cursor || '')}>Next</a>
      </div>
    );
  }

  return null;
}

export default Products;

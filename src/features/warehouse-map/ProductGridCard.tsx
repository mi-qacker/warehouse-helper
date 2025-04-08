import {Product} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import React, {useMemo} from 'react';

export const ProductGridCard = ({product}: {product: Product}) => {
  const products = useWarehouseStore(store => store.products);

  const incompatibleWith = useMemo(() => {
    return products
      .filter(({id}) => product.incompatibleWith.includes(id))
      .map(({id, name}) => {
        const title = `${name}: ${id}`;
        return (
          <li key={id} title={title} className="text-sm">
            {name}
          </li>
        );
      });
  }, [product.incompatibleWith, products]);

  return (
    <div key={product.id} className="flex flex-col rounded-sm border p-2">
      <div className="text-sm font-semibold">{product.name}</div>
      <span className="text-sm">{product.volume} м³</span>
      <span className="text-sm">{product.storageCondition}</span>

      {incompatibleWith.length > 0 && (
        <>
          <span className="text-sm">Несовместим с:</span>
          <ul className="list-inside list-disc">{incompatibleWith}</ul>
        </>
      )}

      <span className="text-xs text-nowrap text-gray-500" title={product.id}>
        ID: {product.id.slice(0, 8)}
      </span>
    </div>
  );
};

'use client';

import {useWarehouseStore} from '@/storages/warehouse-storage';
import {useShallow} from 'zustand/shallow';

export function WarehouseMap() {
  const {products, cells} = useWarehouseStore(
    useShallow(({products, cells}) => ({products, cells}))
  );

  return (
    <div>
      <div>{JSON.stringify(products, null, 2)}</div>
      <div>{JSON.stringify(cells, null, 2)}</div>
    </div>
  );
}

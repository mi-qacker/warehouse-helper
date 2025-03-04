'use client';

import {useWarehouseStore} from '@/storages/warehouse-storage';

export function WarehouseMap() {
  const params = useWarehouseStore(state => state.warehouse);

  return <div>warehouse: {JSON.stringify(params, null, 2)}</div>;
}

'use client';

import {useWarehouseStore} from '@/storages/warehouse-storage';
import {useShallow} from 'zustand/shallow';

export function WarehouseMap() {
  const params = useWarehouseStore(
    useShallow(state => ({
      warehouse: state.warehouse,
      shelving: state.shelving,
      cargo: state.cargo,
    }))
  );

  return (
    <>
      <div>warehouse: {JSON.stringify(params.warehouse, null, 2)}</div>
      <div>shelving: {JSON.stringify(params.shelving, null, 2)}</div>
      <div>cargo: {JSON.stringify(params.cargo, null, 2)}</div>
    </>
  );
}

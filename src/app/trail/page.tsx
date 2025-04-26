'use client';

import {BeakerIcon} from '@heroicons/react/24/solid';
import Button from '@/ui/Button';
import {solveOptimizationRoute} from '@/modules/genetic-algorithm';
import {useCallback} from 'react';
import {useWarehouseStore} from '@/storages/warehouse-storage';

export default function TrailPage() {
  const placement = useWarehouseStore(store => store.placement);
  const cells = useWarehouseStore(store => store.cells);

  const onClickButton = useCallback(() => {
    if (!placement) {
      alert('No placement'); // FIXME: show error in UI
      return;
    }
    const cellIDs = Object.keys(placement);
    const cellsForRoute = cells.filter(cell => cellIDs.includes(cell.id));
    solveOptimizationRoute(cellsForRoute, {x: 0, y: 0}); // FIXME: startPoint add in WAREHOUSEHELPER-10
  }, [placement, cells]);
  return (
    <main className="mx-auto w-full max-w-7xl">
      <h1 className="my-2 text-3xl font-bold">Trail page</h1>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-3xl text-gray-600">Work in progress</span>
          <BeakerIcon className="size-12 text-emerald-600" />
          <Button onClick={onClickButton}>Solve Route</Button>
        </div>
      </div>
    </main>
  );
}

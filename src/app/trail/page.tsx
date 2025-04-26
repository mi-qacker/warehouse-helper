'use client';

import {solveOptimizationRoute} from '@/modules/genetic-algorithm';
import {Cell} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/Button';
import {useCallback, useState} from 'react';

export default function TrailPage() {
  const placement = useWarehouseStore(store => store.placement);
  const cells = useWarehouseStore(store => store.cells);

  const [distance, setDistance] = useState<null | number>(null);
  const [route, setRoute] = useState<Cell[] | null>(null);

  const onClickButton = useCallback(async () => {
    if (!placement) {
      alert('No placement'); // FIXME: show error in UI
      return;
    }
    const cellIDs = Object.keys(placement);
    const cellsForRoute = cells.filter(cell => cellIDs.includes(cell.id));
    const solution = await solveOptimizationRoute(cellsForRoute, {x: 0, y: 0}); // FIXME: startPoint add in WAREHOUSEHELPER-10
    setDistance(solution.distance);
    setRoute(solution.route);
  }, [placement, cells]);

  const renderDistance = () => {
    if (distance === null) return null;
    return <div>Distance: {distance.toFixed(2)} meters</div>;
  };

  const renderRoute = () => {
    if (route === null) return null;
    return (
      <div className="flex flex-row gap-4">
        {route.map(cell => (
          <div
            key={cell.id}
            className="flex flex-col gap-0.5 rounded-sm border p-2"
          >
            <span className="text-sm font-semibold">{cell.name}</span>
            <span className="text-xs text-gray-500">{cell.id}</span>
            <span className="text-sm">
              ({cell.position.x}, {cell.position.y})
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="mx-auto w-full max-w-7xl">
      <h1 className="my-2 text-3xl font-bold">Trail page</h1>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col items-center gap-4">
          <Button onClick={onClickButton}>Solve Route</Button>
          {renderDistance()}
          {renderRoute()}
        </div>
      </div>
    </main>
  );
}

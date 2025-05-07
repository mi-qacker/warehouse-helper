'use client';

import {solveOptimizationRoute} from '@/modules/genetic-algorithm';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/common/Button';
import Link from 'next/link';
import {useCallback, useMemo} from 'react';

export default function TrailPage() {
  const {warehouse, placement, cells, setRoute} = useWarehouseStore();

  const buttonDisabled = useMemo(() => placement === null, [placement]);

  const onClickButton = useCallback(async () => {
    if (!placement) {
      return;
    }
    const cellIDs = Object.keys(placement);
    const cellsForRoute = cells.filter(cell => cellIDs.includes(cell.id));
    const solution = await solveOptimizationRoute(
      cellsForRoute,
      warehouse.inputPoint,
      warehouse.outputPoint
    );
    setRoute(solution.route, solution.distance);
  }, [placement, cells, warehouse.inputPoint, warehouse.outputPoint, setRoute]);

  return (
    <main className="mx-auto w-full max-w-7xl">
      <h1 className="my-2 text-3xl font-bold">Trail page</h1>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col items-center gap-4">
          <Button onClick={onClickButton} disabled={buttonDisabled}>
            Solve Route
          </Button>
          {placement === null ? (
            <div>
              No placement info.
              <Link
                href="/placement"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Get optimized placement!
              </Link>
            </div>
          ) : (
            <RouteViewComponent />
          )}
        </div>
      </div>
    </main>
  );
}

function RouteViewComponent() {
  const route = useWarehouseStore(store => store.route);
  const distance = useWarehouseStore(store => store.distance);

  if (route === null || distance === null) {
    return <div>Build route by button</div>;
  }
  return (
    <div>
      <div className="flex w-full flex-row gap-2">
        {route.map(point => (
          <div key={point.id} className="grow rounded-sm border p-2 text-sm">
            <div className="font-semibold">{point.name}</div>
            <div className="text-xs text-gray-500">{point.id}</div>
            <div>({point.loadingPoint.geometry.coordinates.join(', ')})</div>
          </div>
        ))}
      </div>
      <div>Distance: {distance.toFixed(2)} meters</div>
      <div>
        <Link
          className="text-blue-600 hover:text-blue-800 hover:underline"
          href="/map"
        >
          Show on Map
        </Link>
      </div>
    </div>
  );
}

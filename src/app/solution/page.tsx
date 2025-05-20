'use client';

import {useWarehouseStore} from '@/storages/warehouse-storage';
import {Button} from '@headlessui/react';
import {CheckIcon, ClockIcon} from '@heroicons/react/20/solid';
import {useCallback, useState} from 'react';
import {
  ApiRequest as GenericRouteRequest,
  ApiResponse as GenericRouteResponse,
} from '../api/generic-route';
import {
  ApiRequest as PlacementRequest,
  ApiResponse as PlacementResponse,
} from '../api/placement';

enum FETCH_STATUS {
  IDLE,
  PROGRESS,
  SUCCESS,
}

export default function SolutionPage() {
  const {products, cells, warehouse, graph, setPlacement, setRoute} =
    useWarehouseStore();

  const [showProgress, setShowProgress] = useState(false);
  const [placementStatus, setPlacementStatus] = useState(FETCH_STATUS.IDLE);
  const [routeStatus, setRouteStatus] = useState(FETCH_STATUS.IDLE);

  const onStartOptimization = useCallback(() => {
    const body: PlacementRequest = {
      products,
      cells,
      startPosition: warehouse.inputPoint,
    };

    fetch('/api/distance-matrix', {
      method: 'POST',
      body: JSON.stringify({warehouse, cells, graph}),
    });

    setPlacementStatus(FETCH_STATUS.PROGRESS);
    setShowProgress(true);
    fetch('/api/placement', {
      method: 'POST',
      body: JSON.stringify(body),
    })
      .then(async res => {
        const {placement}: PlacementResponse = await res.json();
        setPlacementStatus(FETCH_STATUS.SUCCESS);
        setPlacement(placement);

        const cellIDs = Object.keys(placement);
        const cellsForRoute = cells.filter(cell => cellIDs.includes(cell.id));

        const body: GenericRouteRequest = {
          cells: cellsForRoute,
          inputPoint: warehouse.inputPoint,
          outputPoint: warehouse.outputPoint,
        };
        setRouteStatus(FETCH_STATUS.PROGRESS);
        return fetch('/api/generic-route', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      })
      .then(async res => {
        const {route, distance}: GenericRouteResponse = await res.json();
        setRouteStatus(FETCH_STATUS.SUCCESS);

        setRoute(route, distance);
      });
  }, [
    cells,
    products,
    setPlacement,
    setRoute,
    warehouse.inputPoint,
    warehouse.outputPoint,
  ]);

  return (
    <main className="container mx-auto">
      <h1 className="my-4 text-2xl font-bold">Solution</h1>

      <p className="text-base">
        Click on the button to start the process of optimizing warehouse
        operations. Optimization will be carried out in several stages:
      </p>
      <ul className="list-inside list-decimal underline">
        <li>Formation of the warehouse graph.</li>
        <li>The arrangement of products in cells.</li>
        <li>
          Building an optimal route, taking into account the placement of goods.
        </li>
      </ul>

      <div className="my-2 flex flex-row justify-center">
        <Button
          className="cursor-pointer rounded-md bg-blue-800 px-4 py-2 text-white shadow-md hover:bg-blue-600"
          onClick={onStartOptimization}
        >
          Start Optimization
        </Button>
      </div>
      {showProgress && (
        <div>
          <ul className="list-inside list-decimal">
            <li className="flex flex-row items-center gap-2">
              <span>Placement</span>
              <span>
                <StatusView status={placementStatus} />
              </span>
            </li>
            <li className="flex flex-row items-center gap-2">
              <span>Route path</span>
              <span>
                <StatusView status={routeStatus} />
              </span>
            </li>
          </ul>
        </div>
      )}
    </main>
  );
}

function StatusView(props: {status: FETCH_STATUS}) {
  if (props.status === FETCH_STATUS.SUCCESS) {
    return <CheckIcon className="size-4" />;
  }

  if (props.status === FETCH_STATUS.PROGRESS) {
    return <ClockIcon className="size-4" />;
  }
  return null;
}

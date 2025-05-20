'use client';

import {useWarehouseStore} from '@/storages/warehouse-storage';
import {Button} from '@headlessui/react';
import {CheckIcon, ClockIcon} from '@heroicons/react/20/solid';
import {useCallback, useState} from 'react';
import {
  ApiRequest as GenericRouteRequest,
  ApiResponse as GenericRouteResponse,
} from '@/app/api/generic-route';
import {
  ApiRequest as PlacementRequest,
  ApiResponse as PlacementResponse,
} from '@/app/api/placement';
import {
  ApiRequest as DistanceMatrixRequest,
  ApiResponse as DistanceMatrixResponse,
} from '@/app/api/distance-matrix';

enum FETCH_STATUS {
  IDLE,
  PROGRESS,
  SUCCESS,
}

export default function SolutionPage() {
  const {products, cells, warehouse, graph, setPlacement, setRoute} =
    useWarehouseStore();

  const [showProgress, setShowProgress] = useState(false);
  const [distanceMatrixStatus, setDistanceMatrixStatus] = useState(
    FETCH_STATUS.IDLE
  );
  const [placementStatus, setPlacementStatus] = useState(FETCH_STATUS.IDLE);
  const [routeStatus, setRouteStatus] = useState(FETCH_STATUS.IDLE);

  const onStartOptimization = useCallback(async () => {
    setDistanceMatrixStatus(FETCH_STATUS.PROGRESS);
    const distanceMatrix: DistanceMatrixResponse = await fetch(
      '/api/distance-matrix',
      {
        method: 'POST',
        body: JSON.stringify({
          warehouse,
          cells,
          graph,
        } as DistanceMatrixRequest),
      }
    ).then(res => res.json());
    setDistanceMatrixStatus(FETCH_STATUS.SUCCESS);

    setPlacementStatus(FETCH_STATUS.PROGRESS);
    setShowProgress(true);
    const placement: PlacementResponse = await fetch('/api/placement', {
      method: 'POST',
      body: JSON.stringify({
        products,
        cells,
        startPosition: warehouse.inputPoint,
        distanceMatrix: distanceMatrix.distanceMatrixPoints,
      } as PlacementRequest),
    }).then(res => res.json());
    setPlacementStatus(FETCH_STATUS.SUCCESS);
    setPlacement(placement.placement);

    const cellIDs = Object.keys(placement.placement);
    const cellsForRoute = cells.filter(cell => cellIDs.includes(cell.id));

    setRouteStatus(FETCH_STATUS.PROGRESS);
    const generic: GenericRouteResponse = await fetch('/api/generic-route', {
      method: 'POST',
      body: JSON.stringify({
        cells: cellsForRoute,
        inputPoint: warehouse.inputPoint,
        outputPoint: warehouse.outputPoint,
        distanceMatrix: {
          ...distanceMatrix.distanceMatrixPoints,
          ...distanceMatrix.distanceMatrixCells,
        },
      } as GenericRouteRequest),
    }).then(res => res.json());
    setRouteStatus(FETCH_STATUS.SUCCESS);
    setRoute(generic.route, generic.distance);
  }, [cells, graph, products, setPlacement, setRoute, warehouse]);

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
              <span>Distance matrix</span>
              <span>
                <StatusView status={distanceMatrixStatus} />
              </span>
            </li>
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

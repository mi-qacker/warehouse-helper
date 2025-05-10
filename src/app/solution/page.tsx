'use client';

import {Button} from '@headlessui/react';
import {useCallback, useState} from 'react';
import {ApiRequest, ApiResponse} from '../api/placement';
import {useWarehouseStore} from '@/storages/warehouse-storage';

enum FETCH_STATUS {
  IDLE,
  PROGRESS,
  SUCCESS,
}

export default function SolutionPage() {
  const {
    products,
    cells,
    warehouse: {inputPoint},
    setPlacement,
  } = useWarehouseStore();

  const [showProgress, setShowProgress] = useState(false);
  const [placementStatus, setPlacementStatus] = useState(FETCH_STATUS.IDLE);

  const onStartOptimization = useCallback(() => {
    const body: ApiRequest = {products, cells, startPosition: inputPoint};

    setPlacementStatus(FETCH_STATUS.PROGRESS);
    setShowProgress(true);
    fetch('/api/placement', {
      method: 'POST',
      body: JSON.stringify(body),
    }).then(async res => {
      const data: ApiResponse = await res.json();
      setPlacementStatus(FETCH_STATUS.SUCCESS);
      setPlacement(data.placement);
    });
  }, [cells, inputPoint, products, setPlacement]);

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
          <ul className="list-inside list-decimal underline">
            <li>
              <span>Placement</span> <span>{placementStatus}</span>
            </li>
            <li>
              <span>Route path</span>
            </li>
          </ul>
        </div>
      )}
    </main>
  );
}

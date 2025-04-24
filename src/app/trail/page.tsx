'use client'

import {BeakerIcon} from '@heroicons/react/24/solid';
import Button from '@/ui/Button';
import {solveOptimizationRoute} from '@/modules/genetic-algorithm';
import {useCallback} from 'react';

export default function TrailPage() {
  const onClickButton = useCallback(() => {
    solveOptimizationRoute();
  }, []);
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

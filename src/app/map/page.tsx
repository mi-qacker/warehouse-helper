import WarehouseMap from '@/features/warehouse-map/WarehouseMap';
import {Suspense} from 'react';

export default function MapPage() {
  return (
    <main className="overflow-y-auto">
      <Suspense>
        <WarehouseMap />
      </Suspense>
    </main>
  );
}

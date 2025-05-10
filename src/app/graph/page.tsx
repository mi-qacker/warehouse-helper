'use client';

import WarehouseMapSchema from '@/features/warehouse-graph/WarehouseMapSchema';
import WarehouseGraphParams from '@/features/params/graph/GraphParams';

export default function GraphPage() {
  return (
    <main className="container mx-auto">
      <h1 className="my-4 text-2xl font-bold">Warehouse route graph</h1>
      <div>
        <WarehouseGraphParams />
        <WarehouseMapSchema />
      </div>
    </main>
  );
}

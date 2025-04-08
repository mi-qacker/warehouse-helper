'use client';

import {WarehouseMap} from '@/features/warehouse-map/WarehouseMap';
import Params from '@/features/params';

export default function Page() {
  return (
    <div className="flex h-[calc(100vh-64px)] flex-row">
      <aside className="w-1/3 shrink-0">
        <Params />
      </aside>
      <main className="grow overflow-auto">
        <WarehouseMap />
      </main>
    </div>
  );
}

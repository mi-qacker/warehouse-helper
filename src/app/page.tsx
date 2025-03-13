import {WarehouseMap} from '@/features/warehouse-map/WarehouseMap';
import {Params} from '@/features/params/Params';

export default function Page() {
  return (
    <div className="flex grow flex-row">
      <aside className="w-1/4 min-w-min">
        <Params />
      </aside>
      <main className="grow">
        <WarehouseMap />
      </main>
    </div>
  );
}

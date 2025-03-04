import {WarehouseMap} from '@/features/warehouse-map/WarehouseMap';
import {Params} from '@/features/params/Params';

export default function Page() {
  return (
    <div className="flex grow flex-row">
      <aside>
        <Params />
      </aside>
      <main className="grow">
        <WarehouseMap />
      </main>
    </div>
  );
}

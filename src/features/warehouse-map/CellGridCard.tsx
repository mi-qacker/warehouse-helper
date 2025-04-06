import {Cell, ZoneCondition} from '@/storages/types';

const ZONE_COLORS: Record<ZoneCondition, string> = {
  cold: '#e0f2fe',
  dry: '#fef3c7',
  normal: '#f0f0f0',
};

export const CellGridCard = (props: {cell: Cell}) => {
  const {cell} = props;

  return (
    <div
      className="flex min-h-16 flex-col rounded-sm border p-2"
      style={{backgroundColor: ZONE_COLORS[cell.zoneCondition]}}
    >
      <span className="text-sm font-semibold">{cell.name}</span>
      <span className="text-sm">Capacity: {cell.capacity} м³</span>
      <span className="text-sm">{cell.zoneCondition}</span>
      <span className="text-xs text-nowrap text-gray-500" title={cell.id}>
        ID: {cell.id.slice(0, 8)}
      </span>
    </div>
  );
};

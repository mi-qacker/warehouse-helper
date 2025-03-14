'use client';

import {useWarehouseStore} from '@/storages/warehouse-storage';
import {useShallow} from 'zustand/shallow';

export function WarehouseMap() {
  const {warehouse, shelving} = useWarehouseStore(
    useShallow(state => ({
      warehouse: state.warehouse,
      shelving: state.shelving,
    }))
  );

  return (
    <div className="p-4">
      <svg
        viewBox={`0 0 ${warehouse.width} ${warehouse.length}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
      >
        <rect
          key="warehouse"
          x={0}
          y={0}
          width={warehouse.width}
          height={warehouse.length}
          fillOpacity={0}
          stroke="#000000"
          strokeWidth={0.1}
        />

        {shelving.map(shelf => (
          <rect
            key={shelf.id}
            x={shelf.x}
            y={shelf.y}
            width={shelf.width}
            height={shelf.length}
            fill="#4f46e5"
            stroke="#3730a3"
            strokeWidth={0.1}
          />
        ))}
      </svg>
    </div>
  );
}

'use client';

import type {ShelfParams} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import {useMemo, useRef, useState} from 'react';
import {useShallow} from 'zustand/shallow';
import {Position, ShelfTooltip} from './ShelfTooltip';

export function WarehouseMap() {
  const {warehouse, shelving} = useWarehouseStore(
    useShallow(({warehouse, shelving}) => ({warehouse, shelving}))
  );
  const svgRef = useRef<SVGSVGElement>(null);

  const [activeShelfId, setActiveShelfId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<Position>({x: 0, y: 0});

  const activeShelf = useMemo(() => {
    return shelving.find(s => s.id === activeShelfId);
  }, [activeShelfId, shelving]);

  const handleMouseMove = (
    event: React.MouseEvent<SVGElement>,
    shelf: ShelfParams
  ) => {
    if (!svgRef.current) {
      return;
    }

    const svgRect = svgRef.current.getBoundingClientRect();
    setTooltipPos({
      x: event.clientX - svgRect.left,
      y: event.clientY - svgRect.top,
    });
    setActiveShelfId(shelf.id);
  };

  return (
    <div className="relative overflow-hidden p-4 select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${warehouse.width} ${warehouse.length}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
        className="touch-none"
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
          <g
            key={shelf.id}
            onMouseMove={e => handleMouseMove(e, shelf)}
            onMouseLeave={() => setActiveShelfId(null)}
            className="cursor-pointer"
          >
            <rect
              x={shelf.x}
              y={shelf.y}
              width={shelf.width}
              height={shelf.length}
              fill="#4f46e5"
              stroke="#3730a3"
              strokeWidth={0.1}
              className="transition-opacity hover:opacity-80"
            />
          </g>
        ))}
      </svg>

      {activeShelf && (
        <ShelfTooltip shelf={activeShelf} pixelCoordinates={tooltipPos} />
      )}
    </div>
  );
}

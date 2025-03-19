'use client';

import type {CargoParams, ShelfParams} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import {useMemo, useRef, useState} from 'react';
import {useShallow} from 'zustand/shallow';
import {CargoTooltip} from './CargoTooltip';
import {Position, ShelfTooltip} from './ShelfTooltip';

export function WarehouseMap() {
  const {warehouse, shelving, cargo} = useWarehouseStore(
    useShallow(({warehouse, shelving, cargo}) => ({warehouse, shelving, cargo}))
  );
  const svgRef = useRef<SVGSVGElement>(null);

  const [activeShelfId, setActiveShelfId] = useState<string | null>(null);
  const [activeCargoId, setActiveCargoId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<Position>({x: 0, y: 0});

  const activeShelf = useMemo(() => {
    return shelving.find(s => s.id === activeShelfId);
  }, [activeShelfId, shelving]);

  const activeCargo = useMemo(() => {
    return cargo.find(c => c.id === activeCargoId);
  }, [activeCargoId, cargo]);

  // Группировка грузов по стеллажам
  const cargoByShelf = useMemo(() => {
    const result = new Map<string, CargoParams[]>();
    
    cargo.forEach(item => {
      if (item.shelfId) {
        if (!result.has(item.shelfId)) {
          result.set(item.shelfId, []);
        }
        result.get(item.shelfId)?.push(item);
      }
    });
    
    return result;
  }, [cargo]);

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
    setActiveCargoId(null);
  };

  const handleCargoMouseMove = (
    event: React.MouseEvent<SVGElement>,
    cargo: CargoParams
  ) => {
    if (!svgRef.current) {
      return;
    }

    const svgRect = svgRef.current.getBoundingClientRect();
    setTooltipPos({
      x: event.clientX - svgRect.left,
      y: event.clientY - svgRect.top,
    });
    setActiveCargoId(cargo.id);
    setActiveShelfId(null);
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
              fill={cargoByShelf.has(shelf.id) ? "#6366f1" : "#4f46e5"}
              stroke="#3730a3"
              strokeWidth={0.1}
              className="transition-opacity hover:opacity-80"
            />
            
            {/* Отображение количества грузов на стеллаже */}
            {cargoByShelf.has(shelf.id) && (
              <text
                x={shelf.x + shelf.width / 2}
                y={shelf.y + shelf.length / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="0.8"
              >
                {cargoByShelf.get(shelf.id)?.length}
              </text>
            )}
          </g>
        ))}

        {/* Отображение грузов без стеллажа */}
        {cargo
          .filter(item => !item.shelfId)
          .map((item, index) => {
            // Размещаем грузы без стеллажа в нижней части склада
            const row = Math.floor(index / 5);
            const col = index % 5;
            const x = 1 + col * 3;
            const y = warehouse.length - 1 - item.length - row * 3;
            
            return (
              <rect
                key={item.id}
                x={x}
                y={y}
                width={item.width}
                height={item.length}
                fill="#ef4444"
                stroke="#b91c1c"
                strokeWidth={0.1}
                className="transition-opacity hover:opacity-80 cursor-pointer"
                onMouseMove={e => handleCargoMouseMove(e, item)}
                onMouseLeave={() => setActiveCargoId(null)}
              />
            );
          })}
      </svg>

      {activeShelf && !activeCargo && (
        <ShelfTooltip shelf={activeShelf} pixelCoordinates={tooltipPos} />
      )}
      
      {activeCargo && (
        <CargoTooltip cargo={activeCargo} pixelCoordinates={tooltipPos} />
      )}
    </div>
  );
}

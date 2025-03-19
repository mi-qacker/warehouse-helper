import type {ShelfParams} from '@/storages/types';
import {useMemo} from 'react';

const PADDING = 8;

export type Position = {x: number; y: number};

export function ShelfTooltip(props: {
  shelf: ShelfParams;
  pixelCoordinates: Position;
}) {
  const {shelf} = props;

  const left = useMemo(
    () => props.pixelCoordinates.x + PADDING,
    [props.pixelCoordinates.x]
  );
  const top = useMemo(
    () => props.pixelCoordinates.y + PADDING,
    [props.pixelCoordinates.y]
  );

  return (
    <div
      className="pointer-events-none absolute rounded-md border border-gray-200 bg-white p-1 text-sm shadow-lg"
      style={{left, top}}
    >
      <div className="font-medium text-indigo-600">
        Стеллаж #{shelf.id.slice(0, 6)}
      </div>
      <div className="mt-1 grid grid-cols-2 gap-x-1">
        <div>Позиция:</div>
        <div>
          (x: {shelf.x}, y: {shelf.y})
        </div>
        <div>Ширина:</div>
        <div>{shelf.width} м</div>
        <div>Длина:</div>
        <div>{shelf.length} м</div>
        <div>Уровни:</div>
        <div>
          {shelf.levels} ({(shelf.height / shelf.levels).toFixed(2)} м)
        </div>
      </div>
    </div>
  );
}

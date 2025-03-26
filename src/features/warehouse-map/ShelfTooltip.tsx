import type {ShelfParams} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import {useMemo} from 'react';

const PADDING = 8;

export type Position = {x: number; y: number};

export function ShelfTooltip(props: {
  shelf: ShelfParams;
  pixelCoordinates: Position;
}) {
  const {shelf} = props;
  const cargo = useWarehouseStore(state => state.cargo);

  // Фильтрация грузов на этом стеллаже
  const cargoOnShelf = useMemo(() => {
    return cargo.filter(item => item.shelfId === shelf.id);
  }, [cargo, shelf.id]);

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

      {cargoOnShelf.length > 0 && (
        <>
          <div className="mt-2 font-medium">Грузы на стеллаже:</div>
          <div className="mt-1 max-h-32 overflow-y-auto">
            {cargoOnShelf.map(item => (
              <div key={item.id} className="mb-1 border-t pt-1">
                <div>Груз #{item.id.slice(0, 6)}</div>
                <div>
                  Размеры: {item.width}×{item.length}×{item.height} м
                </div>
                <div>Вес: {item.weight} кг</div>
                <div>
                  Уровень: {item.level !== null ? item.level + 1 : 'Не указан'}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

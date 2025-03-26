import type {CargoParams} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import {useMemo} from 'react';
import {Position} from './ShelfTooltip';

const PADDING = 8;

export function CargoTooltip(props: {
  cargo: CargoParams;
  pixelCoordinates: Position;
}) {
  const {cargo} = props;
  const shelving = useWarehouseStore(state => state.shelving);

  const shelf = useMemo(() => {
    if (!cargo.shelfId) return null;
    return shelving.find(s => s.id === cargo.shelfId) || null;
  }, [cargo.shelfId, shelving]);

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
      <div className="font-medium text-red-600">
        Груз #{cargo.id.slice(0, 6)}
      </div>
      <div className="mt-1 grid grid-cols-2 gap-x-1">
        <div>Размеры:</div>
        <div>
          {cargo.width}×{cargo.length}×{cargo.height} м
        </div>
        <div>Вес:</div>
        <div>{cargo.weight} кг</div>

        {shelf && (
          <>
            <div className="col-span-2 mt-1 font-medium text-indigo-600">
              Размещение:
            </div>
            <div>Стеллаж:</div>
            <div>#{shelf.id.slice(0, 6)}</div>
            <div>Уровень:</div>
            <div>
              {cargo.level !== null && cargo.level !== undefined
                ? `${cargo.level + 1} из ${shelf.levels}`
                : 'Не указан'}
            </div>
            <div>Высота уровня:</div>
            <div>{(shelf.height / shelf.levels).toFixed(2)} м</div>
          </>
        )}

        {!shelf && (
          <div className="col-span-2 mt-1 text-amber-600">
            Не размещен на стеллаже
          </div>
        )}
      </div>
    </div>
  );
}

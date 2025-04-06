import {Cell} from '@/storages/types';
import Button from '@/ui/Button';
import {PencilSquareIcon, TrashIcon} from '@heroicons/react/16/solid';
import {useCallback} from 'react';

export const CellCard = (props: {
  cell: Cell;
  onSelectCell: (cellId: string) => void;
  onDeleteCell: (cellId: string) => void;
}) => {
  const {cell} = props;

  const onSelectCell = useCallback(() => {
    props.onSelectCell(cell.id);
  }, [cell.id, props]);

  const onDeleteCell = useCallback(() => {
    props.onDeleteCell(cell.id);
  }, [cell.id, props]);

  return (
    <li className="flex w-full flex-col py-2">
      <div className="flex items-center justify-between">
        <span className="font-bold">{cell.name}</span>
        <span>Условия: {cell.zoneCondition}</span>

        <div className="flex flex-row gap-1">
          <Button color="amber" onClick={onSelectCell}>
            <PencilSquareIcon className="size-4" />
          </Button>
          <Button color="red" onClick={onDeleteCell}>
            <TrashIcon className="size-4" />
          </Button>
        </div>
      </div>
    </li>
  );
};

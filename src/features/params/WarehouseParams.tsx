import {useWarehouseStore} from '@/storages/warehouse-storage';
import {Button} from '@/ui/Button';
import {Input} from '@/ui/Input';
import {useCallback, useRef} from 'react';

export function WarehouseParams() {
  const params = useWarehouseStore(state => state.warehouse);
  const updateParams = useWarehouseStore(state => state.updateWarehouse);

  const widthInputRef = useRef<HTMLInputElement>(null);
  const lengthInputRef = useRef<HTMLInputElement>(null);

  const onClickUpdateButton = useCallback(() => {
    const widthValue = widthInputRef.current?.value;
    const lengthValue = lengthInputRef.current?.value;

    if (widthValue == undefined || lengthValue === undefined) return;

    updateParams({width: Number(widthValue), length: Number(lengthValue)});
  }, [updateParams]);

  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="flex flex-row gap-2">
        <Input
          tabIndex={1}
          label="Ширина (в метрах)"
          defaultValue={params.width}
          name="width"
          type="number"
          ref={widthInputRef}
        />
        <Input
          tabIndex={2}
          label="Длина (в метрах)"
          defaultValue={params.length}
          name="length"
          type="number"
          ref={lengthInputRef}
        />
      </div>

      <Button onClick={onClickUpdateButton} label="Обновить" />
    </div>
  );
}

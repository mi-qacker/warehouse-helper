import {Field, Input, Label, Button} from '@headlessui/react';
import clsx from 'clsx';
import {RefObject, useCallback, useMemo, useRef} from 'react';
import {
  useWarehouseStore,
  WarehouseParams as WarehouseStoreParams,
} from '@/storages/warehouse-storage';

export function WarehouseParams() {
  const params = useWarehouseStore(state => state.warehouse);
  const updateParams = useWarehouseStore(state => state.updateWarehouse);

  const widthInputRef = useRef<HTMLInputElement>(null);
  const lengthInputRef = useRef<HTMLInputElement>(null);

  const formContent = useMemo<
    {
      label: string;
      name: keyof WarehouseStoreParams;
      defaultValue: number;
      ref: RefObject<HTMLInputElement | null>;
    }[]
  >(
    () => [
      {
        label: 'Ширина (в метрах)',
        name: 'width',
        defaultValue: params.width,
        ref: widthInputRef,
      },
      {
        label: 'Длина (в метрах)',
        name: 'length',
        defaultValue: params.length,
        ref: lengthInputRef,
      },
    ],
    [params.length, params.width]
  );

  const onClickUpdateButton = useCallback(() => {
    const widthValue = widthInputRef.current?.value;
    const lengthValue = lengthInputRef.current?.value;

    if (widthValue == undefined || lengthValue === undefined) return;

    updateParams({width: Number(widthValue), length: Number(lengthValue)});
  }, [updateParams]);

  return (
    <div className="flex flex-col gap-2 py-4">
      {formContent.map(field => (
        <Field key={field.name}>
          <Label className="text-sm">{field.label}</Label>
          <Input
            defaultValue={field.defaultValue}
            ref={field.ref}
            name="width"
            type="number"
            className="block w-full rounded-lg border-2 border-neutral-200 px-2 py-2 focus:outline-none"
          />
        </Field>
      ))}

      <Button
        className={clsx(
          'cursor-pointer rounded-md bg-lime-500 px-3 py-2 font-semibold text-white shadow-inner',
          'focus:outline-none data-[hover]:bg-lime-600'
        )}
        onClick={onClickUpdateButton}
      >
        Update
      </Button>
    </div>
  );
}

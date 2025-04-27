'use client';

import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/Button';
import FormError from '@/ui/FormError';
import Input from '@/ui/Input';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

const schema = z
  .object({
    width: z.coerce.number().positive(),
    height: z.coerce.number().positive(),
    inputPositionX: z.coerce.number().nonnegative(),
    inputPositionY: z.coerce.number().nonnegative(),
    outputPositionX: z.coerce.number().nonnegative(),
    outputPositionY: z.coerce.number().nonnegative(),
  })
  .required();

export default function WarehouseForm() {
  const warehouse = useWarehouseStore(store => store.warehouse);
  const setWarehouse = useWarehouseStore(store => store.setWarehouse);

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitSuccessful, isDirty},
  } = useForm({
    values: {
      width: warehouse.size.width,
      height: warehouse.size.height,
      inputPositionX: warehouse.inputPosition.x,
      inputPositionY: warehouse.inputPosition.y,
      outputPositionX: warehouse.outputPosition.x,
      outputPositionY: warehouse.outputPosition.y,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(warehouseParams => {
    const newWarehouseParams = {
      size: {
        width: warehouseParams.width,
        height: warehouseParams.height,
      },
      inputPosition: {
        x: warehouseParams.inputPositionX,
        y: warehouseParams.inputPositionY,
      },
      outputPosition: {
        x: warehouseParams.outputPositionX,
        y: warehouseParams.outputPositionY,
      },
    };
    setWarehouse(newWarehouseParams);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <Input type="number" {...register('width')}>
          Ширина
        </Input>
        <FormError>{errors.width?.message}</FormError>
      </div>

      <div className="flex flex-col gap-1">
        <Input type="number" {...register('height')}>
          Длина
        </Input>
        <FormError>{errors.height?.message}</FormError>
      </div>

      <div className="temp grid grid-cols-2 gap-2">
        <span className="col-start-1 col-end-3 text-sm font-semibold">
          Точка погрузки
        </span>
        <span>
          <Input type="number" {...register('inputPositionX')}>
            Координата X
          </Input>
          <FormError>{errors.inputPositionX?.message}</FormError>
        </span>
        <span>
          <Input type="number" {...register('inputPositionY')}>
            Координата Y
          </Input>
          <FormError>{errors.inputPositionY?.message}</FormError>
        </span>
      </div>

      <div className="temp grid grid-cols-2 gap-2">
        <span className="col-start-1 col-end-3 text-sm font-semibold">
          Точка разгрузки
        </span>
        <span>
          <Input type="number" {...register('outputPositionX')}>
            Координата X
          </Input>
          <FormError>{errors.outputPositionX?.message}</FormError>
        </span>
        <span>
          <Input type="number" {...register('outputPositionY')}>
            Координата Y
          </Input>
          <FormError>{errors.outputPositionY?.message}</FormError>
        </span>
      </div>

      <Button type="submit">Save</Button>
      {isSubmitSuccessful && !isDirty && (
        <div className="tex-sm text-center font-semibold text-green-600">
          Success saved!
        </div>
      )}
    </form>
  );
}

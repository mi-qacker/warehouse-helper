'use client';

import {Warehouse} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/Button';
import FormError from '@/ui/FormError';
import Input from '@/ui/Input';
import Textarea from '@/ui/Textarea';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

const schema = z
  .object({
    width: z.coerce.number().positive(),
    height: z.coerce.number().positive(),
    inputPoint: z.string().nonempty(),
    outputPoint: z.string().nonempty(),
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
      width: warehouse.bounds[2],
      height: warehouse.bounds[3],
      inputPoint: JSON.stringify(warehouse.inputPoint),
      outputPoint: JSON.stringify(warehouse.outputPoint),
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(warehouseParams => {
    const newWarehouseParams: Warehouse = {
      bounds: [0, 0, warehouseParams.width, warehouseParams.height],
      inputPoint: JSON.parse(warehouseParams.inputPoint),
      outputPoint: JSON.parse(warehouseParams.outputPoint),
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

      <div className="flex flex-col gap-2">
        <Textarea {...register('inputPoint')}>Точка погрузки</Textarea>
        <FormError>{errors.inputPoint?.message}</FormError>
      </div>

      <div className="flex flex-col gap-2">
        <Textarea {...register('outputPoint')}>Точка погрузки</Textarea>
        <FormError>{errors.outputPoint?.message}</FormError>
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

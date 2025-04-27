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
    values: warehouse,
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(warehouseParams => {
    setWarehouse({...warehouseParams});
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <Input {...register('width')} type="number">
          Ширина
        </Input>
        <FormError>{errors.width?.message}</FormError>
      </div>

      <div className="flex flex-col gap-1">
        <Input {...register('height')} type="number">
          Длина
        </Input>
        <FormError>{errors.height?.message}</FormError>
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

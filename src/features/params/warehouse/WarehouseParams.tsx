'use client';

import {useWarehouseStore} from '@/storages/warehouse-storage';
import {useForm, SubmitHandler} from 'react-hook-form';
import Button from '@/ui/Button';

type WarehouseInputs = {
  width: number;
  height: number;
};

export default function WarehouseForm() {
  const warehouse = useWarehouseStore(store => store.warehouse);
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<WarehouseInputs>({values: warehouse});

  const onSubmit: SubmitHandler<WarehouseInputs> = data =>
    console.log('onSubmit', data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="flex flex-col">
        <label>Width</label>
        <input {...register('width', {required: true})} type="number" />
        {errors.width && <span>Height field is required</span>}
      </div>

      <div className="flex flex-col">
        <label>Height</label>
        <input {...register('height', {required: true})} type="number" />
        {errors.height && <span>Width field is required</span>}
      </div>

      <Button type="submit">Сохранить</Button>
    </form>
  );
}

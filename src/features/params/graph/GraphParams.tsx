import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/common/Button';
import FormError from '@/ui/forms/FormError';
import Input from '@/ui/forms/Input';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

const schema = z
  .object({
    size: z.coerce.number().positive(),
  })
  .required();

export default function WarehouseGraphParams() {
  const {graph, setGraph} = useWarehouseStore();

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitSuccessful, isDirty},
  } = useForm({
    values: {
      size: graph?.size ?? 0,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(graphParams => {
    setGraph(graphParams);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <Input type="number" {...register('size')}>
          Ширина
        </Input>
        <FormError>{errors.size?.message}</FormError>
      </div>
      <div className="flex flex-row items-center gap-4">
        <Button type="submit">Save</Button>
        {isSubmitSuccessful && !isDirty && (
          <div className="tex-sm text-center font-semibold text-green-600">
            Success saved!
          </div>
        )}
      </div>
    </form>
  );
}

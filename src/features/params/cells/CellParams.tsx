import {NewCell} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/common/Button';
import FormError from '@/ui/forms/FormError';
import Input from '@/ui/forms/Input';
import Textarea from '@/ui/forms/Textarea';
import Select from '@/ui/forms/Select';
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/20/solid';
import {zodResolver} from '@hookform/resolvers/zod';
import {useCallback, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {ZONE_CONDITION_OPTIONS} from '../common';
import {CellCard} from './CellCard';

const schema = z.object({
  name: z.string().nonempty(),
  capacity: z.coerce.number().positive(),
  zoneCondition: z.enum(['cold', 'dry', 'normal']),
  loadingPoint: z.string().nonempty(),
  bounds: z.string().nonempty(),
});

export default function CellForm() {
  const {cells, addCell, updateCell, removeCell, getCell} = useWarehouseStore();

  const {
    reset,
    handleSubmit,
    setValue,
    register,
    formState: {errors, isSubmitSuccessful, isDirty},
  } = useForm({resolver: zodResolver(schema)});

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const onSubmit = handleSubmit(formData => {
    const newCell: NewCell = {
      name: formData.name,
      capacity: formData.capacity,
      zoneCondition: formData.zoneCondition,
      loadingPoint: JSON.parse(formData.loadingPoint),
      bounds: JSON.parse(formData.bounds),
    };

    if (selectedId === null) {
      addCell(newCell);
    } else {
      updateCell(selectedId, newCell);
      setSelectedId(null);
    }
    reset();
  });

  const onSelectCell = useCallback(
    (cellId: string) => {
      const selectedCell = getCell(cellId);
      if (!selectedCell) return;

      reset();
      setSelectedId(selectedCell.id);
      setValue('name', selectedCell.name);
      setValue('capacity', selectedCell.capacity);
      setValue('zoneCondition', selectedCell.zoneCondition);
      setValue('loadingPoint', JSON.stringify(selectedCell.loadingPoint));
      setValue('bounds', JSON.stringify(selectedCell.bounds));
    },
    [getCell, reset, setValue]
  );

  const onDeleteCell = useCallback(
    (cellId: string) => {
      removeCell(cellId);
    },
    [removeCell]
  );

  const cellList = useMemo(() => {
    const liElements = cells.map((cell, index) => {
      return (
        <CellCard
          key={index}
          cell={cell}
          onDeleteCell={onDeleteCell}
          onSelectCell={onSelectCell}
        />
      );
    });

    return <ul className="divide-y divide-gray-200">{liElements}</ul>;
  }, [cells, onDeleteCell, onSelectCell]);

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4 rounded-lg p-4">
        <Input type="text" {...register('name')}>
          Название
        </Input>
        <FormError>{errors.name?.message}</FormError>

        <Input type="number" {...register('capacity')}>
          Вместимость (м³)
        </Input>
        <FormError>{errors.capacity?.message}</FormError>

        <Select options={ZONE_CONDITION_OPTIONS} {...register('zoneCondition')}>
          Зона хранения
        </Select>
        <FormError>{errors.zoneCondition?.message}</FormError>

        <div className="flex flex-col gap-2">
          <Textarea {...register('loadingPoint')}>Точка погрузки</Textarea>
          <FormError>{errors.loadingPoint?.message}</FormError>
        </div>

        <div className="flex flex-col gap-2">
          <Textarea {...register('bounds')}>Местоположение</Textarea>
          <FormError>{errors.bounds?.message}</FormError>
        </div>

        <div className="flex flex-row items-center gap-4">
          <Button type="submit">Сохранить</Button>
          {isSubmitSuccessful && !isDirty && (
            <div className="tex-sm text-center font-semibold text-green-600">
              Success saved!
            </div>
          )}
        </div>
      </form>

      <Disclosure as="div" defaultOpen={true} className="w-full">
        <DisclosureButton className="group flex w-full items-center justify-between gap-2">
          <span>Список ячеек</span>
          <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
        </DisclosureButton>
        <DisclosurePanel>{cellList}</DisclosurePanel>
      </Disclosure>
    </>
  );
}

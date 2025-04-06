import {NewCell, ZoneCondition} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/Button';
import Input from '@/ui/Input';
import Select from '@/ui/Select';
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/20/solid';
import React, {useCallback, useMemo, useState} from 'react';
import {ZONE_CONDITION_OPTIONS} from '../common';
import {CellCard} from './CellCard';

const INITIAL_FORM_DATA: NewCell = {
  name: '',
  capacity: 0,
  zoneCondition: 'normal',
};

export default function CellForm() {
  const cells = useWarehouseStore(state => state.cells);
  const addCell = useWarehouseStore(state => state.addCell);
  const updateCell = useWarehouseStore(state => state.updateCell);
  const removeCell = useWarehouseStore(state => state.removeCell);
  const getCell = useWarehouseStore(state => state.getCell);

  const [formData, setFormData] = useState<NewCell>(INITIAL_FORM_DATA);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      const name = String(event.target.value);
      setFormData({...formData, name});
    },
    [formData]
  );

  const onChangeCapacity: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      event => {
        const capacity = Number(event.target.value);
        setFormData({...formData, capacity});
      },
      [formData]
    );

  const onChangeZoneCondition: React.ChangeEventHandler<HTMLSelectElement> =
    useCallback(
      event => {
        const zoneCondition = event.target.value as ZoneCondition;
        setFormData({...formData, zoneCondition});
      },
      [formData]
    );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (selectedId === null) {
        addCell(formData);
      } else {
        updateCell(selectedId, formData);
        setSelectedId(null);
      }
      setFormData(INITIAL_FORM_DATA);
    },
    [addCell, formData, selectedId, updateCell]
  );

  const onSelectCell = useCallback(
    (cellId: string) => {
      const selectedCell = getCell(cellId);
      if (!selectedCell) return;

      const {id, ...data} = selectedCell;
      setSelectedId(id);
      setFormData(data);
    },
    [getCell]
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
    <div className="space-y-4 rounded-lg p-4">
      <Input
        label="Название"
        type="text"
        value={formData.name}
        onChange={onNameChange}
      />

      <Input
        type="number"
        min="0"
        value={formData.capacity}
        label="Вместимость (м³)"
        onChange={onChangeCapacity}
      />

      <Select
        options={ZONE_CONDITION_OPTIONS}
        label="Зона хранения"
        value={formData.zoneCondition}
        onChange={onChangeZoneCondition}
        name="zoneCondition"
      />

      <Button type="button" onClick={handleSubmit}>
        {selectedId === null ? 'Добавить ячейку' : 'Обновить ячейку'}
      </Button>

      <Disclosure as="div" defaultOpen={true} className="w-full">
        <DisclosureButton className="group flex w-full items-center justify-between gap-2">
          <span>Список ячеек</span>
          <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
        </DisclosureButton>
        <DisclosurePanel>{cellList}</DisclosurePanel>
      </Disclosure>
    </div>
  );
}

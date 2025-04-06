import {NewCell, ZoneCondition} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/Button';
import Input from '@/ui/Input';
import Select from '@/ui/Select';
import React, {useCallback, useState} from 'react';
import {ZONE_CONDITION_OPTIONS} from '../common';

export default function CellForm() {
  const addCell = useWarehouseStore(state => state.addCell);
  // const updateCell = useWarehouseStore(state => state.updateCell);
  // const removeCell = useWarehouseStore(state => state.removeCell);

  const [formData, setFormData] = useState<NewCell>({
    capacity: 0,
    zoneCondition: 'normal',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCell(formData);
  };

  return (
    <div className="space-y-4 rounded-lg p-4">
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
        Добавить ячейку
      </Button>
    </div>
  );
}

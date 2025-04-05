import {NewProduct, ZoneCondition} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/Button';
import Input from '@/ui/Input';
import Select from '@/ui/Select';
import React, {useCallback, useState} from 'react';
import {ZONE_CONDITION_OPTIONS} from './common';

export default function ProductForm() {
  const addProduct = useWarehouseStore(state => state.addProduct);
  // const updateProduct = useWarehouseStore(state => state.updateProduct);
  // const removeProduct = useWarehouseStore(state => state.removeProduct);

  const [formData, setFormData] = useState<NewProduct>({
    volume: 0,
    storageCondition: 'normal',
    incompatibleWith: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(formData);
  };

  const onVolumeChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      event => {
        const volume = Number(event.target.value);
        setFormData({...formData, volume});
      },
      [formData]
    );

  const onChangeZoneCondition: React.ChangeEventHandler<HTMLSelectElement> =
    useCallback(
      event => {
        const storageCondition = event.target.value as ZoneCondition;
        setFormData({...formData, storageCondition});
      },
      [formData]
    );

  return (
    <div className="space-y-4 rounded-lg p-4">
      <Input
        label="Объём (м³)"
        type="number"
        min="0"
        value={formData.volume}
        onChange={onVolumeChange}
      />

      <Select
        label="Условия хранения"
        options={ZONE_CONDITION_OPTIONS}
        value={formData.storageCondition}
        onChange={onChangeZoneCondition}
      >
        <option value="cold">Холодильная</option>
        <option value="dry">Сухая</option>
        <option value="normal">Обычная</option>
      </Select>

      <Button type="button" label="Добавить товар" onClick={handleSubmit} />
    </div>
  );
}

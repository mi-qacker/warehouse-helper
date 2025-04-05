import {NewProduct, ZoneCondition} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/Button';
import Input from '@/ui/Input';
import Select from '@/ui/Select';
import {PencilSquareIcon, TrashIcon} from '@heroicons/react/16/solid';
import React, {useCallback, useMemo, useState} from 'react';
import {ZONE_CONDITION_OPTIONS} from './common';

const INITIAL_FORM_DATA: NewProduct = {
  volume: 0,
  name: '',
  storageCondition: 'normal',
  incompatibleWith: [],
};

export default function ProductForm() {
  const products = useWarehouseStore(state => state.products);
  const addProduct = useWarehouseStore(state => state.addProduct);
  // const updateProduct = useWarehouseStore(state => state.updateProduct);
  // const removeProduct = useWarehouseStore(state => state.removeProduct);

  const [formData, setFormData] = useState<NewProduct>(INITIAL_FORM_DATA);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(formData);
    setFormData(INITIAL_FORM_DATA);
  };

  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      const name = String(event.target.value);
      setFormData({...formData, name});
    },
    [formData]
  );

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

  const productsList = useMemo(() => {
    return products.map((product, index) => {
      const incompatibleProducts = product.incompatibleWith.map(
        incompatibleProduct =>
          products.find(({id}) => id === incompatibleProduct)?.name
      );

      return (
        <li key={index} className="py-2">
          <div className="flex items-center justify-between">
            <span className="font-bold">{product.name}</span>
            <span>Объём: {product.volume} м³</span>
            <span>Условия: {product.storageCondition}</span>
            <div className="flex flex-row gap-1">
              <Button color="amber">
                <PencilSquareIcon className="size-4" />
              </Button>
              <Button color="red">
                <TrashIcon className="size-4" />
              </Button>
            </div>
          </div>
          {incompatibleProducts.length > 0 && (
            <div className="text-sm text-gray-500">
              Несовместим с: {incompatibleProducts.join(', ')}
            </div>
          )}
        </li>
      );
    });
  }, [products]);

  return (
    <div className="space-y-4 rounded-lg p-4">
      <Input
        label="Название"
        type="text"
        value={formData.name}
        onChange={onNameChange}
      />

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
      />

      <Button type="button" onClick={handleSubmit}>
        Добавить товар
      </Button>

      <div className="mt-6 space-y-2">
        <h3 className="text-lg font-medium">Список товаров</h3>
        <ul className="divide-y divide-gray-200">{productsList}</ul>
      </div>
    </div>
  );
}

import {NewProduct, ZoneCondition} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/Button';
import Input from '@/ui/Input';
import Select from '@/ui/Select';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import {PencilSquareIcon, TrashIcon} from '@heroicons/react/16/solid';
import {CheckIcon} from '@heroicons/react/20/solid';
import {ChevronDownIcon} from '@heroicons/react/20/solid';
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
  const getProduct = useWarehouseStore(state => state.getProduct);
  const updateProduct = useWarehouseStore(state => state.updateProduct);
  const removeProduct = useWarehouseStore(state => state.removeProduct);

  const [formData, setFormData] = useState<NewProduct>(INITIAL_FORM_DATA);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (selectedId === null) {
        addProduct(formData);
      } else {
        updateProduct(selectedId, formData);
        setSelectedId(null);
      }
      setFormData(INITIAL_FORM_DATA);
    },
    [addProduct, formData, selectedId, updateProduct]
  );

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

  const onIncompatibleWithChange = useCallback(
    (value: string[]) => {
      setFormData({...formData, incompatibleWith: value});
    },
    [formData]
  );

  const onDeleteProduct = useCallback(
    (productId: string) => {
      removeProduct(productId);
    },
    [removeProduct]
  );

  const onSelectProduct = useCallback(
    (productId: string) => {
      const selectedProduct = getProduct(productId);

      if (!selectedProduct) return;

      const {id, ...data} = selectedProduct;
      setSelectedId(id);
      setFormData(data);
    },
    [getProduct]
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
              <Button color="amber" onClick={() => onSelectProduct(product.id)}>
                <PencilSquareIcon className="size-4" />
              </Button>
              <Button color="red" onClick={() => onDeleteProduct(product.id)}>
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
  }, [products, onSelectProduct, onDeleteProduct]);

  const incompatibleWithProducts = useMemo(() => {
    const options = products.map(product => (
      <ListboxOption
        key={product.id}
        value={product.id}
        className="group flex cursor-pointer items-center gap-2 py-1 select-none hover:font-bold"
      >
        <CheckIcon className="invisible size-4 group-data-[selected]:visible" />
        <div className="text-sm">{product.name}</div>
      </ListboxOption>
    ));

    const placeholder =
      formData.incompatibleWith.length === 0
        ? 'Не выбрано'
        : products
            .filter(({id}) => formData.incompatibleWith.includes(id))
            .map(({name}) => name)
            .join(', ');

    return (
      <Field>
        <Label className="text-sm">
          Список товаров, с которыми текущий товар несовместим
        </Label>
        <Listbox
          as="div"
          value={formData.incompatibleWith}
          onChange={onIncompatibleWithChange}
          multiple={true}
        >
          <ListboxButton className="relative flex w-full items-center justify-between rounded-lg border-2 border-neutral-200 px-2 py-2 text-left">
            {placeholder}
            <ChevronDownIcon className="size-4" />
          </ListboxButton>
          <ListboxOptions
            anchor="bottom"
            className="rounded-lg border-1 border-neutral-100 bg-neutral-200 px-2 py-2"
          >
            {options}
          </ListboxOptions>
        </Listbox>
      </Field>
    );
  }, [formData.incompatibleWith, onIncompatibleWithChange, products]);

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

      {incompatibleWithProducts}

      <Button type="button" onClick={handleSubmit}>
        {selectedId === null ? 'Добавить товар' : 'Обновить товар'}
      </Button>

      <Disclosure as="div" defaultOpen={true} className="w-full">
        <DisclosureButton className="group flex w-full items-center justify-between gap-2">
          <span>Список товаров</span>
          <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
        </DisclosureButton>
        <DisclosurePanel>
          <ul className="divide-y divide-gray-200">{productsList}</ul>
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}

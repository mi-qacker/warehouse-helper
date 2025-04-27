import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/Button';
import Input from '@/ui/Input';
import FormError from '@/ui/FormError';
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
import {CheckIcon, ChevronDownIcon} from '@heroicons/react/20/solid';
import {zodResolver} from '@hookform/resolvers/zod';
import {useCallback, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {ZONE_CONDITION_OPTIONS} from '../common';
import {ProductCard} from './ProductCard';

const schema = z.object({
  name: z.string().nonempty(),
  volume: z.coerce.number().positive(),
  storageCondition: z.enum(['cold', 'dry', 'normal']),
  incompatibleWith: z.coerce.string().array(),
});

export default function ProductForm() {
  const {products, addProduct, updateProduct, getProduct, removeProduct} =
    useWarehouseStore();

  const {
    watch,
    register,
    setValue,
    reset,
    handleSubmit,
    formState: {errors, isSubmitSuccessful, isDirty},
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {incompatibleWith: [], volume: 0},
  });
  const incompatibleWithIds = watch('incompatibleWith');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const onSubmit = handleSubmit(formData => {
    if (selectedId) {
      updateProduct(selectedId, formData);
      setSelectedId(null);
    } else {
      addProduct(formData);
    }
    reset();
  });

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

      reset();
      setSelectedId(selectedProduct.id);
      setValue('name', selectedProduct.name);
      setValue('volume', selectedProduct.volume);
      setValue('storageCondition', selectedProduct.storageCondition);
      setValue('incompatibleWith', selectedProduct.incompatibleWith);
    },
    [getProduct, reset, setValue]
  );

  const incompatibleWithOptions = useMemo(() => {
    return products.map(product => (
      <ListboxOption
        key={product.id}
        value={product.id}
        className="group text-12 flex cursor-pointer flex-row items-center gap-2 rounded-md p-2 hover:bg-neutral-300"
      >
        <CheckIcon className="invisible size-4 group-data-selected:visible" />
        <span>{product.name}</span>
      </ListboxOption>
    ));
  }, [products]);

  const productsList = useMemo(() => {
    return products.map((product, index) => {
      return (
        <ProductCard
          key={index}
          product={product}
          onSelectProduct={onSelectProduct}
          onDeleteProduct={onDeleteProduct}
        />
      );
    });
  }, [products, onSelectProduct, onDeleteProduct]);

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4 rounded-lg p-4">
        <Input {...register('name')}>Название</Input>
        <FormError>{errors.name?.message}</FormError>

        <Input {...register('volume')} type="number">
          Объём (м³)
        </Input>
        <FormError>{errors.volume?.message}</FormError>

        <Select
          options={ZONE_CONDITION_OPTIONS}
          {...register('storageCondition')}
        >
          Условия хранения
        </Select>
        <FormError>{errors.storageCondition?.message}</FormError>

        <Field>
          <input type="hidden" {...register('incompatibleWith')} />
          <Label className="text-sm">
            Список товаров, с которыми текущий товар несовместим
          </Label>
          <Listbox
            multiple={true}
            as="div"
            value={incompatibleWithIds}
            onChange={ids => setValue('incompatibleWith', ids)}
            className="block w-full rounded-lg border-2 border-neutral-200 px-2 py-2 focus:outline-none"
          >
            <ListboxButton className="w-full text-left focus:outline-none">
              {incompatibleWithIds.length === 0
                ? 'Select from list'
                : incompatibleWithIds.join(', ')}
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              className="w-(--button-width) rounded-md bg-white p-2 shadow-md focus:outline-none"
            >
              {incompatibleWithOptions}
            </ListboxOptions>
          </Listbox>
          <FormError>{errors.incompatibleWith?.message}</FormError>
        </Field>

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
          <span>Список товаров</span>
          <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
        </DisclosureButton>
        <DisclosurePanel>
          <ul className="divide-y divide-gray-200">{productsList}</ul>
        </DisclosurePanel>
      </Disclosure>
    </>
  );
}

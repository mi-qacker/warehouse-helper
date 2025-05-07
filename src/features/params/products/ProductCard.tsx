import {Product} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/common/Button';
import {PencilSquareIcon, TrashIcon} from '@heroicons/react/16/solid';
import {useCallback, useMemo} from 'react';

export const ProductCard = (props: {
  product: Product;
  onSelectProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
}) => {
  const {product} = props;
  const products = useWarehouseStore(state => state.products);

  const incompatibleProducts = useMemo(() => {
    return product.incompatibleWith.map(incompatibleProduct => {
      return products.find(({id}) => id === incompatibleProduct)?.name;
    });
  }, [product.incompatibleWith, products]);

  const onSelectProduct = useCallback(() => {
    props.onSelectProduct(product.id);
  }, [product.id, props]);

  const onDeleteProduct = useCallback(() => {
    props.onDeleteProduct(product.id);
  }, [product.id, props]);

  return (
    <li className="flex w-full flex-col py-2">
      <div className="flex items-center justify-between">
        <span className="font-bold">{product.name}</span>
        <span>Объём: {product.volume} м³</span>
        <span>Условия: {product.storageCondition}</span>

        <div className="flex flex-row gap-1">
          <Button color="amber" onClick={onSelectProduct}>
            <PencilSquareIcon className="size-4" />
          </Button>
          <Button color="red" onClick={onDeleteProduct}>
            <TrashIcon className="size-4" />
          </Button>
        </div>
      </div>

      {incompatibleProducts.length > 0 && (
        <div className="text-sm text-gray-500">
          <span className="font-bold">Несовместим с</span>:{' '}
          {incompatibleProducts.join(', ')}
        </div>
      )}
    </li>
  );
};

'use client';

import {useWarehouseStore} from '@/storages/warehouse-storage';
import {useMemo} from 'react';
import {useShallow} from 'zustand/shallow';
import {CellGridCard} from './CellGridCard';
import {ProductGridCard} from './ProductGridCard';

export function WarehouseMap() {
  const {products, cells} = useWarehouseStore(
    useShallow(({products, cells}) => ({products, cells}))
  );

  const cellsGrid = useMemo(() => {
    const cellCards = cells.map(cell => {
      return <CellGridCard key={cell.id} cell={cell} />;
    });
    return <div className="grid grid-cols-8 gap-1">{cellCards}</div>;
  }, [cells]);

  const productsGrid = useMemo(() => {
    const productCards = products.map(product => (
      <ProductGridCard key={product.id} product={product} />
    ));

    return <div className="grid grid-cols-5 gap-2">{productCards}</div>;
  }, [products]);

  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="mb-4 text-xl font-bold">Cells</h2>
        {cellsGrid}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Products</h2>
        {productsGrid}
      </div>
    </div>
  );
}

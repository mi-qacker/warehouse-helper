'use client';

import {useWarehouseStore} from '@/storages/warehouse-storage';
import {useMemo} from 'react';
import {useShallow} from 'zustand/shallow';
import {CellGridCard} from './CellGridCard';
import {ProductGridCard} from './ProductGridCard';
import WarehouseMapSchema from './WarehouseMapSchema';
import {useSearchParams} from 'next/navigation';

export type MapModules = 'matrix' | 'route' | 'placement';

export default function WarehouseMap() {
  const searchParams = useSearchParams();
  const showModules: MapModules[] = useMemo(() => {
    const rawShow = searchParams.get('show');
    return !rawShow
      ? ['route', 'placement'] // default
      : (rawShow.split(',') as MapModules[]);
  }, [searchParams]);

  const {products, cells} = useWarehouseStore(
    useShallow(({products, cells}) => ({products, cells}))
  );

  const cellsGrid = useMemo(() => {
    const cellCards = cells.map(cell => {
      return <CellGridCard key={cell.id} cell={cell} />;
    });
    return <div className="grid grid-cols-4 gap-1">{cellCards}</div>;
  }, [cells]);

  const productsGrid = useMemo(() => {
    const productCards = products.map(product => (
      <ProductGridCard key={product.id} product={product} />
    ));

    return <div className="grid grid-cols-5 gap-2">{productCards}</div>;
  }, [products]);

  return (
    <div className="container mx-auto space-y-4 py-4">
      <div>
        <h2 className="mb-2 text-xl font-bold">Cells</h2>
        {cellsGrid}
      </div>

      <div>
        <h2 className="mb-2 text-xl font-bold">Products</h2>
        {productsGrid}
      </div>
      <div>
        <h2 className="mb-2 text-xl font-bold">Schema</h2>
        <WarehouseMapSchema showModules={showModules} />
      </div>
    </div>
  );
}

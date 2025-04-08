import {solveOptimizationPlacement} from '@/modules/lp-solver';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/Button';
import {useCallback, useMemo, useState} from 'react';
import {useShallow} from 'zustand/shallow';
import {CellGridCard} from './CellGridCard';
import {ProductGridCard} from './ProductGridCard';

export function WarehouseMap() {
  const {products, cells} = useWarehouseStore(
    useShallow(({products, cells}) => ({products, cells}))
  );
  const getCell = useWarehouseStore(store => store.getCell);
  const getProduct = useWarehouseStore(store => store.getProduct);

  const [output, setOutput] = useState<Record<string, string[]>>({});

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

  const onClickLPSolver = useCallback(() => {
    solveOptimizationPlacement(products, cells).then(solve => {
      const output: Record<string, string[]> = {};
      Object.entries(solve).forEach(([cellId, productIds]) => {
        const cellName = getCell(cellId)?.name;
        if (!cellName) return;

        output[cellName] = productIds
          .map(id => getProduct(id)?.name)
          .filter(name => name) as string[];
      });

      setOutput(output);
    });
  }, [cells, getCell, getProduct, products]);

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
      <Button onClick={onClickLPSolver}>Оптимизировать расстановку</Button>
      <div>
        {Object.keys(output).length !== 0 && JSON.stringify(output, null, 2)}
      </div>
    </div>
  );
}

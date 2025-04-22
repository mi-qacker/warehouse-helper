import {solveOptimizationPlacement} from '@/modules/lp-solver';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/Button';
import {useCallback, useMemo, useState} from 'react';
import {useShallow} from 'zustand/shallow';

export default function PlacementComponent() {
  const {products, cells} = useWarehouseStore(
    useShallow(({products, cells}) => ({products, cells}))
  );
  const getCell = useWarehouseStore(store => store.getCell);
  const getProduct = useWarehouseStore(store => store.getProduct);

  const [output, setOutput] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string>();

  const onClickLPSolver = useCallback(() => {
    solveOptimizationPlacement(products, cells)
      .then(solve => {
        const output: Record<string, string[]> = {};
        Object.entries(solve).forEach(([cellId, productIds]) => {
          const cellName = getCell(cellId)?.name;
          if (!cellName) return;

          output[cellName] = productIds
            .map(id => getProduct(id)?.name)
            .filter(name => name) as string[];
        });

        setError(undefined);
        setOutput(output);
      })
      .catch((error: Error) => {
        setError(error.message);
      });
  }, [cells, getCell, getProduct, products]);

  const renderOutputs = useMemo(() => {
    if (Object.keys(output).length === 0) {
      return null;
    }
    return Object.entries(output).map(([cellName, products], index) => (
      <div key={index} className="rounded-md border p-2">
        <div className="font-bold">{cellName}</div>
        <ul className="list-inside list-disc">
          {products.map((name, index) => (
            <li key={index} className="text-sm">
              {name}
            </li>
          ))}
        </ul>
      </div>
    ));
  }, [output]);

  return (
    <div className="w-full py-2">
      <Button onClick={onClickLPSolver}>Оптимизировать расстановку</Button>
      {error ? (
        <div className="py-3 text-2xl font-bold text-red-700">{error}</div>
      ) : (
        <div className="flex flex-row flex-wrap gap-2 py-4">
          {renderOutputs}
        </div>
      )}
    </div>
  );
}

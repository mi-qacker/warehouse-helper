import {solveOptimizationPlacement} from '@/modules/lp-solver';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import Button from '@/ui/Button';
import {useCallback, useState} from 'react';

export default function PlacementComponent() {
  const {
    products,
    cells,
    warehouse: {inputPosition},
  } = useWarehouseStore();
  const setPlacement = useWarehouseStore(store => store.setPlacement);
  const resetPlacement = useWarehouseStore(store => store.resetPlacement);

  const [errorMessage, setErrorMessage] = useState<string>();

  const onClickLPSolver = useCallback(() => {
    solveOptimizationPlacement(products, cells, inputPosition)
      .then(newPlacement => {
        setPlacement(newPlacement);
        setErrorMessage(undefined);
      })
      .catch((error: Error) => {
        resetPlacement();
        setErrorMessage(error.message);
      });
  }, [products, cells, inputPosition, setPlacement, resetPlacement]);

  return (
    <div className="w-full py-2">
      <Button onClick={onClickLPSolver}>Оптимизировать расстановку</Button>
      {errorMessage ? <ErrorView message={errorMessage} /> : <PlacementView />}
    </div>
  );
}

function ErrorView(props: {message: string}) {
  return (
    <div className="py-3 text-2xl font-bold text-red-700">{props.message}</div>
  );
}

function PlacementView() {
  const placement = useWarehouseStore(store => store.placement);
  const getCell = useWarehouseStore(store => store.getCell);
  const getProduct = useWarehouseStore(store => store.getProduct);

  if (!placement) {
    return null;
  }

  const output: Record<string, string[]> = {};

  Object.entries(placement).forEach(([cellId, productIds]) => {
    const cellName = getCell(cellId)?.name;
    if (!cellName) return;

    output[cellName] = productIds
      .map(id => getProduct(id)?.name)
      .filter(name => name) as string[];
  });

  if (Object.keys(output).length === 0) {
    return null;
  }

  const renderOutputs = Object.entries(output).map(
    ([cellName, products], index) => (
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
    )
  );

  return (
    <div className="flex flex-row flex-wrap gap-2 py-4">{renderOutputs}</div>
  );
}

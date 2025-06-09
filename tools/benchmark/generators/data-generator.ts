import crypto from 'crypto';
import { DEMO_DATA } from '../../../src/storages/init-data';
import type { WarehouseStore } from '../types';
import type { Cell, Product } from '../../../src/storages/types';

export function generateStressData(scaleFactor: number): WarehouseStore {
  // Создаем глубокую копию исходных данных
  const baseData = JSON.parse(JSON.stringify(DEMO_DATA)) as Pick<
    WarehouseStore,
    'warehouse' | 'products' | 'cells'
  >;

  // Масштабируем массивы
  const scaledCells: Cell[] = [...baseData.cells];
  const scaledProducts: Product[] = [...baseData.products];

  // Генерация дополнительных ячеек
  for (let i = 0; i < baseData.cells.length * (scaleFactor - 1); i++) {
    const baseCell = baseData.cells[i % baseData.cells.length];
    const newCell: Cell = {
      ...baseCell,
      id: `cell-${crypto.randomUUID()}`,
      name: `C${scaledCells.length + 1}`,
      loadingPoint: {
        ...baseCell.loadingPoint,
        properties: { id: `cell-${scaledCells.length + 1}` }
      },
      bounds: [
        baseCell.bounds[0] + 50 * Math.floor(i / 4),
        baseCell.bounds[1] + 50 * (i % 4),
        baseCell.bounds[2] + 50 * Math.floor(i / 4),
        baseCell.bounds[3] + 50 * (i % 4)
      ] as [number, number, number, number]
    };
    scaledCells.push(newCell);
  }

  // Генерация дополнительных продуктов
  for (let i = 0; i < baseData.products.length * (scaleFactor - 1); i++) {
    const baseProduct = baseData.products[i % baseData.products.length];
    const newProduct: Product = {
      ...baseProduct,
      id: `prod-${crypto.randomUUID()}`,
      name: `${baseProduct.name} ${scaledProducts.length + 1}`
    };
    scaledProducts.push(newProduct);
  }

  // Обновление отношений incompatibleWith
  scaledProducts.forEach((product: Product) => {
    product.incompatibleWith = product.incompatibleWith.map((origId: string) => {
      const baseProduct = baseData.products.find((p: Product) => p.id === origId);
      if (!baseProduct) return origId;
      
      // Находим соответствующий масштабированный продукт
      const scaledProduct = scaledProducts.find(
        (p: Product) => p.name.startsWith(baseProduct.name) && p.id !== product.id
      );
      return scaledProduct?.id || origId;
    });
  });

  return {
    warehouse: baseData.warehouse,
    cells: scaledCells,
    products: scaledProducts
  } as WarehouseStore;
}
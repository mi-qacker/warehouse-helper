import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {DEMO_DATA} from './init-data';
import {WarehouseStore} from './types';

export const useWarehouseStore = create<WarehouseStore>()(
  persist(
    (set, get) => ({
      // Initial data
      ...DEMO_DATA,

      // Product functions
      addProduct: newProduct =>
        set({
          products: [
            ...get().products,
            {...newProduct, id: `prod-${crypto.randomUUID()}`},
          ],
        }),
      updateProduct: (id, updatedProduct) =>
        set({
          products: get().products.map(product =>
            product.id === id ? {...updatedProduct, id} : product
          ),
        }),
      removeProduct: id =>
        set({products: get().products.filter(product => product.id !== id)}),
      getProduct: id => get().products.find(product => product.id === id),

      // Cells functions
      addCell: newCell =>
        set({
          cells: [
            ...get().cells,
            {...newCell, id: `cell-${crypto.randomUUID()}`},
          ],
        }),
      updateCell: (id, updatedCell) =>
        set({
          cells: get().cells.map(cell =>
            cell.id === id ? {...updatedCell, id} : cell
          ),
        }),
      removeCell: id =>
        set({cells: get().cells.filter(cell => cell.id !== id)}),
      getCell: id => get().cells.find(cell => cell.id === id),
    }),
    {
      name: 'warehouse-params',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {WarehouseStore} from './types';

export const useWarehouseStore = create<WarehouseStore>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: newProduct =>
        set({
          products: [
            ...get().products,
            {...newProduct, id: crypto.randomUUID()},
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

      cells: [],
      addCell: newCell =>
        set({cells: [...get().cells, {...newCell, id: crypto.randomUUID()}]}),
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

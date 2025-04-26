import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {DEMO_DATA} from './init-data';
import {WarehouseStore} from './types';
import {getUUID} from './common';

export const useWarehouseStore = create<WarehouseStore>()(
  persist(
    (set, get) => ({
      // Initial data
      ...DEMO_DATA,

      // Product functions
      addProduct(newProduct) {
        const oldProducts = get().products;
        set({
          products: oldProducts.concat({...newProduct, id: getUUID('prod')}),
        });
        get().resetOptimizations();
      },
      updateProduct(id, updatedProduct) {
        const newProducts = get().products.map(product =>
          product.id === id ? {...updatedProduct, id} : product
        );
        set({products: newProducts});
        get().resetOptimizations();
      },
      removeProduct(id) {
        const newProducts = get().products.filter(product => product.id !== id);
        set({products: newProducts});
        get().resetOptimizations();
      },
      getProduct(id) {
        return get().products.find(product => product.id === id);
      },

      // Cells functions
      addCell(newCell) {
        const oldCells = get().cells;
        set({cells: oldCells.concat({...newCell, id: getUUID('cell')})});
        get().resetOptimizations();
      },
      updateCell(id, updatedCell) {
        const newCells = get().cells.map(cell =>
          cell.id === id ? {...updatedCell, id} : cell
        );
        set({cells: newCells});
        get().resetOptimizations();
      },
      removeCell(id) {
        const newCells = get().cells.filter(cell => cell.id !== id);
        set({cells: newCells});
        get().resetOptimizations();
      },
      getCell(id) {
        return get().cells.find(cell => cell.id === id);
      },

      // Placement functions
      placement: null,
      setPlacement(placement) {
        set({placement});
      },

      // Route functions
      route: null,
      setRoute(route) {
        set({route});
      },

      // Reset optimizations
      resetOptimizations() {
        set({placement: null, route: null});
      },
    }),
    {
      name: 'warehouse-params',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

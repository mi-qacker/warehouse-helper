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

      // Warehouse function
      setWarehouse(warehouse) {
        set({warehouse});
        get().resetPlacement();
      },

      // Product functions
      addProduct(newProduct) {
        const oldProducts = get().products;
        set({
          products: oldProducts.concat({...newProduct, id: getUUID('prod')}),
        });
        get().resetPlacement();
      },
      updateProduct(id, updatedProduct) {
        const newProducts = get().products.map(product =>
          product.id === id ? {...updatedProduct, id} : product
        );
        set({products: newProducts});
        get().resetPlacement();
      },
      removeProduct(id) {
        const newProducts = get().products.filter(product => product.id !== id);
        set({products: newProducts});
        get().resetPlacement();
      },
      getProduct(id) {
        return get().products.find(product => product.id === id);
      },

      // Cells functions
      addCell(newCell) {
        const oldCells = get().cells;
        set({cells: oldCells.concat({...newCell, id: getUUID('cell')})});
        get().resetPlacement();
      },
      updateCell(id, updatedCell) {
        const newCells = get().cells.map(cell =>
          cell.id === id ? {...updatedCell, id} : cell
        );
        set({cells: newCells});
        get().resetPlacement();
      },
      removeCell(id) {
        const newCells = get().cells.filter(cell => cell.id !== id);
        set({cells: newCells});
        get().resetPlacement();
      },
      getCell(id) {
        return get().cells.find(cell => cell.id === id);
      },

      // Placement functions
      placement: null,
      setPlacement(placement) {
        set({placement});
        get().resetRoute();
      },
      resetPlacement() {
        set({placement: null});
        get().resetRoute();
      },

      // Route functions
      route: null,
      distance: null,
      setRoute(route, distance) {
        set({route, distance});
      },
      resetRoute() {
        set({distance: null, route: null});
      },

      // Graph functions
      graph: null,
      setGraph(graph) {
        set({graph});
      },
    }),
    {
      name: 'warehouse-params',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

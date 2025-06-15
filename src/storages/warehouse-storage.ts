import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {getUUID} from './common';
import {DEMO_DATA} from './init-data';
import {WAREHOUSE_INPUT_ID, WAREHOUSE_OUTPUT_ID} from './templates/common';
import {WarehouseDistanceMatrix, WarehouseStore} from './types';

export const useWarehouseStore = create<WarehouseStore>()(
  persist(
    (set, get) => ({
      // Initial data
      ...DEMO_DATA,

      // Warehouse function
      setWarehouse(warehouse) {
        warehouse.inputPoint.id = WAREHOUSE_INPUT_ID;
        warehouse.outputPoint.id = WAREHOUSE_OUTPUT_ID;
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
        const newId = getUUID('cell');
        newCell.loadingPoint.id = newId;
        set({cells: oldCells.concat({...newCell, id: newId})});
        get().resetPlacement();
      },
      updateCell(id, updatedCell) {
        updatedCell.loadingPoint.id = id;
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

      // Distance matrix
      distanceMatrix: null,
      setDistanceMatrix(distanceMatrix: WarehouseDistanceMatrix) {
        set({distanceMatrix});
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
      routeLineFeature: null,
      setRoute(route, routeLineFeature, distance) {
        set({route, routeLineFeature, distance});
      },
      resetRoute() {
        set({distance: null, routeLineFeature: null, route: null});
      },

      // Graph functions
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

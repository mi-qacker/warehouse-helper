import {point} from '@turf/turf';
import {WarehouseStore} from './types';

export const WAREHOUSE_INPUT_ID = 'warehouse_input';
export const WAREHOUSE_OUTPUT_ID = 'warehouse_output';

export const DEMO_DATA: Pick<
  WarehouseStore,
  'warehouse' | 'products' | 'cells' | 'graph'
> = {
  graph: {size: 10},
  warehouse: {
    bounds: [0, 0, 350, 350],
    inputPoint: point([0, 350], {}, {id: 'warehouse_input'}),
    outputPoint: point([350, 350], {}, {id: 'warehouse_output'}),
  },
  cells: [
    {
      id: 'ID 0',
      name: 'Cell 0',
      capacity: 20,
      zoneCondition: 'dry',
      bounds: [0, 0, 50, 50],
      loadingPoint: point([75, 25], {}, {id: 'ID 0'}),
    },
    {
      id: 'ID 1',
      name: 'Cell 1',
      capacity: 20,
      zoneCondition: 'dry',
      bounds: [100, 0, 150, 50],
      loadingPoint: point([175, 25], {}, {id: 'ID 1'}),
    },
    {
      id: 'ID 2',
      name: 'Cell 2',
      capacity: 20,
      zoneCondition: 'dry',
      bounds: [200, 0, 250, 50],
      loadingPoint: point([275, 25], {}, {id: 'ID 2'}),
    },
    {
      id: 'ID 3',
      name: 'Cell 3',
      capacity: 20,
      zoneCondition: 'normal',
      bounds: [0, 100, 50, 150],
      loadingPoint: point([75, 125], {}, {id: 'ID 3'}),
    },
    {
      id: 'ID 4',
      name: 'Cell 4',
      capacity: 20,
      zoneCondition: 'normal',
      bounds: [100, 100, 150, 150],
      loadingPoint: point([175, 125], {}, {id: 'ID 4'}),
    },
    {
      id: 'ID 5',
      name: 'Cell 5',
      capacity: 20,
      zoneCondition: 'normal',
      bounds: [200, 100, 250, 150],
      loadingPoint: point([275, 125], {}, {id: 'ID 5'}),
    },
    {
      id: 'ID 6',
      name: 'Cell 6',
      capacity: 20,
      zoneCondition: 'cold',
      bounds: [0, 200, 50, 250],
      loadingPoint: point([75, 225], {}, {id: 'ID 6'}),
    },
    {
      id: 'ID 7',
      name: 'Cell 7',
      capacity: 20,
      zoneCondition: 'cold',
      bounds: [100, 200, 150, 250],
      loadingPoint: point([175, 225], {}, {id: 'ID 7'}),
    },
    {
      id: 'ID 8',
      name: 'Cell 8',
      capacity: 20,
      zoneCondition: 'cold',
      bounds: [200, 200, 250, 250],
      loadingPoint: point([275, 225], {}, {id: 'ID 8'}),
    },
  ],
  products: [
    {
      id: 'ID 0',
      name: 'Product 0',
      volume: 5,
      storageCondition: 'cold',
      incompatibleWith: ['ID 5'],
    },
    {
      id: 'ID 1',
      name: 'Product 1',
      volume: 5,
      storageCondition: 'cold',
      incompatibleWith: [],
    },
    {
      id: 'ID 2',
      name: 'Product 2',
      volume: 5,
      storageCondition: 'normal',
      incompatibleWith: ['ID 0'],
    },
    {
      id: 'ID 3',
      name: 'Product 3',
      volume: 5,
      storageCondition: 'normal',
      incompatibleWith: ['ID 0', 'ID 2'],
    },
    {
      id: 'ID 4',
      name: 'Product 4',
      volume: 5,
      storageCondition: 'normal',
      incompatibleWith: ['ID 3'],
    },
    {
      id: 'ID 5',
      name: 'Product 5',
      volume: 5,
      storageCondition: 'dry',
      incompatibleWith: ['ID 6', 'ID 7'],
    },
    {
      id: 'ID 6',
      name: 'Product 6',
      volume: 5,
      storageCondition: 'dry',
      incompatibleWith: [],
    },
    {
      id: 'ID 7',
      name: 'Product 7',
      volume: 5,
      storageCondition: 'dry',
      incompatibleWith: ['ID 6'],
    },
  ],
};

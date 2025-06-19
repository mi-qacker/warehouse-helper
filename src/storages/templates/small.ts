import {WarehouseStore} from '@/storages/types';
import {point} from '@turf/turf';
import {WAREHOUSE_INPUT_ID, WAREHOUSE_OUTPUT_ID} from './common';

const DEMO_DATA: Pick<
  WarehouseStore,
  'warehouse' | 'products' | 'cells' | 'graph'
> = {
  graph: {size: 5},
  warehouse: {
    bounds: [0, 0, 200, 150],
    inputPoint: point([0, 150], {}, {id: WAREHOUSE_INPUT_ID}),
    outputPoint: point([200, 150], {}, {id: WAREHOUSE_OUTPUT_ID}),
  },
  cells: [
    {
      id: 'ID 0',
      name: 'Cell 0',
      capacity: 20,
      zoneCondition: 'dry',
      bounds: [10, 10, 50, 28],
      loadingPoint: point([30, 28], {}, {id: 'ID 0'}),
    },
    {
      id: 'ID 1',
      name: 'Cell 1',
      capacity: 20,
      zoneCondition: 'dry',
      bounds: [80, 10, 120, 28],
      loadingPoint: point([100, 28], {}, {id: 'ID 1'}),
    },
    {
      id: 'ID 2',
      name: 'Cell 2',
      capacity: 20,
      zoneCondition: 'dry',
      bounds: [140, 10, 180, 28],
      loadingPoint: point([160, 28], {}, {id: 'ID 2'}),
    },
    {
      id: 'ID 3',
      name: 'Cell 3',
      capacity: 20,
      zoneCondition: 'normal',
      bounds: [10, 60, 50, 80],
      loadingPoint: point([30, 80], {}, {id: 'ID 3'}),
    },
    {
      id: 'ID 4',
      name: 'Cell 4',
      capacity: 20,
      zoneCondition: 'normal',
      bounds: [80, 60, 120, 80],
      loadingPoint: point([100, 80], {}, {id: 'ID 4'}),
    },
    {
      id: 'ID 5',
      name: 'Cell 5',
      capacity: 20,
      zoneCondition: 'normal',
      bounds: [140, 60, 180, 80],
      loadingPoint: point([160, 80], {}, {id: 'ID 5'}),
    },
    {
      id: 'ID 6',
      name: 'Cell 6',
      capacity: 20,
      zoneCondition: 'cold',
      bounds: [10, 110, 50, 130],
      loadingPoint: point([30, 130], {}, {id: 'ID 6'}),
    },
    {
      id: 'ID 7',
      name: 'Cell 7',
      capacity: 20,
      zoneCondition: 'cold',
      bounds: [80, 110, 120, 130],
      loadingPoint: point([100, 130], {}, {id: 'ID 7'}),
    },
    {
      id: 'ID 8',
      name: 'Cell 8',
      capacity: 20,
      zoneCondition: 'cold',
      bounds: [140, 110, 180, 130],
      loadingPoint: point([160, 130], {}, {id: 'ID 8'}),
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
    {
      id: 'ID 8',
      name: 'Product 8',
      volume: 5,
      storageCondition: 'normal',
      incompatibleWith: ['ID 1'],
    },
    {
      id: 'ID 9',
      name: 'Product 9',
      volume: 5,
      storageCondition: 'dry',
      incompatibleWith: ['ID 7'],
    },
  ],
};

export default DEMO_DATA;

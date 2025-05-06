import {WarehouseStore} from './types';
import {point} from '@turf/turf';

export const DEMO_DATA: Pick<
  WarehouseStore,
  'warehouse' | 'products' | 'cells'
> = {
  warehouse: {
    bounds: [0, 0, 350, 250],
    inputPoint: point([0, 0]),
    outputPoint: point([0, 0]),
  },
  cells: [
    {
      id: `cell-${1}`,
      name: `A1`,
      capacity: 100,
      zoneCondition: `normal`,
      loadingPoint: point([120, 45]),
      bounds: [120, 80, 180, 45],
    },
    {
      id: `cell-${2}`,
      name: `B2`,
      capacity: 50,
      zoneCondition: `cold`,
      loadingPoint: point([240, 45]),
      bounds: [240, 45, 290, 90],
    },
    {
      id: `cell-${3}`,
      name: `B3`,
      capacity: 50,
      zoneCondition: `cold`,
      loadingPoint: point([70, 120]),
      bounds: [70, 120, 100, 170],
    },
    {
      id: `cell-${4}`,
      name: `C4`,
      capacity: 200,
      zoneCondition: `dry`,
      loadingPoint: point([180, 120]),
      bounds: [180, 120, 250, 170],
    },
  ],
  products: [
    {
      id: `prod-${1}`,
      name: `Electronics`,
      volume: 10,
      storageCondition: `dry`,
      incompatibleWith: [`prod-2`],
    },
    {
      id: `prod-${2}`,
      name: `Frozen Food`,
      volume: 5,
      storageCondition: `cold`,
      incompatibleWith: [`prod-1`, `prod-3`],
    },
    {
      id: `prod-${3}`,
      name: `Medicines`,
      volume: 2,
      storageCondition: `cold`,
      incompatibleWith: [`prod-2`],
    },
    {
      id: `prod-${4}`,
      name: `General Goods`,
      volume: 15,
      storageCondition: `normal`,
      incompatibleWith: [],
    },
  ],
};

const {products} = DEMO_DATA;

products[0].incompatibleWith = [products[1].id];
products[1].incompatibleWith = [products[0].id, products[2].id];
products[2].incompatibleWith = [products[1].id];
products[3].incompatibleWith = [];

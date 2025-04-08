import {WarehouseStore} from './types';

export const DEMO_DATA: Pick<WarehouseStore, `products` | `cells`> = {
  cells: [
    {
      id: `cell-${crypto.randomUUID()}`,
      name: `A1`,
      capacity: 100,
      zoneCondition: `normal`,
      position: {x: 0, y: 0},
    },
    {
      id: `cell-${crypto.randomUUID()}`,
      name: `B2`,
      capacity: 50,
      zoneCondition: `cold`,
      position: {x: 1, y: 0},
    },
    {
      id: `cell-${crypto.randomUUID()}`,
      name: `C3`,
      capacity: 200,
      zoneCondition: `dry`,
      position: {x: 0, y: 1},
    },
  ],
  products: [
    {
      id: `prod-${crypto.randomUUID()}`,
      name: `Electronics`,
      volume: 10,
      storageCondition: `dry`,
      incompatibleWith: [`prod-2`],
    },
    {
      id: `prod-${crypto.randomUUID()}`,
      name: `Frozen Food`,
      volume: 5,
      storageCondition: `cold`,
      incompatibleWith: [`prod-1`, `prod-3`],
    },
    {
      id: `prod-${crypto.randomUUID()}`,
      name: `Medicines`,
      volume: 2,
      storageCondition: `cold`,
      incompatibleWith: [`prod-2`],
    },
    {
      id: `prod-${crypto.randomUUID()}`,
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

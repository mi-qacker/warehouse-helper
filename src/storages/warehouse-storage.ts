import {create} from 'zustand';

export type WarehouseParams = {width: number; length: number};
export type ShelfParams = {
  x: number;
  y: number;
  width: number;
  length: number;
  height: number;
  levels: number;
};

export type WarehouseStore = {
  warehouse: WarehouseParams;
  updateWarehouse: (newParams: WarehouseParams) => void;

  shelving: ShelfParams[];
};

export const useWarehouseStore = create<WarehouseStore>(set => ({
  warehouse: {
    width: 16,
    length: 16,
  },
  updateWarehouse: newParams => set({warehouse: newParams}),

  shelving: [],
}));

import {create} from 'zustand';

export type WarehouseParams = {width: number; length: number};

export type WarehouseStore = {
  warehouse: WarehouseParams;
  updateWarehouse: (newParams: WarehouseParams) => void;
};

export const useWarehouseStore = create<WarehouseStore>(set => ({
  warehouse: {
    width: 16,
    length: 16,
  },

  updateWarehouse: newParams => set({warehouse: newParams}),
}));

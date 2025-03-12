import {create} from 'zustand';

export type WarehouseParams = {width: number; length: number};
export type ShelfParams = {
  x: number;
  y: number;
  width: number;
  length: number;
  height: number;
  levels: number;
  id: string;
};
export type NewShelfParams = Omit<ShelfParams, 'id'>;

export type CargoParams = {
  width: number;
  length: number;
  height: number;
  weight: number;
  id: string;
};
export type NewCargoParams = Omit<CargoParams, 'id'>;

export type WarehouseStore = {
  warehouse: WarehouseParams;
  updateWarehouse: (newParams: WarehouseParams) => void;

  shelving: ShelfParams[];
  addShelf: (shelf: NewShelfParams) => void;
  updateShelf: (id: string, shelf: NewShelfParams) => void;
  removeShelf: (id: string) => void;

  cargo: CargoParams[];
  addCargo: (cargo: NewCargoParams) => void;
  updateCargo: (id: string, cargo: NewCargoParams) => void;
  removeCargo: (id: string) => void;
};

export const useWarehouseStore = create<WarehouseStore>(set => ({
  warehouse: {
    width: 16,
    length: 16,
  },
  updateWarehouse: newParams => set({warehouse: newParams}),

  shelving: [],
  addShelf: newShelf =>
    set(state => ({
      shelving: [...state.shelving, {...newShelf, id: crypto.randomUUID()}],
    })),
  updateShelf: (id, updatedShelf) =>
    set(state => ({
      shelving: state.shelving.map(shelf =>
        shelf.id === id ? {...updatedShelf, id} : shelf
      ),
    })),
  removeShelf: id =>
    set(state => ({
      shelving: state.shelving.filter(shelf => shelf.id !== id),
    })),

  cargo: [],
  addCargo: newCargo =>
    set(state => ({
      cargo: [...state.cargo, {...newCargo, id: crypto.randomUUID()}],
    })),
  updateCargo: (id, updatedCargo) =>
    set(state => ({
      cargo: state.cargo.map(cargo =>
        cargo.id === id ? {...updatedCargo, id} : cargo
      ),
    })),
  removeCargo: id =>
    set(state => ({
      cargo: state.cargo.filter(cargo => cargo.id !== id),
    })),
}));

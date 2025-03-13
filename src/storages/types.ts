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

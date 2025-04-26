export type Warehouse = {
  width: number;
  height: number;
};
export type ZoneCondition = 'cold' | 'dry' | 'normal';
export type Position = {
  x: number;
  y: number;
};
export type New<T extends {id: string}> = Omit<T, 'id'>;
export type Product = {
  id: string;
  name: string;
  volume: number;
  storageCondition: ZoneCondition;
  incompatibleWith: string[];
};
export type NewProduct = New<Product>;
export type Cell = {
  id: string;
  name: string;
  capacity: number;
  zoneCondition: ZoneCondition;
  position: Position;
};
export type NewCell = New<Cell>;
export type Placement = {
  [cellId: Cell['id']]: Array<Product['id']>;
};
export type Route = Cell[];
export type WarehouseStore = {
  warehouse: Warehouse;
  setWarehouse: (warehouse: Warehouse) => void;

  products: Product[];
  addProduct: (product: NewProduct) => void;
  updateProduct: (id: string, product: NewProduct) => void;
  removeProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;

  cells: Cell[];
  addCell: (cell: NewCell) => void;
  updateCell: (id: string, cell: NewCell) => void;
  removeCell: (id: string) => void;
  getCell: (id: string) => Cell | undefined;

  placement: Placement | null;
  setPlacement: (placement: Placement) => void;
  resetPlacement: () => void;

  route: Route | null;
  distance: number | null;
  setRoute: (route: Route, distance: number) => void;
  resetRoute: () => void;
};

export type ZoneCondition = 'cold' | 'dry' | 'normal';
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
  capacity: number;
  zoneCondition: ZoneCondition;
};
export type NewCell = New<Cell>;
export type WarehouseStore = {
  products: Product[];
  addProduct: (product: NewProduct) => void;
  updateProduct: (id: string, product: NewProduct) => void;
  removeProduct: (id: string) => void;

  cells: Cell[];
  addCell: (cell: NewCell) => void;
  updateCell: (id: string, cell: NewCell) => void;
  removeCell: (id: string) => void;
};

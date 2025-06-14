import {
  Cell,
  Graph,
  Warehouse,
  WarehouseDistanceMatrix,
} from '@/storages/types';

export type ApiRequest = {
  warehouse: Warehouse;
  cells: Cell[];
  graph: Graph;
};

export type ApiResponse = WarehouseDistanceMatrix;

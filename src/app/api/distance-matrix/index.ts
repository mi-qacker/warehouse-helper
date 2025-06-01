import {Cell, Warehouse, Graph} from '@/storages/types';
import {Feature, LineString, Point} from 'geojson';

export type DistanceMatrix = Record<`${string}-${string}`, DistanceBody>;
export type DistanceBody = {
  distance: number;
  path: Feature<LineString> | Feature<Point>;
};

export type ApiRequest = {
  warehouse: Warehouse;
  cells: Cell[];
  graph: Graph;
};

export type ApiResponse = {
  distanceMatrixCells: DistanceMatrix;
  distanceMatrixPoints: DistanceMatrix;
};

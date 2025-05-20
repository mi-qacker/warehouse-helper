import {Cell, Placement, Product} from '@/storages/types';
import {Feature, Point} from 'geojson';
import {DistanceMatrix} from '@/app/api/distance-matrix';

export type ApiRequest = {
  products: Product[];
  cells: Cell[];
  startPosition: Feature<Point>;
  distanceMatrix: DistanceMatrix;
};
export type ApiResponse = {
  placement: Placement;
};

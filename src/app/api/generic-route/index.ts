import {Cell, Route} from '@/storages/types';
import {Feature, Point} from 'geojson';
import {DistanceMatrix} from '@/app/api/distance-matrix';

export type ApiRequest = {
  cells: Cell[];
  inputPoint: Feature<Point>;
  outputPoint: Feature<Point>;
  distanceMatrix: DistanceMatrix;
};
export type ApiResponse = {
  route: Route;
  distance: number;
};

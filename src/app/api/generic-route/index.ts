import {Cell, Route} from '@/storages/types';
import {Feature, Point} from 'geojson';

export type ApiRequest = {
  cells: Cell[];
  inputPoint: Feature<Point>;
  outputPoint: Feature<Point>;
};
export type ApiResponse = {
  route: Route;
  distance: number;
};

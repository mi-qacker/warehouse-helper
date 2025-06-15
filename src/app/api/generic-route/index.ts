import {DistanceMatrix} from '@/storages/types';
import {Cell, Route} from '@/storages/types';
import {Feature, FeatureCollection, LineString, Point} from 'geojson';

export type ApiRequest = {
  cells: Cell[];
  inputPoint: Feature<Point>;
  outputPoint: Feature<Point>;
  distanceMatrix: DistanceMatrix;
};
export type ApiResponse = {
  route: Route;
  lineFeature: FeatureCollection<LineString>;
  distance: number;
};

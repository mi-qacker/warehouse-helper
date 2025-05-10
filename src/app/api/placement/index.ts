import {Cell, Placement, Product} from '@/storages/types';
import {Feature, Point} from 'geojson';

export type ApiRequest = {
  products: Product[];
  cells: Cell[];
  startPosition: Feature<Point>;
};
export type ApiResponse = {
  placement: Placement;
};

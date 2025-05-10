import {Cell} from '@/storages/types';
import {BBox, Feature, Point} from 'geojson';

export type ApiRequest = {
  bounds: BBox;
  size: {width: number; height: number};
  cells: Cell[];
  warehousePoints: Feature<Point>[];
};
export type ApiResponse = {
  graphId: string;
};

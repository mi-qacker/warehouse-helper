import {getDistancePoints} from '@/modules/common';
import {findPath} from '@/modules/graph';
import {Cell, DistanceBody, DistanceMatrix, Warehouse} from '@/storages/types';
import {lineString, point} from '@turf/turf';
import {Feature, LineString, Point} from 'geojson';
import {Graph} from 'ngraph.graph';

export function createPointDistanceMatrix(
  nrgaph: Graph<Feature<Point>, Feature<LineString>>,
  warehouse: Warehouse,
  cells: Cell[]
): DistanceMatrix {
  const distanceMatrix: DistanceMatrix = {};

  const warehousePoints = [warehouse.inputPoint, warehouse.outputPoint];

  for (let i = 0; i < warehousePoints.length; i++) {
    const fromPoint = warehousePoints[i];
    for (let j = 0; j < cells.length; j++) {
      const toCell = cells[j];
      const path = findPath(nrgaph, fromPoint.id! as string, toCell.id);
      const body: DistanceBody = {
        distance: getDistancePoints(path.map(f => f.geometry)),
        path:
          path.length === 1
            ? point(path[0].geometry.coordinates)
            : lineString(path.map(f => f.geometry.coordinates)),
      };
      distanceMatrix[`${fromPoint.id}-${toCell.id}`] = body;
      distanceMatrix[`${toCell.id}-${fromPoint.id}`] = body;
    }
  }
  return distanceMatrix;
}

export function createCellsDistanceMatrix(
  nrgaph: Graph<Feature<Point>, Feature<LineString>>,
  cells: Cell[]
): DistanceMatrix {
  const distanceMatrix: DistanceMatrix = {};

  for (let i = 0; i < cells.length; i++) {
    const fromCell = cells[i];
    for (let j = 0; j < cells.length; j++) {
      const toCell = cells[j];
      const path = findPath(nrgaph, fromCell.id, toCell.id);
      const body: DistanceBody = {
        distance: getDistancePoints(path.map(f => f.geometry)),
        path:
          path.length === 1
            ? point(path[0].geometry.coordinates)
            : lineString(path.map(f => f.geometry.coordinates)),
      };
      distanceMatrix[`${fromCell.id}-${toCell.id}`] = body;
      distanceMatrix[`${toCell.id}-${fromCell.id}`] = body;
    }
  }
  return distanceMatrix;
}

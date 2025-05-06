import {Cell} from '@/storages/types';
import {Point} from 'geojson';

/**
 * key format: `<CELL_ID_FROM>-<CELL_ID_TO>`
 */
export type DistanceMatrix = Record<`${Cell['id']}-${Cell['id']}`, number>;
export function getDistanceMatrix(cells: Cell[]): DistanceMatrix {
  const distanceMatrix: DistanceMatrix = {};

  for (let i = 0; i < cells.length; i++) {
    const fromCell = cells[i];
    for (let j = 0; j < cells.length; j++) {
      const toCell = cells[j];
      const distance = getCellsDistance(
        fromCell.loadingPoint.geometry,
        toCell.loadingPoint.geometry
      );
      distanceMatrix[`${fromCell.id}-${toCell.id}`] = distance;
      distanceMatrix[`${toCell.id}-${fromCell.id}`] = distance;
    }
  }
  return distanceMatrix;
}

export function getCellsDistance(from: Point, to: Point): number {
  const [x1, y1] = from.coordinates;
  const [x2, y2] = to.coordinates;
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

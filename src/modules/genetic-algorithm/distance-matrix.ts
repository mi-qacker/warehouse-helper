import {Cell} from '@/storages/types';
import {getDistance} from '@/modules/common';

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
      const distance = getDistance(
        fromCell.loadingPoint.geometry,
        toCell.loadingPoint.geometry
      );
      distanceMatrix[`${fromCell.id}-${toCell.id}`] = distance;
      distanceMatrix[`${toCell.id}-${fromCell.id}`] = distance;
    }
  }
  return distanceMatrix;
}

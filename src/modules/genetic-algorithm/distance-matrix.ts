import {Cell, Position} from '@/storages/types';

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
      const distance = getCellsDistance(fromCell.position, toCell.position);
      distanceMatrix[`${fromCell.id}-${toCell.id}`] = distance;
      distanceMatrix[`${toCell.id}-${fromCell.id}`] = distance;
    }
  }
  return distanceMatrix;
}

export function getCellsDistance(from: Position, to: Position): number {
  const {x: x1, y: y1} = from;
  const {x: x2, y: y2} = to;
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

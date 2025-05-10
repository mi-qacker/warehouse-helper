import {Point} from 'geojson';

export function getDistance(from: Point, to: Point): number {
  const [x1, y1] = from.coordinates;
  const [x2, y2] = to.coordinates;
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

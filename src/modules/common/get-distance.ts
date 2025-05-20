import {Point} from 'geojson';

export function getDistancePoints(points: Point[]): number {
  let distance = 0;
  for (let i = 1; i < points.length; i++) {
    const first = points[i - 1];
    const last = points[i];
    distance += getDistance2(first, last);
  }
  return distance;
}

export function getDistance2(from: Point, to: Point): number {
  const [x1, y1] = from.coordinates;
  const [x2, y2] = to.coordinates;
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

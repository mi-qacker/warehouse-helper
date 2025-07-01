import {solveOptimizationRoute} from '@/modules/genetic-algorithm';
import {feature, featureCollection} from '@turf/turf';
import {Feature, LineString, Point} from 'geojson';
import {ApiRequest, ApiResponse} from '.';
import {DistanceMatrix} from '@/storages/types';

export async function POST(request: Request) {
  const {cells, inputPoint, outputPoint, distanceMatrix}: ApiRequest =
    await request.json();
  const {route, distance} = await solveOptimizationRoute(
    cells,
    inputPoint,
    outputPoint,
    distanceMatrix
  );

  const routePoints: Feature<Point>[] = [
    inputPoint,
    ...route.map(cell => cell.loadingPoint),
    outputPoint,
  ];
  const routeLines: Feature<LineString>[] = [];

  for (let i = 1; i < routePoints.length; i++) {
    const prev = routePoints[i - 1];
    const next = routePoints[i];
    const key = `${prev.id}-${next.id}` as keyof DistanceMatrix;
    const {geometry} = distanceMatrix[key].path;
    if (geometry.type === 'LineString') {
      routeLines.push(feature(geometry, {}, {id: key}));
    }
  }

  const res: ApiResponse = {
    route,
    distance,
    lineFeature: featureCollection(routeLines),
  };
  return Response.json(res);
}

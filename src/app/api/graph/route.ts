import {ApiRequest, ApiResponse} from '.';
import {
  createRectangleGrid,
  filterGridByCollisions,
  createGraph,
} from '@/modules/graph';
import {bboxPolygon} from '@turf/turf';
import {Graph} from 'ngraph.graph';
import {Feature, Point, LineString} from 'geojson';

const graphCache = new Map<
  string,
  Graph<Feature<Point>, Feature<LineString>>
>();

export async function POST(request: Request) {
  const {bounds, cells, size, warehousePoints}: ApiRequest =
    await request.json();

  const grid = createRectangleGrid(bounds, size);
  const filteredGrid = filterGridByCollisions(
    cells.map(c => bboxPolygon(c.bounds)),
    grid.features
  );

  const graph = createGraph(
    filteredGrid,
    warehousePoints,
    cells.map(c => c.loadingPoint),
    {maxDistance: Math.sqrt(Math.pow(size.width, 2) * Math.pow(size.height, 2))}
  );

  const graphId = crypto.randomUUID();
  graphCache.set(graphId, graph);

  const res: ApiResponse = {graphId};
  return Response.json(res);
}

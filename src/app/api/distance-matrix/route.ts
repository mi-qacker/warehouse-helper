import {
  createGraph,
  createRectangleGrid,
  filterGridByCollisions,
} from '@/modules/graph';
import {ApiRequest, ApiResponse} from './index';
import {bboxPolygon} from '@turf/turf';
import {
  createCellsDistanceMatrix,
  createPointDistanceMatrix,
} from './create-distance-matrix';

export async function POST(request: Request) {
  const {cells, warehouse, graph}: ApiRequest = await request.json();

  const grid = createRectangleGrid(warehouse.bounds, {
    width: graph.size,
    height: graph.size,
  });
  const filteredGrid = filterGridByCollisions(
    grid.features,
    cells.map(cell => bboxPolygon(cell.bounds))
  );
  const nrgaph = createGraph(
    filteredGrid,
    [warehouse.inputPoint, warehouse.outputPoint],
    cells.map(c => c.loadingPoint),
    {maxDistance: Math.sqrt(Math.pow(graph.size, 2) * 2)}
  );

  const distanceMatrixCells = createCellsDistanceMatrix(nrgaph, cells);
  const distanceMatrixPoints = createPointDistanceMatrix(
    nrgaph,
    warehouse,
    cells
  );

  const res: ApiResponse = {distanceMatrixCells, distanceMatrixPoints};
  return Response.json(res);
}
